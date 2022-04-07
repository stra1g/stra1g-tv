/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  APP_URL: Env.schema.string(),

  DB_CONNECTION: Env.schema.string(),

  DRIVE_DISK: Env.schema.enum(['local'] as const),

  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
  PG_DB_DEBUG: Env.schema.boolean.optional(),
  PG_SSL: Env.schema.boolean(),

  SES_ACCESS_KEY: Env.schema.string(),
  SES_ACCESS_SECRET: Env.schema.string(),
  SES_REGION: Env.schema.string(),
  MAIL_FROM: Env.schema.string({ format: 'email' }),

  GMAIL_USER: Env.schema.string({ format: 'email' }),
  GMAIL_PASSWORD: Env.schema.string(),

  MEDIA_RTMP_PORT: Env.schema.number(),
  MEDIA_HTTP_PORT: Env.schema.number(),
});
