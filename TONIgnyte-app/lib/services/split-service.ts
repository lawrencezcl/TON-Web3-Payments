// lib/services/split-service.ts
import { DatabaseService } from './database-service';
import { SplitEngineService, Expense as SplitExpense } from './split-engine-service';

export class SplitService {
  static async createSplit(
    telegramId: string,
    description: string,
    amount: number,
    participantTelegramIds: string[]
  ) {
    try {
      // Get all users by their Telegram IDs
      const participants = [];
      for (const id of participantTelegramIds) {
        const user = await DatabaseService.getUserByTelegramId(id);
        if (!user) {
          throw new Error(`User with Telegram ID ${id} not found`);
        }
        participants.push(user);
      }
      
      // Get the user who paid
      const payer = await DatabaseService.getUserByTelegramId(telegramId);
      if (!payer) {
        throw new Error(`Payer with Telegram ID ${telegramId} not found`);
      }
      
      // Create the expense in the database
      const expense = await DatabaseService.createExpense(
        description,
        amount,
        payer.id,
        participants.map(p => p.id)
      );
      
      // Calculate settlements using the split engine
      const splitExpenses: SplitExpense[] = [{
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        paidBy: payer.telegramId,
        participants: participantTelegramIds,
        splits: {}
      }];
      
      const settlements = SplitEngineService.calculateOptimalSettlements(splitExpenses);
      
      return {
        expense,
        settlements,
        participants: participantTelegramIds,
      };
    } catch (error) {
      console.error('Error creating split:', error);
      throw error;
    }
  }

  static async getSettlementsForUser(telegramId: string) {
    try {
      const user = await DatabaseService.getUserByTelegramId(telegramId);
      if (!user) {
        throw new Error(`User with Telegram ID ${telegramId} not found`);
      }
      
      // Get all expenses where the user is a participant or payer
      const expenses = await DatabaseService.getExpensesByUserId(user.id);
      
      // Calculate settlements using the split engine
      const splitExpenses: SplitExpense[] = expenses.map(exp => ({
        id: exp.id,
        description: exp.description,
        amount: exp.amount,
        paidBy: exp.paidBy.telegramId,
        participants: exp.participants.map(p => p.user.telegramId),
        splits: {}
      }));
      
      const settlements = SplitEngineService.calculateOptimalSettlements(splitExpenses);
      
      return {
        expenses,
        settlements,
      };
    } catch (error) {
      console.error('Error getting settlements for user:', error);
      throw error;
    }
  }
}