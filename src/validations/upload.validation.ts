import Joi from 'joi';

const deleteKey = {
  body: Joi.object().keys({
    key: Joi.string().required()
  })
};

export default {
  deleteKey
};
