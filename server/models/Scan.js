import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inputType: {
      type: String,
      enum: [
        "text",
        "url",
        "image",
        "qr",
        "email",
        "whatsapp",
        "payment",
        "deepfake",
      ],
      required: true,
    },

    input: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      enum: ["Safe", "Suspicious", "Dangerous"],
      required: true,
    },

    scamType: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },

    recommendation: {
      type: String,
      required: true,
    },

    // Deepfake-specific information
    deepfakeScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    manipulationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    aiGeneratedScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    indicators: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;