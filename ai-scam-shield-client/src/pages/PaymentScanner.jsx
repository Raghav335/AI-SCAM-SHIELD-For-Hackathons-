import { useState } from "react";

function PaymentScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a payment screenshot image.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
  };

  const scanPayment = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload a payment screenshot first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        "http://localhost:5000/api/scan/payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Payment Scan Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Payment scan failed"
        );
      }

      setResult(data.result);
    } catch (err) {
      console.error("Payment Scan Error:", err);

      setError(
        err.message || "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  const getRiskColor = (level) => {
    if (level === "Dangerous") {
      return "text-red-600";
    }

    if (level === "Suspicious") {
      return "text-amber-600";
    }

    return "text-emerald-700";
  };

  const getRiskBackground = (level) => {
    if (level === "Dangerous") {
      return "bg-red-50 border-red-200";
    }

    if (level === "Suspicious") {
      return "bg-amber-50 border-amber-200";
    }

    return "bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* PAGE */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ================= HEADER ================= */}

        <div className="mb-10">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 rounded-2xl bg-[#214d3a] flex items-center justify-center shadow-sm">
              <span className="text-2xl">
                💳
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-700">
                Security Scanner
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                AI Scam Shield
              </p>
            </div>

          </div>


          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">

            <div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d2d25]">
                Fake Payment
                <span className="text-[#214d3a]">
                  {" "}Detection
                </span>
              </h1>

              <p className="max-w-2xl mt-4 text-slate-500 text-base md:text-lg leading-relaxed">
                Upload a payment screenshot and let AI Scam Shield
                analyze visible payment details for suspicious
                indicators.
              </p>

            </div>


            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                🛡️
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Protection
                </p>

                <p className="text-sm font-semibold text-[#214d3a]">
                  AI Analysis
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* ================= MAIN GRID ================= */}

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">


          {/* ================= UPLOAD CARD ================= */}

          <div className="bg-white rounded-[28px] border border-slate-200 shadow-[0_8px_30px_rgba(31,52,42,0.05)] p-6 md:p-8">

            <div className="flex items-start justify-between gap-4 mb-7">

              <div>

                <h2 className="text-xl font-bold text-[#1d2d25]">
                  Upload Payment Screenshot
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a screenshot to begin the security analysis.
                </p>

              </div>

              <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                JPG • PNG
              </div>

            </div>


            {/* FILE INPUT */}

            <label className="block">

              <div className="group border-2 border-dashed border-slate-200 hover:border-[#214d3a] bg-[#fbfbf8] hover:bg-emerald-50/30 rounded-[24px] p-10 md:p-14 text-center cursor-pointer transition-all">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 group-hover:bg-white flex items-center justify-center text-3xl transition">
                  📤
                </div>

                <p className="text-lg font-bold mt-5 text-slate-800">
                  Click to upload screenshot
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  PNG, JPG or JPEG
                </p>

                <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#214d3a] text-white rounded-xl text-sm font-semibold group-hover:bg-[#183d2d] transition">
                  Choose Image
                  <span>→</span>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  Maximum file size: 10 MB
                </p>

              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>


            {/* SELECTED FILE */}

            {file && (

              <div className="mt-5 bg-[#f7f5ed] border border-slate-200 rounded-2xl p-4">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    🖼️
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs text-slate-400">
                      Selected File
                    </p>

                    <p className="font-semibold truncate text-sm">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </div>

                  <button
                    onClick={resetScanner}
                    className="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition"
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}


            {/* PREVIEW */}

            {preview && (

              <div className="mt-6">

                <div className="flex items-center justify-between mb-3">

                  <p className="text-sm font-semibold text-slate-700">
                    Screenshot Preview
                  </p>

                  <span className="text-xs text-slate-400">
                    Ready for analysis
                  </span>

                </div>

                <div className="bg-[#f7f5ed] rounded-2xl p-4 border border-slate-200 flex justify-center">

                  <img
                    src={preview}
                    alt="Payment screenshot preview"
                    className="max-h-[450px] max-w-full rounded-xl object-contain shadow-sm"
                  />

                </div>

              </div>

            )}


            {/* SCAN BUTTON */}

            <button
              onClick={scanPayment}
              disabled={loading || !file}
              className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition shadow-sm"
            >

              {loading
                ? "🔍 Analyzing Payment..."
                : "🛡️ Analyze Payment"}

            </button>

          </div>


          {/* ================= INFO CARD ================= */}

          <div className="space-y-6">


            {/* HOW IT WORKS */}

            <div className="bg-[#214d3a] text-white rounded-[28px] p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  🔍
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    How it works
                  </h2>

                  <p className="text-xs text-green-100">
                    Three simple steps
                  </p>
                </div>

              </div>


              <div className="mt-7 space-y-5">

                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    1
                  </div>

                  <div>
                    <p className="font-semibold">
                      Upload
                    </p>

                    <p className="text-sm text-green-100 mt-1">
                      Select your payment screenshot.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    2
                  </div>

                  <div>
                    <p className="font-semibold">
                      Analyze
                    </p>

                    <p className="text-sm text-green-100 mt-1">
                      AI checks visible payment indicators.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    3
                  </div>

                  <div>
                    <p className="font-semibold">
                      Protect
                    </p>

                    <p className="text-sm text-green-100 mt-1">
                      Get a risk score and safety recommendation.
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* SAFETY NOTICE */}

            <div className="bg-white border border-slate-200 rounded-[28px] p-7">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                  ⚠️
                </div>

                <div>

                  <h3 className="font-bold">
                    Important
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    A screenshot should not be treated as final
                    proof of payment. Always verify the actual
                    transaction through your bank or payment app.
                  </p>

                </div>

              </div>

            </div>


            {/* SUPPORTED */}

            <div className="bg-white border border-slate-200 rounded-[28px] p-7">

              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Supported
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {[
                  "Payment Screenshot",
                  "UPI",
                  "Transaction ID",
                  "Amount",
                  "Receiver",
                  "Payment Status",
                ].map((item) => (

                  <span
                    key={item}
                    className="px-3 py-2 rounded-xl bg-[#f7f5ed] text-xs font-medium text-slate-600"
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* ================= ERROR ================= */}

        {error && (

          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                ⚠️
              </div>

              <p className="text-red-600 font-semibold">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ================= RESULT ================= */}

        {result && (

          <div className="mt-8 bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">

            {/* RESULT HEADER */}

            <div className="p-6 md:p-8 border-b border-slate-100">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                    <span>●</span>
                    Analysis Complete
                  </div>

                  <h2 className="text-3xl font-bold mt-2 text-[#1d2d25]">
                    Security Result
                  </h2>

                  <p className="text-slate-500 mt-1">
                    AI Payment Screenshot Analysis
                  </p>

                </div>


                <div
                  className={`px-5 py-3 rounded-2xl border font-bold ${getRiskBackground(
                    result.riskLevel
                  )} ${getRiskColor(result.riskLevel)}`}
                >
                  {result.riskLevel}
                </div>

              </div>

            </div>


            <div className="p-6 md:p-8">


              {/* RISK SCORE */}

              <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center bg-[#f7f5ed] rounded-3xl p-6">

                <div>

                  <p className="text-sm text-slate-500">
                    Risk Score
                  </p>

                  <div className="flex items-end gap-2 mt-1">

                    <p
                      className={`text-6xl font-bold ${getRiskColor(
                        result.riskLevel
                      )}`}
                    >
                      {result.riskScore}
                    </p>

                    <p className="text-xl text-slate-400 mb-2">
                      /100
                    </p>

                  </div>

                </div>


                <div>

                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>

                  <div className="h-3 bg-white rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all ${
                        result.riskLevel === "Dangerous"
                          ? "bg-red-500"
                          : result.riskLevel === "Suspicious"
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(result.riskScore || 0, 0),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* PAYMENT DETAILS */}

              <div className="mt-8">

                <h3 className="font-bold text-lg">
                  Payment Details
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

                  <div className="bg-[#f7f5ed] rounded-2xl p-5">
                    <p className="text-xs text-slate-400 uppercase">
                      Amount
                    </p>

                    <p className="text-lg font-bold mt-2 break-words">
                      {result.amount || "Not detected"}
                    </p>
                  </div>


                  <div className="bg-[#f7f5ed] rounded-2xl p-5">
                    <p className="text-xs text-slate-400 uppercase">
                      Transaction / UTR
                    </p>

                    <p className="text-lg font-bold mt-2 break-all">
                      {result.transactionId ||
                        result.utr ||
                        "Not detected"}
                    </p>
                  </div>


                  <div className="bg-[#f7f5ed] rounded-2xl p-5">
                    <p className="text-xs text-slate-400 uppercase">
                      Receiver
                    </p>

                    <p className="text-lg font-bold mt-2 break-all">
                      {result.receiver || "Not detected"}
                    </p>
                  </div>


                  <div className="bg-[#f7f5ed] rounded-2xl p-5">
                    <p className="text-xs text-slate-400 uppercase">
                      Payment Status
                    </p>

                    <p className="text-lg font-bold mt-2">
                      {result.paymentStatus || "Not detected"}
                    </p>
                  </div>

                </div>

              </div>


              {/* SCAM TYPE */}

              <div className="mt-7">

                <p className="text-sm text-slate-400">
                  Scam Type
                </p>

                <p className="mt-2 font-bold text-lg">
                  {result.scamType || "None"}
                </p>

              </div>


              {/* EXPLANATION */}

              <div className="mt-6 bg-[#f7f5ed] rounded-2xl p-5">

                <p className="text-sm font-semibold text-slate-500">
                  Explanation
                </p>

                <p className="mt-2 text-slate-700 leading-relaxed">
                  {result.explanation}
                </p>

              </div>


              {/* RECOMMENDATION */}

              <div className="mt-4 bg-[#f7f5ed] rounded-2xl p-5">

                <p className="text-sm font-semibold text-slate-500">
                  Recommendation
                </p>

                <p className="mt-2 text-slate-700 leading-relaxed">
                  {result.recommendation}
                </p>

              </div>


              {/* RISK MESSAGE */}

              <div
                className={`mt-6 border rounded-2xl p-5 ${getRiskBackground(
                  result.riskLevel
                )}`}
              >

                {result.riskLevel === "Dangerous" && (
                  <>
                    <h3 className="font-bold text-red-600 text-lg">
                      🚨 High-Risk Payment
                    </h3>

                    <p className="text-slate-600 mt-2">
                      Do not rely on this screenshot as proof of
                      payment. Verify the transaction directly
                      through your bank or payment application.
                    </p>
                  </>
                )}


                {result.riskLevel === "Suspicious" && (
                  <>
                    <h3 className="font-bold text-amber-600 text-lg">
                      ⚠️ Suspicious Payment
                    </h3>

                    <p className="text-slate-600 mt-2">
                      The screenshot contains indicators that
                      require additional verification.
                    </p>
                  </>
                )}


                {result.riskLevel === "Safe" && (
                  <>
                    <h3 className="font-bold text-emerald-700 text-lg">
                      ✅ No Major Risk Detected
                    </h3>

                    <p className="text-slate-600 mt-2">
                      No major suspicious indicators were detected
                      in the uploaded screenshot. Always verify
                      payment status independently.
                    </p>
                  </>
                )}

              </div>


              {/* OCR TEXT */}

              {result.extractedText && (

                <div className="mt-7">

                  <p className="text-sm font-semibold text-slate-500 mb-3">
                    OCR Extracted Text
                  </p>

                  <div className="bg-[#f7f5ed] border border-slate-200 rounded-2xl p-5">

                    <p className="text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                      {result.extractedText}
                    </p>

                  </div>

                </div>

              )}


              {/* NEW SCAN */}

              <button
                onClick={resetScanner}
                className="w-full mt-7 bg-[#214d3a] hover:bg-[#183d2d] text-white py-4 rounded-2xl font-bold transition"
              >
                🔄 Scan Another Payment
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default PaymentScanner;