const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const routes = require("./routes");
const { errorHandler } = require("./middlewares/error.middleware");
const apiLimiter = require("./middlewares/rateLimit.middleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply rate limiter to all API routes
app.use("/api", apiLimiter);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;