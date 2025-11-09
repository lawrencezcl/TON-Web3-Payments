// components/providers/wallet-provider.tsx
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useTonConnectUI, Wallet } from '@tonconnect/ui-react';
import { WalletService } from '@/lib/services/wallet-service';

interface WalletContextType {
  walletService: WalletService | null;
  connected: boolean;
  wallet: Wallet | null;
  connect: () => void;
  disconnect: () => void;
  sendTransaction: (to: string, amount: string, payload?: string) => Promise<any>;
  balance: string | null;
  address: string | null;
  isMock: boolean;
}

const WalletContext = createContext<WalletContextType>({
  walletService: null,
  connected: false,
  wallet: null,
  connect: () => {},
  disconnect: () => {},
  sendTransaction: async () => { throw new Error('Wallet service not initialized'); },
  balance: null,
  address: null,
  isMock: false
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletService, setWalletService] = useState<WalletService | null>(null);
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const service = new WalletService();
    setWalletService(service);
  }, []);

  // Update state when using wallet
  const [tonConnectUI] = useTonConnectUI();
  useEffect(() => {
    if (tonConnectUI && walletService instanceof WalletService) {
      // Update state when wallet connection changes
      const updateState = () => {
        const isConnected = tonConnectUI.connected;
        setConnected(isConnected);
        setWallet(tonConnectUI.wallet);
        
        if (isConnected && tonConnectUI.wallet) {
          const addr = tonConnectUI.wallet.account.address;
          setAddress(addr);
          
          // Get balance from the wallet service
          walletService.getBalance().then(bal => setBalance(bal));
        } else {
          setAddress(null);
          setBalance(null);
        }
      };

      // Initial update
      updateState();

      // Subscribe to connection changes
      const unsubscribe = tonConnectUI.onStatusChange(wallet => {
        updateState();
      });

      // Clean up subscription
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [tonConnectUI, walletService]);

  const connect = async () => {
    if (!walletService) {
      console.error('Wallet service not initialized');
      return;
    }

    try {
      await walletService.connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = async () => {
    if (!walletService) {
      console.error('Wallet service not initialized');
      return;
    }

    try {
      await walletService.disconnectWallet();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const sendTransaction = async (to: string, amount: string, payload?: string) => {
    if (!walletService) throw new Error('Wallet service not initialized');

    try {
      const result = await walletService.sendTransaction(to, amount, payload);
      // Update balance after transaction
      const newBalance = await walletService.getBalance();
      setBalance(newBalance);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const value = {
    walletService,
    connected,
    wallet,
    connect,
    disconnect,
    sendTransaction,
    balance,
    address,
    isMock: false // Always false now that we're using real wallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}