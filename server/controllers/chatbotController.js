import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please provide a message",
      });
    }

    const selectedLanguage =
      language === "hi" ? "Hindi" : "English";

    const prompt = `
You are AI Scam Shield Assistant.

You are a cybersecurity assistant that helps users
understand online scams and suspicious activity.

Topics you can help with:
- Phishing
- WhatsApp scams
- Email scams
- Payment fraud
- OTP fraud
- Fake customer support
- Malicious links
- Investment scams
- Lottery scams
- Impersonation
- Social engineering

Respond in ${selectedLanguage}.

If the user provides a suspicious message or situation:
1. Identify whether it appears suspicious.
2. Explain the warning signs.
3. Tell the user what they should do safely.

Never ask for:
- Passwords
- OTPs
- PINs
- CVV
- Bank credentials

Keep the response simple and useful.

User:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const reply = response.text;

    return res.status(200).json({
      message: "AI response generated",
      reply,
    });

  } catch (error) {
    console.error("Chatbot Error:", error);

    return res.status(500).json({
      message: "AI chatbot failed",
      error: error.message,
    });
  }
};