document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");
  const status = document.getElementById("status");
  const statusIcon = document.getElementById("statusIcon");
  const statusText = document.getElementById("statusText");

  // Current shield status
  chrome.storage.local.get(["shieldActive"], (data) => {
    updateUI(data.shieldActive === true);
  });

  // Activate / Deactivate
  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["shieldActive"], (data) => {
      const newStatus = !(data.shieldActive === true);

      chrome.storage.local.set(
        {
          shieldActive: newStatus,
        },
        () => {
          updateUI(newStatus);
        }
      );
    });
  });

  function updateUI(active) {
    if (active) {
      status.classList.remove("inactive");
      status.classList.add("active");

      statusIcon.textContent = "🛡️";
      statusText.textContent = "Shield Active";

      toggleButton.textContent = "Deactivate Shield";
      toggleButton.classList.remove("activate");
      toggleButton.classList.add("deactivate");
    } else {
      status.classList.remove("active");
      status.classList.add("inactive");

      statusIcon.textContent = "🔓";
      statusText.textContent = "Shield Inactive";

      toggleButton.textContent = "Activate Shield";
      toggleButton.classList.remove("deactivate");
      toggleButton.classList.add("activate");
    }
  }
});