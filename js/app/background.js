console.log("background script loaded.");

// Listen for received message from content script and set to background scope globally
chrome.runtime.onMessage.addListener(receiver);

var selectedText = "";

function receiver(message, sender, sendResponse) {
  console.log("message Received: " + message);
  selectedText = message;
}
