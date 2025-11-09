// app/api/loyalty/mint/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyalty-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, merchantId, purchaseAmount, loyaltyRate } = body;

    if (!userId || !merchantId || !purchaseAmount) {
      return NextResponse.json(
        { error: 'User ID, merchant ID, and purchase amount are required' },
        { status: 400 }
      );
    }

    const success = await LoyaltyService.mintTokensAfterPurchase(
      userId,
      merchantId,
      purchaseAmount,
      loyaltyRate
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mint loyalty tokens' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Successfully minted loyalty tokens for user ${userId}`
    });
  } catch (error) {
    console.error('Error minting loyalty tokens:', error);
    return NextResponse.json(
      { error: 'Failed to mint loyalty tokens' },
      { status: 500 }
    );
  }
}