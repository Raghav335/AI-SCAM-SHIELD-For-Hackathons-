const API_URL = "https://ai-scam-shield-upkl.onrender.com/api/scan/url";

// Shield status
let shieldActive = false;

// Extension start hone par saved status check
chrome.storage.local.get(["shieldActive"], (data) => {
  shieldActive = data.shieldActive === true;
});

// Popup se shield status receive
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHIELD_STATUS") {
    shieldActive = message.active;

    chrome.storage.local.set({
      shieldActive: shieldActive,
    });

    sendResponse({ success: true });
    return true;
  }
});

// Tab update hone par URL check
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  if (!shieldActive) {
    return;
  }

  if (changeInfo.status !== "loading") {
    return;
  }

  const url = tab.url;

  if (!url) {
    return;
  }

  // Chrome internal pages ko ignore karo
  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("about:")
  ) {
    return;
  }

  console.log("🛡️ Shield checking:", url);

  try {

    const result = await checkURL(url);

    console.log("🔍 Scan result:", result);

    if (!result) {
      return;
    }

    const riskLevel = result.riskLevel;

    if (
      riskLevel === "Dangerous" ||
      riskLevel === "Suspicious"
    ) {

      chrome.tabs.sendMessage(tabId, {
        type: "THREAT_DETECTED",
        url: url,
        result: result,
      });

    }

  } catch (error) {

    console.error(
      "Shield URL scan error:",
      error
    );

  }

});


// Backend URL scanner
async function checkURL(url) {

  const data = await chrome.storage.local.get([
    "authToken"
  ]);

  const token = data.authToken;

  if (!token) {

    console.warn(
      "No login token found."
    );

    return null;
  }

  const response = await fetch(
    API_URL,
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

  if (!response.ok) {

    throw new Error(
      `API Error: ${response.status}`
    );

  }

  const dataResponse =
    await response.json();

  return dataResponse.result;
}