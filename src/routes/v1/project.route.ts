import express from 'express';
import auth from '../../middlewares/auth';
import { projectController, taskController, timelineController } from '../../controllers';
import validate from '../../middlewares/validate';
import { projectValidation } from '../../validations';
import brainstormController from '../../controllers/brainstorm.controller';

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
  .post(auth(), validate(projectValidation.postTimeline), timelineController.postTimeline);

router
  .route('/:id/timeline/:itemId')
  .delete(auth(), validate(projectValidation.deleteItem), timelineController.deleteTimeline);

router
  .route('/:id/brainstorm')
  .get(auth(), validate(projectValidation.getBrainstorm), brainstormController.getAll)
  .post(auth(), validate(projectValidation.postBrainstorm), brainstormController.createBrainstorm);

router
  .route('/:id/brainstorm/:itemId')
  .delete(auth(), validate(projectValidation.deleteItem), brainstormController.deleteBrainstorm);

router
  .route('/:id/task')
  .get(auth(), validate(projectValidation.getTasks), taskController.getTasks)
  .post(auth(), validate(projectValidation.createTask), taskController.createTask)
  .patch(auth(), validate(projectValidation.updateTask), taskController.updateTask);

router
  .route('/:id/task/:taskId')
  .delete(auth(), validate(projectValidation.deleteTask), taskController.deleteTask);

router
  .route('/new')
  .post(auth(), validate(projectValidation.createProject), projectController.create);

export default router;
