import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from './utils/interfaces/env.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService<IEnvironmentVariables>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.getOrThrow('API_PREFIX', { infer: true }), {
    exclude: ['/'],
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  /*
    this code to enable @Exclude in Entity
    https://stackoverflow.com/questions/65545893/nest-js-exclude-decorator-not-working-in-the-post-methods
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const port = configService.getOrThrow('APP_PORT', { infer: true });
  await app.listen(port);
}

void bootstrap();
