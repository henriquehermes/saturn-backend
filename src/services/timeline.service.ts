import { Timeline } from '@prisma/client';
import prisma from '../client';
import uploadService from './upload.service';

/**
 * Create a new timeline item
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @param {string} text - Text content of the timeline item
 * @param {string} [image] - Optional image URL for the timeline item
 * @returns {Promise<Timeline>} - Created timeline item
 */
const createTimeline = async (
  userId: string,
  projectId: string,
  text: string,
  image?: string
): Promise<Timeline> => {
  const timelineItem = await prisma.timeline.create({
    data: {
      text,
      userId,
      projectId,
      image: image || undefined
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true
        }
      }
    }
  });

  return timelineItem;
};

/**
 * Delete a timeline item
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @param {string} itemId - ID of the timeline item to delete
 * @returns {Promise<unknown>}
 */
const deleteTimeline = async (
  userId: string,
  projectId: string,
  itemId: string
): Promise<unknown> => {
  const deleted = await prisma.timeline.delete({
    where: {
      id: itemId,
      projectId,
      userId
    }
  });

  // Delete the associated image if it exists
  if (deleted.image) {
    uploadService.deleteRegistry(deleted.image);
  }

  return;
};

export default {
  createTimeline,
  deleteTimeline
};
