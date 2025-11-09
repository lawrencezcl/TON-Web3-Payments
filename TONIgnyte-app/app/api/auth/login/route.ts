// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { UserService } from '@/lib/services/user-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, tonAddress, signature, payload } = body;

    if (!telegramId || !tonAddress || !signature || !payload) {
      return NextResponse.json(
        { error: 'Telegram ID, TON address, signature, and payload are required' },
        { status: 400 }
      );
    }

    // Verify wallet signature
    const isValid = await AuthService.verifyWalletSignature(tonAddress, signature, payload);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid wallet signature' },
        { status: 401 }
      );
    }

    // Create or update user
    const user = await UserService.createOrUpdateUser(telegramId, tonAddress);

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        tonAddress: user.tonAddress
      }
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}