import { useState } from "react";

function ImageScanner() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    console.log("Selected image:", file);
    console.log("File name:", file.name);
    console.log("File type:", file.type);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const scanImage = async () => {
    setError("");
    setResult(null);

    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const formData = new FormData();

    // IMPORTANT: backend multer field name = image
    formData.append("image", image);

    console.log("Sending image:", image);
    console.log("FormData image:", formData.get("image"));

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/scan/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Image Scan Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Image scan failed");
      }

      setResult(data.result);
    } catch (err) {
      console.error("Image Scan Error:", err);

      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
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

  const getRiskBg = (level) => {
    if (level === "Dangerous") {
      return "bg-red-50 border-red-100";
    }

    if (level === "Suspicious") {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

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
              <h1 className="font-bold text-lg text-slate-800">
                AI Scam Shield
              </h1>
              <p className="text-xs text-slate-500">
                Don't trust it. Scan it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-green-50 transition"
              aria-label="Go back"
            >
              ←
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* PAGE INTRO */}
        <div className="mb-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">
            <span>🖼️</span>
            <span>IMAGE / SCREENSHOT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Analyze an Image
          </h2>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Upload a suspicious screenshot or image and let AI analyze it for
            possible scam indicators.
          </p>
        </div>

        {/* UPLOAD AREA */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Upload Screenshot
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  JPG, PNG, WebP and other image formats
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                🖼️
              </div>
            </div>

            <label
              htmlFor="image-upload"
              className="group block cursor-pointer"
            >
              <div className="min-h-[300px] rounded-2xl border-2 border-dashed border-green-900/15 bg-[#fbfaf5] flex flex-col items-center justify-center p-6 text-center hover:border-green-700/30 hover:bg-green-50/30 transition">
                {preview ? (
                  <div className="w-full flex flex-col items-center">
                    <img
                      src={preview}
                      alt="Selected"
                      className="max-h-64 max-w-full rounded-xl object-contain shadow-sm"
                    />

                    <div className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-600">
                      Click to change image
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition">
                      ☁️
                    </div>

                    <h4 className="font-bold text-slate-800">
                      Tap to upload
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      or drag and drop
                    </p>

                    <span className="mt-4 text-xs text-slate-400">
                      JPG, PNG, WebP
                    </span>
                  </>
                )}
              </div>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {image && (
              <div className="mt-4 rounded-2xl bg-green-50/70 border border-green-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  ✓
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800">
                    Image selected
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {image.name} · {Math.round(image.size / 1024)} KB
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={scanImage}
              disabled={loading}
              className="w-full mt-5 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">◌</span>
                  Analyzing Image...
                </>
              ) : (
                <>
                  <span>🛡️</span>
                  Scan Image
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {/* TIPS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                ✨
              </div>

              <div>
                <h3 className="font-bold text-lg">Tips for better results</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Help AI understand the screenshot
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "Upload a clear and original image",
                "Make sure important details are visible",
                "Avoid heavily cropped screenshots",
                "Your uploaded image is analyzed securely",
              ].map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#edf3eb] border border-green-900/5 p-4">
              <p className="text-sm font-semibold text-green-900">
                🔒 Privacy First
              </p>
              <p className="text-xs text-green-800/70 mt-1 leading-relaxed">
                We value your privacy. Upload only images you are comfortable
                analyzing.
              </p>
            </div>
          </div>
        </div>

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

        {/* RESULT */}
        {result && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-green-700">
                  SCAN RESULT
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  Analysis Details
                </h2>
              </div>

              <button
                type="button"
                onClick={resetScanner}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold hover:bg-green-50 transition"
              >
                New Scan
              </button>
            </div>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
              {/* SCORE CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-center py-3">
                  <div
                    className={`w-48 h-48 rounded-full border-[14px] flex flex-col items-center justify-center ${
                      result.riskLevel === "Dangerous"
                        ? "border-red-200"
                        : result.riskLevel === "Suspicious"
                        ? "border-amber-200"
                        : "border-emerald-200"
                    }`}
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
                  className={`mt-4 rounded-2xl border p-4 text-center ${getRiskBg(
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

                <div className="mt-5 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Scam Type
                  </p>
                  <p className="font-bold text-slate-800 mt-1">
                    {result.scamType}
                  </p>
                </div>
              </div>

              {/* DETAILS CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                {preview && (
                  <div className="mb-5 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-3">
                    <img
                      src={preview}
                      alt="Scanned"
                      className="w-full max-h-60 object-contain rounded-xl"
                    />
                  </div>
                )}

                {result.extractedText && (
                  <div className="mb-5">
                    <p className="text-sm font-bold text-slate-800">
                      Extracted Text
                    </p>
                    <div className="mt-2 bg-[#fbfaf5] rounded-2xl p-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed border border-slate-100">
                      {result.extractedText}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      ✦
                    </span>
                    <p className="font-bold text-slate-800">AI Analysis</p>
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
                    <p className="font-bold text-slate-800">
                      Recommendation
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESET */}
        {(result || error) && (
          <button
            onClick={resetScanner}
            className="w-full mt-6 bg-white border border-slate-200 hover:bg-green-50 py-3.5 rounded-2xl text-slate-700 font-semibold transition"
          >
            🔄 Scan Another Image
          </button>
        )}
      </main>
    </div>
  );
}

export default ImageScanner;