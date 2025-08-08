// Quantity History Tab functionality

function initializeQuantityHistoryTab() {
  // Initialize quantity history display
  updateQuantityHistoryDisplay();
}

// Update quantity history display using allHistory
function updateQuantityHistoryDisplay() {
  const container = $("#quantity-history-items");
  container.empty();

  if (allHistory.length === 0) {
    container.append('<div class="history-item">No quantity changes yet</div>');
    return;
  }

  // Process allHistory to find quantity changes between consecutive entries
  const quantityChanges = [];

  if (allHistory.length > 1) {
    // Compare each entry to the previous one (chronologically)
    for (let i = allHistory.length - 2; i >= 0; i--) {
      const current = allHistory[i];
      const previous = allHistory[i + 1]; // Previous entry in time
      const changes = [];

      // Check each amount type for changes from previous entry
      const amounts = [
        { key: "usdAmount", name: "USD", unit: "USD" },
        { key: "egpAmount", name: "EGP", unit: "EGP" },
        { key: "gold18Amount", name: "18K Gold", unit: "g" },
        { key: "gold21Amount", name: "21K Gold", unit: "g" },
        { key: "gold24Amount", name: "24K Gold", unit: "g" },
      ];

      amounts.forEach((amount) => {
        const currentVal = parseFloat(current[amount.key]) || 0;
        const previousVal = parseFloat(previous[amount.key]) || 0;

        // Only include if there's an actual change from the previous entry
        if (currentVal !== previousVal) {
          const difference = currentVal - previousVal;
          changes.push({
            type: amount.key,
            name: amount.name,
            unit: amount.unit,
            previous: previousVal,
            current: currentVal,
            difference: difference,
            changeType:
              difference > 0
                ? "added"
                : difference < 0
                ? "removed"
                : "modified",
          });
        }
      });

      // Only add entries that have actual changes from the previous entry
      if (changes.length > 0) {
        quantityChanges.push({
          date: current.date,
          changes: changes,
          historyIndex: i,
        });
      }
    }
  }

  if (quantityChanges.length === 0) {
    container.append(
      '<div class="history-item">No quantity changes detected in history</div>'
    );
    return;
  }

  // Group changes by saving type
  const changesBySavingType = {
    usdAmount: { name: "USD", unit: "USD", changes: [] },
    egpAmount: { name: "EGP", unit: "EGP", changes: [] },
    gold18Amount: { name: "18K Gold", unit: "g", changes: [] },
    gold21Amount: { name: "21K Gold", unit: "g", changes: [] },
    gold24Amount: { name: "24K Gold", unit: "g", changes: [] },
  };

  // Collect all changes for each saving type
  quantityChanges.forEach((entry) => {
    entry.changes.forEach((change) => {
      changesBySavingType[change.type].changes.push({
        date: entry.date,
        previous: change.previous,
        current: change.current,
        difference: change.difference,
        changeType: change.changeType,
      });
    });
  });

  // Sort changes within each saving type from latest to oldest
  Object.keys(changesBySavingType).forEach((savingType) => {
    changesBySavingType[savingType].changes.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });

  // Display each saving type in its own section (only if it has changes)
  Object.keys(changesBySavingType).forEach((savingType) => {
    const typeData = changesBySavingType[savingType];

    // Only show sections for saving types that have actual changes
    if (typeData.changes.length > 0) {
      const sectionDiv = $(`
         <div class="saving-type-section">
           <h3 class="saving-type-header collapsible" data-target="${savingType}-changes">
             <span class="collapse-icon">▼</span>
             ${typeData.name} History
             <span class="change-count">(${
               typeData.changes.length
             } changes)</span>
           </h3>
           <div class="saving-type-changes" id="${savingType}-changes">
             ${typeData.changes
               .map((change) => {
                 return `
                 <div class="quantity-change-item ${change.changeType}">
                   <div class="change-date">
                     <strong>${formatDate(change.date)}</strong>
                   </div>
                   <div class="change-details">
                     <span class="quantity-details">
                       ${formatNumber(change.previous)} → ${formatNumber(
                   change.current
                 )} ${typeData.unit}
                     </span>
                     <span class="quantity-amount ${change.changeType}">
                       ${change.difference > 0 ? "+" : ""}${formatNumber(
                   change.difference
                 )} ${typeData.unit}
                     </span>
                   </div>
                 </div>
               `;
               })
               .join("")}
           </div>
         </div>
       `);
      container.append(sectionDiv);
    }
  });

  // Add collapsible functionality
  $(".saving-type-header.collapsible").click(function () {
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
}
