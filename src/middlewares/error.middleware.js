const logger = require("../utils/logger.util");
const { sendError } = require("../utils/response.util");
const { env } = require("../config/env.config");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Detail error logging
  const errorDetails = {
    timestamp: new Date().toISOString(),
    method: req.method,
    endpoint: req.originalUrl,
    message: err.message,
    statusCode: statusCode,
    stack: err.stack,
  };

  // Log error using winston
  logger.error(
    `Error on ${errorDetails.method} ${errorDetails.endpoint}: ${errorDetails.message} (Status: ${errorDetails.statusCode})`
  );
  if (err.stack) {
    logger.error(`Stack trace:\n${err.stack}`);
  }

  // Format error responses
  let clientErrors = null;

  // Handle specific database or library errors
  if (err.name === "PrismaClientKnownRequestError") {
    // Prisma specific errors
    if (err.code === "P2002") {
      return sendError(res, "Data dengan nilai tersebut sudah terdaftar.", null, 409);
    }
    if (err.code === "P2025") {
      return sendError(res, "Data tidak ditemukan.", null, 404);
    }
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return sendError(res, "Validasi input gagal.", formattedErrors, 400);
  }

  // Send JSON response to client
  const isProd = env === "production";
  return sendError(
    res,
    message,
    isProd ? null : { stack: err.stack },
    statusCode
  );
};

module.exports = errorHandler;
