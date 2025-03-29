import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { Response } from "express";
import { logger } from "../utils/logger";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get HTTP Status dynamically (fallback to 500 if unknown error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string = "Internal server error"; // Default message
    let errors: Record<string, unknown> = {}; // Default errors object

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Handle if response is a string or object
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        errors = { message }; // Wrap message in an object
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        message =
          ((exceptionResponse as Record<string, unknown>)[
            "message"
          ] as string) || "An error occurred";

        errors =
          "errors" in exceptionResponse
            ? ((exceptionResponse as Record<string, unknown>)[
                "errors"
              ] as Record<string, unknown>)
            : { message };
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = { message };
    }

    const requestId = request.headers["X-REQUEST-ID"] || "";

    // Log the error
    logger.error(`[ERROR] ${request.method} ${request.url} - ${status}`, {
      requestId: requestId,
      error: errors,
      stack: exception instanceof Error ? exception.stack : null,
    });

    // 🔥 Hide 500 errors in production
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      process.env.NODE_ENV === "production"
    ) {
      errors = { message: "Something went wrong, please try again later." };
    }

    // Send formatted error response
    response.status(status).json({
      requestId,
      errors,
    });
  }
}
