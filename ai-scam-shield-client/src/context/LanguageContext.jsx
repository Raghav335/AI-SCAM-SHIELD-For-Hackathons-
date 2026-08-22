import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const translations = {
    en: {
      // Navbar
      language: "Language",
      english: "English",
      hindi: "Hindi",

      home: "Home",
      dashboard: "Dashboard",
      scanner: "Scanner",
      payment: "Payment",
      whatsapp: "WhatsApp",
      aiAssistant: "AI Assistant",
      knowledgeBase: "Knowledge Base",
      report: "Report Scam",

      login: "Login",
      signup: "Sign Up",
      logout: "Logout",

      // Common
      welcome: "Welcome",
      search: "Search",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      close: "Close",
      back: "Back",
      next: "Next",
      loading: "Loading...",
      error: "Error",
      success: "Success",

      // Shield
      shieldProtection: "Shield Protection",
      activateShield: "Activate Shield",
      deactivateShield: "Deactivate Shield",
      shieldActive: "Shield is Active",
      shieldInactive: "Shield is Inactive",

      checkSuspiciousLink: "Check Suspicious Link",
      checkLink: "Check Link",
      checkingLink: "Checking Link...",
      checkedUrl: "Checked URL",

      riskScore: "Risk Score",
      threatType: "Threat Type",
      safetyRecommendation: "Safety Recommendation",

      dangerous: "Dangerous",
      suspicious: "Suspicious",
      safe: "Safe",
      harmless: "Harmless",
      malicious: "Malicious",

      dangerousLinkDetected: "Dangerous Link Detected",
      suspiciousLinkDetected: "Suspicious Link Detected",
      noMajorThreat: "No Major Threat Detected",

      checkAnotherLink: "Check Another Link",
      clearLink: "Clear Link",

      // Scanner
      scamScanner: "Scam Scanner",
      scanNow: "Scan Now",
      scanResult: "Scan Result",
      scanHistory: "Scan History",

      // Payment
      paymentScanner: "Payment Scanner",
      scanPayment: "Scan Payment",
      paymentDetails: "Payment Details",

      // WhatsApp
      whatsappScanner: "WhatsApp Scanner",
      scanMessage: "Scan Message",
      suspiciousMessage: "Suspicious Message",

      // AI Assistant
      aiScamAssistant: "AI Scam Assistant",
      askAssistant: "Ask AI Assistant",
      typeMessage: "Type your message...",

      // Knowledge Base
      knowledgeBaseTitle: "Knowledge Base",
      scamAwareness: "Scam Awareness",
      learnMore: "Learn More",

      // Report
      reportScam: "Report Scam",
      reportDescription: "Report a suspicious activity or scam.",
      reportNow: "Report Now",

      // Profile
      profile: "Profile",
      personalInformation: "Personal Information",
      accountSettings: "Account Settings",

      // Home
      heroTitle: "AI-Powered Scam Protection",
      heroDescription:
        "Detect suspicious links, messages and payment scams before they cause harm.",
      getStarted: "Get Started",
      staySafe: "Stay Safe",

      // Messages
      loginRequired: "Please login first.",
      enterUrl: "Please enter a URL.",
      invalidUrl: "Please enter a valid URL.",
      serverError: "Unable to connect to server.",
      scanFailed: "Scan failed. Please try again.",
    },

    hi: {
      // Navbar
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",

      home: "होम",
      dashboard: "डैशबोर्ड",
      scanner: "स्कैनर",
      payment: "भुगतान",
      whatsapp: "व्हाट्सऐप",
      aiAssistant: "AI सहायक",
      knowledgeBase: "ज्ञान आधार",
      report: "स्कैम रिपोर्ट करें",

      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉगआउट",

      // Common
      welcome: "स्वागत है",
      search: "खोजें",
      submit: "जमा करें",
      cancel: "रद्द करें",
      save: "सेव करें",
      delete: "हटाएं",
      close: "बंद करें",
      back: "वापस",
      next: "आगे",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल",

      // Shield
      shieldProtection: "शील्ड सुरक्षा",
      activateShield: "शील्ड सक्रिय करें",
      deactivateShield: "शील्ड बंद करें",
      shieldActive: "शील्ड सक्रिय है",
      shieldInactive: "शील्ड निष्क्रिय है",

      checkSuspiciousLink: "संदिग्ध लिंक जांचें",
      checkLink: "लिंक जांचें",
      checkingLink: "लिंक जांची जा रही है...",
      checkedUrl: "जांचा गया URL",

      riskScore: "जोखिम स्कोर",
      threatType: "खतरे का प्रकार",
      safetyRecommendation: "सुरक्षा सुझाव",

      dangerous: "खतरनाक",
      suspicious: "संदिग्ध",
      safe: "सुरक्षित",
      harmless: "हानिरहित",
      malicious: "हानिकारक",

      dangerousLinkDetected: "खतरनाक लिंक मिला",
      suspiciousLinkDetected: "संदिग्ध लिंक मिला",
      noMajorThreat: "कोई बड़ा खतरा नहीं मिला",

      checkAnotherLink: "दूसरा लिंक जांचें",
      clearLink: "लिंक हटाएं",

      // Scanner
      scamScanner: "स्कैम स्कैनर",
      scanNow: "अभी स्कैन करें",
      scanResult: "स्कैन परिणाम",
      scanHistory: "स्कैन इतिहास",

      // Payment
      paymentScanner: "भुगतान स्कैनर",
      scanPayment: "भुगतान स्कैन करें",
      paymentDetails: "भुगतान विवरण",

      // WhatsApp
      whatsappScanner: "व्हाट्सऐप स्कैनर",
      scanMessage: "मैसेज स्कैन करें",
      suspiciousMessage: "संदिग्ध मैसेज",

      // AI Assistant
      aiScamAssistant: "AI स्कैम सहायक",
      askAssistant: "AI सहायक से पूछें",
      typeMessage: "अपना संदेश लिखें...",

      // Knowledge Base
      knowledgeBaseTitle: "ज्ञान आधार",
      scamAwareness: "स्कैम जागरूकता",
      learnMore: "और जानें",

      // Report
      reportScam: "स्कैम रिपोर्ट करें",
      reportDescription:
        "संदिग्ध गतिविधि या स्कैम की रिपोर्ट करें।",
      reportNow: "अभी रिपोर्ट करें",

      // Profile
      profile: "प्रोफ़ाइल",
      personalInformation: "व्यक्तिगत जानकारी",
      accountSettings: "अकाउंट सेटिंग्स",

      // Home
      heroTitle: "AI आधारित स्कैम सुरक्षा",
      heroDescription:
        "संदिग्ध लिंक, संदेश और भुगतान स्कैम से नुकसान होने से पहले उनका पता लगाएं।",
      getStarted: "शुरू करें",
      staySafe: "सुरक्षित रहें",

      // Messages
      loginRequired: "कृपया पहले लॉगिन करें।",
      enterUrl: "कृपया URL दर्ज करें।",
      invalidUrl: "कृपया सही URL दर्ज करें।",
      serverError: "Server से कनेक्ट नहीं हो पाया।",
      scanFailed: "स्कैन असफल हुआ। कृपया दोबारा प्रयास करें।",
    },
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};