import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { projectService } from '../services';
import { User } from '@prisma/client';

const create = catchAsync(async (req, res) => {
  const user = req.user as User;

  const payload = {
    ...req.body,
    creatorId: user.id
  };
  const project = await projectService.createProject(payload);
  res.status(httpStatus.CREATED).send(project);
});

export default {
  create
};
