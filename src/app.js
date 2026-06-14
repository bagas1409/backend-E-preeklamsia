const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const requestLogger = require("./middlewares/logging.middleware");
const errorHandler = require("./middlewares/error.middleware");
const { NotFoundError } = require("./utils/custom-error.util");

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS configuration
app.use(cors({
  origin: "*", // Silakan batasi domain di production
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 3. Rate Limiter (Melindungi dari brute-force / DDoS ringan)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP per windowMs
  message: {
    success: false,
    message: "Terlalu banyak request dari IP Anda. Silakan coba lagi nanti.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 4. Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Request Logging Middleware
app.use(requestLogger);

// 6. Mount API Routes
app.use("/", routes);

// 7. Handle Route Not Found (404)
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} tidak ditemukan.`));
});

// 8. Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
