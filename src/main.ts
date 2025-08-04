import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // 👈 enable all levels
  });
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads', // Serve files at /uploads/<filename>
  });
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  );
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
