// components/tipping/tip-interface.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useWallet } from "@/components/providers/wallet-provider";

interface Worker {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
}

export function TipInterface({ worker }: { worker: Worker }) {
  const [tipAmount, setTipAmount] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { connected, address, sendTransaction } = useWallet();

  const handleTip = async () => {
    if (!connected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setError("Please enter a valid tip amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // In a real implementation, we would send the tip through the wallet service
      // For now, we'll simulate the API call
      const response = await fetch('/api/tipping/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: address,
          toAddress: 'EQCD39...vK32', // Worker's address
          amount: parseFloat(tipAmount),
          workerId: worker.id,
          rating: rating
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send tip');
      }

      const result = await response.json();
      setSuccess('Tip sent successfully!');
      setTipAmount('');
      
      // In a real app, we would refresh the tip history
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickTip = (amount: number) => {
    setTipAmount(amount.toString());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={worker.avatar} />
          <AvatarFallback>{worker.initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{worker.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{worker.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="mb-4">How much would you like to tip?</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={() => quickTip(0.1)}
              disabled={!connected}
            >
              0.1 TON
            </Button>
            <Button 
              variant="outline" 
              onClick={() => quickTip(0.5)}
              disabled={!connected}
            >
              0.5 TON
            </Button>
            <Button 
              variant="outline" 
              onClick={() => quickTip(1.0)}
              disabled={!connected}
            >
              1.0 TON
            </Button>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Custom amount" 
              type="number"
              step="0.01"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              disabled={!connected}
            />
            <Button 
              onClick={handleTip}
              disabled={loading || !connected}
            >
              {loading ? 'Sending...' : 'Send Tip'}
            </Button>
          </div>
          {!connected && (
            <p className="text-sm text-muted-foreground mt-2">
              Connect your wallet to send tips
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}