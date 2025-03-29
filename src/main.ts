import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  HttpException,
  HttpStatus,
  LogLevel,
  ValidationPipe,
} from "@nestjs/common";

import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { AppModule } from "./app.module";
import { LoggingMiddleware } from "./common/middlewares/logging.middleware";
import { NestFactory } from "@nestjs/core";
import { RequestIdMiddleware } from "./common/middlewares/request-id.middleware";
import { ResponseInterceptor } from "./common/responses/response.interceptor";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger: LogLevel[] = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: errors => {
        const formattedErrors = errors.reduce(
          (acc: Record<string, string[]>, err) => {
            acc[err.property] = Object.values(err.constraints || {});
            return acc;
          },
          {},
        );
        return new HttpException(
          { errors: formattedErrors },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.use(new RequestIdMiddleware().use);
  app.use(new LoggingMiddleware().use);

  const mainDocument = new DocumentBuilder()
    .setTitle("Turnament API")
    .setDescription("API Documentation For Turnament Application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, mainDocument);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(err => {
  console.error("Error during application bootstrap:", err);
});
