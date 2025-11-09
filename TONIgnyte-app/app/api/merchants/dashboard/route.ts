// app/api/merchants/dashboard/route.ts
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId) {
      return NextResponse.json(
        { error: 'Merchant ID is required' },
        { status: 400 }
      );
    }

    // Get merchant data
    const merchant = await DatabaseService.getMerchantByTonAddress(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Get merchant transactions
    const transactions = await DatabaseService.getTransactionsByAddress(merchant.tonAddress);

    // Get merchant's loyalty tokens
    const loyaltyTokens = await DatabaseService.getLoyaltyTokensByMerchantId(merchant.id);

    // Calculate metrics
    const dailyRevenue = transactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const loyaltyTokenHolders = new Set(loyaltyTokens.map(t => t.userId)).size;

    return NextResponse.json({
      merchant,
      metrics: {
        dailyRevenue,
        totalTransactions: transactions.length,
        loyaltyTokenHolders,
        totalLoyaltyTokens: loyaltyTokens.reduce((sum, t) => sum + t.tokenAmount, 0)
      },
      recentTransactions: transactions.slice(0, 10),
      loyaltyTokenHoldersCount: loyaltyTokenHolders,
      loyaltyTokenDistribution: loyaltyTokens.slice(0, 10)
    });
  } catch (error) {
    console.error('Error getting merchant dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to get merchant dashboard' },
      { status: 500 }
    );
  }
}