// History Tab functionality

function initializeHistoryTab() {
  // Clear history
  $("#clear-history").click(function () {
    allHistory = [];
    localStorage.setItem("allHistory", JSON.stringify(allHistory));
    updateFullHistoryDisplay();
    // Also update calculate tab history if it exists
    if (typeof updateHistoryDisplay === "function") {
      updateHistoryDisplay();
    }
  });

  // Initialize full history display
  updateFullHistoryDisplay();
}

// Update full history display
function updateFullHistoryDisplay() {
  const fullHistoryContainer = $("#full-history-items");
  fullHistoryContainer.empty();

  if (allHistory.length === 0) {
    fullHistoryContainer.append(
      '<div class="history-item">No history yet</div>'
    );
    return;
  }

  createHistory(allHistory, fullHistoryContainer, false, true);

  // Add click handler for delete buttons
  $(".delete-history").click(function () {
    const index = $(this).data("index");
    allHistory.splice(index, 1);
    localStorage.setItem("allHistory", JSON.stringify(allHistory));
    updateFullHistoryDisplay();
    // Also update calculate tab history if it exists
    if (typeof updateHistoryDisplay === "function") {
      updateHistoryDisplay();
    }
  });
}
