$(document).ready(function () {
  // Format date as dd/mm/yy hh:mm
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Format number to xxx,xxx.xx
  function formatNumber(value) {
    if (!value) return "-";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Format number to xxx,xxx without decimal points for sums
  function formatSum(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Calculate sum for a history entry
  function calculateHistorySum(entry) {
    const usdAmount = parseFloat(localStorage.getItem("usdAmount")) || 0;
    const gold21Amount = parseFloat(localStorage.getItem("gold21Amount")) || 0;
    const gold24Amount = parseFloat(localStorage.getItem("gold24Amount")) || 0;

    const usdValue = usdAmount * entry.usdRate;
    const gold21Value = gold21Amount * entry.gold21Rate;
    const gold24Value = gold24Amount * (entry.gold21Rate / 0.875);

    return usdValue + gold21Value + gold24Value;
  }

  // Get comparison class based on value change
  function getComparisonClass(currentSum, previousSum) {
    if (previousSum === 0) return "";
    const difference = currentSum - previousSum;
    if (difference === 0) return "no-change";
    return difference > 0 ? "increase" : "decrease";
  }

  // Get comparison icon
  function getComparisonIcon(currentSum, previousSum) {
    if (previousSum === 0) return "";
    const difference = currentSum - previousSum;
    if (difference === 0) return "→";
    return difference > 0 ? "↑" : "↓";
  }

  // Load saved values if they exist
  if (localStorage.getItem("usdAmount")) {
    $("#usd-amount").val(localStorage.getItem("usdAmount"));
  }
  if (localStorage.getItem("gold21Amount")) {
    $("#gold21-amount").val(localStorage.getItem("gold21Amount"));
  }
  if (localStorage.getItem("gold24Amount")) {
    $("#gold24-amount").val(localStorage.getItem("gold24Amount"));
  }

  // Load rate history
  let rateHistory = JSON.parse(localStorage.getItem("rateHistory") || "[]");
  let allHistory = JSON.parse(localStorage.getItem("allHistory") || "[]");
  let lastSum = 0;

  // Tab switching
  $(".tab").click(function () {
    $(".tab").removeClass("active");
    $(this).addClass("active");

    var tabId = $(this).data("tab");
    $(".tab-content").removeClass("active");
    $("#" + tabId).addClass("active");

    if (tabId === "calculate") {
      updateHistoryDisplay();
    }
  });

  // Save amounts
  $("#save-btn").click(function () {
    var usdAmount = $("#usd-amount").val();
    var gold21Amount = $("#gold21-amount").val();
    var gold24Amount = $("#gold24-amount").val();

    localStorage.setItem("usdAmount", usdAmount);
    localStorage.setItem("gold21Amount", gold21Amount);
    localStorage.setItem("gold24Amount", gold24Amount);

    $("#save-confirmation").fadeIn().delay(2000).fadeOut();

    // Update history display if we're on the calculate tab
    if ($("#calculate").hasClass("active")) {
      updateHistoryDisplay();
    }
  });

  // Calculate total savings
  $("#calculate-btn").click(function () {
    var usdAmount = parseFloat(localStorage.getItem("usdAmount")) || 0;
    var gold21Amount = parseFloat(localStorage.getItem("gold21Amount")) || 0;
    var gold24Amount = parseFloat(localStorage.getItem("gold24Amount")) || 0;

    var usdRate = parseFloat($("#usd-rate").val()) || 0;
    var gold21Rate = parseFloat($("#gold21-rate").val()) || 0;
    var gold24Rate = parseFloat(gold21Rate / 0.875) || 0;

    // Calculate current sum
    var usdValue = usdAmount * usdRate;
    var gold21Value = gold21Amount * gold21Rate;
    var gold24Value = gold24Amount * gold24Rate;
    var currentSum = usdValue + gold21Value + gold24Value;

    // Save to history
    if (usdRate > 0 || gold21Rate > 0 || gold24Rate > 0) {
      const newEntry = {
        date: new Date(),
        usdRate: usdRate,
        gold21Rate: gold21Rate,
        gold24Rate: gold24Rate,
        sum: currentSum,
        gold21Amount: gold21Amount,
        gold24Amount: gold24Amount,
        usdAmount: usdAmount,
      };

      // Store the previous sum for comparison
      if (rateHistory.length > 0) {
        lastSum = rateHistory[0].sum || 0;
      }

      rateHistory.unshift(newEntry); // Add to beginning of array

      // Keep only last 5 entries
      if (rateHistory.length > 5) {
        rateHistory = rateHistory.slice(0, 5);
      }

      localStorage.setItem("rateHistory", JSON.stringify(rateHistory));
      allHistory.unshift(newEntry);
      localStorage.setItem("allHistory", JSON.stringify(allHistory));
      updateHistoryDisplay();
    }

    $("#result")
      .html(
        `
                <p><strong>USD Value:</strong> $${formatNumber(
                  usdAmount
                )} × ${formatNumber(usdRate)} = ${formatNumber(usdValue)}</p>
                <p><strong>21K Gold Value:</strong> ${formatNumber(
                  gold21Amount
                )}g × ${formatNumber(gold21Rate)} = ${formatNumber(
          gold21Value
        )}</p>
                <p><strong>24K Gold Value:</strong> ${formatNumber(
                  gold24Amount
                )}g × ${formatNumber(gold24Rate)} = ${formatNumber(
          gold24Value
        )}</p>
                <p><strong>Total Savings:</strong> ${formatSum(currentSum)} 
                    ${
                      lastSum > 0
                        ? currentSum > lastSum
                          ? '<span class="increase">(↑ Increased)</span>'
                          : currentSum < lastSum
                          ? '<span class="decrease">(↓ Decreased)</span>'
                          : '<span class="no-change">(→ No change)</span>'
                        : ""
                    }
                </p>
            `
      )
      .fadeIn();
  });
  function createHistory(
    history,
    container,
    showUseButton = true,
    showDeleteButton = true
  ) {
    history.forEach((entry, index) => {
      const sum = entry.sum || calculateHistorySum(entry);
      const prevSum = index < history.length - 1 ? history[index + 1].sum : 0;
      const comparisonClass = getComparisonClass(sum, prevSum);
      const comparisonIcon = getComparisonIcon(sum, prevSum);

      const historyItem = $(`
                        <div class="history-item">
                            <div>
                                <strong>${formatDate(
                                  entry.date
                                )}</strong> <div style="font-size: 10px;">(USD: <strong>${formatNumber(
        entry?.usdAmount
      )} USD</strong>,21K: <strong>${formatNumber(
        entry?.gold21Amount
      )}gm</strong>, 24K: <strong>${formatNumber(
        entry?.gold24Amount
      )}gm</strong>)</div>
                                <div class="history-details">
                                    <span class="history-rate">USD: ${formatNumber(
                                      entry.usdRate
                                    )}</span>
                                    <span class="history-rate">21K: ${formatNumber(
                                      entry.gold21Rate
                                    )}</span>
                                    <span class="history-rate">24K: ${formatNumber(
                                      entry.gold24Rate
                                    )}</span>
                                </div>
                            </div>
                            <div class="history-comparison">
                                <span class="history-sum ${comparisonClass}">
                                    ${formatSum(sum)}
                                    ${
                                      comparisonIcon
                                        ? `<span class="change-indicator">${comparisonIcon}</span>`
                                        : ""
                                    }
                                </span>
                                ${
                                  showUseButton
                                    ? `<button class="use-rates" data-index="${index}">Use</button>`
                                    : ""
                                }
                                ${
                                  showDeleteButton
                                    ? `<button class="${
                                        container.attr("id") ===
                                        "full-history-items"
                                          ? "delete-history"
                                          : "delete-rates"
                                      }" data-index="${index}">Delete</button>`
                                    : ""
                                }
                            </div>
                        </div>
                    `);
      container.append(historyItem);
    });
  }
  // Update history display
  function updateHistoryDisplay() {
    const historyContainer = $("#history-items");
    const fullHistoryContainer = $("#full-history-items");
    historyContainer.empty();
    fullHistoryContainer.empty();

    if (rateHistory.length === 0) {
      historyContainer.append('<div class="history-item">No history yet</div>');
    }
    if (allHistory.length === 0) {
      fullHistoryContainer.append(
        '<div class="history-item">No history yet</div>'
      );
    }
    console.log(rateHistory, "rateHistory");
    console.log(allHistory, "allHistory");
    createHistory(rateHistory, historyContainer);
    createHistory(allHistory, fullHistoryContainer, false, true);

    // Add click handler for use buttons
    $(".use-rates").click(function () {
      const index = $(this).data("index");
      const entry = rateHistory[index];

      $("#usd-rate").val(entry.usdRate);
      $("#gold21-rate").val(entry.gold21Rate);
      $("#gold24-rate").val(entry.gold24Rate);
    });

    // Add click handler for delete buttons
    $(".delete-rates").click(function () {
      const index = $(this).data("index");
      rateHistory.splice(index, 1);
      localStorage.setItem("rateHistory", JSON.stringify(rateHistory));
      updateHistoryDisplay();
    });
    $(".delete-history").click(function () {
      const index = $(this).data("index");
      allHistory.splice(index, 1);
      localStorage.setItem("allHistory", JSON.stringify(allHistory));
      updateHistoryDisplay();
    });
  }
  $("#clear-history").click(function () {
    allHistory = [];
    localStorage.setItem("allHistory", JSON.stringify(allHistory));
    updateHistoryDisplay();
  });

  // Initialize history display
  updateHistoryDisplay();
});
