import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ambil `request_id` dari header atau buat baru jika tidak ada
    req.headers["X-REQUEST-ID"] = req.headers["X-REQUEST-ID"] || uuidv4();
    res.setHeader("X-REQUEST-ID", req.headers["X-REQUEST-ID"]);
    next();
  }
}
