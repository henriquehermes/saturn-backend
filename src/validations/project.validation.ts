import Joi from 'joi';

const commonProjectFields = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
  design_url: Joi.string().allow(null),
  flow_diagram: Joi.string().allow(null),
  logo: Joi.string().allow(null),
  stack: Joi.object().keys({
    frontend: Joi.array().items(Joi.string()).required(),
    backend: Joi.array().items(Joi.string()).required(),
    misc: Joi.array().items(Joi.string()).required()
  })
};

const projectIdSchema = Joi.object().keys({
  id: Joi.string().required()
});

const createProject = {
  body: Joi.object().keys(commonProjectFields)
};

const updateProject = {
  params: projectIdSchema,
  body: Joi.object().keys({
    ...commonProjectFields,
    stack: Joi.object().keys({
      id: Joi.string().required(),
      frontend: Joi.array().items(Joi.string()).required(),
      backend: Joi.array().items(Joi.string()).required(),
      misc: Joi.array().items(Joi.string()).required()
    })
  })
};

const getProjects = {
  query: Joi.object().keys({
    status: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    search: Joi.string(),
    searchKey: Joi.string(),
    pageSize: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getProjectByName = {
  params: Joi.object().keys({
    name: Joi.string().required()
  })
};

const postTimeline = {
  params: projectIdSchema,
  body: Joi.object().keys({
    text: Joi.string().required(),
    image: Joi.string().allow(null)
  })
};

const postBrainstorm = {
  params: projectIdSchema,
  body: Joi.object().keys({
    text: Joi.string().required()
  })
};

const deleteItem = {
  params: Joi.object().keys({
    id: Joi.string().required(),
    itemId: Joi.string().required()
  })
};

const getBrainstorm = {
  params: projectIdSchema
};

const deleteProject = {
  params: projectIdSchema
};

const getTasks = {
  params: projectIdSchema
};

const createTask = {
  params: projectIdSchema,
  body: Joi.object().keys({
    priority: Joi.string().required(),
    columnId: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().required(),
    title: Joi.string().required()
  })
};

const updateTask = {
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    id: Joi.string().required(),
    priority: Joi.string().required(),
    columnId: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().required(),
    title: Joi.string().required()
  })
};

const deleteTask = {
  params: Joi.object().keys({
    id: Joi.string().required(),
    taskId: Joi.string().required()
  })
};

export default {
  createProject,
  getProjects,
  getProjectByName,
  postTimeline,
  deleteItem,
  postBrainstorm,
  getBrainstorm,
  deleteProject,
  updateProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
