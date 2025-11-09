// components/merchant/merchant-dashboard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  BarChartIcon, 
  DollarSign, 
  Users, 
  TrendingUp,
  Award
} from 'lucide-react';
import { useEffect, useState } from "react";

interface MerchantMetrics {
  dailyRevenue: number;
  totalTransactions: number;
  loyaltyTokenHolders: number;
  totalLoyaltyTokens: number;
}

interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
}

interface MerchantData {
  merchant: any;
  metrics: MerchantMetrics;
  recentTransactions: Transaction[];
  loyaltyTokenHoldersCount: number;
  loyaltyTokenDistribution: any[];
}

export function MerchantDashboard({ merchantId }: { merchantId: string }) {
  const [data, setData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchantData();
  }, [merchantId]);

  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/merchants/dashboard?merchantId=${merchantId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch merchant dashboard data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchMerchantData} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const { metrics, recentTransactions } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.dailyRevenue.toFixed(2)} TON</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Holders</CardTitle>
            <Users className="h4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.loyaltyTokenHolders}</div>
            <p className="text-xs text-muted-foreground">+5 new today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Tokens</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalLoyaltyTokens}</div>
            <p className="text-xs text-muted-foreground">+120 minted today</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div>
                      <p className="font-medium">{tx.amount} TON</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.fromAddress.substring(0, 6)}...{tx.fromAddress.substring(tx.fromAddress.length - 4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">Completed</Badge>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Token Redemption Rate</span>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Tokens per Customer</span>
                <span className="font-medium">20</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Top Loyalty Tier</span>
                <Badge>Gold</Badge>
              </div>
              <div className="pt-4">
                <div className="h-32 flex items-center justify-center bg-secondary/10 rounded-lg">
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loyalty Analytics Chart</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}