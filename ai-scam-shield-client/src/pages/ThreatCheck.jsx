import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ThreatCheck() {
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      setShowResult(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800 flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        {/* MAIN CARD */}
        <div className="bg-white rounded-[32px] border border-red-900/10 shadow-xl overflow-hidden">

          {/* TOP BAR */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#214d3a] flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>

              <div>
                <h1 className="font-bold text-lg">
                  AI Scam Shield
                </h1>

                <p className="text-xs text-slate-400">
                  Link Security Check
                </p>
              </div>

            </div>

            <div className="text-slate-400">
              ⋮
            </div>

          </div>


          {/* SCANNING */}
          {scanning && (
            <div className="px-7 py-12 text-center">

              <div className="flex justify-center mb-7">

                <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center">

                  <div className="w-20 h-20 rounded-full bg-[#214d3a] flex items-center justify-center animate-pulse">

                    <span className="text-5xl">
                      🛡️
                    </span>

                  </div>

                </div>

              </div>

              <h2 className="text-2xl font-bold text-[#214d3a]">
                Scanning the Link...
              </h2>

              <p className="text-slate-500 mt-3">
                AI Scam Shield is checking this link
              </p>

              {/* LOADER */}
              <div className="flex justify-center mt-7">

                <div className="w-10 h-10 border-4 border-green-100 border-t-[#214d3a] rounded-full animate-spin" />

              </div>

              <div className="mt-7 bg-[#f7f5ed] rounded-2xl p-4 text-left">

                <p className="text-xs text-slate-400">
                  Link being analyzed
                </p>

                <p className="text-sm font-medium text-slate-600 mt-1 break-all">
                  ai-scam-shield-demo.com/verify
                </p>

              </div>

            </div>
          )}


          {/* RESULT */}
          {showResult && (
            <div>

              {/* RED WARNING HEADER */}
              <div className="bg-red-50 px-7 py-8 text-center border-b border-red-100">

                <div className="flex justify-center mb-4">

                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">

                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">

                      <span className="text-3xl text-white">
                        ✋
                      </span>

                    </div>

                  </div>

                </div>

                <h2 className="text-3xl font-extrabold text-red-600">
                  STOP!
                </h2>

                <p className="text-xl font-bold text-red-600 mt-1">
                  SUSPICIOUS LINK
                </p>

                <p className="text-sm text-red-700/70 mt-3">
                  AI Scam Shield detected potential
                  phishing indicators.
                </p>

              </div>


              {/* RESULT CONTENT */}
              <div className="p-7">

                {/* RISK SCORE */}
                <div className="border border-red-200 rounded-2xl p-5 text-center">

                  <p className="text-sm text-slate-500">
                    Risk Score
                  </p>

                  <div className="flex items-end justify-center gap-1 mt-1">

                    <span className="text-5xl font-extrabold text-red-600">
                      95
                    </span>

                    <span className="text-xl text-slate-400 mb-1">
                      /100
                    </span>

                  </div>

                  <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                    High Risk
                  </span>

                </div>


                {/* TYPE */}
                <div className="mt-5">

                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Threat Type
                  </p>

                  <p className="font-bold text-slate-800 mt-1">
                    Phishing / KYC Scam
                  </p>

                </div>


                {/* WARNING */}
                <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4">

                  <p className="text-sm font-semibold text-amber-800">
                    ⚠️ Why is this suspicious?
                  </p>

                  <p className="text-sm text-amber-700/80 mt-2 leading-relaxed">
                    This link creates urgency and asks you
                    to verify your account. These are common
                    indicators of phishing scams.
                  </p>

                </div>


                {/* RED FLAGS */}
                <div className="mt-5">

                  <p className="font-bold text-slate-800 mb-3">
                    Red Flags Detected
                  </p>

                  <div className="space-y-2">

                    <div className="flex gap-3 items-center">
                      <span className="text-red-500">✕</span>
                      <span className="text-sm text-slate-600">
                        Urgent account verification request
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <span className="text-red-500">✕</span>
                      <span className="text-sm text-slate-600">
                        Suspicious verification link
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <span className="text-red-500">✕</span>
                      <span className="text-sm text-slate-600">
                        Possible phishing attempt
                      </span>
                    </div>

                  </div>

                </div>


                {/* SAFETY MESSAGE */}
                <div className="mt-6 bg-[#f7f5ed] rounded-2xl p-4">

                  <p className="font-semibold text-[#214d3a]">
                    🛡️ Stay Protected
                  </p>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Do not enter OTPs, passwords, card details
                    or other sensitive information.
                  </p>

                </div>


                {/* ACTIVATE */}
                <button
                  onClick={() => navigate("/activate")}
                  className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] text-white py-4 rounded-2xl font-bold transition shadow-lg"
                >
                  🛡️ Download / Activate AI Scam Shield
                </button>


                {/* EXIT */}
                <button
                  onClick={() => window.history.back()}
                  className="w-full mt-3 py-3 text-slate-500 hover:text-slate-800 text-sm font-medium"
                >
                  Go Back
                </button>

              </div>

            </div>
          )}

        </div>


        {/* FOOTER */}
        <p className="text-center text-xs text-slate-400 mt-5">
          AI Scam Shield • Detect. Protect. Stay Safe.
        </p>

      </div>

    </div>
  );
}

export default ThreatCheck;