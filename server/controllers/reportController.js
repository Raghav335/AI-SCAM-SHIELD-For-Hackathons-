import ScamReport from "../models/ScamReport.js";

export const createReport = async (req, res) => {
  try {
    const {
      reportType,
      scammerName,
      scammerContact,
      suspiciousUrl,
      amountLost,
      description,
    } = req.body;

    if (!reportType) {
      return res.status(400).json({
        message: "Please select report type",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Please provide report description",
      });
    }

    const report = await ScamReport.create({
      userId: req.user.userId,
      reportType,
      scammerName,
      scammerContact,
      suspiciousUrl,
      amountLost,
      description,
    });

    res.status(201).json({
      message: "Scam report submitted successfully",
      reportId: report._id,
    });
  } catch (error) {
    console.error(
      "Report Error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to submit scam report",
      error: error.message,
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await ScamReport.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};