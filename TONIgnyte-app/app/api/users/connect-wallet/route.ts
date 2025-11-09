// app/api/users/connect-wallet/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, tonAddress } = body;

    if (!telegramId || !tonAddress) {
      return NextResponse.json(
        { error: 'Telegram ID and TON address are required' },
        { status: 400 }
      );
    }

    const user = await UserService.connectWalletToUser(telegramId, tonAddress);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error connecting wallet to user:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet to user' },
      { status: 500 }
    );
  }
}