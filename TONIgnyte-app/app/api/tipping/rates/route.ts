// app/api/tipping/rates/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real implementation, this would fetch current exchange rates
    // For now, we'll return mock rates
    const rates = {
      tonToUsd: 2.50,
      usdToTon: 0.40,
      tipSuggestions: [0.1, 0.5, 1.0, 2.0, 5.0] // TON amounts
    };

    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error getting tipping rates:', error);
    return NextResponse.json(
      { error: 'Failed to get tipping rates' },
      { status: 500 }
    );
  }
}