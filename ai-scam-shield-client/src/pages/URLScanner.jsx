import { useState } from "react";

function URLScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
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
        "http://localhost:5000/api/scan/url",
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

      if (!response.ok) {
        alert(data.message || "URL scan failed");
        return;
      }

      setResult(data.result);

    } catch (error) {
      console.error(
        "URL Scan Error:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getValue = (
    value,
    fallback = "Not available"
  ) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "Unknown"
    ) {
      return fallback;
    }

    return value;
  };

  const getRiskColor = (
    riskLevel
  ) => {
    if (riskLevel === "Dangerous") {
      return "text-red-600";
    }

    if (riskLevel === "Suspicious") {
      return "text-amber-600";
    }

    return "text-emerald-700";
  };

  const getRiskBg = (
    riskLevel
  ) => {
    if (riskLevel === "Dangerous") {
      return "bg-red-50 border-red-100";
    }

    if (riskLevel === "Suspicious") {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

  const getRiskRing = (
    riskLevel
  ) => {
    if (riskLevel === "Dangerous") {
      return "border-red-200";
    }

    if (riskLevel === "Suspicious") {
      return "border-amber-200";
    }

    return "border-emerald-200";
  };

  // ==========================================
  // COMPONENT
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HEADER */}

      <header className="border-b border-green-900/10 bg-[#f7f5ed]/95 backdrop-blur">

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white border border-green-900/10 shadow-sm flex items-center justify-center">

              <span className="text-2xl">
                🛡️
              </span>

            </div>

            <div>

              <h1 className="font-bold text-lg">
                AI Scam Shield
              </h1>

              <p className="text-xs text-slate-500">
                Don't trust it. Scan it.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-green-50"
          >
            ←
          </button>

        </div>

      </header>


      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        {/* INTRO */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">

            <span>🔗</span>

            <span>
              URL / WEBSITE
            </span>

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Check a Suspicious Link
          </h2>

          <p className="text-slate-500 mt-2 max-w-2xl">

            Analyze suspicious URLs using
            AI-powered threat detection and
            network intelligence.

          </p>

        </div>


        {/* SCANNER */}

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">

          {/* INPUT CARD */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                🔗
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Scan a URL
                </h3>

                <p className="text-sm text-slate-500">
                  Check before you click
                </p>

              </div>

            </div>


            <label className="text-sm font-semibold">
              Website URL
            </label>


            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf5] px-4">

              <span className="text-lg">
                🌐
              </span>

              <input
                type="url"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScan();
                  }
                }}
                placeholder="https://example.com"
                className="w-full bg-transparent py-4 outline-none"
              />

            </div>


            <p className="text-xs text-slate-400 mt-2">
              Never open a suspicious link just to check it.
            </p>


            <button
              onClick={handleScan}
              disabled={loading}
              className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 text-white py-4 rounded-2xl font-semibold transition"
            >

              {loading
                ? "Checking URL..."
                : "🛡️ Scan URL →"}

            </button>

          </div>


          {/* INFO CARD */}

          <div className="bg-[#edf3eb] rounded-3xl border border-green-900/5 p-7">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl mb-5">
              🛡️
            </div>

            <h3 className="text-xl font-bold">
              Scan before you trust
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              AI Scam Shield analyzes the URL
              and provides security and network
              intelligence.
            </p>


            <div className="mt-6 space-y-3">

              <div className="bg-white/70 rounded-2xl p-4">
                ✓ Threat detection
              </div>

              <div className="bg-white/70 rounded-2xl p-4">
                ✓ Server IP intelligence
              </div>

              <div className="bg-white/70 rounded-2xl p-4">
                ✓ ISP / ASN information
              </div>

              <div className="bg-white/70 rounded-2xl p-4">
                ✓ Redirect analysis
              </div>

            </div>

          </div>

        </div>


        {/* RESULT */}

        {result && (

          <div className="mt-10">

            {/* RESULT HEADER */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-sm font-semibold text-green-700">
                  SCAN RESULT
                </p>

                <h2 className="text-3xl font-bold">
                  URL Security Analysis
                </h2>

              </div>


              <div
                className={`px-4 py-2 rounded-xl border font-bold ${getRiskBg(
                  result.riskLevel
                )} ${getRiskColor(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </div>

            </div>


            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">


              {/* SCORE */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

                <p className="text-sm text-slate-400 uppercase">
                  Risk Score
                </p>


                <div className="flex justify-center py-8">

                  <div
                    className={`w-48 h-48 rounded-full border-[14px] flex flex-col items-center justify-center ${getRiskRing(
                      result.riskLevel
                    )}`}
                  >

                    <span
                      className={`text-5xl font-bold ${getRiskColor(
                        result.riskLevel
                      )}`}
                    >
                      {result.riskScore}
                    </span>

                    <span className="text-sm text-slate-400">
                      /100
                    </span>

                  </div>

                </div>


                <div
                  className={`rounded-2xl border p-4 text-center ${getRiskBg(
                    result.riskLevel
                  )}`}
                >

                  <p
                    className={`font-bold ${getRiskColor(
                      result.riskLevel
                    )}`}
                  >
                    {result.riskLevel}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    AI-generated risk assessment
                  </p>

                </div>


                <div className="mt-4 bg-[#fbfaf5] border border-slate-100 rounded-2xl p-4">

                  <p className="text-xs text-slate-400 uppercase">
                    Scam Type
                  </p>

                  <p className="font-bold mt-1">
                    {getValue(
                      result.scamType
                    )}
                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

                {/* URL */}

                <div className="bg-[#fbfaf5] border border-slate-100 rounded-2xl p-4">

                  <p className="text-xs text-slate-400 uppercase">
                    Scanned URL
                  </p>

                  <p className="mt-2 font-semibold text-sm break-all">
                    {getValue(result.url)}
                  </p>

                </div>


                {/* NETWORK */}

                <div className="mt-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-xl">
                        🌐 Network Intelligence
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        Destination infrastructure information
                      </p>

                    </div>

                    <span className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      📡
                    </span>

                  </div>


                  <div className="grid sm:grid-cols-2 gap-3 mt-5">

                    {/* DOMAIN */}

                    <NetworkItem
                      title="DOMAIN"
                      value={getValue(
                        result.domain
                      )}
                      icon="🌐"
                    />


                    {/* IP */}

                    <NetworkItem
                      title="SERVER IP"
                      value={getValue(
                        result.ip
                      )}
                      icon="📡"
                    />


                    {/* ISP */}

                    <NetworkItem
                      title="ISP / HOSTING"
                      value={getValue(
                        result.isp
                      )}
                      icon="🏢"
                    />


                    {/* ASN */}

                    <NetworkItem
                      title="ASN"
                      value={getValue(
                        result.asn
                      )}
                      icon="🔢"
                    />


                    {/* LOCATION */}

                    <NetworkItem
                      title="SERVER LOCATION"
                      value={getValue(
                        result.location
                      )}
                      icon="🌍"
                    />


                    {/* HTTPS */}

                    <NetworkItem
                      title="HTTPS"
                      value={
                        result.https
                          ? "Enabled"
                          : "Not enabled"
                      }
                      icon="🔐"
                    />

                  </div>


                  {/* REDIRECT */}

                  <div className="mt-3 bg-[#fbfaf5] border border-slate-100 rounded-2xl p-4 flex items-center justify-between">

                    <div>

                      <p className="text-xs text-slate-400 font-semibold">
                        🔄 REDIRECT ANALYSIS
                      </p>

                      <p className="font-bold mt-1">

                        {getValue(
                          result.redirects,
                          "0"
                        )}{" "}
                        redirect(s) detected

                      </p>

                    </div>

                    <span className="text-2xl">
                      🔄
                    </span>

                  </div>

                </div>


                {/* ENGINE */}

                <div className="mt-7">

                  <h3 className="font-bold text-xl">
                    Security Engine Results
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Threat classification summary
                  </p>


                  <div className="grid sm:grid-cols-3 gap-3 mt-4">

                    <StatCard
                      title="MALICIOUS"
                      value={result.malicious}
                      className="text-red-600 bg-red-50"
                    />

                    <StatCard
                      title="SUSPICIOUS"
                      value={result.suspicious}
                      className="text-amber-600 bg-amber-50"
                    />

                    <StatCard
                      title="HARMLESS"
                      value={result.harmless}
                      className="text-emerald-700 bg-emerald-50"
                    />

                  </div>

                </div>


                {/* EXPLANATION */}

                <div className="mt-6 bg-[#fbfaf5] border border-slate-100 rounded-2xl p-5">

                  <p className="font-bold">
                    ✦ Explanation
                  </p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {getValue(
                      result.explanation
                    )}
                  </p>

                </div>


                {/* RECOMMENDATION */}

                <div className="mt-4 bg-[#edf3eb] rounded-2xl p-5">

                  <p className="font-bold">
                    🛡️ Recommendation
                  </p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {getValue(
                      result.recommendation
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}


// ==========================================
// NETWORK ITEM
// ==========================================

function NetworkItem({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">

      <div className="flex items-center gap-2">

        <span>
          {icon}
        </span>

        <p className="text-xs text-slate-400 font-semibold">
          {title}
        </p>

      </div>

      <p className="font-bold text-slate-800 mt-2 break-all">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  className,
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 p-4 ${className}`}
    >

      <p className="text-xs font-semibold">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value ?? 0}
      </p>

    </div>
  );
}

export default URLScanner;