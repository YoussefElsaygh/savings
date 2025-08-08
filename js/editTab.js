// Edit Savings Tab functionality

function initializeEditTab() {
  // Load saved values if they exist
  if (localStorage.getItem("usdAmount")) {
    $("#usd-amount").val(localStorage.getItem("usdAmount"));
  }
  if (localStorage.getItem("egpAmount")) {
    $("#egp-amount").val(localStorage.getItem("egpAmount"));
  }
  if (localStorage.getItem("gold18Amount")) {
    $("#gold18-amount").val(localStorage.getItem("gold18Amount"));
  }
  if (localStorage.getItem("gold21Amount")) {
    $("#gold21-amount").val(localStorage.getItem("gold21Amount"));
  }
  if (localStorage.getItem("gold24Amount")) {
    $("#gold24-amount").val(localStorage.getItem("gold24Amount"));
  }

  // Save amounts
  $("#save-btn").click(function () {
    var usdAmount = $("#usd-amount").val();
    var egpAmount = $("#egp-amount").val();
    var gold18Amount = $("#gold18-amount").val();
    var gold21Amount = $("#gold21-amount").val();
    var gold24Amount = $("#gold24-amount").val();

    localStorage.setItem("usdAmount", usdAmount);
    localStorage.setItem("egpAmount", egpAmount);
    localStorage.setItem("gold18Amount", gold18Amount);
    localStorage.setItem("gold21Amount", gold21Amount);
    localStorage.setItem("gold24Amount", gold24Amount);

    $("#save-confirmation").fadeIn().delay(2000).fadeOut();

    // Update history display if we're on the calculate tab
    if ($("#calculate").hasClass("active")) {
      updateHistoryDisplay();
    }
  });
}
