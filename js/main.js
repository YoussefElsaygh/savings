// Main application initialization and tab management

$(document).ready(function () {
  // Load tab content first, then initialize
  initializeTabContent();
});

function checkAndSetActiveTab() {
  // Check if there are any savings stored
  const hasUSD =
    localStorage.getItem("usdAmount") &&
    parseFloat(localStorage.getItem("usdAmount")) > 0;
  const hasEGP =
    localStorage.getItem("egpAmount") &&
    parseFloat(localStorage.getItem("egpAmount")) > 0;
  const hasGold18 =
    localStorage.getItem("gold18Amount") &&
    parseFloat(localStorage.getItem("gold18Amount")) > 0;
  const hasGold21 =
    localStorage.getItem("gold21Amount") &&
    parseFloat(localStorage.getItem("gold21Amount")) > 0;
  const hasGold24 =
    localStorage.getItem("gold24Amount") &&
    parseFloat(localStorage.getItem("gold24Amount")) > 0;

  const hasSavings = hasUSD || hasEGP || hasGold18 || hasGold21 || hasGold24;

  if (!hasSavings) {
    // No savings found, make "Savings Quantity" (edit) tab active
    $(".tab").removeClass("active");
    $(".tab[data-tab='edit']").addClass("active");

    $(".tab-content").removeClass("active");
    $("#edit").addClass("active");
  } else {
    // Savings found, make "Savings Calculator" (calculate) tab active
    $(".tab").removeClass("active");
    $(".tab[data-tab='calculate']").addClass("active");

    $(".tab-content").removeClass("active");
    $("#calculate").addClass("active");
  }
}

function initializeTabSwitching() {
  // Tab switching
  $(".tab").click(function () {
    $(".tab").removeClass("active");
    $(this).addClass("active");

    var tabId = $(this).data("tab");
    $(".tab-content").removeClass("active");
    $("#" + tabId).addClass("active");

    // Update displays when switching to specific tabs
    if (tabId === "calculate") {
      if (typeof updateHistoryDisplay === "function") {
        updateHistoryDisplay();
      }
    } else if (tabId === "quantity-history") {
      if (typeof updateQuantityHistoryDisplay === "function") {
        updateQuantityHistoryDisplay();
      }
    } else if (tabId === "history") {
      if (typeof updateFullHistoryDisplay === "function") {
        updateFullHistoryDisplay();
      }
    }
  });
}
