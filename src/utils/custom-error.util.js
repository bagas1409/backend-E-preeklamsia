class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Request tidak valid") {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Tidak memiliki otorisasi") {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Akses ditolak") {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource tidak ditemukan") {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Resource sudah ada") {
    super(message, 409);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
