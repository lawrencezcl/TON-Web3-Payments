// components/tipping/tip-history.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface TipTransaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  workerName?: string;
}

export function TipHistory({ address }: { address: string }) {
  const [transactions, setTransactions] = useState<TipTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchTipHistory();
    }
  }, [address]);

  const fetchTipHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tip history from the API
      const response = await fetch(`/api/tipping/history?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tip history');
      }
      
      const result = await response.json();
      setTransactions(result.transactions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={fetchTipHistory}
              className="text-sm text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tip History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No tipping history found
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tx.amount} TON</span>
                    {tx.workerName && (
                      <Badge variant="secondary">{tx.workerName}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      tx.status === 'completed' ? 'default' : 
                      tx.status === 'pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {tx.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tx.toAddress.substring(0, 6)}...{tx.toAddress.substring(tx.toAddress.length - 4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}