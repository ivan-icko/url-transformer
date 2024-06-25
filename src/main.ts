import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './common/utils/string.util';

const port = getEnv('APP_PORT', '3000');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS settings
  // SWAGGER settings
  // MIDDLEWARE settings

  await app.listen(port);
}
bootstrap();
