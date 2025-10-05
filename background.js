// Background service worker for Threads Data Downloader

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Threads Data Downloader installed successfully!');
    
    // Set default preferences
    chrome.storage.sync.set({
      includeMedia: true,
      includeFirstComment: true,
      includeEngagement: true,
      postLimit: 50
    });
  } else if (details.reason === 'update') {
    console.log('Threads Data Downloader updated to version ' + chrome.runtime.getManifest().version);
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'progress') {
    // Forward progress to popup
    chrome.runtime.sendMessage(request).catch(() => {
      // Popup might be closed, ignore error
    });
  } else if (request.action === 'complete') {
    // Forward completion to popup
    chrome.runtime.sendMessage(request).catch(() => {
      // Popup might be closed, ignore error
    });
  } else if (request.action === 'error') {
    // Forward error to popup
    chrome.runtime.sendMessage(request).catch(() => {
      // Popup might be closed, ignore error
    });
  } else if (request.action === 'stopped') {
    // Forward stop notification to popup
    chrome.runtime.sendMessage(request).catch(() => {
      // Popup might be closed, ignore error
    });
  }
  
  return true;
});

// Handle download events
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state) {
    if (delta.state.current === 'complete') {
      console.log('Download completed successfully');
    } else if (delta.state.current === 'interrupted') {
      console.error('Download interrupted');
    }
  }
});

// Utility function to format data for download
function formatDataForDownload(data) {
  return {
    ...data,
    exportInfo: {
      version: chrome.runtime.getManifest().version,
      exportedAt: new Date().toISOString(),
      format: 'json'
    }
  };
}

console.log('Threads Data Downloader: Background service worker loaded');
