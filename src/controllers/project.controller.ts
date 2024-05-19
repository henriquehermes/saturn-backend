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

  res.status(httpStatus.OK).send(projects);
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

  res.status(httpStatus.OK).send(projects);
});

const deleteProject = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;

  await projectService.deleteProject(user?.id, projectId);

  res.status(httpStatus.NO_CONTENT).send();
});

const updateProject = catchAsync(async (req, res) => {
  const user = req.user as User;
  const projectId = req.params['id'] as string;
  const { name, description, status, design_url, flow_diagram, logo, stack } = req.body;

  const project = await projectService.updateProject(user?.id, projectId, {
    name,
    description,
    status,
    design_url,
    flow_diagram,
    logo,
    stack
  });

  res.status(httpStatus.OK).send(project);
});

export default {
  create,
  getAll,
  getStats,
  getByName,
  deleteProject,
  updateProject
};
