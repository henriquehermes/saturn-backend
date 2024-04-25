import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { projectService } from '../services';
import { User } from '@prisma/client';
import pick from '../utils/pick';

const create = catchAsync(async (req, res) => {
  const user = req.user as User;

  const payload = {
    ...req.body,
    creatorId: user.id
  };
  const project = await projectService.createProject(payload);
  res.status(httpStatus.CREATED).send(project);
});

const getAll = catchAsync(async (req, res) => {
  const user = req.user as User;
  const filter = {
    ...pick(req.query, ['name', 'status']), // Pick other filters if needed
    creatorId: user.id
  };
  const options = pick(req.query, ['sortBy', 'pageSize', 'page', 'search', 'sortType']);
  const searching = req.query['searchKey'] as string;
  const searchFields = searching ? searching.split(',').map((field) => field.trim()) : [];

  const projects = await projectService.queryProjects(filter, options, searchFields);

  res.status(httpStatus.CREATED).send(projects);
});

const getStats = catchAsync(async (req, res) => {
  const user = req.user as User;

  const projects = await projectService.queryStats(user.id);

  res.status(httpStatus.OK).send(projects);
});

const getByName = catchAsync(async (req, res) => {
  const user = req.user as User;

  const name = req.params['name'] as string;

  const projects = await projectService.queryProjectByName(user?.id, decodeURI(name));

  res.status(httpStatus.CREATED).send(projects);
});

const postTimeline = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const { text } = req.body;

  const projects = await projectService.createTimelineItem(
    user?.id,
    projectId,
    text,
    req.body.image ?? undefined
  );

  res.status(httpStatus.CREATED).send(projects);
});

const removeItemTimeline = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const itemId = req.params['itemId'] as string;

  await projectService.removeTimelineItem(user?.id, projectId, itemId);

  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  create,
  getAll,
  getStats,
  getByName,
  postTimeline,
  removeItemTimeline
};
