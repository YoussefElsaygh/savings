// Main application initialization and tab management

$(document).ready(function () {
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

  // Initialize all tabs
  if (typeof initializeEditTab === "function") {
    initializeEditTab();
  }

  if (typeof initializeCalculateTab === "function") {
    initializeCalculateTab();
  }

  if (typeof initializeHistoryTab === "function") {
    initializeHistoryTab();
  }

  if (typeof initializeQuantityHistoryTab === "function") {
    initializeQuantityHistoryTab();
  }
});
