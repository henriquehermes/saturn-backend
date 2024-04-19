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
    ...pick(req.query, ['name']), // Pick other filters if needed
    creatorId: user.id
  };
  const options = pick(req.query, ['sortBy', 'pageSize', 'page', 'search', 'sortType']);
  const searching = req.query['searchKey'] as string;
  const searchFields = searching ? searching.split(',').map((field) => field.trim()) : [];

  const projects = await projectService.queryProjects(filter, options, searchFields);

  res.status(httpStatus.CREATED).send(projects);
});

export default {
  create,
  getAll
};
