import Joi from 'joi';

const deleteKey = {
  query: Joi.object().keys({
    key: Joi.string().required()
  })
};

export default {
  deleteKey
};
