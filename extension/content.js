// ===============================
// AI SCAM SHIELD - CONTENT SCRIPT
// ===============================

let shieldActive = false;

// Check current shield status
chrome.storage.local.get(["shieldActive"], (data) => {
  shieldActive = data.shieldActive === true;

  if (shieldActive) {
    checkCurrentPage();
  }
});

// Listen for shield ON/OFF
chrome.storage.onChanged.addListener((changes) => {
  if (changes.shieldActive) {
    shieldActive = changes.shieldActive.newValue === true;

    if (shieldActive) {
      checkCurrentPage();
    } else {
      removeWarning();
    }
  }
});

// Listen for messages from background/popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "THREAT_DETECTED") {
    showThreatWarning(message.url || window.location.href);
  }

  if (message.type === "SHIELD_STATUS") {
    shieldActive = message.active === true;

    if (shieldActive) {
      checkCurrentPage();
    } else {
      removeWarning();
    }
  }
});

// ===============================
// CHECK CURRENT URL
// ===============================

function checkCurrentPage() {
  if (!shieldActive) return;

  const url = window.location.href.toLowerCase();

  // Demo suspicious keywords
  const suspiciousKeywords = [
    "verify-account",
    "verify-account-now",
    "free-prize",
    "claim-prize",
    "claim-reward",
    "winner",
    "giveaway",
    "free-money",
    "login-verify",
    "secure-login",
    "account-verify",
    "bank-verify",
    "urgent-payment",
    "otp-verify",
    "password-reset"
  ];

  const detected = suspiciousKeywords.some((keyword) =>
    url.includes(keyword)
  );

  if (detected) {
    showThreatWarning(window.location.href);
  }
}

// ===============================
// WARNING UI
// ===============================

function showThreatWarning(url) {
  if (!shieldActive) return;

  if (document.getElementById("ai-scam-shield-warning")) {
    return;
  }

  const overlay = document.createElement("div");

  overlay.id = "ai-scam-shield-warning";

  overlay.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(2,6,23,0.94);
      z-index:2147483647;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:Arial,sans-serif;
    ">

      <div style="
        width:440px;
        max-width:90%;
        background:#0f172a;
        color:white;
        border:1px solid rgba(239,68,68,.6);
        border-radius:24px;
        padding:30px;
        box-shadow:0 20px 80px rgba(0,0,0,.7);
        text-align:center;
      ">

        <div style="
          width:75px;
          height:75px;
          margin:auto;
          border-radius:50%;
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.4);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:40px;
        ">
          🚨
        </div>

        <h2 style="
          color:#f87171;
          font-size:27px;
          margin:18px 0 8px;
        ">
          Suspicious Link Detected
        </h2>

        <p style="
          color:#94a3b8;
          line-height:1.6;
          margin-bottom:18px;
        ">
          AI Scam Shield detected a potentially
          dangerous URL.
        </p>

        <div style="
          background:#020617;
          border:1px solid #334155;
          padding:14px;
          border-radius:12px;
          margin:20px 0;
          word-break:break-all;
          color:#f87171;
          font-size:13px;
        ">
          ${escapeHtml(url)}
        </div>

        <div style="
          background:rgba(239,68,68,.08);
          border:1px solid rgba(239,68,68,.2);
          border-radius:12px;
          padding:12px;
          margin-bottom:20px;
          color:#fca5a5;
          font-size:13px;
        ">
          ⚠️ Do not enter passwords, OTPs or banking
          information on this page.
        </div>

        <div style="
          display:flex;
          gap:10px;
        ">

          <button id="shield-go-back" style="
            flex:1;
            padding:13px;
            border:0;
            border-radius:12px;
            background:#22c55e;
            color:#020617;
            font-weight:bold;
            cursor:pointer;
          ">
            ← Go Back
          </button>

          <button id="shield-continue" style="
            flex:1;
            padding:13px;
            border-radius:12px;
            background:#1e293b;
            border:1px solid #475569;
            color:#cbd5e1;
            font-weight:bold;
            cursor:pointer;
          ">
            Continue Anyway
          </button>

        </div>

        <p style="
          color:#64748b;
          font-size:11px;
          margin-top:18px;
        ">
          🛡️ AI Scam Shield • Demo Protection
        </p>

      </div>
    </div>
  `;

  document.documentElement.appendChild(overlay);

  document
    .getElementById("shield-go-back")
    .addEventListener("click", () => {
      history.back();
    });

  document
    .getElementById("shield-continue")
    .addEventListener("click", () => {
      overlay.remove();
    });
}

// ===============================
// REMOVE WARNING
// ===============================

function removeWarning() {
  const warning = document.getElementById(
    "ai-scam-shield-warning"
  );

  if (warning) {
    warning.remove();
  }
}

// ===============================
// ESCAPE HTML
// ===============================

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}