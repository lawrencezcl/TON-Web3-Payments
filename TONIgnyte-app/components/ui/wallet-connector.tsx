// components/ui/wallet-connector.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/providers/wallet-provider";
import { useState } from "react";

export function WalletConnector() {
  const { connected, connect, disconnect, address, balance, isMock } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (connected && address) {
    // Show connected wallet info
    const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    
    return (
      <div className="flex items-center gap-2">
        <div className="bg-secondary rounded-full px-3 py-1 text-sm">
          <span className="font-mono">{shortAddress}</span>
          {balance && <span className="ml-2">{balance} TON</span>}
        </div>
        <Button 
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {loading ? 'Disconnecting...' : 'Disconnect'}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}