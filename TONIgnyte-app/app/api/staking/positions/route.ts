// app/api/staking/positions/route.ts
import { NextResponse } from 'next/server';
import { StakingService } from '@/lib/services/staking-service';

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

    const positions = await StakingService.getUserPositions(parseInt(userId));
    
    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error getting staking positions:', error);
    return NextResponse.json(
      { error: 'Failed to get staking positions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { positionId } = body;

    if (!positionId) {
      return NextResponse.json(
        { error: 'Position ID is required' },
        { status: 400 }
      );
    }

    const success = await StakingService.unstakeTokens(positionId);
    
    return NextResponse.json({ 
      success,
      message: success ? 'Successfully unstaked tokens' : 'Failed to unstake tokens'
    });
  } catch (error: any) {
    console.error('Error unstaking tokens:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unstake tokens' },
      { status: 500 }
    );
  }
}