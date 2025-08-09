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

  // Group history by month
  const historyByMonth = {};

  allHistory.forEach((entry, index) => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    if (!historyByMonth[monthKey]) {
      historyByMonth[monthKey] = {
        monthName: monthName,
        entries: [],
      };
    }

    historyByMonth[monthKey].entries.push({
      ...entry,
      originalIndex: index,
    });
  });

  // Sort months from newest to oldest
  const sortedMonths = Object.keys(historyByMonth).sort((a, b) =>
    b.localeCompare(a)
  );

  // Display each month in its own collapsible section
  sortedMonths.forEach((monthKey) => {
    const monthData = historyByMonth[monthKey];

    const monthSection = $(`
      <div class="month-section">
        <h3 class="month-header collapsible" data-target="${monthKey}-entries">
          <span class="collapse-icon">▼</span>
          ${monthData.monthName}
          <span class="entry-count">(${monthData.entries.length} entries)</span>
        </h3>
        <div class="month-entries" id="${monthKey}-entries">
        </div>
      </div>
    `);

    fullHistoryContainer.append(monthSection);

    // Create history items for this month
    const monthContainer = $(`#${monthKey}-entries`);
    createHistory(monthData.entries, monthContainer, false, true, true);
  });

  // Add collapsible functionality
  $(".month-header.collapsible").click(function () {
    const targetId = $(this).data("target");
    const targetDiv = $("#" + targetId);
    const icon = $(this).find(".collapse-icon");

    if (targetDiv.is(":visible")) {
      targetDiv.slideUp(200);
      icon.text("▶");
      $(this).addClass("collapsed");
    } else {
      targetDiv.slideDown(200);
      icon.text("▼");
      $(this).removeClass("collapsed");
    }
  });

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
