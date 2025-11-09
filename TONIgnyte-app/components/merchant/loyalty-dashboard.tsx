// components/merchant/loyalty-dashboard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useWallet } from '@/components/providers/wallet-provider';

interface LoyaltyToken {
  id: string;
  tokenAmount: number;
  merchant: {
    name: string;
  } | null;
  createdAt: Date;
}

export function LoyaltyDashboard({ 
  userId,
  tokens 
}: { 
  userId: number;
  tokens: LoyaltyToken[] 
}) {
  const [redeemAmount, setRedeemAmount] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { connected, address } = useWallet();

  const handleRedeemTokens = async () => {
    if (!connected || !address) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setIsRedeeming(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Call the API to redeem tokens
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          merchantId: address, // Using wallet address as merchant ID for demo
          tokenAmount: parseFloat(redeemAmount)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to redeem loyalty tokens');
      }

      const result = await response.json();
      setSuccess(`Successfully redeemed ${redeemAmount} loyalty tokens! Estimated value: ${result.discountValue.toFixed(4)} TON`);
      setRedeemAmount('');
      
      // In a real app, we would refresh the token balance
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRedeeming(false);
    }
  };

  // Group tokens by merchant
  const tokensByMerchant = tokens.reduce((acc, token) => {
    const merchantName = token.merchant?.name || 'Unknown Merchant';
    if (!acc[merchantName]) {
      acc[merchantName] = 0;
    }
    acc[merchantName] += token.tokenAmount;
    return acc;
  }, {} as Record<string, number>);

  const totalTokens = tokens.reduce((sum, token) => sum + token.tokenAmount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Tokens</p>
              <p className="text-2xl font-bold">{totalTokens.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Merchants</p>
              <p className="text-2xl font-bold">{Object.keys(tokensByMerchant).length}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="text-2xl font-bold">{(totalTokens * 0.01).toFixed(2)} TON</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Tokens by Merchant</h3>
            {Object.entries(tokensByMerchant).map(([merchant, amount]) => (
              <div key={merchant} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                <span>{merchant}</span>
                <span className="font-medium">{amount.toFixed(2)} LTY</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Redeem Tokens</CardTitle>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tokens to Redeem</label>
              <Input
                type="number"
                step="0.01"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={!connected}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Estimated value: {(parseFloat(redeemAmount || '0') * 0.01).toFixed(4)} TON
              </p>
            </div>
            <Button 
              onClick={handleRedeemTokens}
              disabled={isRedeeming || !redeemAmount || parseFloat(redeemAmount) <= 0 || !connected}
              className="w-full"
            >
              {isRedeeming ? 'Redeeming...' : connected ? 'Redeem Tokens' : 'Connect Wallet to Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}