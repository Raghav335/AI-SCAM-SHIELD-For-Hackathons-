import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("MongoDB URI loaded:", !!process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;