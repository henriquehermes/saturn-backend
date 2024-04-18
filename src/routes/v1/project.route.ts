import express from 'express';
import auth from '../../middlewares/auth';
import { projectController } from '../../controllers';
import validate from '../../middlewares/validate';
import { projectValidation } from '../../validations';

const router = express.Router();
router
  .route('/new')
  .post(auth(), validate(projectValidation.createProject), projectController.create);

export default router;
