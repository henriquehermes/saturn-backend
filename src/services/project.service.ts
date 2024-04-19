import { Project, Stack, Status } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

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

export default {
  createProject,
  queryProjects
};
