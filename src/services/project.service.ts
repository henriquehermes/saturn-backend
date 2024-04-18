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

export default {
  createProject
};
