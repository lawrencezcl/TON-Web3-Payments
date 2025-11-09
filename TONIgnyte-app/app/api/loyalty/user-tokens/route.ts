// app/api/loyalty/user-tokens/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyalty-service';

// Disable static generation for this route since it accesses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const tokens = await LoyaltyService.getUserAllTokens(parseInt(userId));

    return NextResponse.json({ 
      userId,
      tokens
    });
  } catch (error) {
    console.error('Error getting user loyalty tokens:', error);
    return NextResponse.json(
      { error: 'Failed to get user loyalty tokens' },
      { status: 500 }
    );
  }
}