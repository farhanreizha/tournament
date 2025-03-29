import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ambil `request_id` dari header atau buat baru jika tidak ada
    req.headers["requestId"] = req.headers["requestId"] || uuidv4();
    res.setHeader("requestId", req.headers["requestId"]);
    next();
  }
}
