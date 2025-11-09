// app/api/tipping/history/route.ts
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database-service';

// Disable static generation for this route since it accesses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const limit = searchParams.get('limit') || '20';

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Get tipping transactions for the address
    const transactions = await DatabaseService.getTransactionsByAddress(address);
    const tipTransactions = transactions
      .filter(t => t.type === 'tip')
      .slice(0, parseInt(limit));

    return NextResponse.json({ 
      transactions: tipTransactions
    });
  } catch (error) {
    console.error('Error getting tipping history:', error);
    return NextResponse.json(
      { error: 'Failed to get tipping history' },
      { status: 500 }
    );
  }
}