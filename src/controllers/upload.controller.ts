import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { r2, s3 } from '../lib/cloud-bucket';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/config';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import uploadService from '../services/upload.service';

const multerConfigBucket = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 // limit file size to 2MB
  }
});

const multerConfig = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Save avatars in a folder named 'uploads/avatars'
    },
    filename: function (req, file, cb) {
      const fileName = randomUUID() + '-' + file.originalname;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024 // limit file size to 2MB
  }
});

const upload = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).send('No file uploaded');
  }

  // File uploaded successfully
  const filePath = req.file.path; // File path on the server
  const fileLink = `http://localhost:${config.port}/${filePath}`; // Construct file link

  res.status(httpStatus.CREATED).send({
    url: fileLink
  });
});

const uploadToR2 = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(httpStatus.NOT_FOUND).send();
  }

  const key = randomUUID().concat('-').concat(req.file?.originalname);

  await r2.send(
    new PutObjectCommand({
      Bucket: config.cloudflare.bucket,
      Key: key,
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype
    })
  );

  const downloadSignedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: config.cloudflare.bucket,
      Key: key
    })
  );

  res.status(httpStatus.CREATED).send({
    image: downloadSignedUrl
  });
});

const uploadToS3 = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).send('File not found');
  }

  const key = randomUUID().concat('-').concat(req.file?.originalname);

  const params = {
    Bucket: config.aws.bucket,
    Key: key,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype
  };

  const upload = new Upload({
    client: s3,
    params
  });

  try {
    const response = await upload.done();

    if (response.Location) {
      await uploadService.createUploadRegistry(response.Location, key);
    }

    return res.status(httpStatus.CREATED).send({
      url: response.Location
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error uploading file to S3');
  }
});

const deleteFromS3 = catchAsync(async (req, res) => {
  const params = { Bucket: config.aws.bucket, Key: req.query['key'] as string };

  try {
    const deleteCommand = new DeleteObjectCommand(params);
    await s3.send(deleteCommand);

    return res.status(httpStatus.OK).send();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error deleting file from S3');
  }
});

export default {
  uploadToR2,
  multerConfigBucket,
  multerConfig,
  upload,
  uploadToS3,
  deleteFromS3
};
