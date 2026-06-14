const app = require("./app");
const { port, env } = require("./config/env.config");
const logger = require("./utils/logger.util");
const prisma = require("./db/prisma");

// Tangani uncaught exceptions (error di luar Express handler)
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! Mematikan server...");
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

const server = app.listen(port, () => {
  logger.info(`Server berjalan di port ${port} [Mode: ${env}]`);
});

// Tangani unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! Mematikan server...");
  logger.error(err.name, err.message);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Tangani signal terminasi (graceful shutdown)
const gracefulShutdown = async (signal) => {
  logger.info(`Menerima signal ${signal}. Menutup koneksi database & server...`);
  await prisma.$disconnect();
  server.close(() => {
    logger.info("Server dihentikan secara aman.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
