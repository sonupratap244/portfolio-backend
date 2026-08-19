// ============================================================
// 1️⃣ DNS DEBUG
// ============================================================

console.log("\n");
console.log("============================================================");
console.log("🚀 SERVER FILE LOADING STARTED");
console.log("============================================================");
console.log("🕐 Time:", new Date().toISOString());
console.log("🟢 Node Version:", process.version);
console.log("🟢 Environment:", process.env.NODE_ENV || "not-set");
console.log("============================================================\n");

import dns from "dns";

console.log("🔧 Setting DNS servers...");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

console.log("✅ DNS servers configured\n");


// ============================================================
// 2️⃣ IMPORTS
// ============================================================

console.log("📦 Loading Express...");
import express from "express";

console.log("📦 Loading dotenv...");
import dotenv from "dotenv";

console.log("📦 Loading CORS...");
import cors from "cors";

console.log("📦 Loading cookie-parser...");
import cookieParser from "cookie-parser";

console.log("📦 Loading Morgan...");
import morgan from "morgan";

console.log("📦 Loading path...");
import path from "path";

console.log("📦 Loading fileURLToPath...");
import { fileURLToPath } from "url";

console.log("📦 Loading profile routes...");
import profileRoutes from "./routes/profileRoutes.js";

console.log("📦 Loading DB connection...");
import connectDB from "./config/db.js";

console.log("📦 Loading experience routes...");
import experienceRoutes from "./routes/Experience.js";

console.log("📦 Loading project routes...");
import projectRoutes from "./routes/projectRoutes.js";

console.log("📦 Loading contact routes...");
import contactRoutes from "./routes/contactRoutes.js";

console.log("📦 Loading admin routes...");
import adminRoutes from "./routes/adminRoutes.js";

console.log("📦 Loading admin seeder...");
import seedAdmin from "./seeders/adminSeeder.js";

console.log("✅ ALL IMPORTS LOADED\n");


// ============================================================
// 3️⃣ PATH SETUP
// ============================================================

console.log("📂 Setting __filename...");

const __filename = fileURLToPath(import.meta.url);

console.log("📄 __filename:", __filename);

const __dirname = path.dirname(__filename);

console.log("📁 __dirname:", __dirname);

console.log("✅ Path setup completed\n");


// ============================================================
// 4️⃣ ENVIRONMENT VARIABLES
// ============================================================

console.log("============================================================");
console.log("🔐 LOADING ENVIRONMENT VARIABLES");
console.log("============================================================");

console.log("🔄 Running dotenv.config()...");

const dotenvResult = dotenv.config();

console.log("📌 Dotenv result:", {
  error: dotenvResult.error
    ? dotenvResult.error.message
    : null,
  parsed: dotenvResult.parsed
    ? Object.keys(dotenvResult.parsed)
    : [],
});

console.log("\n📌 Environment Variables Check:");

console.log(
  "MONGO_URI:",
  process.env.MONGO_URI
    ? "✅ EXISTS"
    : "❌ MISSING"
);

console.log(
  "PORT:",
  process.env.PORT || "❌ MISSING (will use 5000)"
);

console.log(
  "FRONTEND_URL:",
  process.env.FRONTEND_URL || "❌ MISSING"
);

console.log(
  "NODE_ENV:",
  process.env.NODE_ENV || "❌ MISSING"
);

// Email values ko password ke saath print NAHI karenge
console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
    ? "✅ EXISTS"
    : "❌ MISSING"
);

console.log(
  "EMAIL_HOST:",
  process.env.EMAIL_HOST || "❌ MISSING"
);

console.log(
  "EMAIL_PORT:",
  process.env.EMAIL_PORT || "❌ MISSING"
);

console.log("============================================================\n");


// ============================================================
// 5️⃣ DATABASE CONNECTION
// ============================================================

console.log("============================================================");
console.log("🍃 MONGODB CONNECTION STARTING");
console.log("============================================================");

try {

  console.log("🔄 Calling connectDB()...");

  await connectDB();

  console.log("✅ connectDB() completed successfully");

} catch (error) {

  console.error("❌❌❌ DATABASE CONNECTION FAILED ❌❌❌");

  console.error("Error Name:", error.name);
  console.error("Error Message:", error.message);
  console.error("Error Code:", error.code);
  console.error("Full Error:", error);

  console.error("============================================================");

  process.exit(1);
}

console.log("============================================================");
console.log("🍃 DATABASE CONNECTION SECTION COMPLETED");
console.log("============================================================\n");


// ============================================================
// 6️⃣ ADMIN SEEDER
// ============================================================

console.log("============================================================");
console.log("👤 ADMIN SEEDING STARTING");
console.log("============================================================");

try {

  console.log("🔄 Calling seedAdmin()...");

  await seedAdmin();

  console.log("✅ seedAdmin() completed successfully");

} catch (error) {

  console.error("❌❌❌ ADMIN SEEDING FAILED ❌❌❌");

  console.error("Error Name:", error.name);
  console.error("Error Message:", error.message);
  console.error("Full Error:", error);

}

console.log("============================================================");
console.log("👤 ADMIN SEEDING SECTION COMPLETED");
console.log("============================================================\n");


// ============================================================
// 7️⃣ EXPRESS APP
// ============================================================

console.log("🚀 Creating Express application...");

const app = express();

console.log("✅ Express application created\n");


// ============================================================
// 8️⃣ CORS CONFIGURATION
// ============================================================

console.log("============================================================");
console.log("🌐 CORS CONFIGURATION");
console.log("============================================================");

const allowedOrigins = [
  "https://sonpratap.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

console.log("✅ Allowed Origins:");

allowedOrigins.forEach((origin, index) => {
  console.log(`${index + 1}. ${origin}`);
});

console.log("============================================================\n");


// ============================================================
// 9️⃣ CORS MIDDLEWARE
// ============================================================

console.log("🔧 Registering CORS middleware...");

app.use(
  cors({

    origin: function (origin, callback) {

      console.log("\n");
      console.log("****************************************************");
      console.log("🔥🔥🔥 CORS CHECK STARTED 🔥🔥🔥");
      console.log("****************************************************");

      console.log("🌐 Request Origin:", origin);

      console.log(
        "📋 Allowed Origins:",
        allowedOrigins
      );

      if (!origin) {

        console.log(
          "⚠️ NO ORIGIN HEADER"
        );

        console.log(
          "✅ Allowing request"
        );

        console.log("****************************************************");

        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {

        console.log(
          "✅✅ CORS ALLOWED:",
          origin
        );

        console.log("****************************************************");

        return callback(null, true);
      }

      console.log(
        "❌❌❌ CORS BLOCKED ❌❌❌"
      );

      console.log(
        "❌ Blocked Origin:",
        origin
      );

      console.log("****************************************************");

      return callback(
        new Error(`CORS blocked: ${origin}`)
      );
    },

    credentials: true,

  })
);

console.log("✅ CORS middleware registered\n");


// ============================================================
// 🔟 REQUEST DEBUG MIDDLEWARE
// ============================================================

console.log("🔧 Registering request debug middleware...");

app.use((req, res, next) => {

  const startTime = Date.now();

  console.log("\n");
  console.log("============================================================");
  console.log("🔥🔥🔥 INCOMING REQUEST 🔥🔥🔥");
  console.log("============================================================");

  console.log("🕐 Time:", new Date().toISOString());

  console.log("📌 Method:", req.method);

  console.log("📌 URL:", req.originalUrl);

  console.log("📌 Path:", req.path);

  console.log("🌐 Origin:", req.headers.origin);

  console.log("🔗 Referer:", req.headers.referer);

  console.log("🖥️ User Agent:", req.headers["user-agent"]);

  console.log("📡 Host:", req.headers.host);

  console.log(
    "🍪 Cookie:",
    req.headers.cookie
      ? "✅ EXISTS"
      : "❌ NONE"
  );

  console.log(
    "📦 Content-Type:",
    req.headers["content-type"]
  );

  console.log("============================================================");

  res.on("finish", () => {

    const duration = Date.now() - startTime;

    console.log("\n");
    console.log("------------------------------------------------------------");
    console.log("📤 RESPONSE FINISHED");
    console.log("------------------------------------------------------------");

    console.log("📌 Method:", req.method);

    console.log("📌 URL:", req.originalUrl);

    console.log("📤 Status:", res.statusCode);

    console.log("⏱️ Duration:", `${duration}ms`);

    console.log(
      "🌐 ACAO:",
      res.getHeader("Access-Control-Allow-Origin")
    );

    console.log(
      "🍪 Credentials:",
      res.getHeader("Access-Control-Allow-Credentials")
    );

    console.log("------------------------------------------------------------\n");

  });

  res.on("close", () => {

    console.log("⚠️ RESPONSE CONNECTION CLOSED");

    console.log(
      "📌 URL:",
      req.originalUrl
    );

  });

  next();

});

console.log("✅ Request debug middleware registered\n");


// ============================================================
// 1️⃣1️⃣ BODY PARSERS
// ============================================================

console.log("🔧 Registering express.json()...");

app.use(express.json());

console.log("✅ express.json() registered");

console.log("🔧 Registering express.urlencoded()...");

app.use(
  express.urlencoded({
    extended: true,
  })
);

console.log("✅ express.urlencoded() registered");


// ============================================================
// 1️⃣2️⃣ COOKIE PARSER
// ============================================================

console.log("🔧 Registering cookie-parser...");

app.use(cookieParser());

console.log("✅ cookie-parser registered");


// ============================================================
// 1️⃣3️⃣ MORGAN
// ============================================================

console.log("🔧 Registering Morgan...");

app.use(morgan("dev"));

console.log("✅ Morgan registered\n");


// ============================================================
// 1️⃣4️⃣ UPLOADS STATIC FOLDER
// ============================================================

console.log("============================================================");
console.log("📁 UPLOADS CONFIGURATION");
console.log("============================================================");

const uploadsPath = path.join(
  __dirname,
  "uploads"
);

console.log(
  "📁 Uploads absolute path:",
  uploadsPath
);

console.log("🔧 Registering /uploads static route...");

app.use(
  "/uploads",
  express.static(uploadsPath)
);

console.log("✅ /uploads static route registered");

console.log("============================================================\n");


// ============================================================
// 1️⃣5️⃣ ROUTE REGISTRATION
// ============================================================

console.log("============================================================");
console.log("🛣️ REGISTERING API ROUTES");
console.log("============================================================");

console.log("🔧 Registering /api/profile...");

app.use(
  "/api/profile",
  profileRoutes
);

console.log("✅ /api/profile registered");

console.log("🔧 Registering /api/experience...");

app.use(
  "/api/experience",
  experienceRoutes
);

console.log("✅ /api/experience registered");

console.log("🔧 Registering /api/project...");

app.use(
  "/api/project",
  projectRoutes
);

console.log("✅ /api/project registered");

console.log("🔧 Registering /api/contact...");

app.use(
  "/api/contact",
  contactRoutes
);

console.log("✅ /api/contact registered");

console.log("🔧 Registering /api/admin...");

app.use(
  "/api/admin",
  adminRoutes
);

console.log("✅ /api/admin registered");

console.log("============================================================");
console.log("🛣️ ALL API ROUTES REGISTERED");
console.log("============================================================\n");


// ============================================================
// 1️⃣6️⃣ ROOT ROUTE
// ============================================================

console.log("🔧 Registering root route...");

app.get("/", (req, res) => {

  console.log("\n");
  console.log("🏠 ROOT ROUTE HIT");

  console.log("🌐 Origin:", req.headers.origin);

  console.log("📌 Sending backend status response");

  res.json({
    status: true,
    message: "Portfolio Backend Running",
  });

});

console.log("✅ Root route registered\n");


// ============================================================
// 1️⃣7️⃣ 404 HANDLER
// ============================================================

app.use((req, res) => {

  console.log("\n");
  console.log("============================================================");
  console.log("❌❌❌ 404 ROUTE NOT FOUND ❌❌❌");
  console.log("============================================================");

  console.log("📌 Method:", req.method);

  console.log("📌 URL:", req.originalUrl);

  console.log("🌐 Origin:", req.headers.origin);

  console.log("============================================================\n");

  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });

});


// ============================================================
// 1️⃣8️⃣ GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

  console.log("\n");
  console.log("============================================================");
  console.log("🔥🔥🔥 GLOBAL ERROR HANDLER 🔥🔥🔥");
  console.log("============================================================");

  console.error("❌ Error Name:", err.name);

  console.error("❌ Error Message:", err.message);

  console.error("❌ Error Code:", err.code);

  console.error("📌 Method:", req.method);

  console.error("📌 URL:", req.originalUrl);

  console.error("🌐 Origin:", req.headers.origin);

  console.error("📚 Full Error:", err);

  console.log("============================================================\n");

  if (res.headersSent) {

    console.log(
      "⚠️ Headers already sent. Passing error..."
    );

    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });

});


// ============================================================
// 1️⃣9️⃣ SERVER START
// ============================================================

const PORT =
  process.env.PORT || 5000;

console.log("============================================================");
console.log("🚀 STARTING HTTP SERVER");
console.log("============================================================");

console.log("📌 PORT:", PORT);

console.log("📌 NODE_ENV:", process.env.NODE_ENV);

console.log(
  "📌 FRONTEND_URL:",
  process.env.FRONTEND_URL
);

const server = app.listen(
  PORT,
  () => {

    console.log("\n");
    console.log("============================================================");
    console.log("🎉🎉🎉 SERVER STARTED SUCCESSFULLY 🎉🎉🎉");
    console.log("============================================================");

    console.log(
      `✅ Server Running On Port: ${PORT}`
    );

    console.log(
      "🌐 Frontend:",
      "https://sonpratap.onrender.com"
    );

    console.log(
      "🔗 Backend:",
      "https://portfolio-backend-7e9e.onrender.com"
    );

    console.log(
      "🍃 MongoDB:",
      "CONNECTED"
    );

    console.log(
      "📁 Uploads:",
      uploadsPath
    );

    console.log(
      "🌐 CORS:",
      allowedOrigins
    );

    console.log("============================================================\n");

  }
);


// ============================================================
// 2️⃣0️⃣ SERVER ERROR
// ============================================================

server.on("error", (error) => {

  console.error("\n");
  console.error("============================================================");
  console.error("🔥🔥🔥 HTTP SERVER ERROR 🔥🔥🔥");
  console.error("============================================================");

  console.error("Error Name:", error.name);

  console.error("Error Message:", error.message);

  console.error("Error Code:", error.code);

  console.error("Full Error:", error);

  console.error("============================================================\n");

});


// ============================================================
// 2️⃣1️⃣ PROCESS ERRORS
// ============================================================

process.on(
  "uncaughtException",
  (error) => {

    console.error("\n");
    console.error("============================================================");
    console.error("💀💀💀 UNCAUGHT EXCEPTION 💀💀💀");
    console.error("============================================================");

    console.error(error);

    console.error("============================================================\n");

  }
);


process.on(
  "unhandledRejection",
  (reason) => {

    console.error("\n");
    console.error("============================================================");
    console.error("💀💀💀 UNHANDLED PROMISE REJECTION 💀💀💀");
    console.error("============================================================");

    console.error(reason);

    console.error("============================================================\n");

  }
);


// ============================================================
// 2️⃣2️⃣ SHUTDOWN DEBUG
// ============================================================

process.on(
  "SIGTERM",
  () => {

    console.log("\n");
    console.log("⚠️ SIGTERM RECEIVED");

    console.log("🔄 Server shutting down...");

    server.close(() => {

      console.log(
        "✅ HTTP server closed"
      );

      process.exit(0);

    });

  }
);


process.on(
  "SIGINT",
  () => {

    console.log("\n");
    console.log("⚠️ SIGINT RECEIVED");

    console.log("🔄 Server shutting down...");

    server.close(() => {

      console.log(
        "✅ HTTP server closed"
      );

      process.exit(0);

    });

  }
);


console.log("\n");
console.log("============================================================");
console.log("✅ SERVER.JS FILE FINISHED EXECUTING");
console.log("============================================================");