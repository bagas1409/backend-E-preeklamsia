const { PrismaClient } = require("@prisma/client");
const { env } = require("../config/env.config");

const prismaLogOptions =
  env === "development" ? ["query", "info", "warn", "error"] : ["error"];

const prisma = new PrismaClient({
  log: prismaLogOptions,
});

module.exports = prisma;
