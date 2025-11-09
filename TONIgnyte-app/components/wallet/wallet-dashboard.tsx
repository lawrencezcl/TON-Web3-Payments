// components/wallet/wallet-dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/providers/wallet-provider";
import { TransactionHistory } from "@/components/wallet/transaction-history";
import { WalletConnector } from "@/components/ui/wallet-connector";

interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  transactionHash?: string;
  status: string;
  type: string;
  createdAt: Date;
}

interface LoyaltyToken {
  id: string;
  tokenAmount: number;
  merchant: {
    name: string;
  } | null;
  transaction: {
    amount: number;
  };
  createdAt: Date;
}

interface UserWithWallet {
  id: number;
  telegramId: string;
  tonAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
  loyaltyTokens: LoyaltyToken[];
  expenses: any[];
}

export function WalletDashboard() {
  const { connected, address, balance } = useWallet();
  const [user, setUser] = useState<UserWithWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && address) {
      fetchUserData();
    }
  }, [connected, address]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Find user by TON address
      const response = await fetch(`/api/users?tonAddress=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Connect your TON wallet to view your balance and transaction history.
          </p>
          <WalletConnector />
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchUserData}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate total loyalty tokens
  const totalLoyaltyTokens = user?.loyaltyTokens?.reduce((sum, token) => sum + token.tokenAmount, 0) || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">{balance || '0.00'} TON</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyalty Tokens</p>
              <p className="text-xl font-bold">{totalLoyaltyTokens.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-bold">{user?.transactions?.length || 0}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Send</Button>
            <Button variant="outline">Receive</Button>
          </div>
        </CardContent>
      </Card>
      
      <TransactionHistory transactions={user?.transactions || []} />
    </div>
  );
}