import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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


// =====================================================
// 🔥 CORS DEBUG LOG
// =====================================================

app.use(
  cors({
    origin: function (origin, callback) {

      console.log("\n================ CORS CHECK ================");
      console.log("🌐 Request Origin:", origin);
      console.log("✅ Allowed Origins:", allowedOrigins);

      // Postman / direct backend request
      if (!origin) {
        console.log("⚠️ No Origin Header");
        console.log("============================================\n");

        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS ALLOWED:", origin);
        console.log("============================================\n");

        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      console.log("============================================\n");

      return callback(new Error(`CORS blocked: ${origin}`));
    },

    credentials: true,
  })
);


// =====================================================
// 🔥 REQUEST DEBUG LOG
// =====================================================

app.use((req, res, next) => {

  console.log("\n================ API REQUEST ================");
  console.log("📌 Method :", req.method);
  console.log("📌 URL    :", req.originalUrl);
  console.log("🌐 Origin :", req.headers.origin);
  console.log("🔗 Referer:", req.headers.referer);

  const startTime = Date.now();

  res.on("finish", () => {

    const duration = Date.now() - startTime;

    console.log("📤 Status :", res.statusCode);
    console.log("⏱️ Time   :", `${duration}ms`);
    console.log("============================================\n");

  });

  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Morgan
app.use(morgan("dev"));


// =====================================================
// 📁 UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// =====================================================
// 🚀 API ROUTES
// =====================================================

console.log("🚀 Registering API routes...");

app.use("/api/profile", profileRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

console.log("✅ API routes registered");


// =====================================================
// 🏠 ROOT
// =====================================================

app.get("/", (req, res) => {

  console.log("🏠 Root API hit");

  res.json({
    status: true,
    message: "Portfolio Backend Running",
  });

});


// =====================================================
// ❌ GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

  console.log("\n================ SERVER ERROR ================");
  console.log("❌ Error:", err.message);
  console.log("📌 Method:", req.method);
  console.log("📌 URL:", req.originalUrl);
  console.log("🌐 Origin:", req.headers.origin);
  console.log("==============================================\n");

  res.status(500).json({
    success: false,
    message: err.message,
  });

});


// =====================================================
// 🚀 SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("\n============================================");
  console.log("🚀 PORTFOLIO BACKEND STARTED");
  console.log("============================================");
  console.log("📡 PORT:", PORT);
  console.log("🌍 Allowed Origins:");
  console.log(allowedOrigins);
  console.log("📁 Uploads:", path.join(__dirname, "uploads"));
  console.log("============================================\n");

});