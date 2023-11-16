import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
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

  const options = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('API documentations')
    .setVersion('1.0')
    .addBearerAuth()
    /* this is an alternate for define jwt bearer in swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'Header',
      },
      'bearer',
    )
    */
    /*
      As mentioned in this link (https://swagger.io/docs/specification/authentication/cookie-authentication/)
      Swagger editor is not supported for try cookie auth to send refresh-token api,
      you must use app like postman or insomnia to test, or use curl command in swagger editor
      and test in terminal, this method will work.
     */
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      name: 'refreshToken',
      in: 'cookie',
    })
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port);
}

void bootstrap();
