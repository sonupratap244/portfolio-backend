import dns from "dns";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import profileRoutes from "./routes/profileRoutes.js";
import connectDB from "./config/db.js";
import experienceRoutes from "./routes/Experience.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import seedAdmin from "./seeders/adminSeeder.js";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

await connectDB();
await seedAdmin();

const app = express();

const allowedOrigins = [
  "https://sonpratap.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const uploadsPath = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsPath));

app.use("/api/profile", profileRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Portfolio Backend Running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
  console.log(`Uploads path: ${uploadsPath}`);
});