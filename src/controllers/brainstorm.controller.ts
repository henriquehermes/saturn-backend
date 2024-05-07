import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { brainstormService } from '../services';
import catchAsync from '../utils/catchAsync';

const createBrainstorm = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const { text } = req.body;

  const projects = await brainstormService.createBrainstorm(user?.id, projectId, text);

  res.status(httpStatus.CREATED).send(projects);
});

const deleteBrainstorm = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const itemId = req.params['itemId'] as string;

  await brainstormService.deleteBrainstorm(user?.id, projectId, itemId);

  res.status(httpStatus.NO_CONTENT).send();
});

const getAll = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;

  const brainstorms = await brainstormService.getAll(user?.id, projectId);

  res.status(httpStatus.OK).send(brainstorms);
});

export default {
  createBrainstorm,
  deleteBrainstorm,
  getAll
};
