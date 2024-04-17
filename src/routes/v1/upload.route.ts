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
