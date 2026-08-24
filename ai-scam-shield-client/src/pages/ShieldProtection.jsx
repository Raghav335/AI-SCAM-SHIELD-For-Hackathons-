import { useState } from "react";

function ShieldProtection() {
  const [shieldActive, setShieldActive] = useState(
    localStorage.getItem("shieldActive") === "true"
  );

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const activateShield = () => {
    setShieldActive(true);
    localStorage.setItem("shieldActive", "true");
    setResult(null);
    setError("");
  };

  const deactivateShield = () => {
    setShieldActive(false);
    localStorage.setItem("shieldActive", "false");
    setResult(null);
    setError("");
  };

  const checkLink = async () => {
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL to check.");
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
        "https://ai-scam-shield-upkl.onrender.comd-upkl.onrender.com/api/scan/url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("URL Scan Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to check this URL."
        );
      }

      if (!data.result) {
        throw new Error("No scan result received.");
      }

      setResult(data.result);

    } catch (error) {
      console.error("Shield Error:", error);

      setError(
        error.message ||
          "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  const clearScan = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const getRiskConfig = (riskLevel) => {
    if (riskLevel === "Dangerous") {
      return {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-700",
        icon: "🚨",
        title: "Dangerous Link Detected",
      };
    }

    if (riskLevel === "Suspicious") {
      return {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        icon: "⚠️",
        title: "Suspicious Link Detected",
      };
    }

    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      icon: "✅",
      title: "No Major Threat Detected",
    };
  };

  const risk = result
    ? getRiskConfig(result.riskLevel)
    : null;

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HEADER */}
      <header className="border-b border-green-900/10 bg-[#f7f5ed]/95">

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#214d3a] flex items-center justify-center shadow-sm">
              <span className="text-2xl">
                🛡️
              </span>
            </div>

            <div>
              <h1 className="font-bold text-lg text-[#214d3a]">
                AI Scam Shield
              </h1>

              <p className="text-xs text-slate-500">
                Don't trust it. Scan it.
              </p>
            </div>

          </div>

          <div
            className={`px-4 py-2 rounded-full text-xs font-bold ${
              shieldActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {shieldActive
              ? "● PROTECTION ON"
              : "○ PROTECTION OFF"}
          </div>

        </div>

      </header>


      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

        {/* PAGE HEADER */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-green-900/10 shadow-sm text-3xl">
            🛡️
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#214d3a] mt-5">
            Shield Protection
          </h2>

          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Check suspicious links before opening them.
            AI Scam Shield analyzes the URL and identifies
            potential threats.
          </p>

        </div>


        {/* SHIELD STATUS */}
        <div className="bg-white border border-green-900/10 rounded-3xl p-7 sm:p-9 shadow-sm">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-7">

            <div className="flex items-center gap-5">

              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border ${
                  shieldActive
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-100 border-slate-200"
                }`}
              >
                {shieldActive ? "🛡️" : "🔓"}
              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Protection Status
                </p>

                <h3 className="text-2xl font-bold mt-1 text-slate-800">
                  {shieldActive
                    ? "Shield is Active"
                    : "Shield is Inactive"}
                </h3>

                <p
                  className={`text-sm mt-1 font-medium ${
                    shieldActive
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {shieldActive
                    ? "Your links can now be checked safely."
                    : "Activate protection to start checking links."}
                </p>

              </div>

            </div>


            {/* TOGGLE BUTTON */}
            {!shieldActive ? (

              <button
                onClick={activateShield}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#214d3a] hover:bg-[#183d2d] text-white font-bold transition shadow-md"
              >
                🛡️ Activate Shield
              </button>

            ) : (

              <button
                onClick={deactivateShield}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
              >
                Turn Off
              </button>

            )}

          </div>

        </div>


        {/* ACTIVE PROTECTION AREA */}
        {shieldActive && (

          <div className="mt-7 bg-white border border-green-900/10 rounded-3xl p-7 sm:p-9 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#f0f5ef] flex items-center justify-center text-2xl">
                🔗
              </div>

              <div>

                <h3 className="text-xl font-bold text-[#214d3a]">
                  Check a Suspicious Link
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Paste the link below before opening it.
                </p>

              </div>

            </div>


            {/* URL INPUT */}
            <div className="mt-6">

              <label className="text-sm font-semibold text-slate-700">
                Website URL
              </label>

              <div className="mt-2 flex flex-col sm:flex-row gap-3">

                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                    setResult(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkLink();
                    }
                  }}
                  placeholder="https://example.com"
                  className="flex-1 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-green-700/30 focus:ring-4 focus:ring-green-100/60 transition"
                />

                <button
                  onClick={checkLink}
                  disabled={loading}
                  className="sm:w-44 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 text-white rounded-2xl px-6 py-4 font-bold transition"
                >
                  {loading
                    ? "🔍 Checking..."
                    : "🛡️ Check Link"}
                </button>

              </div>

            </div>


            {/* INFO */}
            <div className="mt-5 flex flex-wrap gap-3">

              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                🔒 No passwords required
              </span>

              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                🤖 AI Analysis
              </span>

              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                ⚡ Fast Scan
              </span>

            </div>


            {/* ERROR */}
            {error && (

              <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">

                <span className="text-xl">
                  ⚠️
                </span>

                <div>
                  <p className="font-semibold text-red-700">
                    Scan Failed
                  </p>

                  <p className="text-sm text-red-600 mt-1">
                    {error}
                  </p>
                </div>

              </div>

            )}

          </div>

        )}


        {/* RESULT */}
        {result && risk && (

          <div className="mt-7 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

            {/* RESULT HEADER */}
            <div className={`${risk.bg} border-b ${risk.border} p-7`}>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                    {risk.icon}
                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Security Analysis
                    </p>

                    <h2 className={`text-2xl font-extrabold ${risk.text}`}>
                      {risk.title}
                    </h2>

                  </div>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${risk.badge}`}
                >
                  {result.riskLevel || "Unknown"}
                </span>

              </div>

            </div>


            {/* RESULT BODY */}
            <div className="p-7">

              {/* SCORE + TYPE */}
              <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-[#fbfaf5] rounded-2xl p-5">

                  <p className="text-sm text-slate-400">
                    Risk Score
                  </p>

                  <div className="flex items-end gap-1 mt-1">

                    <span className={`text-5xl font-extrabold ${risk.text}`}>
                      {result.riskScore ?? 0}
                    </span>

                    <span className="text-xl text-slate-400 mb-1">
                      /100
                    </span>

                  </div>

                </div>


                <div className="bg-[#fbfaf5] rounded-2xl p-5">

                  <p className="text-sm text-slate-400">
                    Threat Type
                  </p>

                  <p className="text-lg font-bold text-[#214d3a] mt-2">
                    {result.scamType || "Not detected"}
                  </p>

                </div>

              </div>


              {/* URL */}
              <div className="mt-6">

                <p className="text-sm text-slate-400">
                  Checked URL
                </p>

                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-2xl p-4">

                  <p className="text-sm text-slate-700 break-all">
                    {result.url || url}
                  </p>

                </div>

              </div>


              {/* ENGINE RESULTS */}
              {(result.malicious !== undefined ||
                result.suspicious !== undefined ||
                result.harmless !== undefined) && (

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">

                    <p className="text-sm text-slate-500">
                      Malicious
                    </p>

                    <p className="text-3xl font-extrabold text-red-600 mt-1">
                      {result.malicious ?? 0}
                    </p>

                  </div>


                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">

                    <p className="text-sm text-slate-500">
                      Suspicious
                    </p>

                    <p className="text-3xl font-extrabold text-amber-600 mt-1">
                      {result.suspicious ?? 0}
                    </p>

                  </div>


                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">

                    <p className="text-sm text-slate-500">
                      Harmless
                    </p>

                    <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                      {result.harmless ?? 0}
                    </p>

                  </div>

                </div>

              )}


              {/* EXPLANATION */}
              <div className="mt-6 bg-[#f7f5ed] rounded-2xl p-5">

                <p className="text-sm font-semibold text-[#214d3a]">
                  🔎 Analysis
                </p>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {result.explanation ||
                    "No additional explanation was provided."}
                </p>

              </div>


              {/* RECOMMENDATION */}
              <div className="mt-4 bg-[#f7f5ed] rounded-2xl p-5">

                <p className="text-sm font-semibold text-[#214d3a]">
                  🛡️ Safety Recommendation
                </p>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {result.recommendation ||
                    "Continue to verify the website before providing sensitive information."}
                </p>

              </div>


              {/* ACTIONS */}
              <div className="grid sm:grid-cols-2 gap-3 mt-6">

                <button
                  onClick={clearScan}
                  className="py-3.5 rounded-2xl bg-[#214d3a] hover:bg-[#183d2d] text-white font-bold transition"
                >
                  🔄 Check Another Link
                </button>

                <button
                  onClick={() => {
                    setUrl("");
                    setResult(null);
                  }}
                  className="py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition"
                >
                  Clear Result
                </button>

              </div>

            </div>

          </div>

        )}


        {/* INACTIVE INFORMATION */}
        {!shieldActive && (

          <div className="mt-7 bg-[#214d3a] rounded-3xl p-7 text-white">

            <div className="flex items-start gap-4">

              <span className="text-3xl">
                🔐
              </span>

              <div>

                <h3 className="text-xl font-bold">
                  Activate your protection
                </h3>

                <p className="text-green-50/70 text-sm mt-2 leading-relaxed">
                  Turn on AI Scam Shield to scan suspicious
                  links and identify phishing, malicious URLs
                  and other scam indicators.
                </p>

              </div>

            </div>

          </div>

        )}

      </main>


      {/* FOOTER */}
      <footer className="text-center pb-8">

        <p className="text-xs text-slate-400">
          AI Scam Shield • Detect. Protect. Stay Safe.
        </p>

      </footer>

    </div>
  );
}

export default ShieldProtection;