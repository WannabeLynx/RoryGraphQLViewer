// Create Custom Panel in Chrome DevTools
try {
  chrome.devtools.panels.create(
    "Rory's Viewer",
    "icons/icon48.png",
    "panel.html",
    function(panel) {}
  );
} catch (e) {
  console.error("Error creating DevTools panel:", e);
}
