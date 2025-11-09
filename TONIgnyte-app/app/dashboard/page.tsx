// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { WalletDashboard } from '@/components/wallet/wallet-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UserWithWallet {
  id: number;
  telegramId: string;
  tonAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  transactions: any[];
  loyaltyTokens: any[];
  expenses: any[];
}

export default function Dashboard() {
  const [user, setUser] = useState<UserWithWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data with wallet information
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">TON Web3 Payments</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Seamlessly integrate Web3 payments into Telegram
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Bill Splitting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Split bills with friends instantly on Telegram using TON cryptocurrency.
            </p>
            <Link href="/split">
              <Button className="w-full">Split Bills</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Accept payments and run loyalty programs with tokenization for your business.
            </p>
            <Link href="/merchant">
              <Button className="w-full">Accept Payments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipping Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Tip service workers instantly with crypto and earn loyalty rewards.
            </p>
            <Link href="/tip">
              <Button className="w-full">Send Tip</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <WalletDashboard />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold mb-2">1. Connect Wallet</h3>
            <p>Connect your TON wallet with one click using TON Connect.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold mb-2">2. Choose Service</h3>
            <p>Select from bill splitting, merchant payments, or tipping.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold mb-2">3. Transact</h3>
            <p>Complete transactions instantly on the TON blockchain.</p>
          </div>
        </div>
      </div>
    </div>
  );
}