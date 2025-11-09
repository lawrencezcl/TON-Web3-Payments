// lib/services/merchant-service.ts
import { DatabaseService } from './database-service';

export class MerchantService {
  static async createMerchant(
    name: string,
    tonAddress: string,
    telegramId: string,
    description?: string
  ) {
    try {
      // Check if merchant already exists
      const existingMerchant = await DatabaseService.getMerchantByTonAddress(tonAddress);
      if (existingMerchant) {
        throw new Error('Merchant with this TON address already exists');
      }
      
      // Create the merchant
      const merchant = await DatabaseService.createMerchant(name, tonAddress, description);
      
      return merchant;
    } catch (error) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  }

  static async getMerchantByAddress(tonAddress: string) {
    try {
      return await DatabaseService.getMerchantByTonAddress(tonAddress);
    } catch (error) {
      console.error('Error getting merchant:', error);
      throw error;
    }
  }

  static async getMerchantLoyaltyTokens(merchantId: string) {
    try {
      return await DatabaseService.getLoyaltyTokensByMerchantId(merchantId);
    } catch (error) {
      console.error('Error getting merchant loyalty tokens:', error);
      throw error;
    }
  }
}