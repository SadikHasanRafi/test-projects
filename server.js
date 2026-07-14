import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./index.js";
import errorHandler from "./utils/errorHandler.js";
import {
  requestLogger,
} from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ======================================================
// Middlewares
// ======================================================

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger
app.use(requestLogger);

// ======================================================
// Routes
// ======================================================

app.use("/", routes);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ======================================================
// Global Error Handler
// ======================================================

app.use(errorHandler);

// ======================================================
// Server
// ======================================================

const server = app.listen(PORT, () => {
  console.clear();

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🚀 EXPRESS SERVER IS RUNNING 🚀                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  console.log(`🌍 Environment : ${process.env.NODE_ENV ?? "development"}`);
  console.log(`📡 URL         : http://localhost:${PORT}`);
  console.log(`🟢 Status      : Online`);
  console.log(`⚙️  Node.js     : ${process.version}`);
  console.log(`🆔 PID         : ${process.pid}`);
  console.log(`🕒 Started At  : ${new Date().toLocaleString()}`);


  console.log(
    "══════════════════════════════════════════════════════════════════════"
  );
});

// ======================================================
// Graceful Shutdown
// ======================================================

const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down...`);

  server.close(() => {
    console.log("✅ HTTP Server Closed.");
    console.log("👋 Bye!");

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));