import prisma from '../../src/client';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Ensure you're connected before attempting to delete data
    await prisma.brainstorm.deleteMany();
    await prisma.task.deleteMany();
    await prisma.timeline.deleteMany();
    await prisma.file.deleteMany();
    await prisma.project.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.brainstorm.deleteMany();
    await prisma.task.deleteMany();
    await prisma.timeline.deleteMany();
    await prisma.file.deleteMany();
    await prisma.project.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
};

export default setupTestDB;
