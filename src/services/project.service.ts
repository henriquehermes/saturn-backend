import { Project, Stack, Status } from '@prisma/client';
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
 * @param {number} [options.page] - Current page (default = 0)
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
  totalRows: number;
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
  const page = options.page ?? 0;
  const pageSize = options.pageSize ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const totalPages = Math.ceil(totalCount / pageSize);

  const projects = await prisma.project.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * pageSize,
    take: pageSize,
    orderBy: sortBy ? { [sortBy]: sortType } : { name: 'asc' }
  });

  return {
    projects: projects as Pick<Project, Key>[],
    pageSize,
    totalPages,
    page,
    totalRows: totalCount
  };
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
 * @param {string} creatorId
 * @param {string} name
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

/**
 * Delete project
 * @param {string} userId
 * @param {string} projectId
 * @returns {Promise<QueryResult>}
 */
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

  await prisma.brainstorm.deleteMany({
    where: {
      projectId,
      userId
    }
  });
  logger.debug('Project brainstorms deleted');

  await prisma.task.deleteMany({
    where: {
      projectId,
      userId
    }
  });
  logger.debug('Project tasks deleted');

  const existingTimelines = await prisma.timeline.findMany({
    where: { id: projectId }
  });

  await Promise.all(
    existingTimelines.map(async (item) => {
      if (item.image) {
        logger.debug(`Project timeline image found: ${item.image}`);
        await uploadService.deleteRegistry(item.image);
      }
    })
  );

  await prisma.timeline.deleteMany({
    where: {
      projectId,
      userId
    }
  });
  logger.debug('Project timeline deleted');

  await prisma.project.delete({
    where: {
      id: projectId,
      creatorId: userId
    }
  });
  logger.debug('Project successfully deleted');

  const userFavouriteList = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      favourites: true
    }
  });

  const isIncluded =
    userFavouriteList?.favourites && userFavouriteList.favourites.includes(existingProject.name);

  if (isIncluded) {
    const newList = userFavouriteList.favourites.filter((fav) => fav !== existingProject.name);
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        favourites: newList
      }
    });
    logger.debug('Project shortcut successfully deleted');
  }

  return existingProject;
};

/**
 * Update a project
 * @param {string} userId
 * @param {string} projectId
 * @param {Object} body - Object containing updated project details
 * @param {string} body.name - New name of the project
 * @param {string} body.description - New description of the project
 * @param {Status} body.status - New status of the project
 * @param {string} body.design_url - New URL for the project design
 * @param {string} body.flow_diagram - New URL for the project flow diagram
 * @param {string} body.logo - New URL for the project logo
 * @param {Stack} body.stack - New stack for the project
 * @returns {Promise<Project>}
 */
const updateProject = async (
  userId: string,
  projectId: string,
  body: {
    name: string;
    description: string;
    status: Status;
    design_url: string;
    flow_diagram: string;
    logo: string;
    stack: Stack;
  }
): Promise<Project> => {
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!existingProject) {
    throw new Error('Project not found');
  }

  if (existingProject.creatorId !== userId) {
    throw new Error('User is not the creator of this project');
  }

  const projectStack = await prisma.stack.findUnique({
    where: {
      id: body.stack.id
    }
  });

  if (!projectStack) {
    throw new Error('Stack not found');
  }

  await prisma.stack.update({
    where: {
      id: body.stack.id
    },
    data: {
      ...body.stack
    }
  });
  logger.debug('Project stack updated');

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: body.name,
      description: body.description,
      status: body.status,
      design_url: body.design_url,
      flow_diagram: body.flow_diagram,
      logo: body.logo
    },
    include: {
      stack: true
    }
  });
  logger.debug('Project updated');

  return updatedProject;
};

export default {
  createProject,
  queryProjects,
  queryStats,
  queryProjectByName,
  deleteProject,
  updateProject
};
