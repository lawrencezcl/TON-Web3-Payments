// lib/services/wallet-service.ts
import { 
  TonConnectUI, 
  WalletConnectionSource, 
  WalletInfo, 
  ConnectAdditionalRequest, 
  SendTransactionRequest,
  SendTransactionResponse
} from '@tonconnect/ui-react';
import { Address, toNano, fromNano } from 'ton-core';
import { TonClient } from 'ton';

export class WalletService {
  private tonConnectUI: TonConnectUI | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize TonConnectUI only on the client side
      this.tonConnectUI = new TonConnectUI({
        manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
      });
    }
  }

  // Check if wallet is connected
  isConnected(): boolean {
    if (!this.tonConnectUI) return false;
    return this.tonConnectUI.connected;
  }

  // Get wallet address
  getWalletAddress(): string | null {
    if (!this.tonConnectUI || !this.tonConnectUI.wallet) return null;
    return this.tonConnectUI.wallet.account.address;
  }

  // Get wallet network
  getWalletNetwork(): string | null {
    if (!this.tonConnectUI || !this.tonConnectUI.wallet) return null;
    return this.tonConnectUI.wallet.account.chain;
  }

  // Connect wallet
  async connectWallet(): Promise<void> {
    if (!this.tonConnectUI) {
      throw new Error('TonConnectUI not initialized');
    }
    
    try {
      await this.tonConnectUI.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    if (!this.tonConnectUI) {
      throw new Error('TonConnectUI not initialized');
    }
    
    try {
      await this.tonConnectUI.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  // Send transaction
  async sendTransaction(
    to: string,
    amount: string,
    payload?: string
  ): Promise<SendTransactionResponse> {
    if (!this.tonConnectUI) {
      throw new Error('TonConnectUI not initialized');
    }
    
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const transaction: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      messages: [
        {
          address: to,
          amount: toNano(amount).toString(),
          payload: payload,
        },
      ],
    };

    try {
      const result = await this.tonConnectUI.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance(): Promise<string> {
    if (!this.tonConnectUI || !this.tonConnectUI.wallet) {
      return '0';
    }

    try {
      // Get the wallet address
      const address = this.tonConnectUI.wallet.account.address;
      
      // Initialize TON client for testnet
      const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // Using TON testnet endpoint
      });

      // Parse the address
      const parsedAddress = Address.parse(address);
      
      // Get account state
      const account = await client.getContractState(parsedAddress);
      
      if (account.balance) {
        // Convert from nanoTON to TON
        const balanceInNano = account.balance;
        return fromNano(balanceInNano).toString();
      }
      
      return '0';
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  // Format TON amount
  formatTonAmount(amount: string): string {
    try {
      const nanoAmount = toNano(amount);
      return fromNano(nanoAmount);
    } catch (error) {
      console.error('Failed to format TON amount:', error);
      return '0';
    }
  }

  // Validate TON address
  isValidAddress(address: string): boolean {
    try {
      Address.parse(address);
      return true;
    } catch (error) {
      return false;
    }
  }
}