import { useState } from "react";
import ThreatAlert from "../components/ThreatAlert";

function WhatsAppScanner() {
  const [chat, setChat] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [alertResult, setAlertResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setError("");
    setResult(null);
    setAlertResult(null);

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a WhatsApp exported .txt chat file.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      if (!text.trim()) {
        setError("The uploaded chat file is empty.");
        setChat("");
        return;
      }

      setChat(text);
    };

    reader.onerror = () => {
      setError("Unable to read the chat file.");
    };

    reader.readAsText(file);
  };

  const scanWhatsApp = async () => {
    setError("");
    setResult(null);
    setAlertResult(null);

    if (!chat.trim()) {
      setError("Please upload or paste a WhatsApp exported chat.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/scan/whatsapp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chat: chat.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "WhatsApp scan failed"
        );
      }

      const scanResult = data.result;

      if (!scanResult) {
        throw new Error("No scan result received.");
      }

      setResult(scanResult);
      setAlertResult(scanResult);

    } catch (err) {
      console.error("WhatsApp Scan Error:", err);

      setError(
        err.message ||
          "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setChat("");
    setFileName("");
    setResult(null);
    setError("");
    setAlertResult(null);
  };

  const getRiskStyle = (level) => {
    if (level === "Dangerous") {
      return {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "🚨",
      };
    }

    if (level === "Suspicious") {
      return {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: "⚠️",
      };
    }

    if (level === "Safe") {
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: "✓",
      };
    }

    return {
      text: "text-[#315c45]",
      bg: "bg-[#f0f5ef]",
      border: "border-[#d9e4d8]",
      icon: "🛡️",
    };
  };

  const riskStyle = result
    ? getRiskStyle(result.riskLevel)
    : null;

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#26352b] px-4 py-6 md:px-8">

      <ThreatAlert
        result={alertResult}
        onClose={() => setAlertResult(null)}
      />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#e8eee3] flex items-center justify-center text-2xl">
              💬
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#26352b]">
                WhatsApp Scanner
              </h1>

              <p className="text-sm text-[#718073]">
                Detect suspicious messages before you act.
              </p>
            </div>

          </div>

          <div className="hidden md:flex items-center gap-2 bg-white border border-[#e2e4db] px-4 py-2 rounded-full text-sm text-[#58705e]">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            AI Protection Active
          </div>

        </div>


        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT - SCANNER */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-[28px] border border-[#e5e4dc] shadow-sm p-6 md:p-8">

              <div className="mb-7">

                <div className="flex items-center gap-3 mb-2">

                  <div className="w-10 h-10 rounded-xl bg-[#edf3e9] flex items-center justify-center">
                    🛡️
                  </div>

                  <h2 className="text-xl font-bold">
                    Analyze WhatsApp Chat
                  </h2>

                </div>

                <p className="text-sm text-[#7b847c]">
                  Upload an exported WhatsApp chat or paste
                  the conversation below.
                </p>

              </div>


              {/* UPLOAD */}

              <label className="block cursor-pointer">

                <div className="border-2 border-dashed border-[#cbd7c8] hover:border-[#52745b] bg-[#fafbf7] rounded-2xl p-8 text-center transition">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#e9f0e5] flex items-center justify-center text-3xl mb-4">
                    📄
                  </div>

                  <h3 className="font-semibold text-[#34473a]">
                    Upload WhatsApp Chat
                  </h3>

                  <p className="text-sm text-[#8a938b] mt-1">
                    Export your conversation as a .txt file
                  </p>

                  <div className="inline-flex mt-4 px-5 py-2.5 rounded-xl bg-[#315c45] text-white text-sm font-semibold">
                    Choose File
                  </div>

                  {fileName && (
                    <div className="mt-4 text-sm font-medium text-[#315c45] break-all">
                      📎 {fileName}
                    </div>
                  )}

                </div>

                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />

              </label>


              {/* OR */}

              <div className="flex items-center gap-4 my-6">

                <div className="h-px bg-[#e3e4dd] flex-1"></div>

                <span className="text-xs font-semibold text-[#929990]">
                  OR PASTE CHAT
                </span>

                <div className="h-px bg-[#e3e4dd] flex-1"></div>

              </div>


              {/* TEXTAREA */}

              <div>

                <div className="flex justify-between items-center mb-2">

                  <label className="text-sm font-semibold text-[#536258]">
                    WhatsApp Conversation
                  </label>

                  <span className="text-xs text-[#9a9f99]">
                    {chat.length} characters
                  </span>

                </div>

                <textarea
                  value={chat}
                  onChange={(e) => {
                    setChat(e.target.value);
                    setFileName("");
                  }}
                  placeholder={`Paste exported WhatsApp conversation here...

Example:
12/08/2026, 10:30 am - Rahul: Congratulations! You won ₹50,000.
12/08/2026, 10:31 am - Rahul: Click this link to claim your prize.
12/08/2026, 10:32 am - Rahul: http://example.com/claim`}
                  rows={11}
                  className="w-full bg-[#fafbf8] border border-[#dfe3dc] rounded-2xl px-4 py-4 text-sm text-[#354238] placeholder-[#a1a8a1] outline-none focus:border-[#6a8b71] focus:ring-4 focus:ring-[#dce8da] resize-none transition"
                />

              </div>


              {/* SCAN BUTTON */}

              <button
                onClick={scanWhatsApp}
                disabled={loading}
                className="w-full mt-5 bg-[#315c45] hover:bg-[#274b38] disabled:bg-[#9ba99e] text-white py-4 rounded-2xl font-bold transition shadow-sm"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">◌</span>
                    Analyzing Conversation...
                  </span>
                ) : (
                  "🛡️ Scan WhatsApp Chat"
                )}

              </button>


              {/* PRIVACY */}

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#7e897f]">
                🔒 Your chat is analyzed securely
              </div>

            </div>

          </div>


          {/* RIGHT INFO */}

          <div className="space-y-5">

            {/* QUICK INFO */}

            <div className="bg-[#edf3e9] rounded-[24px] p-6 border border-[#dce6d8]">

              <div className="text-2xl mb-3">
                ✨
              </div>

              <h3 className="font-bold text-[#315c45]">
                What we detect
              </h3>

              <div className="space-y-3 mt-5 text-sm text-[#607063]">

                <div className="flex gap-3">
                  <span>🔗</span>
                  <span>Suspicious links & phishing</span>
                </div>

                <div className="flex gap-3">
                  <span>💰</span>
                  <span>Fake payment requests</span>
                </div>

                <div className="flex gap-3">
                  <span>🎁</span>
                  <span>Prize & lottery scams</span>
                </div>

                <div className="flex gap-3">
                  <span>🔐</span>
                  <span>OTP & credential scams</span>
                </div>

              </div>

            </div>


            {/* HOW IT WORKS */}

            <div className="bg-white rounded-[24px] border border-[#e5e4dc] p-6">

              <h3 className="font-bold text-[#34473a] mb-5">
                How it works
              </h3>

              <div className="space-y-5">

                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#e8eee3] text-[#315c45] flex items-center justify-center font-bold text-sm">
                    1
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Upload or paste
                    </p>
                    <p className="text-xs text-[#899189] mt-1">
                      Add your WhatsApp conversation.
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#e8eee3] text-[#315c45] flex items-center justify-center font-bold text-sm">
                    2
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      AI analyzes
                    </p>
                    <p className="text-xs text-[#899189] mt-1">
                      Scam patterns and risk indicators are checked.
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#e8eee3] text-[#315c45] flex items-center justify-center font-bold text-sm">
                    3
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Get your result
                    </p>
                    <p className="text-xs text-[#899189] mt-1">
                      See risk score, scam type and recommendation.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">

            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>

              <p className="text-red-600 font-semibold">
                {error}
              </p>
            </div>

          </div>

        )}


        {/* RESULT */}

        {result && (

          <div className="mt-7 bg-white rounded-[28px] border border-[#e5e4dc] shadow-sm p-6 md:p-8">

            <div className="flex flex-wrap justify-between items-center gap-5">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-[#e9f0e5] flex items-center justify-center">
                    📊
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      Scan Result
                    </h2>

                    <p className="text-sm text-[#858e86]">
                      AI WhatsApp security analysis
                    </p>
                  </div>

                </div>

              </div>


              <div
                className={`px-5 py-3 rounded-xl ${riskStyle.bg} ${riskStyle.border} border ${riskStyle.text} font-bold`}
              >
                {riskStyle.icon} {result.riskLevel || "Unknown"}
              </div>

            </div>


            {/* SCORE */}

            <div className="mt-8 grid md:grid-cols-3 gap-5">

              <div className="bg-[#fafbf8] border border-[#e6e8e2] rounded-2xl p-5">

                <p className="text-xs uppercase tracking-wide text-[#899189]">
                  Risk Score
                </p>

                <p className={`text-5xl font-bold mt-2 ${riskStyle.text}`}>
                  {result.riskScore ?? 0}
                  <span className="text-xl text-[#9ca39c]">
                    /100
                  </span>
                </p>

              </div>


              <div className="bg-[#fafbf8] border border-[#e6e8e2] rounded-2xl p-5">

                <p className="text-xs uppercase tracking-wide text-[#899189]">
                  Scam Type
                </p>

                <p className="text-lg font-bold text-[#315c45] mt-3">
                  {result.scamType || "Not detected"}
                </p>

              </div>


              <div className="bg-[#fafbf8] border border-[#e6e8e2] rounded-2xl p-5">

                <p className="text-xs uppercase tracking-wide text-[#899189]">
                  Protection
                </p>

                <p className="text-lg font-bold text-[#315c45] mt-3">
                  AI Verified
                </p>

              </div>

            </div>


            {/* EXPLANATION */}

            <div className="mt-6 grid md:grid-cols-2 gap-5">

              <div className="bg-[#f7f8f4] rounded-2xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-[#7f887f]">
                  Explanation
                </p>

                <p className="mt-3 text-sm leading-7 text-[#48554b]">
                  {result.explanation ||
                    "No explanation available."}
                </p>

              </div>


              <div className="bg-[#f7f8f4] rounded-2xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-[#7f887f]">
                  Recommendation
                </p>

                <p className="mt-3 text-sm leading-7 text-[#48554b]">
                  {result.recommendation ||
                    "No recommendation available."}
                </p>

              </div>

            </div>


            {/* DANGEROUS */}

            {result.riskLevel === "Dangerous" && (

              <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">

                <h3 className="font-bold text-red-600 text-lg">
                  🚨 Dangerous Chat Detected
                </h3>

                <p className="text-sm text-red-700 mt-2 leading-6">
                  Avoid clicking suspicious links, sending money,
                  sharing OTPs, passwords or banking information.
                </p>

              </div>

            )}


            {/* SUSPICIOUS */}

            {result.riskLevel === "Suspicious" && (

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">

                <h3 className="font-bold text-amber-600 text-lg">
                  ⚠️ Suspicious Chat Detected
                </h3>

                <p className="text-sm text-amber-700 mt-2 leading-6">
                  Verify the sender independently before
                  interacting with links or payment requests.
                </p>

              </div>

            )}


            {/* SAFE */}

            {result.riskLevel === "Safe" && (

              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">

                <h3 className="font-bold text-emerald-700 text-lg">
                  ✅ Chat Appears Safe
                </h3>

                <p className="text-sm text-emerald-700 mt-2 leading-6">
                  No major scam indicators were detected
                  in this conversation.
                </p>

              </div>

            )}


            {/* SCAN AGAIN */}

            <button
              onClick={resetScanner}
              className="w-full mt-6 bg-[#315c45] hover:bg-[#274b38] text-white py-3.5 rounded-2xl font-bold transition"
            >
              🔄 Scan Another Chat
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default WhatsAppScanner;