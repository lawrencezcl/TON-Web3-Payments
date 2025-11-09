// app/split/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ExpenseForm } from "@/components/bill-split/expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from '@/components/providers/wallet-provider';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: {
    telegramId: string;
  };
  participants: {
    user: {
      telegramId: string;
    };
  }[];
  createdAt: Date;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function BillSplitPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { connected, address } = useWallet();

  useEffect(() => {
    if (connected && address) {
      fetchSplitData();
    }
  }, [connected, address]);

  const fetchSplitData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real expenses data from API
      const response = await fetch(`/api/splits/user/${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses data');
      }
      
      const data = await response.json();
      setExpenses(data.expenses || []);
      setSettlements(data.settlements || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSettleAll = async () => {
    try {
      // Call the settle API
      const response = await fetch('/api/splits/settle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settlements,
          groupId: 'group1' // In a real app, this would be dynamic
        })
      });

      if (!response.ok) {
        throw new Error('Failed to settle balances');
      }

      // Refresh the data after settlement
      fetchSplitData();
    } catch (err: any) {
      setError(err.message);
    }
  };

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
            <Button onClick={fetchSplitData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bill Splitting</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-md">New Split</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md">History</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ExpenseForm />
        </div>
        
        <div>
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Split</h2>
            <div className="space-y-4">
              {expenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span>{expense.description}</span>
                  <span className="font-medium">{expense.amount} TON</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">
                    {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)} TON
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Settlement</h2>
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{settlement.from} owes {settlement.to}</span>
                  <span className="font-medium text-red-500">{settlement.amount.toFixed(2)} TON</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Net amount you owe:</span>
                  <span className="font-bold text-red-500">0.70 TON</span>
                </div>
              </div>
              <button 
                onClick={handleSettleAll}
                className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md"
              >
                Settle All Balances
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}