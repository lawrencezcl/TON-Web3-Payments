// app/api/merchants/create/route.ts
import { NextResponse } from 'next/server';
import { MerchantService } from '@/lib/services/merchant-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tonAddress, telegramId, description } = body;

    if (!name || !tonAddress || !telegramId) {
      return NextResponse.json(
        { error: 'Name, TON address, and Telegram ID are required' },
        { status: 400 }
      );
    }

    const merchant = await MerchantService.createMerchant(
      name,
      tonAddress,
      telegramId,
      description
    );

    return NextResponse.json({ merchant });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { error: 'Failed to create merchant' },
      { status: 500 }
    );
  }
}