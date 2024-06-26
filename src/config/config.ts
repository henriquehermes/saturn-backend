import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLOUDFLARE_TOKEN: Joi.string().description('API token for Cloudflare authentication'),
    CLOUDFLARE_ACCESS_KEY_ID: Joi.string().description(
      'Access key ID for Cloudflare authentication'
    ),
    CLOUDFLARE_SECRET_ACCESS_KEY: Joi.string().description(
      'Secret access key for Cloudflare authentication'
    ),
    CLOUDFLARE_BUCKET_NAME: Joi.string().description(
      'Name of the bucket used in Cloudflare integration'
    ),
    CLOUDFLARE_ACCOUNT_ID: Joi.string().description('Account ID associated with Cloudflare'),
    AWS_REGION: Joi.string().description('Region from S3 bucket'),
    AWS_ACCESS_KEY: Joi.string().description('Access key ID for S3 authentication'),
    AWS_BUCKET_NAME: Joi.string().description('Name of the bucket used in S3 integration'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('Secret Access key ID for S3 authentication')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  },
  cloudflare: {
    token: envVars.CLOUDFLARE_TOKEN,
    accessKey: envVars.CLOUDFLARE_ACCESS_KEY_ID,
    bucket: envVars.CLOUDFLARE_BUCKET_NAME,
    secretKey: envVars.CLOUDFLARE_SECRET_ACCESS_KEY,
    accountId: envVars.CLOUDFLARE_ACCOUNT_ID
  },
  aws: {
    bucket: envVars.AWS_BUCKET_NAME,
    region: envVars.AWS_REGION,
    accessKeyId: envVars.AWS_ACCESS_KEY,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY
  },
  openAiKey: envVars.OPEN_AI_KEY
};
