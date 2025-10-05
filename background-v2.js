// Background service worker for Threads Data Downloader Pro v2.0

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Threads Data Downloader Pro v2.0 installed successfully!');
    
    // Set default preferences
    chrome.storage.sync.set({
      includeMedia: true,
      includeFirstComment: true,
      includeEngagement: true,
      convertShopee: true,
      postLimit: 50
    });
    
    // Initialize schedules
    chrome.storage.local.set({ schedules: [] });
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
    // Add tabId for background downloads
    if (sender.tab) {
      request.tabId = sender.tab.id;
    }
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

// Handle scheduled alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('schedule_')) {
    const scheduleId = parseInt(alarm.name.replace('schedule_', ''));
    await executeScheduledDownload(scheduleId);
  }
});

async function executeScheduledDownload(scheduleId) {
  console.log('Executing scheduled download:', scheduleId);
  
  chrome.storage.local.get(['schedules'], async (result) => {
    const schedules = result.schedules || [];
    const schedule = schedules.find(s => s.id === scheduleId);
    
    if (!schedule) {
      console.log('Schedule not found:', scheduleId);
      return;
    }
    
    try {
      // Create new tab for download
      const tab = await chrome.tabs.create({
        url: schedule.url,
        active: false
      });
      
      // Wait for tab to load
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Start download
          chrome.tabs.sendMessage(tab.id, {
            action: 'startDownload',
            options: schedule.options,
            mode: 'scheduled'
          });
          
          // Listen for completion
          chrome.runtime.onMessage.addListener(function completionListener(message) {
            if (message.action === 'complete' && message.tabId === tab.id) {
              chrome.runtime.onMessage.removeListener(completionListener);
              
              // Close tab
              chrome.tabs.remove(tab.id);
              
              // Show notification
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Threads Downloader',
                message: `Đã hoàn thành tải dữ liệu từ ${schedule.url}`,
                priority: 2
              });
              
              // Remove schedule
              removeSchedule(scheduleId);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error executing scheduled download:', error);
    }
  });
}

function removeSchedule(scheduleId) {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const filtered = schedules.filter(s => s.id !== scheduleId);
    chrome.storage.local.set({ schedules: filtered });
  });
}

console.log('Threads Data Downloader Pro v2.0: Background service worker loaded');
