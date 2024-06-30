import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getEnv } from './common/utils/string.util';
import {
  DEFAULT_APP_NAME,
  DEFAULT_DOC_PATH,
  DEFAULT_PORT,
} from './common/constants/general';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { CookieMiddleware } from './common/middleware/cookie.middleware';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './common/validators/validation-options';

const port = Number(getEnv('APP_PORT', DEFAULT_PORT));
const appName = getEnv('APP_NAME', DEFAULT_APP_NAME);
const PREFIX = getEnv('APP_PREFIX', '');
const swaggerEnabled = getEnv('APP_DOC_ENABLED', 'false') === 'true';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: getEnv('IP_WHITE_LIST', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    optionsSuccessStatus: 200,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  let swaggerPath = DEFAULT_DOC_PATH;
  let docPath = '/documentation';
  if (PREFIX.length > 0) {
    app.setGlobalPrefix(PREFIX);
    swaggerPath = `${PREFIX}/${swaggerPath}`;
    docPath = `/${PREFIX}${docPath}`;
  }

  // swagger setup... (path: http://$host:$port/docs)
  if (swaggerEnabled) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(`${appName} API swagger documentation`)
      .addSecurity('basic', {
        type: 'http',
        scheme: 'basic',
      })
      .build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup(swaggerPath, app, document);

    app.use(cookieParser());

    app.use(new CookieMiddleware().use);

    app.setViewEngine('html');
  }
  await app.listen(port);
  console.log(
    `Server is up and running on port ${port} on node version ${process.version}`,
  );
}
bootstrap();
