import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QRCodeScanner() {
  const scannerRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // START CAMERA
  // =========================
  const startScanner = async () => {
    setError("");
    setResult(null);
    setQrData("");

    try {
      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          setQrData(decodedText);

          try {
            await scanner.stop();
            scanner.clear();
          } catch (err) {
            console.log("Scanner stop error:", err);
          }

          scannerRef.current = null;
          setIsScanning(false);

          await checkQRCode(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera Error:", err);

      setError(
        "Camera start nahi ho paaya. Browser me camera permission allow karo."
      );
    }
  };

  // =========================
  // STOP CAMERA
  // =========================
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.log("Stop scanner error:", err);
      }

      scannerRef.current = null;
    }

    setIsScanning(false);
  };

  // =========================
  // UPLOAD QR IMAGE
  // =========================
  const uploadQRCode = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setError("");
    setResult(null);
    setQrData("");
    setLoading(true);

    try {
      const scanner = new Html5Qrcode("qr-file-reader");

      const decodedText = await scanner.scanFile(file, true);

      await scanner.clear();

      console.log("QR Data:", decodedText);

      setQrData(decodedText);

      await checkQRCode(decodedText);
    } catch (err) {
      console.error("QR Image Error:", err);

      setError(
        "QR code detect nahi hua. Clear QR image upload karo."
      );

      setLoading(false);
    }

    event.target.value = "";
  };

  // =========================
  // CHECK QR CONTENT
  // =========================
  const checkQRCode = async (data) => {
    if (!data) {
      setError("QR code empty hai.");
      setLoading(false);
      return;
    }

    setQrData(data);

    const isURL =
      data.startsWith("http://") ||
      data.startsWith("https://");

    // QR contains normal text
    if (!isURL) {
      setResult({
        type: "text",
        message: data,
      });

      setLoading(false);
      return;
    }

    // QR contains URL
    await scanURL(data);
  };

  // =========================
  // SCAN URL WITH BACKEND
  // =========================
  const scanURL = async (url) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("Sending URL to backend:", url);

      const response = await fetch(
        "http://localhost:5000/api/scan/url",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            url: url,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend QR Response:", data);

      // =========================
      // ANALYSIS STILL RUNNING
      // =========================
      if (response.status === 202) {
        setResult({
          type: "pending",
          message:
            data.message ||
            "Security analysis is still in progress.",
        });

        return;
      }

      // =========================
      // BACKEND ERROR
      // =========================
      if (!response.ok) {
        throw new Error(
          data.message || "URL scan failed"
        );
      }

      // =========================
      // NO RESULT
      // =========================
      if (!data.result) {
        throw new Error(
          "Security result server se receive nahi hua."
        );
      }

      // =========================
      // FINAL RESULT
      // =========================
      setResult({
        type: "url",

        url: data.result.url || url,

        riskScore:
          data.result.riskScore ?? 0,

        riskLevel:
          data.result.riskLevel || "Safe",

        scamType:
          data.result.scamType || "None",

        explanation:
          data.result.explanation ||
          "No explanation available.",

        recommendation:
          data.result.recommendation ||
          "Remain cautious while opening unknown links.",

        malicious:
          data.result.malicious ?? 0,

        suspicious:
          data.result.suspicious ?? 0,

        harmless:
          data.result.harmless ?? 0,
      });
    } catch (err) {
      console.error("QR URL Scan Error:", err);

      setError(
        err.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const resetScanner = () => {
    setQrData("");
    setResult(null);
    setError("");
    setLoading(false);
  };

  // =========================
  // RISK COLOR
  // =========================
  const getRiskColor = (level) => {
    if (level === "Dangerous") {
      return "text-red-600";
    }

    if (level === "Suspicious") {
      return "text-amber-600";
    }

    return "text-emerald-700";
  };

  const getRiskBg = (level) => {
    if (level === "Dangerous") {
      return "bg-red-50 border-red-100";
    }

    if (level === "Suspicious") {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

  const getRiskRing = (level) => {
    if (level === "Dangerous") {
      return "border-red-200";
    }

    if (level === "Suspicious") {
      return "border-amber-200";
    }

    return "border-emerald-200";
  };

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">
      {/* HEADER */}
      <header className="border-b border-green-900/10 bg-[#f7f5ed]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-green-900/10 shadow-sm flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Scam Shield</h1>
              <p className="text-xs text-slate-500">Don't trust it. Scan it.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-green-50 transition"
            aria-label="Go back"
          >
            ←
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* INTRO */}
        <div className="mb-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">
            <span>▦</span>
            <span>QR CODE SCANNER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Scan a QR Code Safely
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Scan using your camera or upload a QR screenshot to check its
            destination for possible threats.
          </p>
        </div>

        {/* SCANNER OPTIONS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* CAMERA */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                📷
              </div>
              <div>
                <h3 className="text-xl font-bold">Camera Scanner</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Scan a QR code directly with your camera.
                </p>
              </div>
            </div>

            <div
              id="qr-reader"
              className="mt-6 rounded-2xl overflow-hidden bg-[#fbfaf5] min-h-[260px] border border-slate-100"
            />

            {!isScanning ? (
              <button
                onClick={startScanner}
                className="w-full mt-5 bg-[#214d3a] hover:bg-[#183d2d] text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                📷 Start Camera
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="w-full mt-5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 py-4 rounded-2xl font-semibold transition"
              >
                ⛔ Stop Camera
              </button>
            )}
          </div>

          {/* UPLOAD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                📤
              </div>
              <div>
                <h3 className="text-xl font-bold">Upload QR Image</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Upload a screenshot or QR image.
                </p>
              </div>
            </div>

            <label className="block mt-6 cursor-pointer">
              <div className="min-h-[260px] rounded-2xl border-2 border-dashed border-green-900/15 bg-[#fbfaf5] flex flex-col items-center justify-center p-8 text-center hover:border-green-700/30 hover:bg-green-50/30 transition">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
                  ▦
                </div>
                <p className="font-bold mt-4">Click to Upload QR</p>
                <p className="text-slate-500 text-sm mt-2">
                  PNG, JPG, JPEG
                </p>
                <span className="mt-4 text-xs text-slate-400">
                  Clear QR images give better results
                </span>
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={uploadQRCode}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Hidden QR file scanner */}
        <div id="qr-file-reader" className="hidden" />

        {/* ERROR */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              ⚠️
            </div>
            <div>
              <p className="font-semibold text-red-700">Scan failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* QR DATA */}
        {qrData && (
          <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              QR Code Content
            </p>
            <div className="mt-2 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4">
              <p className="break-all text-sm text-slate-700 leading-relaxed">
                {qrData}
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-50 mx-auto flex items-center justify-center text-3xl animate-pulse">
              🛡️
            </div>
            <h3 className="text-xl font-bold mt-5">Scanning QR...</h3>
            <p className="text-slate-500 mt-2">
              Checking the QR destination for threats.
            </p>
          </div>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div className="mt-8">
            {/* PENDING */}
            {result.type === "pending" && (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center text-3xl">
                  ⏳
                </div>
                <h2 className="text-2xl font-bold mt-5">
                  Security Analysis In Progress
                </h2>
                <p className="text-slate-500 mt-3">{result.message}</p>
                <p className="text-slate-400 text-sm mt-2">
                  VirusTotal is still checking the QR destination.
                </p>
                <button
                  onClick={() => scanURL(qrData)}
                  className="mt-6 px-6 py-3 bg-[#214d3a] hover:bg-[#183d2d] text-white rounded-xl font-semibold"
                >
                  🔄 Check Again
                </button>
              </div>
            )}

            {/* TEXT QR */}
            {result.type === "text" && (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                    ℹ️
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">QR Contains Text</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      No web URL was found in this QR code.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5">
                  <p className="text-slate-700 break-all leading-relaxed">
                    {result.message}
                  </p>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-sm text-amber-700">
                    This QR code does not contain a web URL, so VirusTotal URL
                    scanning was not performed.
                  </p>
                </div>
              </div>
            )}

            {/* URL RESULT */}
            {result.type === "url" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      SCAN RESULT
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                      QR Security Analysis
                    </h2>
                  </div>

                  <div
                    className={`w-fit px-4 py-2 rounded-xl border font-bold text-sm ${getRiskBg(
                      result.riskLevel
                    )} ${getRiskColor(result.riskLevel)}`}
                  >
                    {result.riskLevel}
                  </div>
                </div>

                <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
                  {/* SCORE */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <p className="text-sm text-slate-400 uppercase tracking-wide">
                      Risk Score
                    </p>

                    <div className="flex justify-center py-7">
                      <div
                        className={`w-48 h-48 rounded-full border-[14px] ${getRiskRing(
                          result.riskLevel
                        )} flex flex-col items-center justify-center`}
                      >
                        <span
                          className={`text-5xl font-bold ${getRiskColor(
                            result.riskLevel
                          )}`}
                        >
                          {result.riskScore}
                        </span>
                        <span className="text-sm text-slate-400 font-medium">
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

                    <div className="mt-4 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Scam Type
                      </p>
                      <p className="font-bold text-slate-800 mt-1">
                        {result.scamType}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div className="rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Scanned URL
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700 break-all leading-relaxed">
                        {result.url}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold">Security Engine Results</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Threat classification summary
                          </p>
                        </div>
                        <span className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                          🔍
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 mt-4">
                        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                          <p className="text-xs text-red-500 font-semibold">
                            MALICIOUS
                          </p>
                          <p className="text-2xl font-bold text-red-600 mt-1">
                            {result.malicious}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                          <p className="text-xs text-amber-600 font-semibold">
                            SUSPICIOUS
                          </p>
                          <p className="text-2xl font-bold text-amber-600 mt-1">
                            {result.suspicious}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                          <p className="text-xs text-emerald-600 font-semibold">
                            HARMLESS
                          </p>
                          <p className="text-2xl font-bold text-emerald-700 mt-1">
                            {result.harmless}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          ✦
                        </span>
                        <p className="font-bold">Explanation</p>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[#edf3eb] border border-green-900/5 p-5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          🛡️
                        </span>
                        <p className="font-bold">Recommendation</p>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {result.riskLevel === "Dangerous" && (
                  <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
                    <h3 className="font-bold text-red-700 text-lg">
                      🚨 Dangerous QR Code
                    </h3>
                    <p className="text-sm text-red-700/80 mt-2 leading-relaxed">
                      Do not open this URL. Do not enter passwords, OTPs,
                      banking details or personal information.
                    </p>
                  </div>
                )}

                {result.riskLevel === "Suspicious" && (
                  <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <h3 className="font-bold text-amber-700 text-lg">
                      ⚠️ Suspicious QR Code
                    </h3>
                    <p className="text-sm text-amber-700/80 mt-2 leading-relaxed">
                      Verify the website carefully before entering any
                      sensitive information.
                    </p>
                  </div>
                )}

                {result.riskLevel === "Safe" && (
                  <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                    <h3 className="font-bold text-emerald-700 text-lg">
                      ✅ QR Appears Safe
                    </h3>
                    <p className="text-sm text-emerald-700/80 mt-2 leading-relaxed">
                      No major threat was detected by the available security
                      engines.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* RESET */}
        {(qrData || result || error) && !loading && (
          <button
            onClick={resetScanner}
            className="w-full mt-6 bg-white border border-slate-200 hover:bg-green-50 py-3.5 rounded-2xl text-slate-700 font-semibold transition"
          >
            🔄 Scan Another QR
          </button>
        )}
      </main>
    </div>
  );
}

export default QRCodeScanner;