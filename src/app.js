const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const jobRoutes = require("./modules/jobs/job.routes");
const applicationRoutes = require("./modules/applications/application.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ─── Global Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "QuickHire API is running 🚀" });
});

// ─── Routes ──────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ─── Centralized Error Handler (must be registered last) ─────────────
app.use(errorHandler);

module.exports = app;
