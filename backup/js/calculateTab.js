// Calculate Savings Tab functionality

let allHistory = [];
let lastSum = 0;

function initializeCalculateTab() {
  allHistory = JSON.parse(localStorage.getItem("allHistory") || "[]");

  // Calculate total savings
  $("#calculate-btn").click(function () {
    var egpAmount = parseFloat(localStorage.getItem("egpAmount")) || 0;
    var usdAmount = parseFloat(localStorage.getItem("usdAmount")) || 0;
    var gold18Amount = parseFloat(localStorage.getItem("gold18Amount")) || 0;
    var gold21Amount = parseFloat(localStorage.getItem("gold21Amount")) || 0;
    var gold24Amount = parseFloat(localStorage.getItem("gold24Amount")) || 0;

    var usdRate = parseFloat($("#usd-rate").val()) || 0;
    var gold21Rate = parseFloat($("#gold21-rate").val()) || 0;
    var gold24Rate = parseFloat(gold21Rate / 0.875) || 0;
    var gold18Rate = parseFloat(gold21Rate / 1.1667) || 0;

    // Calculate current sum
    var usdValue = usdAmount * usdRate;
    var egpValue = egpAmount;
    var gold18Value = gold18Amount * gold18Rate;
    var gold21Value = gold21Amount * gold21Rate;
    var gold24Value = gold24Amount * gold24Rate;
    var currentSum =
      usdValue + gold21Value + gold24Value + gold18Value + egpValue;

    // Save to history
    if (usdRate > 0 || gold21Rate > 0 || gold24Rate > 0 || gold18Rate > 0) {
      const newEntry = {
        date: new Date(),
        usdRate: usdRate,
        gold21Rate: gold21Rate,
        gold24Rate: gold24Rate,
        gold18Rate: gold18Rate,
        sum: currentSum,
        gold18Amount: gold18Amount,
        gold21Amount: gold21Amount,
        gold24Amount: gold24Amount,
        egpAmount: egpAmount,
        usdAmount: usdAmount,
      };

      // Store the previous sum for comparison
      if (allHistory.length > 0) {
        lastSum = allHistory[0].sum || 0;
      }

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
                <p><strong>EGP Value:</strong> ${formatNumber(egpAmount)}</p>
                <p><strong>18K Gold Value:</strong> ${formatNumber(
                  gold18Amount
                )}g × ${formatNumber(gold18Rate)} = ${formatNumber(
          gold18Value
        )}</p>
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

  // Initialize history display
  updateHistoryDisplay();
}

function createHistory(
  history,
  container,
  showUseButton = true,
  showDeleteButton = true,
  useOriginalIndex = false
) {
  history.forEach((entry, index) => {
    // Use originalIndex if available (for month grouping), otherwise use current index
    const deleteIndex =
      useOriginalIndex && entry.originalIndex !== undefined
        ? entry.originalIndex
        : index;
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
    )} USD</strong>, EGP: <strong>${formatNumber(
      entry?.egpAmount
    )} EGP</strong>, 18K: <strong>${formatNumber(
      entry?.gold18Amount
    )}gm</strong>, 21K: <strong>${formatNumber(
      entry?.gold21Amount
    )}gm</strong>, 24K: <strong>${formatNumber(
      entry?.gold24Amount
    )}gm</strong>)</div>
                                <div class="history-details">
                                    <span class="history-rate">USD: ${formatNumber(
                                      entry.usdRate
                                    )}</span>
                                    <span class="history-rate">18K: ${formatNumber(
                                      entry.gold18Rate
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
                                    ? `<button class="${"delete-history"}" data-index="${deleteIndex}">Delete</button>`
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
  historyContainer.empty();
  let rateHistory = allHistory.slice(0, 5);

  if (rateHistory.length === 0) {
    historyContainer.append('<div class="history-item">No history yet</div>');
  }

  createHistory(rateHistory, historyContainer);

  // Add click handler for use buttons
  $(".use-rates").click(function () {
    const index = $(this).data("index");
    const entry = rateHistory[index];

    $("#usd-rate").val(entry.usdRate);
    $("#gold18-rate").val(entry.gold18Rate);
    $("#gold21-rate").val(entry.gold21Rate);
    $("#gold24-rate").val(entry.gold24Rate);
  });
}
