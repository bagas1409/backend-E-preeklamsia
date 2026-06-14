const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env.config");
const prisma = require("../db/prisma");
const { UnauthorizedError, ForbiddenError, NotFoundError } = require("../utils/custom-error.util");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new UnauthorizedError("Silakan login terlebih dahulu untuk mengakses resource ini.")
      );
    }

    // Verifikasi Token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } catch (err) {
      return next(new UnauthorizedError("Token JWT tidak valid atau sudah kedaluwarsa."));
    }

    // Cari User di Database
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return next(
        new NotFoundError("User pemilik token ini sudah tidak terdaftar.")
      );
    }

    // Lampirkan data user ke request
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("Anda tidak memiliki hak akses untuk melakukan aksi ini.")
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
