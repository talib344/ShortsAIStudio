require("dotenv").config();

const express = require("express");
const cors = require("cors");

const generateRoute = require("./routes/generate");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shorts AI Studio Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "node-backend"
  });
});

app.use("/api/generate", generateRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});