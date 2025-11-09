// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/services/database-service';

// Disable static generation for this route since it accesses the database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if required environment variables are present
    const requiredEnvVars = ['NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_TON_NETWORK'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return NextResponse.json(
        { 
          status: 'error', 
          timestamp: new Date().toISOString(),
          error: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
          database: 'not checked'
        },
        { status: 500 }
      );
    }
    
    // Check database connection only if DATABASE_URL is present
    if (process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL) {
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    } else {
      // If no database URL is configured, return success but indicate database is not connected
      return NextResponse.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: 'not configured'
      });
    }
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