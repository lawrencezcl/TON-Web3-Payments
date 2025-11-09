// app/tip/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TipInterface } from "@/components/tipping/tip-interface";
import { TipHistory } from "@/components/tipping/tip-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/components/providers/wallet-provider';

interface Worker {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
}

interface TipTransaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  workerName?: string;
}

export default function TippingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipTransactions, setTipTransactions] = useState<TipTransaction[]>([]);
  const { connected, address } = useWallet();

  const [worker, setWorker] = useState<Worker | null>(null);

  // Fetch worker data
  useEffect(() => {
    if (connected && address) {
      fetchWorkerData();
    }
  }, [connected, address]);

  const fetchWorkerData = async () => {
    try {
      const response = await fetch(`/api/tipping/worker?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch worker data');
      }
      
      const data = await response.json();
      setWorker(data.worker);
    } catch (error) {
      console.error('Error fetching worker data:', error);
    }
  };

  useEffect(() => {
    if (connected && address) {
      fetchTipHistory();
    }
  }, [connected, address]);

  const fetchTipHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tip history from API
      const response = await fetch(`/api/tipping/history?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tip history');
      }
      
      const data = await response.json();
      setTipTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tipping Platform</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-md">My Tips</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md">History</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {worker && <TipInterface worker={worker} />}
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              {tipTransactions.length > 0 ? (
                tipTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md mb-2">
                    <div>
                      <p className="font-medium">{tx.workerName || 'Service Worker'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-medium text-green-500">{tx.amount} TON</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent tips</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Tips This Week</span>
                  <span className="font-bold text-green-500">
                    {tipTransactions
                      .filter(tx => new Date(tx.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                      .reduce((sum, tx) => sum + tx.amount, 0)
                      .toFixed(2)} TON
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <span className="font-bold">4.8 ★</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Top Earner This Week</span>
                  <span className="font-bold">You</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {connected && address && (
        <div className="mt-8">
          <TipHistory address={address} />
        </div>
      )}
    </div>
  );
}