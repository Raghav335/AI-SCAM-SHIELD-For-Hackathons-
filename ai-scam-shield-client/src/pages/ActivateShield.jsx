import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ActivateShield() {
  const navigate = useNavigate();
  const [activating, setActivating] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivating(false);
      setActivated(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-slate-800 flex items-center justify-center px-5">

      <div className="w-full max-w-lg">

        {/* CARD */}
        <div className="bg-white rounded-[32px] border border-green-900/10 shadow-xl p-8 sm:p-10 text-center">

          {/* SHIELD */}
          <div className="flex justify-center mb-7">

            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${
                activating
                  ? "bg-green-100 animate-pulse"
                  : "bg-green-100"
              }`}
            >

              <div className="w-20 h-20 rounded-full bg-[#214d3a] flex items-center justify-center shadow-lg">

                <span className="text-5xl">
                  🛡️
                </span>

              </div>

            </div>

          </div>

          {/* ACTIVATING */}
          {activating && (
            <>
              <h1 className="text-3xl font-bold text-[#214d3a]">
                Activating AI Scam Shield
              </h1>

              <p className="text-slate-500 mt-3">
                Setting up your protection...
              </p>

              <div className="mt-7 flex justify-center">

                <div className="w-10 h-10 border-4 border-green-100 border-t-[#214d3a] rounded-full animate-spin" />

              </div>
            </>
          )}

          {/* ACTIVATED */}
          {activated && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-5">
                <span>✓</span>
                Protection Active
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#214d3a]">
                AI Scam Shield
                <br />
                Activated
              </h1>

              <p className="text-slate-500 mt-4 leading-relaxed">
                Your AI Scam Shield is now ready to help
                detect suspicious links and scam attempts.
              </p>

              {/* PROTECTION FEATURES */}
              <div className="mt-8 text-left space-y-3">

                <div className="flex items-center gap-3 bg-[#f7f5ed] rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    🔗
                  </div>

                  <div>
                    <p className="font-semibold">
                      Suspicious Link Detection
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Detect potentially dangerous links.
                    </p>
                  </div>

                  <span className="ml-auto text-green-600">
                    ✓
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#f7f5ed] rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    🚨
                  </div>

                  <div>
                    <p className="font-semibold">
                      Scam Alerts
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Get warned about suspicious activity.
                    </p>
                  </div>

                  <span className="ml-auto text-green-600">
                    ✓
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#f7f5ed] rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    🛡️
                  </div>

                  <div>
                    <p className="font-semibold">
                      AI Protection
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Analyze threats before you act.
                    </p>
                  </div>

                  <span className="ml-auto text-green-600">
                    ✓
                  </span>
                </div>

              </div>

              {/* PROTECTED MESSAGE */}
              <div className="mt-7 bg-green-50 border border-green-100 rounded-2xl p-4">

                <p className="text-green-700 font-semibold">
                  🔒 You are now protected!
                </p>

                <p className="text-green-700/70 text-xs mt-1">
                  Stay alert. Stay safe.
                </p>

              </div>

              {/* DASHBOARD BUTTON */}
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full mt-6 bg-[#214d3a] hover:bg-[#183d2d] text-white py-4 rounded-2xl font-semibold transition shadow-lg"
              >
                Go to Dashboard →
              </button>

            </>
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

export default ActivateShield;