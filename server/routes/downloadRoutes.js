import { useState } from "react";

function SecureDownload() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generateHash = async (selectedFile) => {
    const buffer = await selectedFile.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      buffer
    );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setResult(null);
    setHash("");
    setFile(selectedFile);

    try {
      const generatedHash = await generateHash(
        selectedFile
      );

      setHash(generatedHash);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze file.");
    }
  };

  const scanFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    setError("");
    setResult(null);
    setScanning(true);

    try {
      /*
       * DEMO SECURITY ANALYSIS
       *
       * Later this will be connected to the backend
       * and MongoDB.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );

      const extension =
        file.name.split(".").pop()?.toLowerCase();

      const dangerousExtensions = [
        "exe",
        "bat",
        "cmd",
        "scr",
        "vbs",
        "ps1",
      ];

      const isSuspicious =
        dangerousExtensions.includes(extension);

      setResult({
        riskLevel: isSuspicious
          ? "Suspicious"
          : "Safe",

        riskScore: isSuspicious ? 72 : 8,

        fileName: file.name,

        fileType:
          extension?.toUpperCase() || "Unknown",

        fileSize: (
          file.size /
          1024 /
          1024
        ).toFixed(2),

        hash,

        checks: {
          fileType: !isSuspicious,
          integrity: true,
          source: true,
        },

        recommendation: isSuspicious
          ? "Verify the source before opening this file."
          : "No major indicators detected. Continue with caution.",
      });
    } catch (err) {
      console.error(err);

      setError(
        "Unable to complete security analysis."
      );
    } finally {
      setScanning(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setHash("");
    setResult(null);
    setError("");
  };

  const downloadFile = () => {
    if (!file) return;

    if (
      result?.riskLevel === "Suspicious"
    ) {
      const confirmed = window.confirm(
        "⚠️ This file has suspicious indicators. Do you want to continue?"
      );

      if (!confirmed) return;
    }

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800">

      {/* HEADER */}

      <header className="border-b border-green-900/10 bg-[#f7f5ed]">

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5">

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

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

        {/* TITLE */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#214d3a] text-3xl shadow-sm">
            🛡️
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mt-5">
            Secure Download Shield
          </h2>

          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Analyze a file before opening it. AI Scam Shield
            checks the file type, integrity and security
            indicators before download.
          </p>

        </div>


        {/* SHIELD STATUS */}

        <div className="bg-[#214d3a] rounded-3xl p-6 text-white mb-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              🔐
            </div>

            <div>

              <p className="text-green-50/70 text-sm">
                Protection Status
              </p>

              <h3 className="text-xl font-bold mt-1">
                Secure Download Shield
              </h3>

            </div>

            <div className="ml-auto">

              <span className="px-4 py-2 rounded-full bg-emerald-400/20 text-emerald-200 text-sm font-semibold">
                ● Active
              </span>

            </div>

          </div>

        </div>


        {/* UPLOAD CARD */}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">

          <h3 className="text-xl font-bold">
            Select a File
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Choose the file you want to analyze before opening.
          </p>


          {/* DROP AREA */}

          <label className="block mt-6 cursor-pointer">

            <div className="border-2 border-dashed border-slate-300 hover:border-green-700 rounded-3xl p-10 text-center transition">

              <div className="text-5xl">
                📁
              </div>

              <p className="font-semibold mt-4">
                Choose a file to scan
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Documents, images, installers and other files
              </p>

              <div className="inline-block mt-5 px-5 py-2.5 bg-[#214d3a] text-white rounded-xl font-semibold">
                Select File
              </div>

            </div>

            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>


          {/* FILE INFO */}

          {file && (

            <div className="mt-6 bg-[#fbfaf5] border border-slate-200 rounded-2xl p-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl border border-slate-200">
                  📄
                </div>

                <div className="min-w-0">

                  <p className="font-semibold break-all">
                    {file.name}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>

                </div>

              </div>

              {hash && (

                <div className="mt-5">

                  <p className="text-xs font-semibold text-slate-500">
                    SHA-256 FILE HASH
                  </p>

                  <div className="mt-2 bg-white border border-slate-200 rounded-xl p-3">

                    <p className="text-xs text-slate-500 break-all font-mono">
                      {hash}
                    </p>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-4">

              <p className="text-sm text-red-700 font-medium">
                ⚠️ {error}
              </p>

            </div>

          )}


          {/* SCAN BUTTON */}

          <button
            onClick={scanFile}
            disabled={!file || scanning}
            className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition"
          >

            {scanning
              ? "🔍 Analyzing File..."
              : "🛡️ Analyze File Security"}

          </button>

        </div>


        {/* RESULT */}

        {result && (

          <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">

            <div className="flex flex-wrap justify-between items-center gap-4">

              <div>

                <p className="text-sm text-slate-500">
                  Security Analysis
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  Scan Result
                </h3>

              </div>


              <div
                className={`px-5 py-3 rounded-xl font-bold ${
                  result.riskLevel === "Safe"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >

                {result.riskLevel === "Safe"
                  ? "✓ SAFE"
                  : "⚠ SUSPICIOUS"}

              </div>

            </div>


            {/* SCORE */}

            <div className="mt-8">

              <p className="text-sm text-slate-500">
                Risk Score
              </p>

              <div className="flex items-end gap-2 mt-1">

                <span
                  className={`text-6xl font-bold ${
                    result.riskLevel === "Safe"
                      ? "text-emerald-600"
                      : "text-yellow-600"
                  }`}
                >
                  {result.riskScore}
                </span>

                <span className="text-xl text-slate-400 mb-2">
                  /100
                </span>

              </div>

            </div>


            {/* SECURITY CHECKS */}

            <div className="mt-8">

              <h4 className="font-bold">
                Security Checks
              </h4>

              <div className="grid sm:grid-cols-3 gap-3 mt-4">

                <div className="bg-[#fbfaf5] rounded-2xl p-4">

                  <p className="text-sm text-slate-500">
                    File Type
                  </p>

                  <p className="font-semibold mt-2">
                    {result.checks.fileType
                      ? "✓ Verified"
                      : "⚠ Review"}
                  </p>

                </div>


                <div className="bg-[#fbfaf5] rounded-2xl p-4">

                  <p className="text-sm text-slate-500">
                    Integrity
                  </p>

                  <p className="font-semibold mt-2">
                    ✓ Checked
                  </p>

                </div>


                <div className="bg-[#fbfaf5] rounded-2xl p-4">

                  <p className="text-sm text-slate-500">
                    Source
                  </p>

                  <p className="font-semibold mt-2">
                    ✓ Analyzed
                  </p>

                </div>

              </div>

            </div>


            {/* FILE DETAILS */}

            <div className="mt-8">

              <h4 className="font-bold">
                File Details
              </h4>

              <div className="mt-4 space-y-3">

                <div className="flex justify-between gap-4 py-3 border-b border-slate-100">

                  <span className="text-slate-500">
                    File Name
                  </span>

                  <span className="font-medium break-all text-right">
                    {result.fileName}
                  </span>

                </div>

                <div className="flex justify-between gap-4 py-3 border-b border-slate-100">

                  <span className="text-slate-500">
                    File Type
                  </span>

                  <span className="font-medium">
                    {result.fileType}
                  </span>

                </div>

                <div className="flex justify-between gap-4 py-3">

                  <span className="text-slate-500">
                    File Size
                  </span>

                  <span className="font-medium">
                    {result.fileSize} MB
                  </span>

                </div>

              </div>

            </div>


            {/* RECOMMENDATION */}

            <div
              className={`mt-6 rounded-2xl p-5 ${
                result.riskLevel === "Safe"
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-yellow-50 border border-yellow-100"
              }`}
            >

              <p className="font-bold">
                {result.riskLevel === "Safe"
                  ? "✅ File appears safe"
                  : "⚠️ Review before opening"}
              </p>

              <p className="text-sm text-slate-600 mt-2">
                {result.recommendation}
              </p>

            </div>


            {/* ACTIONS */}

            <div className="grid sm:grid-cols-2 gap-3 mt-6">

              <button
                onClick={downloadFile}
                className="bg-[#214d3a] hover:bg-[#183d2d] text-white py-3.5 rounded-2xl font-semibold"
              >
                📥 Download File
              </button>

              <button
                onClick={resetScan}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-semibold"
              >
                🔄 Scan Another File
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default SecureDownload;