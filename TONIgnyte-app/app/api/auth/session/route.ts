// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Disable static generation for this route since it uses cookies
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token');
    
    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // In a real implementation, we would verify the session token
    // For now, we'll just return a mock response
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: 1,
        telegramId: 'user123',
        tonAddress: 'EQCD39...vK32'
      }
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}