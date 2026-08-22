import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScans: 0,
    safeScans: 0,
    suspiciousScans: 0,
    dangerousScans: 0,
  });

  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const statsResponse = await fetch(
          "http://localhost:5000/api/scan/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statsData = await statsResponse.json();

        if (!statsResponse.ok) {
          throw new Error(
            statsData.message || "Failed to load dashboard"
          );
        }

        setStats(statsData);

        const historyResponse = await fetch(
          "http://localhost:5000/api/scan/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const historyData = await historyResponse.json();

        if (historyResponse.ok) {
          setRecentScans(historyData.scans?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const getRiskColor = (level) => {
    if (level === "Dangerous") return "text-[#c95c55]";
    if (level === "Suspicious") return "text-[#c58a35]";
    return "text-[#47765b]";
  };

  const getRiskBg = (level) => {
    if (level === "Dangerous") {
      return "bg-[#fff1ef] border-[#f1d0cc]";
    }

    if (level === "Suspicious") {
      return "bg-[#fff8e9] border-[#eadbb8]";
    }

    return "bg-[#eef7ef] border-[#d5e6d6]";
  };

  const total = stats.totalScans || 0;

  const safePercentage =
    total > 0 ? (stats.safeScans / total) * 100 : 0;

  const suspiciousPercentage =
    total > 0 ? (stats.suspiciousScans / total) * 100 : 0;

  const dangerousPercentage =
    total > 0 ? (stats.dangerousScans / total) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4eb] flex items-center justify-center text-[#26382c]">
        <div className="text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-[0_10px_35px_rgba(50,70,50,0.10)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#dce8dc] border-t-[#47765b] animate-spin" />
          </div>

          <h2 className="mt-6 text-xl font-bold">
            Loading Security Center
          </h2>

          <p className="text-[#788078] mt-2 text-sm">
            Fetching your latest protection data...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4eb] text-[#26382c]">

      {/* Decorative Background */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-[#dfeadb]/50 blur-3xl" />

        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#e7eee0]/60 blur-3xl" />

      </div>


      <main className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-7">


        {/* TOP NAV */}

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#e4eee1] flex items-center justify-center text-2xl">
              🛡️
            </div>

            <div>

              <h2 className="font-bold text-lg tracking-tight">
                AI Scam Shield
              </h2>

              <p className="text-xs text-[#8a928b]">
                Don't trust it. Scan it.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e5e2d9] shadow-sm">

              <span className="w-2 h-2 rounded-full bg-[#5f936c] animate-pulse" />

              <span className="text-xs font-semibold text-[#52715a]">
                Protection Active
              </span>

            </div>

            <button
              className="w-11 h-11 rounded-full bg-white border border-[#e5e2d9] flex items-center justify-center hover:bg-[#eef3eb] transition shadow-sm"
              title="Notifications"
            >
              🔔
            </button>

          </div>

        </div>


        {/* HERO */}

        <section className="grid lg:grid-cols-2 gap-7 mb-8">

          <div className="bg-transparent py-4">

            <p className="text-sm font-semibold text-[#52715a] mb-3">
              STAY ALERT. STAY SAFE.
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-[#26382c]">
              Your security,
              <br />
              <span className="text-[#527b5d]">
                always protected.
              </span>
            </h1>

            <p className="text-[#727a73] mt-5 max-w-xl leading-relaxed">
              Monitor suspicious links, messages, payments and
              other digital threats with AI-powered protection.
            </p>


            <div className="flex flex-wrap gap-3 mt-7">

              <button
                onClick={() => navigate("/scanner")}
                className="px-6 py-3.5 rounded-2xl bg-[#355c45] text-white font-semibold hover:bg-[#2d503b] transition shadow-[0_10px_25px_rgba(53,92,69,0.18)]"
              >
                Scan Anything →
              </button>

              <button
                onClick={() => navigate("/shield")}
                className="px-6 py-3.5 rounded-2xl bg-white border border-[#deddd5] text-[#355c45] font-semibold hover:bg-[#f0f3ed] transition"
              >
                🛡️ Activate Shield
              </button>

            </div>

          </div>


          {/* HERO SHIELD */}

          <div className="hidden lg:flex relative items-center justify-center min-h-[280px]">

            <div className="absolute w-64 h-64 rounded-full border border-[#cadbc9]" />

            <div className="absolute w-48 h-48 rounded-full border border-[#d7e3d3]" />

            <div className="absolute w-32 h-32 rounded-full bg-[#e3eee0] opacity-80" />

            <div className="relative w-40 h-40 rounded-[45%] bg-gradient-to-br from-[#6f9b78] to-[#355c45] rotate-6 shadow-[0_25px_50px_rgba(53,92,69,0.25)] flex items-center justify-center">

              <div className="w-28 h-32 bg-[#f7f4eb] rounded-[48%] -rotate-6 flex items-center justify-center shadow-inner">

                <span className="text-5xl">
                  ✓
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* SECURITY STATUS */}

        <section className="mb-7">

          <div className="bg-white rounded-[24px] border border-[#e5e1d7] shadow-[0_8px_30px_rgba(65,75,65,0.06)] p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-[#e7f0e4] flex items-center justify-center text-xl">
                  🛡️
                </div>

                <div>

                  <h2 className="font-bold text-[#304334]">
                    AI Scam Shield is protecting you
                  </h2>

                  <p className="text-sm text-[#858c85] mt-1">
                    Your security monitoring system is ready.
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf6ed]">

                <span className="w-2.5 h-2.5 rounded-full bg-[#5c9569]" />

                <span className="text-sm text-[#47765b] font-semibold">
                  System Secure
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* STATS */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">


          {/* TOTAL */}

          <div className="bg-white rounded-[22px] border border-[#e5e1d7] p-5 shadow-[0_7px_25px_rgba(65,75,65,0.05)] hover:-translate-y-1 transition">

            <div className="flex justify-between items-start">

              <div className="w-11 h-11 rounded-2xl bg-[#edf3eb] flex items-center justify-center text-xl">
                🔍
              </div>

              <span className="text-[10px] tracking-widest text-[#9a9f99]">
                ALL TIME
              </span>

            </div>

            <p className="text-sm text-[#7e857f] mt-5">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold mt-1 text-[#304334]">
              {stats.totalScans}
            </h2>

            <p className="text-xs text-[#a0a59f] mt-2">
              Security checks performed
            </p>

          </div>


          {/* SAFE */}

          <div className="bg-white rounded-[22px] border border-[#dce8dc] p-5 shadow-[0_7px_25px_rgba(65,75,65,0.05)] hover:-translate-y-1 transition">

            <div className="flex justify-between items-start">

              <div className="w-11 h-11 rounded-2xl bg-[#edf6ed] flex items-center justify-center text-xl">
                ✓
              </div>

              <span className="text-[10px] tracking-widest text-[#5d9068]">
                SAFE
              </span>

            </div>

            <p className="text-sm text-[#7e857f] mt-5">
              Safe Scans
            </p>

            <h2 className="text-4xl font-bold mt-1 text-[#47765b]">
              {stats.safeScans}
            </h2>

            <p className="text-xs text-[#a0a59f] mt-2">
              No major threat detected
            </p>

          </div>


          {/* SUSPICIOUS */}

          <div className="bg-white rounded-[22px] border border-[#eee2c8] p-5 shadow-[0_7px_25px_rgba(65,75,65,0.05)] hover:-translate-y-1 transition">

            <div className="flex justify-between items-start">

              <div className="w-11 h-11 rounded-2xl bg-[#fff6e2] flex items-center justify-center text-xl">
                !
              </div>

              <span className="text-[10px] tracking-widest text-[#b07a2e]">
                REVIEW
              </span>

            </div>

            <p className="text-sm text-[#7e857f] mt-5">
              Suspicious
            </p>

            <h2 className="text-4xl font-bold mt-1 text-[#b17b30]">
              {stats.suspiciousScans}
            </h2>

            <p className="text-xs text-[#a0a59f] mt-2">
              Requires attention
            </p>

          </div>


          {/* DANGEROUS */}

          <div className="bg-white rounded-[22px] border border-[#efd8d5] p-5 shadow-[0_7px_25px_rgba(65,75,65,0.05)] hover:-translate-y-1 transition">

            <div className="flex justify-between items-start">

              <div className="w-11 h-11 rounded-2xl bg-[#fff0ee] flex items-center justify-center text-xl">
                !
              </div>

              <span className="text-[10px] tracking-widest text-[#bd5d57]">
                ALERT
              </span>

            </div>

            <p className="text-sm text-[#7e857f] mt-5">
              Dangerous
            </p>

            <h2 className="text-4xl font-bold mt-1 text-[#c45d56]">
              {stats.dangerousScans}
            </h2>

            <p className="text-xs text-[#a0a59f] mt-2">
              Immediate caution required
            </p>

          </div>

        </section>


        {/* MAIN CONTENT */}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">


          {/* PROTECTION OVERVIEW */}

          <div className="xl:col-span-2 bg-white rounded-[25px] border border-[#e5e1d7] p-6 shadow-[0_8px_30px_rgba(65,75,65,0.05)]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-widest text-[#7d887e]">
                  Security Analytics
                </p>

                <h2 className="text-2xl font-bold text-[#304334] mt-1">
                  Protection Overview
                </h2>

                <p className="text-sm text-[#8b928b] mt-1">
                  Distribution of your security scan results
                </p>

              </div>

              <div className="w-11 h-11 rounded-2xl bg-[#edf3eb] flex items-center justify-center">
                📊
              </div>

            </div>


            <div className="mt-8 flex items-end gap-3">

              <span className="text-5xl font-bold text-[#304334]">
                {stats.totalScans}
              </span>

              <span className="text-sm text-[#919791] mb-2">
                total scans
              </span>

            </div>


            {/* PROGRESS */}

            <div className="mt-7 h-5 rounded-full bg-[#edf0eb] overflow-hidden flex">

              <div
                className="h-full bg-[#699373] transition-all"
                style={{
                  width: `${safePercentage}%`,
                }}
              />

              <div
                className="h-full bg-[#d5a24c] transition-all"
                style={{
                  width: `${suspiciousPercentage}%`,
                }}
              />

              <div
                className="h-full bg-[#c96b64] transition-all"
                style={{
                  width: `${dangerousPercentage}%`,
                }}
              />

            </div>


            {/* LEGEND */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">


              <div className="rounded-2xl bg-[#f4f8f2] border border-[#e0e9de] p-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#699373]" />

                  <span className="text-sm text-[#6d776f]">
                    Safe
                  </span>

                </div>

                <p className="text-2xl font-bold text-[#47765b] mt-2">
                  {safePercentage.toFixed(0)}%
                </p>

                <p className="text-xs text-[#929a93] mt-1">
                  {stats.safeScans} scans
                </p>

              </div>


              <div className="rounded-2xl bg-[#fff9ed] border border-[#eee4cc] p-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#d5a24c]" />

                  <span className="text-sm text-[#6d776f]">
                    Suspicious
                  </span>

                </div>

                <p className="text-2xl font-bold text-[#b17b30] mt-2">
                  {suspiciousPercentage.toFixed(0)}%
                </p>

                <p className="text-xs text-[#929a93] mt-1">
                  {stats.suspiciousScans} scans
                </p>

              </div>


              <div className="rounded-2xl bg-[#fff3f1] border border-[#efdeda] p-4">

                <div className="flex items-center gap-2">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#c96b64]" />

                  <span className="text-sm text-[#6d776f]">
                    Dangerous
                  </span>

                </div>

                <p className="text-2xl font-bold text-[#c45d56] mt-2">
                  {dangerousPercentage.toFixed(0)}%
                </p>

                <p className="text-xs text-[#929a93] mt-1">
                  {stats.dangerousScans} scans
                </p>

              </div>

            </div>

          </div>


          {/* QUICK SCAN */}

          <div className="bg-[#e8f0e4] rounded-[25px] border border-[#d6e2d3] p-6">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
              ⚡
            </div>

            <p className="text-xs uppercase tracking-widest text-[#66806c] mt-5">
              Quick Action
            </p>

            <h2 className="text-2xl font-bold text-[#304334] mt-1">
              Scan Anything
            </h2>

            <p className="text-sm text-[#718074] mt-2 leading-relaxed">
              Choose what you want to check and let AI analyze
              it for suspicious indicators.
            </p>


            <div className="space-y-3 mt-6">


              <button
                onClick={() => navigate("/scanner")}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#355c45] text-white hover:bg-[#2d503b] transition font-semibold shadow-sm"
              >
                <span>📝 Message Scanner</span>
                <span>→</span>
              </button>


              <button
                onClick={() => navigate("/url-scanner")}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white border border-[#d9e1d7] text-[#3e5946] hover:bg-[#f5f7f2] transition font-semibold"
              >
                <span>🔗 URL / Website</span>
                <span>→</span>
              </button>


              <button
                onClick={() => navigate("/image-scanner")}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white border border-[#d9e1d7] text-[#3e5946] hover:bg-[#f5f7f2] transition font-semibold"
              >
                <span>🖼️ Image / Screenshot</span>
                <span>→</span>
              </button>


              <button
                onClick={() => navigate("/email-scanner")}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white border border-[#d9e1d7] text-[#3e5946] hover:bg-[#f5f7f2] transition font-semibold"
              >
                <span>✉️ Email Scanner</span>
                <span>→</span>
              </button>

            </div>

          </div>

        </section>


        {/* RECENT SCANS */}

        <section className="mt-6 bg-white rounded-[25px] border border-[#e5e1d7] p-6 shadow-[0_8px_30px_rgba(65,75,65,0.05)]">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-[#edf3eb] flex items-center justify-center">
                  🕘
                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-[#899188]">
                    Activity
                  </p>

                  <h2 className="text-xl font-bold text-[#304334]">
                    Recent Scans
                  </h2>

                </div>

              </div>

              <p className="text-sm text-[#8b928b] mt-3">
                Your latest security checks
              </p>

            </div>


            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 rounded-xl bg-[#f1f5ef] text-[#47765b] hover:bg-[#e7eee4] text-sm font-semibold transition"
            >
              View Full History →
            </button>

          </div>


          {recentScans.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-[#dfe3dc] bg-[#fafbf8] p-10 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#edf3eb] flex items-center justify-center text-3xl">
                🔍
              </div>

              <h3 className="font-semibold mt-4 text-[#3b4d40]">
                No scans yet
              </h3>

              <p className="text-sm text-[#8b928b] mt-2">
                Start your first security scan to see activity here.
              </p>

              <button
                onClick={() => navigate("/scanner")}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#355c45] hover:bg-[#2d503b] text-white font-semibold text-sm transition"
              >
                Start First Scan
              </button>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {recentScans.map((scan) => (

                <div
                  key={scan._id}
                  className={`group rounded-2xl border p-4 ${getRiskBg(
                    scan.riskLevel
                  )} hover:shadow-sm transition`}
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-start gap-4 min-w-0">

                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/80 flex items-center justify-center text-lg shadow-sm">

                        {scan.inputType === "url"
                          ? "🔗"
                          : scan.inputType === "image"
                          ? "🖼️"
                          : scan.inputType === "email"
                          ? "✉️"
                          : scan.inputType === "whatsapp"
                          ? "💬"
                          : "📝"}

                      </div>


                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-[10px] uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-full text-[#7c837d]">
                            {scan.inputType}
                          </span>

                          <span
                            className={`text-sm font-bold ${getRiskColor(
                              scan.riskLevel
                            )}`}
                          >
                            {scan.riskLevel}
                          </span>

                        </div>


                        <p className="mt-2 text-sm text-[#4f5951] truncate max-w-2xl">
                          {scan.input}
                        </p>


                        <p className="text-xs text-[#929892] mt-1">
                          {new Date(
                            scan.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-5 md:pl-5">

                      <div className="text-right">

                        <p className="text-[10px] uppercase tracking-wider text-[#929892]">
                          Risk Score
                        </p>

                        <p
                          className={`text-2xl font-bold ${getRiskColor(
                            scan.riskLevel
                          )}`}
                        >
                          {scan.riskScore}
                        </p>

                      </div>

                      <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center text-[#778078] group-hover:text-[#47765b] transition">
                        →
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* SECURITY TIP */}

        <section className="mt-6 bg-[#e8f0e4] rounded-[25px] border border-[#d6e2d3] p-6">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 shrink-0 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">
              💡
            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-[#66806c]">
                Stay Safe
              </p>

              <h3 className="font-bold text-[#355c45] mt-1">
                Security Tip
              </h3>

              <p className="text-sm text-[#6e7b70] mt-2 leading-relaxed">
                Never share your OTP, password, PIN or banking
                information through suspicious links or messages.
                When something feels suspicious, scan it before
                taking action.
              </p>

            </div>

          </div>

        </section>


        {/* BOTTOM FEATURES */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pb-8">

          <div className="bg-white border border-[#e5e1d7] rounded-2xl p-5">

            <div className="text-2xl">
              ✨
            </div>

            <h3 className="font-bold mt-3">
              AI-Powered Analysis
            </h3>

            <p className="text-xs text-[#8a918a] mt-1">
              Advanced AI analyzes suspicious content.
            </p>

          </div>


          <div className="bg-white border border-[#e5e1d7] rounded-2xl p-5">

            <div className="text-2xl">
              🔐
            </div>

            <h3 className="font-bold mt-3">
              Privacy First
            </h3>

            <p className="text-xs text-[#8a918a] mt-1">
              Your security data stays protected.
            </p>

          </div>


          <div className="bg-white border border-[#e5e1d7] rounded-2xl p-5">

            <div className="text-2xl">
              🛡️
            </div>

            <h3 className="font-bold mt-3">
              Stay Alert, Stay Safe
            </h3>

            <p className="text-xs text-[#8a918a] mt-1">
              Scan before you trust suspicious content.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;