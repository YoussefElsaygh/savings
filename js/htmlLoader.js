// HTML Fragment Loader

function loadHTMLFragment(url, containerId) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading HTML fragment:", error);
    });
}

function loadAllTabContent() {
  const tabsContainer = document.getElementById("tabs-container");

  // Load all tab content
  return Promise.all([
    loadHTMLFragment("html/edit-tab.html", "tabs-container").then(() => {
      // Edit tab content is loaded, but we need to append it properly
      return fetch("html/edit-tab.html").then((r) => r.text());
    }),
    loadHTMLFragment("html/calculate-tab.html", "temp-container").then(() => {
      return fetch("html/calculate-tab.html").then((r) => r.text());
    }),
    loadHTMLFragment("html/history-tab.html", "temp-container").then(() => {
      return fetch("html/history-tab.html").then((r) => r.text());
    }),
    loadHTMLFragment("html/quantity-history-tab.html", "temp-container").then(
      () => {
        return fetch("html/quantity-history-tab.html").then((r) => r.text());
      }
    ),
  ]).then((htmlContents) => {
    // Combine all HTML content
    tabsContainer.innerHTML = htmlContents.join("");
  });
}

// Alternative simpler approach - directly insert HTML
function initializeTabContent() {
  const tabsContainer = document.getElementById("tabs-container");

  // For now, we'll use a simpler approach and load content directly
  Promise.all([
    fetch("html/edit-tab.html").then((r) => r.text()),
    fetch("html/calculate-tab.html").then((r) => r.text()),
    fetch("html/history-tab.html").then((r) => r.text()),
    fetch("html/quantity-history-tab.html").then((r) => r.text()),
  ])
    .then((htmlContents) => {
      tabsContainer.innerHTML = htmlContents.join("");

      // Initialize all tabs after content is loaded
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

      // Initialize tab switching after all content is loaded
      if (typeof initializeTabSwitching === "function") {
        initializeTabSwitching();
      }
    })
    .catch((error) => {
      console.error("Error loading tab content:", error);
      // Fallback: show error message
      tabsContainer.innerHTML =
        '<div class="error">Error loading tab content. Please refresh the page.</div>';
    });
}
