import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }

  // Prevent mongoose buffering from hiding connection problems
  mongoose.set("bufferCommands", false);

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("❌ MongoDB Error:", error.message);
    console.error("🔍 MongoDB Error Details:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB Reconnected");
  });

  try {
    console.log("🔄 Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,

      retryReads: true,
      retryWrites: true,

      maxPoolSize: 10,
      minPoolSize: 2,

      heartbeatFrequencyMS: 10000,
    });

    console.log(`✅ MongoDB Host: ${mongoose.connection.host}`);
    console.log(`📦 Database: ${mongoose.connection.name}`);

  } catch (error) {
    console.error("\n========================================");
    console.error("❌ MONGODB CONNECTION FAILED");
    console.error("========================================");

    console.error("📌 Error Name:");
    console.error(error.name);

    console.error("\n📌 Error Message:");
    console.error(error.message);

    console.error("\n📌 Error Code:");
    console.error(error.code);

    console.error("\n📌 Error Reason:");
    console.error(error.reason);

    console.error("\n📌 Full Error:");
    console.error(error);

    console.error("\n📌 Error Stack:");
    console.error(error.stack);

    console.error("========================================\n");

    process.exit(1);
  }
};

export default connectDB;