// app/api/loyalty/balance/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyalty-service';

// Disable static generation for this route since it accesses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const merchantId = searchParams.get('merchantId');

    if (!userId || !merchantId) {
      return NextResponse.json(
        { error: 'User ID and merchant ID are required' },
        { status: 400 }
      );
    }

    const balance = await LoyaltyService.getUserTokenBalance(
      parseInt(userId),
      merchantId
    );

    return NextResponse.json({ 
      userId,
      merchantId,
      balance
    });
  } catch (error) {
    console.error('Error getting loyalty token balance:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty token balance' },
      { status: 500 }
    );
  }
}