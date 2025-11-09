// lib/services/loyalty-service.ts
import { LoyaltyContractService } from './loyalty-contract-service';
import { DatabaseService } from './database-service';
import { WalletService } from './wallet-service';

export class LoyaltyService {
  private loyaltyContractService: LoyaltyContractService;

  constructor(walletService: WalletService) {
    this.loyaltyContractService = new LoyaltyContractService(walletService);
  }

  // Mint loyalty tokens for a user after a purchase
  static async mintTokensAfterPurchase(
    userId: number,
    merchantId: string,
    purchaseAmount: number,
    loyaltyRate: number = 1 // 1 token per 1 TON spent by default
  ): Promise<boolean> {
    try {
      const tokensToMint = purchaseAmount * loyaltyRate;
      
      // Mint tokens via the contract service
      const success = await new LoyaltyContractService(new WalletService())
        .mintTokens(userId, merchantId, tokensToMint);
      
      if (success) {
        console.log(`Successfully minted ${tokensToMint} loyalty tokens for user ${userId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error minting tokens after purchase:', error);
      return false;
    }
  }

  // Redeem loyalty tokens for a discount or reward
  static async redeemTokens(
    userId: number,
    merchantId: string,
    tokenAmount: number
  ): Promise<boolean> {
    try {
      // Check if user has enough tokens
      const contractService = new LoyaltyContractService(new WalletService());
      const balance = await contractService.getUserTokenBalance(userId, merchantId);
      
      if (balance < tokenAmount) {
        throw new Error(`Insufficient tokens. Available: ${balance}, Required: ${tokenAmount}`);
      }
      
      // Redeem tokens via the contract service
      const success = await contractService.redeemTokens(userId, merchantId, tokenAmount);
      
      if (success) {
        console.log(`Successfully redeemed ${tokenAmount} loyalty tokens for user ${userId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error redeeming tokens:', error);
      return false;
    }
  }

  // Get user's loyalty token balance for a specific merchant
  static async getUserTokenBalance(userId: number, merchantId: string): Promise<number> {
    try {
      const contractService = new LoyaltyContractService(new WalletService());
      return await contractService.getUserTokenBalance(userId, merchantId);
    } catch (error) {
      console.error('Error getting user token balance:', error);
      return 0;
    }
  }

  // Get all of user's loyalty tokens across merchants
  static async getUserAllTokens(userId: number) {
    try {
      return await DatabaseService.getLoyaltyTokensByUserId(userId);
    } catch (error) {
      console.error('Error getting user loyalty tokens:', error);
      return [];
    }
  }

  // Get merchant's total token supply
  static async getMerchantTokenSupply(merchantId: string): Promise<number> {
    try {
      const contractService = new LoyaltyContractService(new WalletService());
      return await contractService.getMerchantTokenSupply(merchantId);
    } catch (error) {
      console.error('Error getting merchant token supply:', error);
      return 0;
    }
  }

  // Calculate discount based on loyalty tokens
  static calculateDiscountFromTokens(tokenAmount: number, rate: number = 0.01): number {
    // Default rate: 1 token = 0.01 TON discount
    return tokenAmount * rate;
  }
}