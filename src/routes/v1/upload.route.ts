import express from 'express';
import auth from '../../middlewares/auth';
import uploadController from '../../controllers/upload.controller';

const router = express.Router();

router
  .route('/r2')
  .post(auth(), uploadController.multerConfigR2.single('file'), uploadController.uploadToR2);

router
  .route('/')
  .post(auth(), uploadController.multerConfig.single('file'), uploadController.upload);

export default router;

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload files to the backend.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Upload'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
