import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminPhone = process.argv[2];

  if (!/^7\d{10}$/.test(adminPhone))
    throw new Error('Phone number is not valid. Example: 79877156043');

  await prisma.user.upsert({
    where: { phoneNumber: adminPhone },
    update: {},
    create: {
      phoneNumber: adminPhone,
      name: 'Admin',
      role: 'admin',
      passwordHash: '123',
    },
  });
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
