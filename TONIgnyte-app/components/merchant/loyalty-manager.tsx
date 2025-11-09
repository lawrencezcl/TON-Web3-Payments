// components/merchant/loyalty-manager.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function LoyaltyManager() {
  const [loyaltyRate, setLoyaltyRate] = useState('1.0');
  const [minPurchase, setMinPurchase] = useState('1.0');
  const [rewardThreshold, setRewardThreshold] = useState('100');

  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to the database
    console.log('Saving loyalty settings:', {
      loyaltyRate,
      minPurchase,
      rewardThreshold
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Program Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="loyaltyRate">Tokens per TON spent</Label>
            <Input
              id="loyaltyRate"
              type="number"
              step="0.1"
              value={loyaltyRate}
              onChange={(e) => setLoyaltyRate(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              How many loyalty tokens to award per 1 TON spent
            </p>
          </div>
          
          <div>
            <Label htmlFor="minPurchase">Minimum purchase for tokens</Label>
            <Input
              id="minPurchase"
              type="number"
              step="0.01"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum purchase amount to earn loyalty tokens
            </p>
          </div>
          
          <div>
            <Label htmlFor="rewardThreshold">Tokens for reward</Label>
            <Input
              id="rewardThreshold"
              type="number"
              value={rewardThreshold}
              onChange={(e) => setRewardThreshold(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Number of tokens needed to unlock a reward
            </p>
          </div>
          
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}