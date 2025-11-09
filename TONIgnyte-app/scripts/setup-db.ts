// scripts/setup-db.ts
import { PrismaClient } from '@prisma/client';

async function setupDatabase() {
  // Check if we have database environment variables
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  if (!databaseUrl) {
    console.error('Error: Database URL not configured. Please set DATABASE_URL or POSTGRES_PRISMA_URL environment variable.');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    console.log('Setting up database with URL:', databaseUrl.substring(0, 50) + '...');
    
    // Test the database connection
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Run a simple query to verify the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database query test successful');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Failed to set up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();