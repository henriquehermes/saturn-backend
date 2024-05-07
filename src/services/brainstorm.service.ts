import { Brainstorm } from '@prisma/client';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

/**
 * Create a new Brainstorm entry
 * @param {string} userId
 * @param {string} projectId
 * @param {string} text
 * @returns {Promise<Brainstorm>}
 */
const createBrainstorm = async (
  userId: string,
  projectId: string,
  text: string
): Promise<Brainstorm> => {
  // Validate inputs
  if (!userId || !projectId || !text) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing userId, projectId, or text');
  }

  const brainstorm = await prisma.brainstorm.create({
    data: {
      text,
      userId,
      projectId
    }
  });

  return brainstorm as Brainstorm;
};

/**
 * Delete a Brainstorm entry
 * @param {string} userId
 * @param {string} projectId
 * @param {string} itemId
 * @returns {Promise<Brainstorm>}
 */
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

/**
 * Get all Brainstorm entries for a user in a project
 * @param {string} userId
 * @param {string} projectId
 * @returns {Promise<Brainstorm[]>}
 */
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
