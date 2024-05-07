import { User } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { timelineService } from '../services';

const postTimeline = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const { text } = req.body;

  const projects = await timelineService.createTimeline(
    user?.id,
    projectId,
    text,
    req.body.image ?? undefined
  );

  res.status(httpStatus.CREATED).send(projects);
});

const deleteTimeline = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const itemId = req.params['itemId'] as string;

  await timelineService.deleteTimeline(user?.id, projectId, itemId);

  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  postTimeline,
  deleteTimeline
};
