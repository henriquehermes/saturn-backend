import express from 'express';
import auth from '../../middlewares/auth';
import uploadController from '../../controllers/upload.controller';
import validate from '../../middlewares/validate';
import { uploadValidation } from '../../validations';

const router = express.Router();

router
  .route('/r2')
  .post(auth(), uploadController.multerConfigBucket.single('file'), uploadController.uploadToR2);

router
  .route('/local')
  .post(auth(), uploadController.multerConfig.single('file'), uploadController.upload);

router
  .route('/')
  .post(auth(), uploadController.multerConfigBucket.single('file'), uploadController.uploadToS3)
  .delete(auth(), validate(uploadValidation.deleteKey), uploadController.deleteFromS3);

export default router;
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload management and retrieval
 */
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to S3
 *     description: Upload files to S3 Bucket.
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
 *   delete:
 *     summary: Delete a file from S3 Bucket
 *     description: Delete files from S3 Bucket.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *             example:
 *               key: some_strange_key
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /upload/local:
 *   post:
 *     summary: Upload a file to local storage
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
 *
 * /upload/r2:
 *   post:
 *     summary: Upload a file to CloudFlare R2
 *     description: Upload files to CloudFlare r2.
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
