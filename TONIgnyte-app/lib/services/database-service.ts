// lib/services/database-service.ts
import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient
const prismaClientSingleton = () => {
  // Check if we have the required environment variables
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  if (!databaseUrl) {
    console.warn('Warning: Database URL not configured. Database operations will fail.');
    // Return a mock client that will fail gracefully
    return {
      $connect: async () => { throw new Error('Database not configured'); },
      $disconnect: async () => {},
      $queryRaw: async () => { throw new Error('Database not configured'); },
      $transaction: async (fn: any) => { throw new Error('Database not configured'); },
      user: {
        findUnique: async () => null,
        create: async () => { throw new Error('Database not configured'); },
      },
      expense: {
        findMany: async () => [],
        create: async () => { throw new Error('Database not configured'); },
      },
      merchant: {
        findUnique: async () => null,
        create: async () => { throw new Error('Database not configured'); },
      },
      transaction: {
        findMany: async () => [],
        create: async () => { throw new Error('Database not configured'); },
      },
      loyaltyToken: {
        findMany: async () => [],
        create: async () => { throw new Error('Database not configured'); },
      },
    } as any;
  }
  
  // Configure Prisma client with appropriate settings for production
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export class DatabaseService {
  // User operations
  static async createUser(telegramId: string, tonAddress?: string) {
    return prisma.user.create({
      data: {
        telegramId,
        tonAddress,
      },
    });
  }

  static async getUserByTelegramId(telegramId: string) {
    return prisma.user.findUnique({
      where: { telegramId },
    });
  }

  static async getUserByTonAddress(tonAddress: string) {
    return prisma.user.findUnique({
      where: { tonAddress },
    });
  }

  // Expense operations
  static async createExpense(
    description: string,
    amount: number,
    paidById: number,
    participantIds: number[]
  ) {
    return prisma.expense.create({
      data: {
        description,
        amount,
        paidById,
        participants: {
          create: participantIds.map(userId => ({
            userId,
          })),
        },
      },
    });
  }

  static async getExpensesByUserId(userId: number) {
    return prisma.expense.findMany({
      where: {
        OR: [
          { paidById: userId },
          { participants: { some: { userId } } },
        ],
      },
      include: {
        paidBy: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Merchant operations
  static async createMerchant(
    name: string,
    tonAddress: string,
    description?: string
  ) {
    return prisma.merchant.create({
      data: {
        name,
        tonAddress,
        description,
      },
    });
  }

  static async getMerchantByTonAddress(tonAddress: string) {
    return prisma.merchant.findUnique({
      where: { tonAddress },
    });
  }

  // Transaction operations
  static async createTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number,
    type: string,
    transactionHash?: string
  ) {
    return prisma.transaction.create({
      data: {
        fromAddress,
        toAddress,
        amount,
        type,
        transactionHash,
      },
    });
  }

  static async getTransactionsByAddress(address: string) {
    return prisma.transaction.findMany({
      where: {
        OR: [
          { fromAddress: address },
          { toAddress: address },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Loyalty token operations
  static async createLoyaltyToken(
    userId: number,
    tokenAmount: number,
    transactionId: string,
    merchantId?: string
  ) {
    return prisma.loyaltyToken.create({
      data: {
        userId,
        tokenAmount,
        transactionId,
        merchantId,
      },
    });
  }

  static async getLoyaltyTokensByUserId(userId: number) {
    return prisma.loyaltyToken.findMany({
      where: { userId },
      include: {
        merchant: true,
        transaction: true,
      },
    });
  }

  static async getLoyaltyTokensByMerchantId(merchantId: string) {
    return prisma.loyaltyToken.findMany({
      where: { merchantId },
      include: {
        user: true,
        transaction: true,
      },
    });
  }
}