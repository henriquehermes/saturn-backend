import { Brainstorm } from '@prisma/client';
import prisma from '../client';

const createBrainstorm = async (
  userId: string,
  projectId: string,
  text: string
): Promise<Brainstorm> => {
  const brainstorm = await prisma.brainstorm.create({
    data: {
      text,
      userId,
      projectId
    }
  });

  return brainstorm as Brainstorm;
};

const deleteBrainstorm = async (
  userId: string,
  projectId: string,
  itemId: string
): Promise<Brainstorm> => {
  const deleted = await prisma.brainstorm.delete({
    where: {
      id: itemId,
      AND: {
        projectId,
        userId
      }
    }
  });

  return deleted;
};

const getAll = async (userId: string, projectId: string): Promise<Brainstorm[]> => {
  const brainstorms = await prisma.brainstorm.findMany({
    where: {
      userId,
      projectId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return brainstorms;
};

export default {
  createBrainstorm,
  deleteBrainstorm,
  getAll
};
