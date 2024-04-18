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

export default {
  createProject
};
