import { useEffect } from "react";

function ThreatAlert({ result, onClose }) {
  useEffect(() => {
    if (!result) return;

    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [result, onClose]);

  if (!result) return null;

  const level = result.riskLevel || "Safe";

  const config = {
    Dangerous: {
      icon: "🚨",
      title: "Dangerous Threat Detected",
      style:
        "border-red-500/40 bg-red-500/10 text-red-400",
    },

    Suspicious: {
      icon: "⚠️",
      title: "Suspicious Activity Detected",
      style:
        "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
    },

    Safe: {
      icon: "✅",
      title: "No Major Threat Detected",
      style:
        "border-green-500/40 bg-green-500/10 text-green-400",
    },
  };

  const current = config[level] || config.Safe;

  return (
    <div className="fixed top-24 right-6 z-[9999] w-[360px] max-w-[calc(100vw-48px)]">

      <div
        className={`rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${current.style}`}
      >

        <div className="flex items-start gap-4">

          <div className="text-3xl">
            {current.icon}
          </div>

          <div className="flex-1">

            <div className="flex items-start justify-between gap-3">

              <h3 className="font-bold text-lg">
                {current.title}
              </h3>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <p className="text-slate-300 text-sm mt-2">
              Risk Score:
              <span className="font-bold ml-1">
                {result.riskScore}/100
              </span>
            </p>

            {result.scamType && (
              <p className="text-slate-400 text-sm mt-1">
                Type: {result.scamType}
              </p>
            )}

            {result.explanation && (
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                {result.explanation}
              </p>
            )}

          </div>

        </div>

        {level === "Dangerous" && (
          <div className="mt-4 pt-4 border-t border-red-500/20">
            <p className="text-sm font-semibold">
              🛑 Do not click, open, download or share
              sensitive information.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default ThreatAlert;