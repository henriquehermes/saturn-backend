import Joi from 'joi';

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    design_url: Joi.string(),
    flow_diagram: Joi.string(),
    logo: Joi.string(),
    stack: Joi.object().keys({
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
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    text: Joi.string().required(),
    image: Joi.string().allow(null)
  })
};

const deleteItemTimeline = {
  params: Joi.object().keys({
    id: Joi.string().required(),
    itemId: Joi.string().required()
  })
};

export default {
  createProject,
  getProjects,
  getProjectByName,
  postTimeline,
  deleteItemTimeline
};
