const { createLogger, format, transports } = require("winston");
const path = require("path");

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const loggerTransports = [
  new transports.Console({
    format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  }),
];

if (process.env.LOG_TO_FILE === "true") {
  loggerTransports.push(
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), logFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
      format: combine(timestamp(), logFormat),
    })
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(errors({ stack: true }), timestamp()),
  transports: loggerTransports,
});

module.exports = logger;
