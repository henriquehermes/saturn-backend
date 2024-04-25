import { Project, Stack, Status, Timeline } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/cloud-bucket';
import config from '../config/config';

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
      brainstorms: true,
      collaborators: true,
      tasks: true,
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
    const fileKey = await prisma.file.delete({
      where: {
        file_url: deleted.image
      }
    });

    const params = { Bucket: config.aws.bucket, Key: fileKey.key };
    const deleteCommand = new DeleteObjectCommand(params);
    await s3.send(deleteCommand);
  }

  return;
};

export default {
  createProject,
  queryProjects,
  queryStats,
  queryProjectByName,
  createTimelineItem,
  removeTimelineItem
};
