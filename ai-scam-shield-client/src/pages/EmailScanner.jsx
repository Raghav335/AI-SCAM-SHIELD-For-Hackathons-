import { useState } from "react";
import ThreatAlert from "../components/ThreatAlert";

function EmailScanner() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [alertResult, setAlertResult] = useState(null);

  const scanEmail = async () => {
    setError("");
    setResult(null);
    setAlertResult(null);

    if (!body.trim()) {
      setError("Please enter email body.");
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
        "https://ai-scam-shield-upkl.onrender.com/api/scan/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sender: sender.trim(),
            subject: subject.trim(),
            body: body.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("Email Scan Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Email scan failed"
        );
      }

      const scanResult = data.result;

      if (!scanResult) {
        throw new Error("No scan result received.");
      }

      setResult(scanResult);
      setAlertResult(scanResult);
    } catch (err) {
      console.error("Email Scan Error:", err);

      setError(
        err.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setSender("");
    setSubject("");
    setBody("");
    setResult(null);
    setError("");
    setAlertResult(null);
  };

  const getRiskColor = (level) => {
    if (level === "Dangerous") return "#D95C5C";
    if (level === "Suspicious") return "#D89A32";
    if (level === "Safe") return "#4E8B65";

    return "#517B62";
  };

  const getRiskBg = (level) => {
    if (level === "Dangerous") {
      return "#FFF1F0";
    }

    if (level === "Suspicious") {
      return "#FFF8E8";
    }

    if (level === "Safe") {
      return "#EEF8F0";
    }

    return "#F3F7F1";
  };

  return (
    <div
      className="min-h-screen text-[#27352D] px-4 sm:px-6 lg:px-8 py-6"
      style={{
        background:
          "linear-gradient(135deg,#F8F7EF 0%,#F4F1E7 50%,#F8F7EF 100%)",
      }}
    >
      <ThreatAlert
        result={alertResult}
        onClose={() => setAlertResult(null)}
      />

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#B8D5BD]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#D8E7D5]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white/70 border border-[#E3E1D7] flex items-center justify-center text-[#4F6255] hover:bg-white transition shadow-sm"
          >
            ←
          </button>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#76917D] font-bold">
              AI Scam Shield
            </p>

            <h1 className="text-xl sm:text-2xl font-bold text-[#26362C]">
              Email Scanner
            </h1>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#EAF2E8] flex items-center justify-center text-[#4F765C]">
            🛡️
          </div>
        </div>

        {/* INTRO CARD */}
        <div className="bg-white/75 backdrop-blur-sm border border-[#E5E2D7] rounded-[26px] p-5 sm:p-7 shadow-[0_10px_40px_rgba(75,85,70,0.08)] mb-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-[#E7F0E5] border border-[#D5E4D3] flex items-center justify-center text-3xl shrink-0">
              ✉️
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#5C8A69]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#66816D]">
                  Email Protection
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#29372F]">
                Analyze a suspicious email
              </h2>

              <p className="text-sm text-[#7A827C] mt-1 leading-relaxed">
                Paste the sender, subject and email content.
                Our AI will check for scam and phishing indicators.
              </p>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FORM */}
          <div className="lg:col-span-2">

            <div className="bg-white/80 border border-[#E4E1D6] rounded-[26px] p-5 sm:p-7 shadow-[0_10px_40px_rgba(75,85,70,0.07)]">

              {/* CARD HEADER */}
              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-lg font-bold text-[#2D3B32]">
                    Email Details
                  </h2>

                  <p className="text-xs text-[#89918B] mt-1">
                    Enter the information you want to verify
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#F0F5ED] flex items-center justify-center">
                  🔍
                </div>
              </div>

              {/* SENDER */}
              <div className="mb-5">

                <label className="block text-sm font-semibold text-[#526058] mb-2">
                  Sender Email
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A8E]">
                    @
                  </span>

                  <input
                    type="email"
                    value={sender}
                    onChange={(e) =>
                      setSender(e.target.value)
                    }
                    placeholder="example@gmail.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAFAF6] border border-[#DEDCD2] text-[#303C34] placeholder:text-[#A1A7A2] outline-none focus:border-[#789B82] focus:ring-4 focus:ring-[#A8C4AD]/20 transition"
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div className="mb-5">

                <label className="block text-sm font-semibold text-[#526058] mb-2">
                  Subject
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9A8E]">
                    ✦
                  </span>

                  <input
                    type="text"
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                    placeholder="Your account needs verification"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAFAF6] border border-[#DEDCD2] text-[#303C34] placeholder:text-[#A1A7A2] outline-none focus:border-[#789B82] focus:ring-4 focus:ring-[#A8C4AD]/20 transition"
                  />
                </div>
              </div>

              {/* EMAIL BODY */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="block text-sm font-semibold text-[#526058]">
                    Email Body
                  </label>

                  <span className="text-[11px] text-[#969E98]">
                    {body.length} characters
                  </span>

                </div>

                <textarea
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value)
                  }
                  placeholder="Paste the suspicious email content here..."
                  rows={11}
                  className="w-full p-4 rounded-xl bg-[#FAFAF6] border border-[#DEDCD2] text-[#303C34] placeholder:text-[#A1A7A2] outline-none focus:border-[#789B82] focus:ring-4 focus:ring-[#A8C4AD]/20 transition resize-none leading-relaxed"
                />

                <p className="text-[11px] text-[#929A94] mt-2">
                  Include the complete email content for better analysis.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-5 bg-[#FFF1F0] border border-[#F0C8C5] rounded-xl p-4 flex gap-3">
                  <span>⚠️</span>

                  <p className="text-sm text-[#B6534E] font-semibold">
                    {error}
                  </p>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  onClick={scanEmail}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-[#416C51] hover:bg-[#355B43] disabled:opacity-60 text-white font-bold transition shadow-[0_8px_20px_rgba(65,108,81,0.18)]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">
                        ◌
                      </span>
                      Analyzing Email...
                    </span>
                  ) : (
                    <span>
                      🛡️ Scan Email
                    </span>
                  )}
                </button>

                <button
                  onClick={resetScanner}
                  className="sm:w-32 py-3.5 rounded-xl bg-[#F0F1EA] hover:bg-[#E7E9E0] border border-[#DADDD2] text-[#59665D] font-semibold transition"
                >
                  Clear
                </button>

              </div>
            </div>
          </div>

          {/* SIDE INFORMATION */}
          <div className="space-y-5">

            {/* AI CHECK CARD */}
            <div className="bg-[#EAF2E7] border border-[#D4E3D2] rounded-[26px] p-6">

              <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center text-2xl mb-4">
                🤖
              </div>

              <h3 className="font-bold text-[#304238] text-lg">
                AI-Powered Analysis
              </h3>

              <p className="text-sm text-[#718077] mt-2 leading-relaxed">
                AI checks the email for phishing,
                impersonation, urgency and other scam indicators.
              </p>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3 text-sm text-[#52645A]">
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    ✓
                  </span>
                  Suspicious language
                </div>

                <div className="flex items-center gap-3 text-sm text-[#52645A]">
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    ✓
                  </span>
                  Phishing indicators
                </div>

                <div className="flex items-center gap-3 text-sm text-[#52645A]">
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    ✓
                  </span>
                  Sender risk
                </div>

                <div className="flex items-center gap-3 text-sm text-[#52645A]">
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    ✓
                  </span>
                  Scam patterns
                </div>

              </div>
            </div>

            {/* SAFETY TIP */}
            <div className="bg-white/75 border border-[#E2E0D6] rounded-[26px] p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#F0F5EC] flex items-center justify-center">
                  💡
                </div>

                <h3 className="font-bold text-[#35443A]">
                  Safety Tip
                </h3>

              </div>

              <p className="text-sm text-[#78817B] mt-4 leading-relaxed">
                Never reply to a suspicious email or share
                OTPs, passwords, PINs or banking information.
              </p>
            </div>

            {/* PRIVACY */}
            <div className="bg-white/70 border border-[#E2E0D6] rounded-[26px] p-5">

              <div className="flex items-center gap-3">

                <span className="text-xl">
                  🔒
                </span>

                <div>
                  <p className="text-sm font-bold text-[#405046]">
                    Privacy First
                  </p>

                  <p className="text-xs text-[#8A918C] mt-0.5">
                    Your scan stays protected
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-6">

            <div className="bg-white/85 border border-[#E0DED3] rounded-[28px] p-5 sm:p-7 shadow-[0_10px_40px_rgba(75,85,70,0.08)]">

              {/* RESULT HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-[#EAF2E7] flex items-center justify-center text-2xl">
                    🛡️
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2D3B32]">
                      Scan Result
                    </h2>

                    <p className="text-sm text-[#858D87] mt-1">
                      AI Email Security Analysis
                    </p>
                  </div>

                </div>

                <div
                  className="px-5 py-2.5 rounded-full font-bold text-sm border"
                  style={{
                    color: getRiskColor(
                      result.riskLevel
                    ),
                    backgroundColor: getRiskBg(
                      result.riskLevel
                    ),
                    borderColor:
                      getRiskColor(
                        result.riskLevel
                      ) + "40",
                  }}
                >
                  {result.riskLevel || "Unknown"}
                </div>

              </div>

              {/* RISK SCORE */}
              <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="md:col-span-1 rounded-2xl bg-[#F5F6F0] border border-[#E1E1D7] p-5">

                  <p className="text-xs uppercase tracking-wider text-[#8A918B] font-semibold">
                    Risk Score
                  </p>

                  <div className="flex items-end gap-2 mt-2">

                    <span
                      className="text-5xl font-bold"
                      style={{
                        color: getRiskColor(
                          result.riskLevel
                        ),
                      }}
                    >
                      {result.riskScore ?? 0}
                    </span>

                    <span className="text-[#8A918B] mb-2">
                      /100
                    </span>

                  </div>

                  <div className="mt-4 h-2 rounded-full bg-[#E2E4DC] overflow-hidden">

                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          result.riskScore ?? 0,
                          100
                        )}%`,
                        backgroundColor:
                          getRiskColor(
                            result.riskLevel
                          ),
                      }}
                    />

                  </div>
                </div>

                {/* SCAM TYPE */}
                <div className="rounded-2xl bg-[#F5F6F0] border border-[#E1E1D7] p-5">

                  <p className="text-xs uppercase tracking-wider text-[#8A918B] font-semibold">
                    Scam Type
                  </p>

                  <p className="text-lg font-bold text-[#486651] mt-3">
                    {result.scamType ||
                      "Not detected"}
                  </p>

                  <p className="text-xs text-[#8B938D] mt-2">
                    Detected by AI analysis
                  </p>

                </div>

                {/* SENDER */}
                <div className="rounded-2xl bg-[#F5F6F0] border border-[#E1E1D7] p-5">

                  <p className="text-xs uppercase tracking-wider text-[#8A918B] font-semibold">
                    Sender
                  </p>

                  <p className="text-sm font-semibold text-[#46544B] mt-3 break-all">
                    {result.sender ||
                      sender ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {/* EMAIL INFO */}
              <div className="mt-5 rounded-2xl bg-[#FAFAF6] border border-[#E5E3D9] p-5">

                <p className="text-xs uppercase tracking-wider text-[#8A918B] font-semibold">
                  Subject
                </p>

                <p className="mt-2 text-[#39473F] font-medium">
                  {result.subject ||
                    subject ||
                    "Not provided"}
                </p>

              </div>

              {/* EXPLANATION */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-2xl bg-[#F5F7F1] border border-[#DEE5DB] p-5">

                  <div className="flex items-center gap-2">
                    <span>🔎</span>

                    <h3 className="font-bold text-[#415249]">
                      Why this email is risky
                    </h3>
                  </div>

                  <p className="text-sm text-[#707A73] mt-3 leading-relaxed">
                    {result.explanation ||
                      "No explanation available."}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#F5F7F1] border border-[#DEE5DB] p-5">

                  <div className="flex items-center gap-2">
                    <span>🛡️</span>

                    <h3 className="font-bold text-[#415249]">
                      What should you do?
                    </h3>
                  </div>

                  <p className="text-sm text-[#707A73] mt-3 leading-relaxed">
                    {result.recommendation ||
                      "No recommendation available."}
                  </p>

                </div>

              </div>

              {/* RISK WARNING */}
              {result.riskLevel === "Dangerous" && (
                <div className="mt-5 rounded-2xl bg-[#FFF0EF] border border-[#EBC8C5] p-5">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      🚨
                    </div>

                    <div>
                      <h3 className="font-bold text-[#B34E48]">
                        Dangerous Email Detected
                      </h3>

                      <p className="text-sm text-[#846B69] mt-1">
                        Do not click links, download attachments,
                        or share OTPs, passwords or banking information.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {result.riskLevel === "Suspicious" && (
                <div className="mt-5 rounded-2xl bg-[#FFF8E8] border border-[#EBD9A9] p-5">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      ⚠️
                    </div>

                    <div>
                      <h3 className="font-bold text-[#A87725]">
                        Suspicious Email Detected
                      </h3>

                      <p className="text-sm text-[#82745B] mt-1">
                        Verify the sender independently before
                        taking any action.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {result.riskLevel === "Safe" && (
                <div className="mt-5 rounded-2xl bg-[#EEF8F0] border border-[#CDE1D1] p-5">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      ✅
                    </div>

                    <div>
                      <h3 className="font-bold text-[#4B7C59]">
                        Email Appears Safe
                      </h3>

                      <p className="text-sm text-[#6F7E73] mt-1">
                        No major scam indicators were detected.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* NEW SCAN */}
              <button
                onClick={resetScanner}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#416C51] hover:bg-[#355B43] text-white font-bold transition"
              >
                + Scan Another Email
              </button>

            </div>
          </div>
        )}

        {/* BOTTOM TRUST BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

          <div className="bg-white/60 border border-[#E5E2D7] rounded-2xl p-4 flex items-center gap-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="text-xs font-bold text-[#4B5A50]">
                AI-Powered
              </p>
              <p className="text-[10px] text-[#8B938D]">
                Smart scam detection
              </p>
            </div>
          </div>

          <div className="bg-white/60 border border-[#E5E2D7] rounded-2xl p-4 flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-xs font-bold text-[#4B5A50]">
                Privacy First
              </p>
              <p className="text-[10px] text-[#8B938D]">
                Security-focused analysis
              </p>
            </div>
          </div>

          <div className="bg-white/60 border border-[#E5E2D7] rounded-2xl p-4 flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="text-xs font-bold text-[#4B5A50]">
                Stay Protected
              </p>
              <p className="text-[10px] text-[#8B938D]">
                Scan before you trust
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default EmailScanner;