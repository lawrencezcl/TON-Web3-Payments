// lib/services/user-service.ts
import { DatabaseService } from './database-service';
import { WalletService } from './wallet-service';

export class UserService {
  static async createOrUpdateUser(telegramId: string, tonAddress?: string) {
    try {
      // Check if user already exists
      let user = await DatabaseService.getUserByTelegramId(telegramId);
      
      if (user) {
        // Update the user's TON address if provided and different
        if (tonAddress && user.tonAddress !== tonAddress) {
          user = await DatabaseService.prisma.user.update({
            where: { id: user.id },
            data: { tonAddress },
          });
        }
      } else {
        // Create new user
        user = await DatabaseService.createUser(telegramId, tonAddress);
      }
      
      return user;
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  static async getUserWithWallet(telegramId: string) {
    try {
      const user = await DatabaseService.getUserByTelegramId(telegramId);
      if (!user) {
        return null;
      }
      
      // Get user's transaction history
      const transactions = user.tonAddress 
        ? await DatabaseService.getTransactionsByAddress(user.tonAddress)
        : [];
      
      // Get user's loyalty tokens
      const loyaltyTokens = await DatabaseService.getLoyaltyTokensByUserId(user.id);
      
      // Get user's expenses
      const expenses = await DatabaseService.getExpensesByUserId(user.id);
      
      return {
        ...user,
        transactions,
        loyaltyTokens,
        expenses,
      };
    } catch (error) {
      console.error('Error getting user with wallet:', error);
      throw error;
    }
  }

  static async connectWalletToUser(telegramId: string, tonAddress: string) {
    try {
      // Check if the TON address is already associated with another user
      const existingUser = await DatabaseService.getUserByTonAddress(tonAddress);
      if (existingUser && existingUser.telegramId !== telegramId) {
        throw new Error('This wallet is already connected to another account');
      }
      
      // Create or update user with the TON address
      return await this.createOrUpdateUser(telegramId, tonAddress);
    } catch (error) {
      console.error('Error connecting wallet to user:', error);
      throw error;
    }
  }
}