import { useState } from "react";

function DeepfakeScanner() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please select JPG, PNG or WEBP image"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(
        "Image size must be less than 10MB"
      );
      return;
    }

    setImage(file);
    setResult(null);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const handleScan = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append(
        "image",
        image
      );

      const response = await fetch(
        "http://localhost:5000/api/scan/deepfake",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Deepfake scan failed"
        );
        return;
      }

      setResult(data.result);

    } catch (error) {
      console.error(
        "Deepfake Scan Error:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (
      status ===
      "Highly Suspicious"
    ) {
      return "text-red-600";
    }

    if (
      status ===
      "Likely Manipulated"
    ) {
      return "text-orange-600";
    }

    if (
      status === "Suspicious"
    ) {
      return "text-amber-600";
    }

    return "text-emerald-700";
  };

  const getStatusBg = (status) => {
    if (
      status ===
      "Highly Suspicious"
    ) {
      return "bg-red-50 border-red-100";
    }

    if (
      status ===
      "Likely Manipulated"
    ) {
      return "bg-orange-50 border-orange-100";
    }

    if (
      status === "Suspicious"
    ) {
      return "bg-amber-50 border-amber-100";
    }

    return "bg-emerald-50 border-emerald-100";
  };

  const getValue = (
    value,
    fallback = "Not available"
  ) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    return value;
  };

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
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-green-50 transition"
          >
            ←
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

        {/* INTRO */}

        <div className="mb-7">

          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">

            <span>🧠</span>

            <span>
              DEEPFAKE DETECTOR
            </span>

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Detect Manipulated Images
          </h2>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Upload an image and let AI Scam Shield
            analyze it for possible AI generation,
            manipulation and deepfake indicators.
          </p>

        </div>


        {/* UPLOAD */}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                🧠
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Upload Image
                </h3>

                <p className="text-sm text-slate-500">
                  Analyze before you trust
                </p>

              </div>

            </div>


            <label
              htmlFor="deepfake-image"
              className="block cursor-pointer border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-green-600 hover:bg-green-50/30 transition"
            >

              <div className="text-5xl mb-4">
                📷
              </div>

              <p className="font-semibold">
                Click to select an image
              </p>

              <p className="text-sm text-slate-400 mt-2">
                JPG, PNG or WEBP • Max 10MB
              </p>

            </label>

            <input
              id="deepfake-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />


            {image && (
              <div className="mt-5">

                <div className="flex items-center justify-between mb-3">

                  <p className="font-semibold">
                    Selected Image
                  </p>

                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                      setResult(null);
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">

                  <img
                    src={preview}
                    alt="Selected"
                    className="w-full max-h-80 object-contain"
                  />

                </div>

                <p className="text-xs text-slate-400 mt-2 break-all">
                  {image.name}
                </p>

              </div>
            )}


            <button
              onClick={handleScan}
              disabled={
                loading || !image
              }
              className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition"
            >

              {loading
                ? "Analyzing Image..."
                : "🧠 Analyze Image"}

            </button>

          </div>


          {/* INFORMATION CARD */}

          <div className="bg-[#edf3eb] rounded-3xl border border-green-900/5 p-6">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl mb-5">
              🔍
            </div>

            <h3 className="text-xl font-bold">
              What does AI Scam Shield check?
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              The system looks for visual indicators
              that may suggest image manipulation or
              AI generation.
            </p>

            <div className="mt-6 space-y-3">

              {[
                "Facial inconsistencies",
                "AI-generated visual artifacts",
                "Lighting and shadow mismatch",
                "Face and background distortions",
                "Texture and compression anomalies",
              ].map((item) => (

                <div
                  key={item}
                  className="flex gap-3 items-start bg-white/70 rounded-2xl p-4"
                >

                  <span className="text-green-700">
                    ✓
                  </span>

                  <p className="text-sm text-slate-600">
                    {item}
                  </p>

                </div>

              ))}

            </div>

            <div className="mt-5 p-4 bg-white/70 rounded-2xl">

              <p className="text-xs text-slate-500 leading-relaxed">
                ⚠️ This analysis is an AI-based
                assessment and cannot guarantee that
                an image is authentic or fake.
              </p>

            </div>

          </div>

        </div>


        {/* RESULT */}

        {result && (

          <div className="mt-8">

            <div className="mb-5">

              <p className="text-sm font-semibold text-green-700">
                ANALYSIS RESULT
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                Deepfake Analysis
              </h2>

            </div>


            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">


              {/* SCORE */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

                <p className="text-sm text-slate-400 uppercase tracking-wide">
                  Risk Score
                </p>

                <div className="flex justify-center py-8">

                  <div
                    className={`w-48 h-48 rounded-full border-[14px] flex flex-col items-center justify-center ${
                      result.riskScore >= 81
                        ? "border-red-200"
                        : result.riskScore >= 61
                        ? "border-orange-200"
                        : result.riskScore >= 31
                        ? "border-amber-200"
                        : "border-emerald-200"
                    }`}
                  >

                    <span
                      className={`text-5xl font-bold ${
                        result.riskScore >= 81
                          ? "text-red-600"
                          : result.riskScore >= 61
                          ? "text-orange-600"
                          : result.riskScore >= 31
                          ? "text-amber-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {result.riskScore}
                    </span>

                    <span className="text-sm text-slate-400">
                      /100
                    </span>

                  </div>

                </div>


                <div
                  className={`rounded-2xl border p-4 text-center ${getStatusBg(
                    result.status
                  )}`}
                >

                  <p
                    className={`font-bold ${getStatusColor(
                      result.status
                    )}`}
                  >
                    {getValue(
                      result.status
                    )}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Deepfake risk assessment
                  </p>

                </div>


                <div className="mt-4 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-4">

                  <p className="text-xs text-slate-400 uppercase">
                    Confidence
                  </p>

                  <p className="font-bold mt-1">
                    {getValue(
                      result.confidence
                    )}
                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">


                {/* PROBABILITIES */}

                <h3 className="font-bold text-lg">
                  Detection Assessment
                </h3>

                <div className="grid sm:grid-cols-3 gap-3 mt-4">

                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4">

                    <p className="text-xs text-red-500 font-semibold">
                      DEEPFAKE
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {getValue(
                        result.deepfakeProbability,
                        0
                      )}%
                    </p>

                  </div>


                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">

                    <p className="text-xs text-orange-600 font-semibold">
                      MANIPULATION
                    </p>

                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {getValue(
                        result.manipulationProbability,
                        0
                      )}%
                    </p>

                  </div>


                  <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">

                    <p className="text-xs text-purple-600 font-semibold">
                      AI GENERATED
                    </p>

                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {getValue(
                        result.aiGeneratedProbability,
                        0
                      )}%
                    </p>

                  </div>

                </div>


                {/* INDICATORS */}

                <div className="mt-6">

                  <h3 className="font-bold">
                    Detected Indicators
                  </h3>

                  {result.indicators?.length > 0 ? (

                    <div className="mt-3 space-y-2">

                      {result.indicators.map(
                        (indicator, index) => (

                          <div
                            key={index}
                            className="flex gap-3 items-start rounded-xl bg-[#fbfaf5] border border-slate-100 p-3"
                          >

                            <span>
                              ⚠️
                            </span>

                            <p className="text-sm text-slate-600">
                              {indicator}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-slate-500 mt-3">
                      No significant visual indicators
                      were detected.
                    </p>

                  )}

                </div>


                {/* EXPLANATION */}

                <div className="mt-6 rounded-2xl bg-[#fbfaf5] border border-slate-100 p-5">

                  <div className="flex items-center gap-2">

                    <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      ✦
                    </span>

                    <p className="font-bold">
                      Explanation
                    </p>

                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {getValue(
                      result.explanation
                    )}
                  </p>

                </div>


                {/* RECOMMENDATION */}

                <div className="mt-4 rounded-2xl bg-[#edf3eb] border border-green-900/5 p-5">

                  <div className="flex items-center gap-2">

                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      🛡️
                    </span>

                    <p className="font-bold">
                      Recommendation
                    </p>

                  </div>

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

export default DeepfakeScanner;