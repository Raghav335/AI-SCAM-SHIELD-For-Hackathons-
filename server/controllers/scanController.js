import axios from "axios";
import dotenv from "dotenv";
import Tesseract from "tesseract.js";
import { GoogleGenAI } from "@google/genai";
import Scan from "../models/Scan.js";
import dns from "dns/promises";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// TEXT SCANNER
// ======================================================

export const scanText = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({
        message: "Please provide text to scan",
      });
    }

    const prompt = `
You are an AI cybersecurity assistant called AI Scam Shield.

Analyze the following message for possible scams, phishing, fraud,
social engineering, financial fraud, or malicious intent.

Return ONLY valid JSON:

{
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:
- riskScore must be between 0 and 100.
- riskLevel must be exactly Safe, Suspicious, or Dangerous.
- Do not invent facts.
- Keep explanation concise.

Message:
${input}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("AI returned empty response");
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "text",
      input,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      scamType: result.scamType,
      explanation: result.explanation,
      recommendation: result.recommendation,
    });

    return res.status(201).json({
      message: "AI scan completed",
      result,
      scanId: scan._id,
    });

  } catch (error) {
    console.error("AI Scan Error:", error);

    return res.status(500).json({
      message: "AI scan failed",
      error: error.message,
    });
  }
};


// ======================================================
// URL SCANNER
// ======================================================

export const scanUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({
        message: "Please provide a URL to scan",
      });
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "VirusTotal API key is not configured",
      });
    }

    const cleanUrl = url.trim();

    // ==========================================
    // 1. SUBMIT URL TO VIRUSTOTAL
    // ==========================================

    const formData = new URLSearchParams();
    formData.append("url", cleanUrl);

    const submitResponse = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      formData.toString(),
      {
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const analysisId =
      submitResponse.data?.data?.id;

    if (!analysisId) {
      return res.status(500).json({
        message: "Unable to start URL analysis",
      });
    }

    // ==========================================
    // 2. WAIT FOR ANALYSIS
    // ==========================================

    let analysis = null;

    for (let attempt = 0; attempt < 8; attempt++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            "x-apikey": apiKey,
          },
        }
      );

      analysis = analysisResponse.data?.data;

      if (
        analysis?.attributes?.status === "completed"
      ) {
        break;
      }
    }

    if (
      !analysis ||
      analysis.attributes?.status !== "completed"
    ) {
      return res.status(202).json({
        message:
          "URL analysis is still in progress. Please try again.",
      });
    }

    // ==========================================
    // 3. SECURITY ENGINE RESULTS
    // ==========================================

    const stats =
      analysis.attributes?.stats || {};

    const malicious =
      stats.malicious || 0;

    const suspicious =
      stats.suspicious || 0;

    const harmless =
      stats.harmless || 0;

    const totalEngines =
      malicious +
      suspicious +
      harmless;

    let riskScore = 0;

    if (totalEngines > 0) {
      riskScore = Math.round(
        (
          malicious * 100 +
          suspicious * 50
        ) / totalEngines
      );
    }

    let riskLevel = "Safe";

    if (
      malicious > 0 ||
      riskScore >= 70
    ) {
      riskLevel = "Dangerous";
    } else if (
      suspicious > 0 ||
      riskScore >= 30
    ) {
      riskLevel = "Suspicious";
    }

    let scamType = "None";

    if (malicious > 0) {
      scamType = "Malicious / Phishing";
    } else if (suspicious > 0) {
      scamType = "Suspicious URL";
    }

    // ==========================================
    // 4. GET URL REPORT
    // ==========================================

    const encodedUrl = Buffer
      .from(cleanUrl)
      .toString("base64")
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    let urlReport = null;

    try {
      const urlReportResponse = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${encodedUrl}`,
        {
          headers: {
            "x-apikey": apiKey,
          },
        }
      );

      urlReport =
        urlReportResponse.data?.data;
    } catch (error) {
      console.log(
        "URL report unavailable:",
        error.response?.data || error.message
      );
    }

    const urlAttributes =
      urlReport?.attributes || {};

    // ==========================================
    // 5. NETWORK INTELLIGENCE
    // ==========================================

    let network = {
      domain: "Not available",
      ip: "Not available",
      isp: "Not available",
      asn: "Not available",
      location: "Not available",
      https: cleanUrl.toLowerCase().startsWith("https://"),
      redirects: 0,
    };

    // ------------------------------------------
    // DOMAIN
    // ------------------------------------------

    try {
      const parsedUrl = new URL(cleanUrl);

      network.domain =
        parsedUrl.hostname || "Not available";
    } catch (error) {
      console.log("Domain parsing failed");
    }

    // ------------------------------------------
    // REDIRECT ANALYSIS
    // ------------------------------------------

    if (
      Array.isArray(
        urlAttributes.redirection_chain
      )
    ) {
      network.redirects =
        urlAttributes.redirection_chain.length;
    }

    // ------------------------------------------
    // FINAL URL
    // ------------------------------------------

    if (
      urlAttributes.last_final_url &&
      urlAttributes.last_final_url !== cleanUrl
    ) {
      network.redirects =
        Math.max(
          network.redirects,
          1
        );
    }

    // ==========================================
    // 6. LAST SERVING IP
    // ==========================================

    let servingIp = null;

    try {
      const ipResponse = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${encodedUrl}/last_serving_ip_address`,
        {
          headers: {
            "x-apikey": apiKey,
          },
        }
      );

      servingIp =
        ipResponse.data?.data;
    } catch (error) {
      console.log(
        "Serving IP unavailable:",
        error.response?.data || error.message
      );
    }

    if (servingIp) {
      const ipAttributes =
        servingIp.attributes || {};

      network.ip =
        servingIp.id ||
        "Not available";

      network.isp =
        ipAttributes.as_owner ||
        "Not available";

      network.asn =
        ipAttributes.asn
          ? `AS${ipAttributes.asn}`
          : "Not available";

      if (ipAttributes.country) {
        network.location =
          ipAttributes.country;
      }
    }

    // ==========================================
    // 7. NETWORK LOCATION
    // ==========================================

    try {
      const networkLocationResponse =
        await axios.get(
          `https://www.virustotal.com/api/v3/urls/${encodedUrl}/network_location`,
          {
            headers: {
              "x-apikey": apiKey,
            },
          }
        );

      const networkLocation =
        networkLocationResponse.data?.data;

      if (
        networkLocation?.type === "ip_address"
      ) {
        const attributes =
          networkLocation.attributes || {};

        network.ip =
          networkLocation.id ||
          network.ip;

        network.isp =
          attributes.as_owner ||
          network.isp;

        network.asn =
          attributes.asn
            ? `AS${attributes.asn}`
            : network.asn;

        network.location =
          attributes.country ||
          network.location;
      }

      if (
        networkLocation?.type === "domain"
      ) {
        network.domain =
          networkLocation.id ||
          network.domain;
      }

    } catch (error) {
      console.log(
        "Network location unavailable:",
        error.response?.data || error.message
      );
    }

    // ==========================================
    // 8. EXPLANATION
    // ==========================================

    let explanation =
      "The URL was checked against VirusTotal security engines.";

    if (malicious > 0) {
      explanation =
        `${malicious} security engine(s) flagged this URL as malicious.`;
    } else if (suspicious > 0) {
      explanation =
        `${suspicious} security engine(s) flagged this URL as suspicious.`;
    } else {
      explanation =
        "No major threat was detected by the available security engines.";
    }

    // ==========================================
    // 9. RECOMMENDATION
    // ==========================================

    let recommendation =
      "Avoid entering sensitive information unless you can verify the website.";

    if (riskLevel === "Dangerous") {
      recommendation =
        "Do not open the website or enter passwords, OTPs, banking details, or personal information.";
    } else if (riskLevel === "Suspicious") {
      recommendation =
        "Verify the website carefully before opening it or providing any personal information.";
    } else {
      recommendation =
        "No major threat was detected, but continue to remain cautious.";
    }

    // ==========================================
    // 10. SAVE SCAN
    // ==========================================

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "url",
      input: cleanUrl,
      riskScore,
      riskLevel,
      scamType,
      explanation,
      recommendation,
    });

    // ==========================================
    // 11. RESPONSE
    // ==========================================

    return res.status(201).json({
      message: "URL scan completed",

      result: {
        url: cleanUrl,

        riskScore,
        riskLevel,
        scamType,

        explanation,
        recommendation,

        malicious,
        suspicious,
        harmless,

        domain:
          network.domain,

        ip:
          network.ip,

        isp:
          network.isp,

        asn:
          network.asn,

        location:
          network.location,

        https:
          network.https,

        redirects:
          network.redirects,

        network,
      },

      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "URL Scan Error:",
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      message: "URL scan failed",

      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};
// ======================================================
// IMAGE SCANNER
// ======================================================

export const scanImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    console.log(
      "Image received:",
      req.file.originalname
    );

    const { data } = await Tesseract.recognize(
      req.file.buffer,
      "eng",
      {
        logger: (info) => {
          console.log(info);
        },
      }
    );

    const extractedText =
      data.text.trim();

    if (!extractedText) {
      return res.status(400).json({
        message:
          "No readable text found in image",
      });
    }

    const prompt = `
You are an AI cybersecurity assistant called AI Scam Shield.

Analyze the following text extracted from an image for:

- phishing
- scam
- fraud
- social engineering
- fake rewards
- OTP/password requests
- financial fraud
- impersonation
- malicious links

Return ONLY valid JSON:

{
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:
- riskScore must be between 0 and 100.
- riskLevel must be exactly Safe, Suspicious, or Dangerous.
- Do not invent facts.
- Keep explanation concise.

Extracted text:
${extractedText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("AI returned empty response");
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result =
      JSON.parse(cleanedText);

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "image",
      input: extractedText,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      scamType: result.scamType,
      explanation: result.explanation,
      recommendation: result.recommendation,
    });

    return res.status(201).json({
      message: "Image scan completed",
      result: {
        extractedText,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        scamType: result.scamType,
        explanation: result.explanation,
        recommendation: result.recommendation,
      },
      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "Image Scan Error:",
      error
    );

    return res.status(500).json({
      message: "Image scan failed",
      error: error.message,
    });
  }
};


// ======================================================
// EMAIL SCANNER
// ======================================================

export const scanEmail = async (req, res) => {
  try {
    const {
      sender,
      subject,
      body,
    } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({
        message:
          "Please provide email body",
      });
    }

    const emailContent = `
Sender: ${sender || "Not provided"}

Subject: ${subject || "Not provided"}

Email Body:
${body}
`;

    const prompt = `
You are an AI cybersecurity assistant called AI Scam Shield.

Analyze this email for:

- phishing
- scam
- fraud
- social engineering
- impersonation
- fake rewards
- OTP/password requests
- financial fraud
- malicious links
- urgency or threats
- suspicious sender behavior
- credential theft

Return ONLY valid JSON:

{
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:

- riskScore must be between 0 and 100.
- riskLevel must be exactly Safe, Suspicious, or Dangerous.
- Do not invent facts.
- Analyze only the information provided.
- Keep explanation concise.

Email:
${emailContent}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error(
        "AI returned empty response"
      );
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result =
      JSON.parse(cleanedText);

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "email",
      input: emailContent,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      scamType: result.scamType,
      explanation: result.explanation,
      recommendation: result.recommendation,
    });

    return res.status(201).json({
      message:
        "Email scan completed",

      result: {
        sender: sender || "",
        subject: subject || "",
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        scamType: result.scamType,
        explanation: result.explanation,
        recommendation: result.recommendation,
      },

      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "Email Scan Error:",
      error
    );

    return res.status(500).json({
      message:
        "Email scan failed",
      error: error.message,
    });
  }
};


// ======================================================
// WHATSAPP SCANNER
// ======================================================

export const scanWhatsApp = async (req, res) => {
  try {
    const { chat } = req.body;

    console.log(
      "WhatsApp scan request received"
    );

    if (!chat || !chat.trim()) {
      return res.status(400).json({
        message:
          "Please provide WhatsApp chat content",
      });
    }

    const prompt = `
You are an AI cybersecurity assistant called AI Scam Shield.

Analyze the following exported WhatsApp chat for:

- scam
- phishing
- fraud
- social engineering
- impersonation
- fake rewards
- OTP theft
- password requests
- banking fraud
- payment requests
- malicious links
- investment scams
- lottery scams
- urgency tactics
- threats
- suspicious requests

Return ONLY valid JSON:

{
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:

- riskScore must be between 0 and 100.
- 0-30 = Safe
- 31-70 = Suspicious
- 71-100 = Dangerous
- riskLevel must be exactly Safe, Suspicious, or Dangerous.
- Do not invent facts.
- Analyze only the provided chat.
- Keep explanation concise.
- Identify the most likely scam type.

WhatsApp chat:

${chat}
`;

    console.log(
      "Sending WhatsApp chat to Gemini..."
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

    const text = response.text;

    console.log(
      "Gemini WhatsApp response received"
    );

    if (!text) {
      throw new Error(
        "Gemini returned empty response"
      );
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result =
      JSON.parse(cleanedText);

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "whatsapp",
      input: chat.substring(0, 10000),
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      scamType: result.scamType,
      explanation: result.explanation,
      recommendation: result.recommendation,
    });

    console.log(
      "WhatsApp scan saved:",
      scan._id
    );

    return res.status(201).json({
      message:
        "WhatsApp chat scanned successfully",

      result: {
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        scamType: result.scamType,
        explanation: result.explanation,
        recommendation: result.recommendation,
      },

      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "WhatsApp Scan Error:",
      error
    );

    return res.status(500).json({
      message:
        "WhatsApp scan failed",
      error: error.message,
    });
  }
};


// ======================================================
// SCAN HISTORY
// ======================================================

export const getScanHistory = async (
  req,
  res
) => {
  try {
    const scans = await Scan.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message:
        "Scan history fetched successfully",
      scans,
    });

  } catch (error) {
    console.error(
      "History Error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch scan history",
      error: error.message,
    });
  }
};


// ======================================================
// DASHBOARD STATS
// ======================================================

export const getDashboardStats = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const totalScans =
      await Scan.countDocuments({
        userId,
      });

    const safeScans =
      await Scan.countDocuments({
        userId,
        riskLevel: "Safe",
      });

    const suspiciousScans =
      await Scan.countDocuments({
        userId,
        riskLevel: "Suspicious",
      });

    const dangerousScans =
      await Scan.countDocuments({
        userId,
        riskLevel: "Dangerous",
      });

    return res.status(200).json({
      totalScans,
      safeScans,
      suspiciousScans,
      dangerousScans,
    });

  } catch (error) {
    console.error(
      "Dashboard Error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};
export const scanPayment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a payment screenshot",
      });
    }

    console.log(
      "Payment screenshot received:",
      req.file.originalname
    );

    const { data } = await Tesseract.recognize(
      req.file.buffer,
      "eng",
      {
        logger: (info) => {
          console.log(info);
        },
      }
    );

    const extractedText = data.text.trim();

    if (!extractedText) {
      return res.status(400).json({
        message: "No readable payment information found",
      });
    }

    const prompt = `
You are an AI cybersecurity payment fraud detection system.

Analyze the following OCR extracted payment screenshot text.

Look for:

- Fake payment confirmation
- Edited payment screenshots
- Suspicious transaction information
- Fake UTR/reference numbers
- Fake successful payment claims
- Unusual payment status
- QR/UPI payment scams
- Refund scams
- Payment request scams
- Social engineering
- Missing or inconsistent payment information
- Fraud indicators

IMPORTANT:
You cannot prove that a screenshot is authentic only from OCR.
Do not claim that a payment is definitely genuine.
Give a risk assessment based only on visible/extracted information.

Return ONLY valid JSON in exactly this format:

{
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "amount": "Not detected",
  "transactionId": "Not detected",
  "receiver": "Not detected",
  "paymentStatus": "Not detected",
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:

riskScore:
0-30 = Safe
31-70 = Suspicious
71-100 = Dangerous

riskLevel must be exactly:
Safe
Suspicious
Dangerous

Do not invent payment information.

If information is not visible, use:
"Not detected"

OCR extracted payment screenshot text:

${extractedText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    const scan = await Scan.create({
      userId: req.user.userId,
      inputType: "payment",
      input: extractedText,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      scamType: result.scamType,
      explanation: result.explanation,
      recommendation: result.recommendation,
    });

    res.status(201).json({
      message: "Payment screenshot scanned successfully",

      result: {
        extractedText,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        scamType: result.scamType,
        amount: result.amount,
        transactionId: result.transactionId,
        receiver: result.receiver,
        paymentStatus: result.paymentStatus,
        explanation: result.explanation,
        recommendation: result.recommendation,
      },

      scanId: scan._id,
    });
  } catch (error) {
    console.error(
      "Payment Scan Error:",
      error.message
    );

    res.status(500).json({
      message: "Payment scan failed",
      error: error.message,
    });
  }
};// ======================================================
// DEEPFAKE IMAGE SCANNER
// ======================================================

export const scanDeepfake = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    console.log(
      "Deepfake image received:",
      req.file.originalname
    );

    /*
      IMPORTANT:

      This endpoint performs an AI-based visual assessment.
      It should NOT be presented as forensic proof.

      The percentages are assessment scores, not guaranteed
      probabilities of a deepfake.
    */

    const base64Image =
      req.file.buffer.toString("base64");

    const mimeType =
      req.file.mimetype || "image/jpeg";

    const prompt = `
You are an AI image-security assistant for a cybersecurity
application called AI Scam Shield.

Analyze the supplied image for possible:

1. Deepfake / synthetic face characteristics
2. Digital manipulation
3. AI-generated image characteristics
4. Visual inconsistencies

Look for indicators such as:

- unnatural skin texture
- inconsistent facial details
- unusual eyes or teeth
- hair blending artifacts
- lighting inconsistencies
- shadows inconsistent with the scene
- facial boundary artifacts
- unnatural background details
- repeated patterns
- compression inconsistencies
- synthetic-looking textures

IMPORTANT:

This is an AI visual assessment, NOT forensic proof.

Do not claim that an image is definitely a deepfake.
Do not claim that an image is definitely authentic.

Return ONLY valid JSON:

{
  "deepfakeScore": 0,
  "manipulationScore": 0,
  "aiGeneratedScore": 0,
  "riskScore": 0,
  "riskLevel": "Safe",
  "scamType": "None",
  "indicators": [],
  "explanation": "Short explanation",
  "recommendation": "Safety recommendation"
}

Rules:

- All scores must be integers from 0 to 100.
- riskScore must be from 0 to 100.
- riskLevel must be exactly Safe, Suspicious, or Dangerous.
- indicators must contain short strings.
- Do not invent information that cannot be visually supported.
- Keep the explanation concise.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: [
          {
            text: prompt,
          },

          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      });

    const text = response.text;

    if (!text) {
      throw new Error(
        "AI returned empty response"
      );
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Deepfake JSON Error:",
        cleanedText
      );

      throw new Error(
        "AI returned invalid JSON"
      );
    }

    // --------------------------------------------------
    // Validate scores
    // --------------------------------------------------

    const deepfakeScore = Math.min(
      100,
      Math.max(
        0,
        Number(result.deepfakeScore) || 0
      )
    );

    const manipulationScore = Math.min(
      100,
      Math.max(
        0,
        Number(result.manipulationScore) || 0
      )
    );

    const aiGeneratedScore = Math.min(
      100,
      Math.max(
        0,
        Number(result.aiGeneratedScore) || 0
      )
    );

    const riskScore = Math.min(
      100,
      Math.max(
        0,
        Number(result.riskScore) || 0
      )
    );

    let riskLevel = "Safe";

    if (riskScore >= 71) {
      riskLevel = "Dangerous";
    } else if (riskScore >= 31) {
      riskLevel = "Suspicious";
    }

    const indicators =
      Array.isArray(result.indicators)
        ? result.indicators.slice(0, 10)
        : [];

    const scamType =
      result.scamType || "None";

    const explanation =
      result.explanation ||
      "The image was analyzed for possible synthetic or manipulated characteristics.";

    const recommendation =
      result.recommendation ||
      "Do not rely solely on this assessment. Verify the image through another trusted source.";

    // --------------------------------------------------
    // Save to MongoDB
    // --------------------------------------------------

    const scan = await Scan.create({
      userId: req.user.userId,

      inputType: "deepfake",

      input:
        req.file.originalname ||
        "uploaded-image",

      riskScore,

      riskLevel,

      scamType,

      explanation,

      recommendation,

      deepfakeScore,

      manipulationScore,

      aiGeneratedScore,

      indicators,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(201).json({
      message:
        "Deepfake image analysis completed",

      result: {
        deepfakeScore,

        manipulationScore,

        aiGeneratedScore,

        riskScore,

        riskLevel,

        scamType,

        indicators,

        explanation,

        recommendation,
      },

      scanId: scan._id,
    });

  } catch (error) {
    console.error(
      "Deepfake Scan Error:",
      error
    );

    return res.status(500).json({
      message:
        "Deepfake image scan failed",

      error:
        error.message,
    });
  }
};