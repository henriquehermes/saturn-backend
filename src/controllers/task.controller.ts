import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { taskService } from '../services';
import catchAsync from '../utils/catchAsync';

const createTask = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const { columnId, content, type, title, priority } = req.body;

  const tasks = await taskService.createTask(user?.id, projectId, {
    columnId,
    content,
    type,
    title,
    priority
  });

  res.status(httpStatus.CREATED).send(tasks);
});

const getAll = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;

  const tasks = await taskService.getAll(user?.id, projectId);

  res.status(httpStatus.OK).send(tasks);
});

const updateTask = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;

  const { id, columnId, content, title, type, priority } = req.body;

  const taskUpdated = await taskService.updateTask(user?.id, projectId, {
    id,
    columnId,
    content,
    title,
    type,
    priority
  });

  res.status(httpStatus.OK).send(taskUpdated);
});

const deleteTask = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const taskId = req.params['taskId'] as string;

  await taskService.deleteTask(user?.id, projectId, taskId);

  res.status(httpStatus.OK).send();
});

export default {
  createTask,
  getAll,
  updateTask,
  deleteTask
};
