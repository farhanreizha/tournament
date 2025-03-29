import {
  HttpException,
  HttpStatus,
  LogLevel,
  ValidationPipe,
} from "@nestjs/common";

import { AllExceptionsFilter } from "./filters/http-exception.filter";
import { AppModule } from "./app.module";
import { LoggingMiddleware } from "./middlewares/logging.middleware";
import { NestFactory } from "@nestjs/core";
import { RequestIdMiddleware } from "./middlewares/request-id.middleware";
import { ResponseInterceptor } from "./responses/response.interceptor";
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
      exceptionFactory: (errors) => {
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

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Error during application bootstrap:", err);
});
