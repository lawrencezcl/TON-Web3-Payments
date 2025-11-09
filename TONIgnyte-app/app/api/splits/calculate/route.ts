// app/api/splits/calculate/route.ts
import { NextResponse } from 'next/server';
import { SplitEngineService } from '@/lib/services/split-engine-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { expenses } = body;

    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json(
        { error: 'Missing or invalid expenses array' },
        { status: 400 }
      );
    }

    const settlements = SplitEngineService.calculateOptimalSettlements(expenses);

    return NextResponse.json({ settlements });
  } catch (error) {
    console.error('Error calculating splits:', error);
    return NextResponse.json(
      { error: 'Failed to calculate splits' },
      { status: 500 }
    );
  }
}