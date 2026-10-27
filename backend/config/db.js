const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDB;