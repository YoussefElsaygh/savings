// Shared utility functions

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
  const egpAmount = parseFloat(localStorage.getItem("egpAmount")) || 0;
  const gold18Amount = parseFloat(localStorage.getItem("gold18Amount")) || 0;
  const gold21Amount = parseFloat(localStorage.getItem("gold21Amount")) || 0;
  const gold24Amount = parseFloat(localStorage.getItem("gold24Amount")) || 0;

  const usdValue = usdAmount * entry.usdRate;
  const gold18Value = gold18Amount * (entry.gold18Rate / 1.1667);
  const gold21Value = gold21Amount * entry.gold21Rate;
  const gold24Value = gold24Amount * (entry.gold21Rate / 0.875);

  return usdValue + gold21Value + gold24Value + gold18Value + egpAmount;
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
