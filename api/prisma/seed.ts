import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const spaces = [
    { name: 'Study Room 1', description: 'Quiet individual study room', capacity: 2 },
    { name: 'Study Room 2', description: 'Small group study room', capacity: 4 },
    { name: 'Group Study Room', description: 'Larger collaborative study space', capacity: 8 },
  ];

  for (const space of spaces) {
    await prisma.space.upsert({
      where: { name: space.name },
      update: { description: space.description, capacity: space.capacity, isActive: true },
      create: space,
    });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
