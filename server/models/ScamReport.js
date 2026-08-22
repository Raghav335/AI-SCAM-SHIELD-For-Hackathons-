import mongoose from "mongoose";

const scamReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportType: {
      type: String,
      enum: [
        "Message",
        "URL",
        "WhatsApp",
        "Email",
        "Payment",
        "Phone",
        "Other",
      ],
      required: true,
    },

    scammerName: {
      type: String,
      default: "",
    },

    scammerContact: {
      type: String,
      default: "",
    },

    suspiciousUrl: {
      type: String,
      default: "",
    },

    amountLost: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ScamReport = mongoose.model(
  "ScamReport",
  scamReportSchema
);

export default ScamReport;