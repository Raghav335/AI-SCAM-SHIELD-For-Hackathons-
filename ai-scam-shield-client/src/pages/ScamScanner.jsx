import { useState } from "react";

function ScamScanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!message.trim()) {
      alert("Please enter a message to scan");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://ai-scam-shield-upkl.onrender.com/api/scan/text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            input: message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Scan failed");
        return;
      }

      setResult(data.result);
    } catch (error) {
      console.error("Scan Error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const getRiskTheme = (level) => {
    if (level === "Dangerous") {
      return {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        ring: "border-red-500",
        label: "High Risk",
      };
    }

    if (level === "Suspicious") {
      return {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        ring: "border-amber-500",
        label: "Medium Risk",
      };
    }

    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "border-emerald-500",
      label: "Safe",
    };
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-[#24342b] relative overflow-hidden">

      {/* Decorative Background */}

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#dfe9d9] rounded-full blur-3xl opacity-60" />

      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-[#e5eddf] rounded-full blur-3xl opacity-70" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white border border-[#e3e1d7] flex items-center justify-center text-xl hover:bg-[#eef3e9] transition"
          >
            ←
          </button>

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-[#dfe9d9] flex items-center justify-center text-xl">
              🛡️
            </div>

            <span className="font-bold text-[#26372d]">
              AI Scam Shield
            </span>

          </div>

          <div className="w-10 h-10 rounded-full bg-white border border-[#e3e1d7] flex items-center justify-center">
            ⋮
          </div>

        </div>


        {/* PAGE TITLE */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#71836f]">
            AI Security Scanner
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-[#26372d]">
            Scan Anything Suspicious
          </h1>

          <p className="text-[#778077] mt-2 max-w-2xl">
            Paste a suspicious message below and let AI analyze
            it for scam indicators before you take action.
          </p>

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">


          {/* LEFT SCANNER */}

          <div className="lg:col-span-3">

            <div className="bg-white rounded-[28px] border border-[#e5e2d8] shadow-[0_12px_40px_rgba(65,80,65,0.08)] p-6 sm:p-8">

              {/* Card Header */}

              <div className="flex items-center gap-4 mb-7">

                <div className="w-14 h-14 rounded-2xl bg-[#e6eee1] flex items-center justify-center text-2xl">
                  💬
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#2b3b31]">
                    Message Scanner
                  </h2>

                  <p className="text-sm text-[#899087] mt-1">
                    Analyze SMS, WhatsApp or suspicious text
                  </p>

                </div>

              </div>


              {/* TEXT AREA */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <label className="text-sm font-semibold text-[#536154]">
                    Suspicious Message
                  </label>

                  <span className="text-xs text-[#9a9e98]">
                    {message.length} characters
                  </span>

                </div>

                <div className="relative">

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Paste the suspicious message here..."
                    className="w-full h-64 resize-none rounded-2xl bg-[#faf9f4] border border-[#deded4] px-5 py-4 text-[#354139] placeholder-[#a7aaa3] outline-none focus:border-[#8ca88c] focus:ring-4 focus:ring-[#dfe9d9] transition leading-relaxed"
                  />

                  {!message && (
                    <div className="absolute bottom-4 left-5 flex items-center gap-2 text-xs text-[#a2a69f] pointer-events-none">
                      <span>🔒</span>
                      <span>Your content stays protected</span>
                    </div>
                  )}

                </div>

              </div>


              {/* SCAN BUTTON */}

              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full mt-5 py-4 rounded-2xl bg-[#315b45] hover:bg-[#264c39] disabled:bg-[#9eaaa1] text-white font-bold shadow-lg shadow-[#315b45]/15 transition flex items-center justify-center gap-3"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Analyzing Message...
                  </>
                ) : (
                  <>
                    <span>🛡️</span>
                    Scan Message
                    <span>→</span>
                  </>
                )}

              </button>


              {/* PRIVACY */}

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#899087]">
                <span>✓</span>
                <span>AI-powered analysis</span>
                <span>•</span>
                <span>Privacy protected</span>
              </div>

            </div>


            {/* QUICK TIPS */}

            <div className="mt-5 bg-[#edf3e9] border border-[#dce6d7] rounded-2xl p-5">

              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                  💡
                </div>

                <div>

                  <h3 className="font-bold text-[#3b513f]">
                    Tip for better results
                  </h3>

                  <p className="text-sm text-[#687468] mt-1 leading-relaxed">
                    Include the complete message, especially links,
                    payment requests, OTP requests or urgent instructions.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT INFORMATION PANEL */}

          <div className="lg:col-span-2 space-y-5">


            {/* SECURITY CARD */}

            <div className="bg-white rounded-[28px] border border-[#e5e2d8] shadow-[0_12px_40px_rgba(65,80,65,0.07)] p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#e7efe3] flex items-center justify-center text-xl">
                  🛡️
                </div>

                <div>

                  <h3 className="font-bold text-[#34463a]">
                    AI-Powered Protection
                  </h3>

                  <p className="text-xs text-[#8b938b] mt-1">
                    Scam detection in seconds
                  </p>

                </div>

              </div>


              <div className="mt-6 space-y-4">

                <div className="flex gap-3">

                  <div className="w-7 h-7 rounded-full bg-[#e7efe3] flex items-center justify-center text-sm">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#435045]">
                      Scam Pattern Detection
                    </p>

                    <p className="text-xs text-[#8d958d] mt-1">
                      Detects common scam and phishing patterns.
                    </p>

                  </div>

                </div>


                <div className="flex gap-3">

                  <div className="w-7 h-7 rounded-full bg-[#e7efe3] flex items-center justify-center text-sm">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#435045]">
                      Risk Score
                    </p>

                    <p className="text-xs text-[#8d958d] mt-1">
                      Understand the potential danger level.
                    </p>

                  </div>

                </div>


                <div className="flex gap-3">

                  <div className="w-7 h-7 rounded-full bg-[#e7efe3] flex items-center justify-center text-sm">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#435045]">
                      Safety Recommendation
                    </p>

                    <p className="text-xs text-[#8d958d] mt-1">
                      Get clear guidance on what to do next.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* SUPPORTED CONTENT */}

            <div className="bg-[#eef3e9] rounded-[28px] border border-[#dce5d8] p-6">

              <h3 className="font-bold text-[#34483a]">
                What can you scan?
              </h3>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-white rounded-xl p-4 border border-[#e2e6dd]">
                  <div className="text-xl">💬</div>
                  <p className="text-xs font-semibold mt-2">
                    SMS
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#e2e6dd]">
                  <div className="text-xl">💚</div>
                  <p className="text-xs font-semibold mt-2">
                    WhatsApp
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#e2e6dd]">
                  <div className="text-xl">📧</div>
                  <p className="text-xs font-semibold mt-2">
                    Email
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#e2e6dd]">
                  <div className="text-xl">🔗</div>
                  <p className="text-xs font-semibold mt-2">
                    Links
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* RESULT */}

        {result && (
          <div className="mt-7 bg-white rounded-[28px] border border-[#e5e2d8] shadow-[0_12px_45px_rgba(65,80,65,0.09)] p-6 sm:p-8">

            {/* RESULT HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7c897c] font-bold">
                  <span>✦</span>
                  AI Analysis Complete
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#2d3c32] mt-2">
                  Scan Result
                </h2>

              </div>


              <div
                className={`px-5 py-3 rounded-full font-bold ${
                  getRiskTheme(result.riskLevel).bg
                } ${
                  getRiskTheme(result.riskLevel).text
                } ${
                  getRiskTheme(result.riskLevel).border
                } border`}
              >
                {getRiskTheme(result.riskLevel).label}
              </div>

            </div>


            {/* SCORE AREA */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              {/* SCORE */}

              <div className="rounded-2xl bg-[#faf9f4] border border-[#e6e3d9] p-6 flex flex-col items-center justify-center">

                <div className="relative w-36 h-36 flex items-center justify-center">

                  <div
                    className={`absolute inset-0 rounded-full border-[10px] border-[#e8e6dd]`}
                  />

                  <div
                    className={`absolute inset-0 rounded-full border-[10px] ${
                      getRiskTheme(result.riskLevel).ring
                    } border-l-transparent border-b-transparent rotate-[-45deg]`}
                  />

                  <div className="text-center">

                    <div
                      className={`text-4xl font-bold ${
                        getRiskTheme(result.riskLevel).text
                      }`}
                    >
                      {result.riskScore ?? 0}
                    </div>

                    <div className="text-xs text-[#969b94]">
                      / 100
                    </div>

                  </div>

                </div>

                <p className="text-sm font-semibold text-[#667067] mt-4">
                  Risk Score
                </p>

              </div>


              {/* SCAM TYPE */}

              <div className="rounded-2xl bg-[#faf9f4] border border-[#e6e3d9] p-6">

                <p className="text-xs uppercase tracking-widest text-[#969d96] font-bold">
                  Scam Type
                </p>

                <p className="text-xl font-bold text-[#334238] mt-3">
                  {result.scamType || "Not detected"}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#738075]">
                  <span className="w-2 h-2 rounded-full bg-[#799879]" />
                  AI classification
                </div>

              </div>


              {/* RISK LEVEL */}

              <div className="rounded-2xl bg-[#faf9f4] border border-[#e6e3d9] p-6">

                <p className="text-xs uppercase tracking-widest text-[#969d96] font-bold">
                  Risk Level
                </p>

                <p
                  className={`text-2xl font-bold mt-3 ${
                    getRiskTheme(result.riskLevel).text
                  }`}
                >
                  {result.riskLevel || "Unknown"}
                </p>

                <p className="text-sm text-[#7d877e] mt-3">
                  Based on detected scam indicators.
                </p>

              </div>

            </div>


            {/* MESSAGE */}

            <div className="mt-6">

              <p className="text-xs uppercase tracking-widest text-[#969d96] font-bold mb-2">
                Analyzed Message
              </p>

              <div className="bg-[#faf9f4] border border-[#e6e3d9] rounded-2xl p-5 text-sm text-[#4d584f] leading-relaxed">
                {message}
              </div>

            </div>


            {/* EXPLANATION + RECOMMENDATION */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              <div className="rounded-2xl bg-[#faf9f4] border border-[#e6e3d9] p-5">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-[#e6eee1] flex items-center justify-center">
                    🔎
                  </div>

                  <h3 className="font-bold text-[#3c4c40]">
                    Explanation
                  </h3>

                </div>

                <p className="text-sm text-[#69736b] mt-4 leading-relaxed">
                  {result.explanation ||
                    "No explanation available."}
                </p>

              </div>


              <div className="rounded-2xl bg-[#edf3e9] border border-[#dce6d8] p-5">

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    🛡️
                  </div>

                  <h3 className="font-bold text-[#3c4c40]">
                    Recommendation
                  </h3>

                </div>

                <p className="text-sm text-[#69736b] mt-4 leading-relaxed">
                  {result.recommendation ||
                    "No recommendation available."}
                </p>

              </div>

            </div>


            {/* WARNING */}

            {result.riskLevel === "Dangerous" && (

              <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-5">

                <div className="flex gap-3">

                  <div className="text-2xl">
                    🚨
                  </div>

                  <div>

                    <h3 className="font-bold text-red-700">
                      Dangerous Message Detected
                    </h3>

                    <p className="text-sm text-red-600 mt-2 leading-relaxed">
                      Do not click links, send OTPs, share passwords
                      or provide banking information.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {result.riskLevel === "Suspicious" && (

              <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-5">

                <div className="flex gap-3">

                  <div className="text-2xl">
                    ⚠️
                  </div>

                  <div>

                    <h3 className="font-bold text-amber-700">
                      Suspicious Message
                    </h3>

                    <p className="text-sm text-amber-700 mt-2">
                      Verify the sender independently before
                      taking any action.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {result.riskLevel === "Safe" && (

              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">

                <div className="flex gap-3">

                  <div className="text-2xl">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold text-emerald-700">
                      Message Appears Safe
                    </h3>

                    <p className="text-sm text-emerald-700 mt-2">
                      No major scam indicators were detected.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* SCAN AGAIN */}

            <button
              onClick={() => {
                setMessage("");
                setResult(null);
              }}
              className="w-full mt-6 py-3.5 rounded-2xl border border-[#d8ddd5] bg-white hover:bg-[#f1f4ed] text-[#405445] font-bold transition"
            >
              ↻ Scan Another Message
            </button>

          </div>
        )}


        {/* FOOTER */}

        <div className="mt-10 pb-5">

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#8d958d]">

            <span>🛡️ AI-Powered Analysis</span>

            <span className="hidden sm:block">•</span>

            <span>🔒 Privacy First</span>

            <span className="hidden sm:block">•</span>

            <span>✓ Stay Alert, Stay Safe</span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ScamScanner;