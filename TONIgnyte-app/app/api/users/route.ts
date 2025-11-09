// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, tonAddress } = body;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }

    const user = await UserService.createOrUpdateUser(telegramId, tonAddress);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create or update user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    const tonAddress = searchParams.get('tonAddress');

    if (!telegramId && !tonAddress) {
      return NextResponse.json(
        { error: 'Either Telegram ID or TON address is required' },
        { status: 400 }
      );
    }

    let user;
    if (telegramId) {
      user = await UserService.getUserWithWallet(telegramId);
    } else if (tonAddress) {
      user = await UserService.getUserWithWallet(tonAddress);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}