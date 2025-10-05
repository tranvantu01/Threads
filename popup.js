// Popup script for Threads Data Downloader
let isDownloading = false;
let shouldStop = false;

// DOM Elements
const downloadBtn = document.getElementById('downloadBtn');
const stopBtn = document.getElementById('stopBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const progressInfo = document.getElementById('progressInfo');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const totalPosts = document.getElementById('totalPosts');
const totalMedia = document.getElementById('totalMedia');
const totalEngagement = document.getElementById('totalEngagement');

// Options
const includeMedia = document.getElementById('includeMedia');
const includeFirstComment = document.getElementById('includeFirstComment');
const includeEngagement = document.getElementById('includeEngagement');
const postLimit = document.getElementById('postLimit');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load saved preferences
  chrome.storage.sync.get(['includeMedia', 'includeFirstComment', 'includeEngagement', 'postLimit'], (result) => {
    if (result.includeMedia !== undefined) includeMedia.checked = result.includeMedia;
    if (result.includeFirstComment !== undefined) includeFirstComment.checked = result.includeFirstComment;
    if (result.includeEngagement !== undefined) includeEngagement.checked = result.includeEngagement;
    if (result.postLimit) postLimit.value = result.postLimit;
  });

  // Save preferences on change
  [includeMedia, includeFirstComment, includeEngagement].forEach(checkbox => {
    checkbox.addEventListener('change', savePreferences);
  });
  postLimit.addEventListener('change', savePreferences);

  // Button handlers
  downloadBtn.addEventListener('click', startDownload);
  stopBtn.addEventListener('click', stopDownload);

  // Check if we're on a Threads page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && !tabs[0].url.includes('threads.net')) {
      updateStatus('error', 'Vui lòng mở trang Threads');
      downloadBtn.disabled = true;
    }
  });
});

function savePreferences() {
  chrome.storage.sync.set({
    includeMedia: includeMedia.checked,
    includeFirstComment: includeFirstComment.checked,
    includeEngagement: includeEngagement.checked,
    postLimit: parseInt(postLimit.value) || 50
  });
}

async function startDownload() {
  if (isDownloading) return;

  isDownloading = true;
  shouldStop = false;
  downloadBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  progressInfo.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  updateStatus('working', 'Đang thu thập dữ liệu...');
  updateProgress(0, 0);

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Get options
    const options = {
      includeMedia: includeMedia.checked,
      includeFirstComment: includeFirstComment.checked,
      includeEngagement: includeEngagement.checked,
      limit: parseInt(postLimit.value) || 50
    };

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'startDownload', options }, (response) => {
      if (chrome.runtime.lastError) {
        updateStatus('error', 'Lỗi: ' + chrome.runtime.lastError.message);
        resetUI();
        return;
      }

      if (response && response.success) {
        updateStatus('working', 'Đang xử lý...');
      } else {
        updateStatus('error', response?.error || 'Lỗi không xác định');
        resetUI();
      }
    });

    // Listen for progress updates
    chrome.runtime.onMessage.addListener(handleMessages);

  } catch (error) {
    updateStatus('error', 'Lỗi: ' + error.message);
    resetUI();
  }
}

function handleMessages(message, sender, sendResponse) {
  if (message.action === 'progress') {
    updateProgress(message.current, message.total);
    updateStatus('working', `Đã xử lý ${message.current}/${message.total} bài viết`);
  } else if (message.action === 'complete') {
    handleDownloadComplete(message.data);
  } else if (message.action === 'error') {
    updateStatus('error', message.error);
    resetUI();
  } else if (message.action === 'stopped') {
    updateStatus('error', 'Đã dừng');
    resetUI();
  }
}

function handleDownloadComplete(data) {
  updateStatus('working', 'Hoàn thành! Đang tạo file...');

  // Calculate totals
  const mediaCount = data.posts.reduce((count, post) => {
    return count + (post.media?.length || 0);
  }, 0);

  const engagementCount = data.posts.reduce((count, post) => {
    return count + (post.likes || 0) + (post.shares || 0) + (post.reposts || 0) + (post.comments || 0);
  }, 0);

  // Show results
  totalPosts.textContent = data.posts.length;
  totalMedia.textContent = mediaCount;
  totalEngagement.textContent = engagementCount.toLocaleString();
  resultsSection.classList.remove('hidden');

  // Download JSON file
  const filename = `threads_${data.username}_${new Date().toISOString().split('T')[0]}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      updateStatus('error', 'Lỗi tải xuống: ' + chrome.runtime.lastError.message);
    } else {
      updateStatus('ready', 'Tải xuống thành công! ✓');
    }
    resetUI();
    URL.revokeObjectURL(url);
  });
}

function stopDownload() {
  shouldStop = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stopDownload' });
  });
  updateStatus('error', 'Đang dừng...');
}

function updateStatus(type, text) {
  statusText.textContent = text;
  statusIndicator.className = 'status-indicator';
  if (type === 'working') {
    statusIndicator.classList.add('working');
  } else if (type === 'error') {
    statusIndicator.classList.add('error');
  }
}

function updateProgress(current, total) {
  if (total === 0) {
    progressFill.style.width = '0%';
    progressText.textContent = '0 / 0 bài viết';
  } else {
    const percentage = (current / total) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${current} / ${total} bài viết`;
  }
}

function resetUI() {
  isDownloading = false;
  downloadBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
  
  // Don't hide progress info immediately to show final state
  setTimeout(() => {
    if (!isDownloading) {
      progressInfo.classList.add('hidden');
    }
  }, 3000);
}
