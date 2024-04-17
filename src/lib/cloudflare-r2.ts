import { S3Client } from '@aws-sdk/client-s3';
import config from '../config/config';

const endpoint = `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`;

export const r2 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId: config.cloudflare.accessKey,
    secretAccessKey: config.cloudflare.secretKey
  }
});
