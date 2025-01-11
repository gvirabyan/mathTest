const openExternalLink = url => {
  if (window.cordova && window.cordova.InAppBrowser) {
    // Open the URL in the device's system browser
    window.cordova.InAppBrowser.open(url, "_system");
  } else {
    // For web browsers, open in a new tab
    window.open(url, "_blank");
  }
};

export default openExternalLink;
