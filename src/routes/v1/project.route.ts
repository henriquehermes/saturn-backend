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
  .get(auth(), validate(projectValidation.getTasks), taskController.getAll)
  .post(auth(), validate(projectValidation.createTask), taskController.createTask)
  .patch(auth(), validate(projectValidation.updateTask), taskController.updateTask);

router
  .route('/:id/task/:taskId')
  .delete(auth(), validate(projectValidation.deleteTask), taskController.deleteTask);

router
  .route('/new')
  .post(auth(), validate(projectValidation.createProject), projectController.create);

export default router;

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing projects
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve all projects
 *     description: Retrieve a list of all projects
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *   post:
 *     summary: Create a new project
 *     description: Create a new project
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProject'
 *     responses:
 *       200:
 *         description: Created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     description: Get a project by its ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project to get
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/{id}/timeline:
 *   post:
 *     summary: Add timeline to a project
 *     description: Add a timeline to a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Timeline'
 *     responses:
 *       200:
 *         description: Timeline added successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /projects/{id}/brainstorm:
 *   get:
 *     summary: Get brainstorming sessions of a project
 *     description: Get brainstorming sessions of a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: List of brainstorming sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BrainstormSession'
 *   post:
 *     summary: Create a brainstorming session for a project
 *     description: Create a brainstorming session for a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBrainstormSession'
 *     responses:
 *       200:
 *         description: Created brainstorming session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrainstormSession'
 */

/**
 * @swagger
 * /projects/{id}/task:
 *   get:
 *     summary: Get tasks of a project
 *     description: Get tasks of a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *   post:
 *     summary: Create a task for a project
 *     description: Create a task for a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTask'
 *     responses:
 *       200:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /projects/{id}/task/{taskId}:
 *   delete:
 *     summary: Delete a task from a project
 *     description: Delete a task from a project by task ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /projects/new:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProject'
 *     responses:
 *       200:
 *         description: Created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /projects/{id}/brainstorm/{itemId}:
 *   delete:
 *     summary: Delete a brainstorming item from a project
 *     description: Delete a brainstorming item from a project by item ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the brainstorming item to delete
 *     responses:
 *       200:
 *         description: Brainstorming item deleted successfully
 *       404:
 *         description: Brainstorming item not found
 */

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     description: Update a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProject'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/stats:
 *   get:
 *     summary: Get statistics of projects
 *     description: Get statistics of projects
 *     security:
 *       - bearerAuth: []
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       404:
 *         description: Statistics not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The project ID
 *         name:
 *           type: string
 *           description: The project name
 *     NewProject:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The project name
 *     UpdateProject:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The new project name
 *     Timeline:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the timeline event
 *         event:
 *           type: string
 *           description: Description of the timeline event
 *     BrainstormSession:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The brainstorming session ID
 *         topic:
 *           type: string
 *           description: The topic of the brainstorming session
 *     NewBrainstormSession:
 *       type: object
 *       properties:
 *         topic:
 *           type: string
 *           description: The topic of the brainstorming session
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The task ID
 *         name:
 *           type: string
 *           description: The task name
 *         description:
 *           type: string
 *           description: The task description
 *         status:
 *           type: string
 *           description: The task status
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: The task deadline
 *     NewTask:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The task name
 *         description:
 *           type: string
 *           description: The task description
 *         status:
 *           type: string
 *           description: The task status
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: The task deadline
 */
