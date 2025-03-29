import * as DailyRotateFile from "winston-daily-rotate-file";

import { createLogger, format, transports } from "winston";

import { dirname } from "path";

const __root = dirname(require.main?.filename || ".");
const logFilePath = `${process.cwd()}/logs/app-%DATE%.log`;
console.log(logFilePath);

// Format log dengan timestamp & warna untuk console
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  }),
);

export const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({ format: format.colorize() }),
    new DailyRotateFile({
      filename: logFilePath,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});
