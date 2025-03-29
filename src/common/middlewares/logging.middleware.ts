import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ambil `request_id` dari header atau buat baru jika tidak ada
    let requestId = req.headers["X-REQUEST-ID"] as string;

    if (!requestId) {
      requestId = uuidv4();
      req.headers["X-REQUEST-ID"] = requestId;
    }

    const start = Date.now();
    logger.info(`[REQUEST] ${req.method} ${req.url}`, {
      request_id: requestId,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
    });

    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(`[RESPONSE] ${req.method} ${req.url} - ${res.statusCode}`, {
        request_id: requestId,
        duration: `${duration}ms`,
      });
    });

    next();
  }
}
