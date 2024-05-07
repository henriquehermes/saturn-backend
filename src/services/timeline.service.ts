import { Timeline } from '@prisma/client';
import prisma from '../client';
import uploadService from './upload.service';

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
      image: image ?? undefined
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

  return timelineItem as Timeline;
};

const deleteTimeline = async (
  userId: string,
  projectId: string,
  itemId: string
): Promise<unknown> => {
  const deleted = await prisma.timeline.delete({
    where: {
      id: itemId,
      AND: {
        projectId,
        userId
      }
    }
  });

  if (deleted.image) {
    uploadService.deleteRegistry(deleted.image);
  }

  return;
};

export default {
  createTimeline,
  deleteTimeline
};
