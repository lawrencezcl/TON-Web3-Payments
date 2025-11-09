// app/api/loyalty/redeem/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyalty-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, merchantId, tokenAmount } = body;

    if (!userId || !merchantId || !tokenAmount) {
      return NextResponse.json(
        { error: 'User ID, merchant ID, and token amount are required' },
        { status: 400 }
      );
    }

    const success = await LoyaltyService.redeemTokens(userId, merchantId, tokenAmount);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to redeem loyalty tokens' },
        { status: 500 }
      );
    }

    // Calculate discount value
    const discountValue = LoyaltyService.calculateDiscountFromTokens(tokenAmount);

    return NextResponse.json({ 
      success: true,
      message: `Successfully redeemed ${tokenAmount} loyalty tokens`,
      discountValue
    });
  } catch (error: any) {
    console.error('Error redeeming loyalty tokens:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to redeem loyalty tokens' },
      { status: 500 }
    );
  }
}