import { useEffect, useState } from "react";

function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/scan/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load history");
          return;
        }

        setScans(data.scans || []);
      } catch (error) {
        console.error("History Error:", error);
        alert("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getRiskColor = (riskLevel) => {
    if (riskLevel === "Dangerous") return "text-red-600";
    if (riskLevel === "Suspicious") return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskBadge = (riskLevel) => {
    if (riskLevel === "Dangerous") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (riskLevel === "Suspicious") {
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    }

    return "bg-green-50 text-green-600 border-green-200";
  };

  const getIcon = (inputType) => {
    if (inputType === "url") return "🔗";
    if (inputType === "text") return "💬";
    return "🖼️";
  };

  const getScanName = (inputType) => {
    if (inputType === "url") return "URL Scan";
    if (inputType === "text") return "Message Scan";
    return "Image Scan";
  };

  const dangerous = scans.filter(
    (scan) => scan.riskLevel === "Dangerous"
  ).length;

  const suspicious = scans.filter(
    (scan) => scan.riskLevel === "Suspicious"
  ).length;

  const safe = scans.filter(
    (scan) =>
      scan.riskLevel !== "Dangerous" &&
      scan.riskLevel !== "Suspicious"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ed] flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl animate-pulse">
            🛡️
          </div>

          <p className="mt-4 text-[#214d3a] font-semibold">
            Loading scan history...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800 px-5 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#214d3a] text-white text-3xl shadow-lg">
            🛡️
          </div>

          <h1 className="text-4xl font-bold mt-5">
            Scan History
          </h1>

          <p className="text-slate-500 mt-2">
            View your previous scam detection results
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">

          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <p className="text-sm text-slate-400">
              Total Scans
            </p>

            <p className="text-3xl font-bold mt-2">
              {scans.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-5 text-center shadow-sm">
            <p className="text-sm text-slate-400">
              Dangerous
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {dangerous}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-yellow-100 p-5 text-center shadow-sm">
            <p className="text-sm text-slate-400">
              Suspicious
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {suspicious}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 text-center shadow-sm">
            <p className="text-sm text-slate-400">
              Safe
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {safe}
            </p>
          </div>

        </div>

        {/* EMPTY */}

        {scans.length === 0 ? (

          <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="text-2xl font-bold mt-5">
              No scans yet
            </h2>

            <p className="text-slate-500 mt-2">
              Your scan results will appear here.
            </p>

          </div>

        ) : (

          /* HISTORY */

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5">
              Recent Scans
            </h2>

            <div className="space-y-5">

              {scans.map((scan) => (

                <div
                  key={scan._id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                >

                  {/* TOP */}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-[#edf3eb] flex items-center justify-center text-2xl">
                        {getIcon(scan.inputType)}
                      </div>

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <h3 className="text-lg font-bold">
                            {getScanName(scan.inputType)}
                          </h3>

                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-semibold ${getRiskBadge(
                              scan.riskLevel
                            )}`}
                          >
                            {scan.riskLevel}
                          </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {scan.scamType}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(
                            scan.createdAt
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                    {/* SCORE */}

                    <div className="text-left md:text-right">

                      <p className="text-xs text-slate-400">
                        RISK SCORE
                      </p>

                      <p
                        className={`text-3xl font-bold ${getRiskColor(
                          scan.riskLevel
                        )}`}
                      >
                        {scan.riskScore}
                        <span className="text-sm text-slate-400">
                          /100
                        </span>
                      </p>

                    </div>

                  </div>

                  {/* INPUT */}

                  <div className="mt-6">

                    <p className="text-xs font-semibold text-slate-400 uppercase">
                      {scan.inputType === "url"
                        ? "Scanned URL"
                        : "Scanned Message"}
                    </p>

                    <div className="mt-2 bg-[#f8f8f3] border border-slate-200 rounded-2xl p-4">

                      <p className="text-sm text-slate-700 break-all">
                        {scan.input}
                      </p>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    <div className="bg-[#f8f8f3] rounded-2xl p-5">

                      <p className="font-semibold">
                        🔍 Explanation
                      </p>

                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {scan.explanation}
                      </p>

                    </div>

                    <div className="bg-[#f8f8f3] rounded-2xl p-5">

                      <p className="font-semibold">
                        🛡️ Recommendation
                      </p>

                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {scan.recommendation}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default ScanHistory;