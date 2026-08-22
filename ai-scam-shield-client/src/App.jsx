import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScamScanner from "./pages/ScamScanner";
import ScanHistory from "./pages/ScanHistory";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import PaymentScanner from "./pages/PaymentScanner";
import URLScanner from "./pages/URLScanner";
import ImageScanner from "./pages/ImageScanner";
import ShieldProtection from "./pages/ShieldProtection";
import QRScanner from "./pages/QRScanner";
import EmailScanner from "./pages/EmailScanner";
import KnowledgeBase from "./pages/KnowledgeBase";
import ReportScam from "./pages/ReportScam";
import WhatsAppScanner from "./pages/WhatsAppScanner";
import AIChatbot from "./pages/AIChatbot";
import ActivateShield from "./pages/ActivateShield";
import ThreatCheck from "./pages/ThreatCheck";
import DeepfakeScanner from "./pages/DeepfakeScanner.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
    <Route path="/activate" element={<ActivateShield />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/report-scam" element={<ReportScam />} />
    <Route path="/check" element={<ThreatCheck />} />
        <Route path="/scanner" element={<ScamScanner />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment-scanner" element={<PaymentScanner />} />
        <Route path="/url-scanner" element={<URLScanner />} />
        <Route path="/image-scanner" element={<ImageScanner />} />
        <Route path="/shield" element={<ShieldProtection />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/email-scanner" element={<EmailScanner />} />
        <Route path="/deepfake" element={<DeepfakeScanner />}
/>
        

        <Route path="/whatsapp-scanner" element={<WhatsAppScanner />} />

        {/* AI ASSISTANT */}
        <Route path="/chatbot" element={<AIChatbot />} />
      </Routes>
    </>
  );
}

export default App;