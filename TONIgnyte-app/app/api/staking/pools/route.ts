// app/api/staking/pools/route.ts
import { NextResponse } from 'next/server';
import { StakingService } from '@/lib/services/staking-service';

export async function GET() {
  try {
    const pools = await StakingService.getAvailablePools();
    
    return NextResponse.json({ pools });
  } catch (error) {
    console.error('Error getting staking pools:', error);
    return NextResponse.json(
      { error: 'Failed to get staking pools' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, poolId, amount } = body;

    if (!userId || !poolId || !amount) {
      return NextResponse.json(
        { error: 'User ID, pool ID, and amount are required' },
        { status: 400 }
      );
    }

    const position = await StakingService.stakeTokens(userId, poolId, amount);
    
    return NextResponse.json({ 
      success: true,
      position
    });
  } catch (error: any) {
    console.error('Error staking tokens:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to stake tokens' },
      { status: 500 }
    );
  }
}