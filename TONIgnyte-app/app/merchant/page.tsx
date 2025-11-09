// app/merchant/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PaymentQR } from "@/components/merchant/payment-qr";
import { LoyaltyDashboard } from "@/components/merchant/loyalty-dashboard";
import { LoyaltyManager } from "@/components/merchant/loyalty-manager";
import { MerchantDashboard } from "@/components/merchant/merchant-dashboard";
import { useWallet } from '@/components/providers/wallet-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MerchantPage() {
  const [amount, setAmount] = useState('');
  const [merchantId, setMerchantId] = useState(''); // Default to connected wallet address
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tokens, setTokens] = useState([]);
  const { connected, address } = useWallet();

  // Fetch loyalty tokens when wallet is connected
  useEffect(() => {
    if (connected && address) {
      setMerchantId(address);
      fetchLoyaltyTokens();
    }
  }, [connected, address]);

  const fetchLoyaltyTokens = async () => {
    try {
      const response = await fetch(`/api/loyalty/user-tokens?address=${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty tokens');
      }
      
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error('Error fetching loyalty tokens:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Merchant Hub</h1>
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'border'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'payments' ? 'bg-primary text-white' : 'border'}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'loyalty' ? 'bg-primary text-white' : 'border'}`}
            onClick={() => setActiveTab('loyalty')}
          >
            Loyalty
          </button>
        </div>
      </div>
      
      {activeTab === 'dashboard' && (
        <MerchantDashboard merchantId={merchantId} />
      )}
      
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Generate Payment QR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Merchant ID</label>
                    <Input 
                      type="text" 
                      value={merchantId}
                      onChange={(e) => setMerchantId(e.target.value)}
                      readOnly={!connected}
                    />
                    {!connected && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Connect wallet to use your address as merchant ID
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (TON)</label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={!connected}>
                    {connected ? 'Generate QR Code' : 'Connect Wallet to Generate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {connected && address && (
              <LoyaltyManager />
            )}
          </div>
          
          <div>
            <PaymentQR merchantId={merchantId} amount={amount || '0.00'} />
          </div>
        </div>
      )}
      
      {activeTab === 'loyalty' && connected && address && (
        <div className="space-y-6">
          <LoyaltyDashboard userId={1} tokens={tokens} />
        </div>
      )}
      
      {activeTab === 'loyalty' && (!connected || !address) && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Please connect your wallet to access the loyalty program features.
            </p>
            <Button>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}