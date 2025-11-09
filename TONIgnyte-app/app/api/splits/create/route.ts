// app/api/splits/create/route.ts
import { NextResponse } from 'next/server';
import { SplitService } from '@/lib/services/split-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, description, amount, participantTelegramIds } = body;

    if (!telegramId || !description || !amount || !participantTelegramIds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await SplitService.createSplit(
      telegramId,
      description,
      amount,
      participantTelegramIds
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error creating split:', error);
    return NextResponse.json(
      { error: 'Failed to create split' },
      { status: 500 }
    );
  }
}