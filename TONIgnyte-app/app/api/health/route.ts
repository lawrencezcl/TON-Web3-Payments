// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services/database-service';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'Database connection failed'
      },
      { status: 500 }
    );
  }
}