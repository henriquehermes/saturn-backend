import { BrainStorm, Project, Stack, Status, Timeline } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import uploadService from './upload.service';
import logger from '../config/logger';

const validStatusValues = Object.values(Status);

type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & {
  stack: Stack;
};
/**
 * Create a new Project
 * @param {CreateProject} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async ({
  name,
  description,
  status,
  design_url,
  flow_diagram,
  logo,
  creatorId,
  stack
}: CreateProject): Promise<Project> => {
  if (!validStatusValues.includes(status)) {
    throw new Error('Invalid status type');
  }

  const nameAlreadyTaken = await prisma.project.findUnique({
    where: { name }
  });
  if (nameAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project name already taken');
  }

  const projectCreated = await prisma.project.create({
    data: {
      name,
      description,
      status,
      design_url,
      flow_diagram,
      logo,
      creatorId,
      stack: {
        create: stack
      }
    },
    include: {
      stack: true
    }
  });

  return projectCreated;
};

/**
 * Query for projects from user
 * @param {Object} query - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProjects = async <Key extends keyof Project>(
  filter: object,
  options: {
    pageSize?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
    search?: string;
  },
  searchableFields: string[],
  keys: Key[] = [
    'id',
    'createdAt',
    'updatedAt',
    'creatorId',
    'logo',
    'name',
    'status',
    'description',
    'flow_diagram',
    'design_url'
  ] as Key[]
): Promise<{
  projects: Pick<Project, Key>[];
  pageSize: number;
  totalPages: number;
  page: number;
}> => {
  if (options.search) {
    const searchWord = options.search.toLowerCase(); // Convert search word to lowercase for case-insensitive search
    const searchFilter: { OR: { [key: string]: any }[] } = { OR: [] };

    searchableFields.forEach((field) => {
      const fieldFilter: { [key: string]: any } = {};
      fieldFilter[field] = {
        contains: searchWord,
        mode: 'insensitive'
      };
      searchFilter.OR.push(fieldFilter);
    });
    // Combine the search filter with the existing filter
    filter = { AND: [filter, searchFilter] };
  }
  const totalCount = await prisma.project.count({ where: filter });
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const totalPages = Math.ceil(totalCount / pageSize);
  const projects = await prisma.project.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return { projects: projects as Pick<Project, Key>[], pageSize, totalPages, page };
};

/**
 * Query for stats dashboard
 * @returns {Promise<QueryResult>}
 */
const queryStats = async (userId: string) => {
  const totalInactive = await prisma.project.count({
    where: {
      status: {
        equals: Status.INACTIVE
      },
      AND: { creatorId: userId }
    }
  });
  const totalActive = await prisma.project.count({
    where: {
      status: {
        equals: Status.IN_PROGRESS
      },
      AND: { creatorId: userId }
    }
  });

  return { totalActive, totalInactive, total: totalActive + totalInactive };
};

/**
 * Query project by name and creator
 * @returns {Promise<QueryResult>}
 */
const queryProjectByName = async (creatorId: string, name: string): Promise<Project> => {
  const project = await prisma.project.findFirst({
    where: {
      name,
      AND: { creatorId }
    },
    include: {
      stack: true,
      timeline: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  return project as Project;
};

const createTimelineItem = async (
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

const removeTimelineItem = async (
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

const createBrainstormItem = async (
  userId: string,
  projectId: string,
  text: string
): Promise<BrainStorm> => {
  const brainstorm = await prisma.brainStorm.create({
    data: {
      text,
      userId,
      projectId
    }
  });

  return brainstorm as BrainStorm;
};

const removeBrainstormItem = async (
  userId: string,
  projectId: string,
  itemId: string
): Promise<BrainStorm> => {
  const deleted = await prisma.brainStorm.delete({
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

const getBrainstorms = async (userId: string, projectId: string): Promise<BrainStorm[]> => {
  const brainstorms = await prisma.brainStorm.findMany({
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

const deleteProject = async (userId: string, projectId: string) => {
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!existingProject) {
    throw new Error('Project not found');
  }

  if (existingProject.logo) {
    logger.debug(`Project image found: ${existingProject.logo}`);
    await uploadService.deleteRegistry(existingProject.logo);
  }

  if (existingProject.flow_diagram) {
    logger.debug(`Project diagram found: ${existingProject.flow_diagram}`);
    await uploadService.deleteRegistry(existingProject.flow_diagram);
  }

  await prisma.brainStorm.deleteMany({
    where: {
      projectId,
      AND: {
        userId
      }
    }
  });
  logger.debug('Project brainstorms deleted');

  await prisma.task.deleteMany({
    where: {
      projectId,
      AND: {
        userId
      }
    }
  });
  logger.debug('Project tasks deleted');

  const existingTimelines = await prisma.timeline.findMany({
    where: { id: projectId }
  });

  existingTimelines.map(async (item) => {
    if (item.image) {
      logger.debug(`Project timeline image found: ${item.image}`);
      await uploadService.deleteRegistry(item.image);
    }
  });

  await prisma.timeline.deleteMany({
    where: {
      projectId,
      AND: {
        userId
      }
    }
  });
  logger.debug('Project timeline deleted');

  await prisma.collaborator.deleteMany({
    where: {
      projectId,
      AND: {
        userId
      }
    }
  });
  logger.debug('Project collaborators deleted');

  await prisma.project.delete({
    where: {
      id: projectId,
      AND: {
        creatorId: userId
      }
    }
  });
  logger.debug('Project successfully deleted');

  return existingProject;
};

export default {
  createProject,
  queryProjects,
  queryStats,
  queryProjectByName,
  createTimelineItem,
  removeTimelineItem,
  createBrainstormItem,
  removeBrainstormItem,
  getBrainstorms,
  deleteProject
};
