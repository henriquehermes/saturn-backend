import express from 'express';
import auth from '../../middlewares/auth';
import { projectController } from '../../controllers';
import validate from '../../middlewares/validate';
import { projectValidation } from '../../validations';

const router = express.Router();

router.route('/').get(auth(), validate(projectValidation.getProjects), projectController.getAll);

router.route('/stats').get(auth(), projectController.getStats);

router
  .route('/:name')
  .get(auth(), validate(projectValidation.getProjectByName), projectController.getByName);

router
  .route('/:id')
  .patch(auth(), validate(projectValidation.updateProject), projectController.updateProject)
  .delete(auth(), validate(projectValidation.deleteProject), projectController.deleteProject);

router
  .route('/:id/timeline')
  .post(auth(), validate(projectValidation.postTimeline), projectController.postTimeline);

router
  .route('/:id/timeline/:itemId')
  .delete(auth(), validate(projectValidation.deleteItem), projectController.removeItemTimeline);

router
  .route('/:id/brainstorm')
  .get(auth(), validate(projectValidation.getBrainstorm), projectController.getBrainstorms)
  .post(auth(), validate(projectValidation.postBrainstorm), projectController.postBrainstorm);

router
  .route('/:id/brainstorm/:itemId')
  .delete(auth(), validate(projectValidation.deleteItem), projectController.removeItemBrainstorm);

router
  .route('/new')
  .post(auth(), validate(projectValidation.createProject), projectController.create);

export default router;
