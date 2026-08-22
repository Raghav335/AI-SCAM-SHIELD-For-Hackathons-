import { useState } from "react";

function ReportScam() {
  const [form, setForm] = useState({
    reportType: "Message",
    scammerName: "",
    scammerContact: "",
    suspiciousUrl: "",
    amountLost: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitReport = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.description.trim()) {
      setError("Please describe the scam.");
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
        "http://localhost:5000/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Report failed");
      }

      setSuccess("✅ Scam report submitted successfully.");

      setForm({
        reportType: "Message",
        scammerName: "",
        scammerContact: "",
        suspiciousUrl: "",
        amountLost: "",
        description: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HEADER */}
      <header className="border-b border-green-900/10 bg-[#f7f5ed]/95">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white border border-green-900/10 shadow-sm flex items-center justify-center text-2xl">
              🛡️
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

          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
            🚨
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8">

        {/* TITLE */}
        <div className="mb-7">

          <div className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-2">
            <span>🚨</span>
            <span>SCAM REPORT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Report a Scam
          </h2>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Help document suspicious activity by providing the details of
            the incident.
          </p>

        </div>

        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-6">

          {/* INFO PANEL */}
          <div className="bg-[#214d3a] rounded-3xl p-7 text-white shadow-sm h-fit">

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              🚨
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Help Stop Scams
            </h3>

            <p className="text-green-50/75 mt-3 leading-relaxed">
              Reporting scam incidents helps create awareness and can help
              identify suspicious patterns.
            </p>

            <div className="mt-7 space-y-3">

              <div className="flex gap-3 items-start bg-white/10 rounded-2xl p-4 border border-white/10">
                <span>🔒</span>

                <div>
                  <p className="font-semibold text-sm">
                    Protect your information
                  </p>

                  <p className="text-xs text-green-50/60 mt-1">
                    Never share passwords, OTPs or sensitive banking details.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-white/10 rounded-2xl p-4 border border-white/10">
                <span>🔗</span>

                <div>
                  <p className="font-semibold text-sm">
                    Include suspicious links
                  </p>

                  <p className="text-xs text-green-50/60 mt-1">
                    Add the URL if the scam involved a suspicious website.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-white/10 rounded-2xl p-4 border border-white/10">
                <span>📝</span>

                <div>
                  <p className="font-semibold text-sm">
                    Describe what happened
                  </p>

                  <p className="text-xs text-green-50/60 mt-1">
                    Clear details make the report more useful.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={submitReport}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >

            <div className="mb-7">

              <h3 className="text-xl font-bold">
                Incident Details
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Tell us what happened.
              </p>

            </div>

            {/* REPORT TYPE */}
            <div>

              <label className="text-sm font-semibold text-slate-700">
                Report Type
              </label>

              <select
                name="reportType"
                value={form.reportType}
                onChange={handleChange}
                className="w-full mt-2 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:border-green-700/30 focus:ring-4 focus:ring-green-100/60 transition"
              >
                <option>Message</option>
                <option>URL</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>Payment</option>
                <option>Phone</option>
                <option>Other</option>
              </select>

            </div>

            {/* NAME + CONTACT */}
            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Scammer Name
                </label>

                <div className="mt-2 flex items-center gap-3 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

                  <span className="text-slate-400">
                    👤
                  </span>

                  <input
                    name="scammerName"
                    value={form.scammerName}
                    onChange={handleChange}
                    placeholder="Name if known"
                    className="w-full bg-transparent py-3.5 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Contact
                </label>

                <div className="mt-2 flex items-center gap-3 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

                  <span className="text-slate-400">
                    📞
                  </span>

                  <input
                    name="scammerContact"
                    value={form.scammerContact}
                    onChange={handleChange}
                    placeholder="Phone / Email"
                    className="w-full bg-transparent py-3.5 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

            </div>

            {/* URL */}
            <div className="mt-5">

              <label className="text-sm font-semibold text-slate-700">
                Suspicious URL
              </label>

              <div className="mt-2 flex items-center gap-3 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

                <span className="text-slate-400">
                  🔗
                </span>

                <input
                  name="suspiciousUrl"
                  value={form.suspiciousUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-transparent py-3.5 outline-none placeholder:text-slate-400"
                />

              </div>

            </div>

            {/* AMOUNT */}
            <div className="mt-5">

              <label className="text-sm font-semibold text-slate-700">
                Amount Lost
              </label>

              <div className="mt-2 flex items-center gap-3 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 focus-within:border-green-700/30 focus-within:ring-4 focus-within:ring-green-100/60 transition">

                <span className="text-slate-400">
                  ₹
                </span>

                <input
                  name="amountLost"
                  value={form.amountLost}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-transparent py-3.5 outline-none placeholder:text-slate-400"
                />

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">

              <label className="text-sm font-semibold text-slate-700">
                Describe the Scam
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={7}
                placeholder="Explain what happened..."
                className="w-full mt-2 bg-[#fbfaf5] border border-slate-200 rounded-2xl px-4 py-3.5 outline-none resize-none focus:border-green-700/30 focus:ring-4 focus:ring-green-100/60 transition placeholder:text-slate-400"
              />

            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">

                <span className="text-lg">
                  ⚠️
                </span>

                <p className="text-sm text-red-700 font-medium">
                  {error}
                </p>

              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">

                <span className="text-lg">
                  ✅
                </span>

                <p className="text-sm text-emerald-700 font-medium">
                  {success}
                </p>

              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">
                    ⏳
                  </span>
                  Submitting...
                </>
              ) : (
                <>
                  🚨
                  Submit Scam Report
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">
              Please provide accurate information. Do not include passwords,
              OTPs or other sensitive credentials.
            </p>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ReportScam;