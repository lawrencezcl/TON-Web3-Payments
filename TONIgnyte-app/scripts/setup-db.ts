// scripts/setup-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');
  
  // Create a sample user
  const user = await prisma.user.upsert({
    where: { telegramId: 'user123' },
    update: {},
    create: {
      telegramId: 'user123',
      tonAddress: 'EQCD39...vK32',
    },
  });
  
  console.log('Created user:', user);
  
  // Create a sample merchant
  const merchant = await prisma.merchant.upsert({
    where: { tonAddress: 'EQCD39...vK32' },
    update: {},
    create: {
      name: 'Sample Merchant',
      tonAddress: 'EQCD39...vK32',
      description: 'A sample merchant for testing',
    },
  });
  
  console.log('Created merchant:', merchant);
  
  console.log('Database setup complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });