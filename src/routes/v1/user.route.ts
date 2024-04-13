import express from 'express';
import auth from '../../middlewares/auth';
import { userController } from '../../controllers';
import validate from '../../middlewares/validate';
import { userValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(userValidation.getSession), userController.getUserSession)
  .patch(auth(), validate(userValidation.getSession), userController.updateUser)
  .delete(auth(), validate(userValidation.getSession), userController.deleteUser);

export default router;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and retrieval
 */
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user details
 *     description: Retrieve user details using the access token provided in the Authorization header.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
