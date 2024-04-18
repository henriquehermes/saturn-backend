import express from 'express';
import auth from '../../middlewares/auth';
import { aiController } from '../../controllers';

const router = express.Router();
router.route('/').post(auth(), aiController.aiPrompt);

export default router;

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI service
 */

/**
 * @swagger
 * /ai:
 *   post:
 *     summary: Send a message to the AI service
 *     description: Receive a message from the AI service
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: fake name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AI'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
