import { PrismaClient } from '@prisma/client';
import { PROJECT_SATURN, PROJECT_SATURN_STACK } from './seeds/new-project';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Henrique Hermes',
      email: 'henriquehermes97@gmail.com',
      password: 'Testando@2024'
    }
  });

  await prisma.project.create({
    data: {
      ...PROJECT_SATURN,
      creatorId: user.id,
      stack: {
        create: PROJECT_SATURN_STACK
      }
    }
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
