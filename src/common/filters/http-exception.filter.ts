import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { Response } from "express";
import { logger } from "src/common/utils/logger";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errors: Record<string, unknown> = {};
    if (typeof exceptionResponse === "string") {
      // Jika error berupa string, ubah jadi format object
      errors = { message: exceptionResponse };
    } else if (
      exceptionResponse !== null &&
      typeof exceptionResponse === "object"
    ) {
      // Jika error adalah object, ambil key "errors" atau seluruh response
      errors = exceptionResponse["errors"] as Record<string, unknown>;
    }

    const requestId = request.headers["requestId"] || "";

    logger.error(`[ERROR] ${request.method} ${request.url} - ${status}`, {
      request_id: requestId,
      error: exceptionResponse,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json({
      requestId, // Tambahkan request_id dari client
      errors, // Hanya menampilkan error dalam format yang diminta
    });
  }
}
