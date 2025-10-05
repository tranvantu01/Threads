// Popup script for Threads Data Downloader Pro v2.0
let isDownloading = false;
let shouldStop = false;
let currentTab = 'single';
let allData = [];

const SHOPEE_AFFILIATE_ID = '17357490088';

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const downloadBtn = document.getElementById('downloadBtn');
const stopBtn = document.getElementById('stopBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const progressInfo = document.getElementById('progressInfo');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');

// Multiple URLs
const urlList = document.getElementById('urlList');
const fileUpload = document.getElementById('fileUpload');
const fileName = document.getElementById('fileName');
const multiStatus = document.getElementById('multiStatus');
const multiProgressText = document.getElementById('multiProgressText');
const multiProgressFill = document.getElementById('multiProgressFill');

// Schedule
const scheduleDate = document.getElementById('scheduleDate');
const scheduleTime = document.getElementById('scheduleTime');
const scheduleUrl = document.getElementById('scheduleUrl');
const addScheduleBtn = document.getElementById('addScheduleBtn');
const scheduleItems = document.getElementById('scheduleItems');

// Options
const includeMedia = document.getElementById('includeMedia');
const includeFirstComment = document.getElementById('includeFirstComment');
const includeEngagement = document.getElementById('includeEngagement');
const convertShopee = document.getElementById('convertShopee');
const postLimit = document.getElementById('postLimit');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  loadScheduledTasks();
  setupEventListeners();
  checkIfOnThreadsPage();
});

function setupEventListeners() {
  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Download button
  downloadBtn.addEventListener('click', handleDownload);
  stopBtn.addEventListener('click', stopDownload);

  // File upload
  fileUpload.addEventListener('change', handleFileUpload);

  // Schedule
  addScheduleBtn.addEventListener('click', addSchedule);

  // Save preferences
  [includeMedia, includeFirstComment, includeEngagement, convertShopee].forEach(checkbox => {
    checkbox.addEventListener('change', savePreferences);
  });
  postLimit.addEventListener('change', savePreferences);
}

function switchTab(tabName) {
  currentTab = tabName;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  tabContents.forEach(tc => {
    const id = tc.id.replace('tab-', '');
    tc.classList.toggle('active', id === tabName);
  });
}

async function handleDownload() {
  if (isDownloading) return;

  if (currentTab === 'single') {
    await downloadSingle();
  } else if (currentTab === 'multiple') {
    await downloadMultiple();
  }
}

async function downloadSingle() {
  isDownloading = true;
  shouldStop = false;
  allData = [];
  
  downloadBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  progressInfo.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  updateStatus('working', 'Đang thu thập dữ liệu...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const options = getOptions();

    chrome.tabs.sendMessage(tab.id, { 
      action: 'startDownload', 
      options,
      mode: 'single'
    }, handleDownloadResponse);

    chrome.runtime.onMessage.addListener(handleMessages);

  } catch (error) {
    updateStatus('error', 'Lỗi: ' + error.message);
    resetUI();
  }
}

async function downloadMultiple() {
  const urls = getUrlsFromInput();
  
  if (urls.length === 0) {
    alert('Vui lòng nhập ít nhất 1 URL hoặc upload file TXT!');
    return;
  }

  isDownloading = true;
  shouldStop = false;
  allData = [];
  
  downloadBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  updateMultiProgress(0, urls.length, 'Đang bắt đầu...');

  const options = getOptions();
  let completed = 0;

  for (let i = 0; i < urls.length && !shouldStop; i++) {
    const url = urls[i];
    updateMultiProgress(i, urls.length, `Đang xử lý: ${url}`);

    try {
      const data = await downloadProfileByUrl(url, options);
      if (data) {
        allData.push(data);
      }
      completed++;
    } catch (error) {
      console.error(`Error downloading ${url}:`, error);
    }

    updateMultiProgress(completed, urls.length, `Đã hoàn thành: ${completed}/${urls.length}`);
    
    // Delay giữa các profile
    if (i < urls.length - 1) {
      await sleep(2000);
    }
  }

  if (!shouldStop) {
    exportAllData(allData);
    showResults(allData);
  }

  resetUI();
}

function getUrlsFromInput() {
  const text = urlList.value.trim();
  if (!text) return [];
  
  return text.split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0 && url.includes('threads.com'));
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    urlList.value = content;
  };
  reader.readAsText(file);
}

async function downloadProfileByUrl(url, options) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url, active: false }, (tab) => {
      const tabId = tab.id;

      // Wait for page to load
      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);

          // Start download
          chrome.tabs.sendMessage(tabId, {
            action: 'startDownload',
            options,
            mode: 'background'
          }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              // Listen for completion
              const messageListener = (message) => {
                if (message.action === 'complete' && message.tabId === tabId) {
                  chrome.runtime.onMessage.removeListener(messageListener);
                  chrome.tabs.remove(tabId);
                  resolve(message.data);
                }
              };
              chrome.runtime.onMessage.addListener(messageListener);
            }
          });
        }
      });
    });
  });
}

function handleDownloadResponse(response) {
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
  
  // Process Shopee links if enabled
  if (convertShopee.checked) {
    data = processShopeeLinks(data);
  }

  allData = [data];
  exportAllData(allData);
  showResults(allData);
  resetUI();
}

function processShopeeLinks(data) {
  let shopeeCount = 0;

  data.posts.forEach(post => {
    // Process content
    const shopeeLinks = extractShopeeLinks(post.content);
    post.shopeeLinks = shopeeLinks.original;
    post.shopeeLinksConverted = shopeeLinks.converted;
    shopeeCount += shopeeLinks.original.length;

    // Process first comment
    if (post.firstComment && post.firstComment.text) {
      const commentShopee = extractShopeeLinks(post.firstComment.text);
      if (!post.shopeeLinks) post.shopeeLinks = [];
      if (!post.shopeeLinksConverted) post.shopeeLinksConverted = [];
      post.shopeeLinks.push(...commentShopee.original);
      post.shopeeLinksConverted.push(...commentShopee.converted);
      shopeeCount += commentShopee.original.length;
    }

    // Process firstComment links array
    if (post.firstComment && post.firstComment.links) {
      post.firstComment.links.forEach(link => {
        if (isShopeeLink(link)) {
          const converted = convertToAffiliateLink(link);
          if (!post.shopeeLinks) post.shopeeLinks = [];
          if (!post.shopeeLinksConverted) post.shopeeLinksConverted = [];
          post.shopeeLinks.push(link);
          post.shopeeLinksConverted.push(converted);
          shopeeCount++;
        }
      });
    }
  });

  data.totalShopeeLinksConverted = shopeeCount;
  return data;
}

function extractShopeeLinks(text) {
  const original = [];
  const converted = [];
  
  // Regex patterns for Shopee links
  const patterns = [
    /https?:\/\/(?:www\.)?shopee\.vn\/[^\s]+/gi,
    /https?:\/\/(?:www\.)?shopee\.com\.vn\/[^\s]+/gi,
    /https?:\/\/shope\.ee\/[^\s]+/gi
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(link => {
      original.push(link);
      converted.push(convertToAffiliateLink(link));
    });
  });

  return { original, converted };
}

function isShopeeLink(url) {
  return url.includes('shopee.vn') || 
         url.includes('shopee.com.vn') || 
         url.includes('shope.ee');
}

function convertToAffiliateLink(url) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('af_siteid', SHOPEE_AFFILIATE_ID);
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, append manually
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}af_siteid=${SHOPEE_AFFILIATE_ID}`;
  }
}

function exportAllData(dataArray) {
  const format = document.querySelector('input[name="exportFormat"]:checked').value;

  if (format === 'excel') {
    exportToExcel(dataArray);
  } else if (format === 'csv') {
    exportToCSV(dataArray);
  } else {
    exportToJSON(dataArray);
  }
}

function exportToExcel(dataArray) {
  const rows = [];
  
  // Header
  rows.push([
    'STT',
    'Tên Tài Khoản',
    'Content',
    'Số lượng media',
    'Media URLs',
    'Lượt thích',
    'Bình luận',
    'Đăng lại',
    'Chia sẻ',
    'Comment đầu',
    'Link Shopee',
    'Link Shopee đã đổi ID',
    'Thời gian tải'
  ]);

  let stt = 1;
  const downloadTime = new Date().toLocaleString('vi-VN');

  dataArray.forEach(profileData => {
    profileData.posts.forEach(post => {
      rows.push([
        stt++,
        profileData.username,
        post.content || '',
        post.media?.length || 0,
        post.media?.map(m => m.url).join('\n') || '',
        post.engagement?.likes || 0,
        post.engagement?.comments || 0,
        post.engagement?.reposts || 0,
        post.engagement?.shares || 0,
        post.firstComment?.text || '',
        post.shopeeLinks?.join('\n') || '',
        post.shopeeLinksConverted?.join('\n') || '',
        downloadTime
      ]);
    });
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Auto width
  const colWidths = [
    { wch: 5 },  // STT
    { wch: 20 }, // Tên
    { wch: 50 }, // Content
    { wch: 10 }, // Số media
    { wch: 40 }, // Media URLs
    { wch: 10 }, // Likes
    { wch: 10 }, // Comments
    { wch: 10 }, // Reposts
    { wch: 10 }, // Shares
    { wch: 30 }, // Comment đầu
    { wch: 40 }, // Shopee links
    { wch: 40 }, // Shopee converted
    { wch: 20 }  // Time
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Threads Data');

  // Save file
  const filename = `threads_data_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

function exportToCSV(dataArray) {
  const rows = [];
  
  // Header
  rows.push([
    'STT', 'Tên Tài Khoản', 'Content', 'Số lượng media', 'Media URLs',
    'Lượt thích', 'Bình luận', 'Đăng lại', 'Chia sẻ', 'Comment đầu',
    'Link Shopee', 'Link Shopee đã đổi ID', 'Thời gian tải'
  ]);

  let stt = 1;
  const downloadTime = new Date().toLocaleString('vi-VN');

  dataArray.forEach(profileData => {
    profileData.posts.forEach(post => {
      rows.push([
        stt++,
        profileData.username,
        `"${(post.content || '').replace(/"/g, '""')}"`,
        post.media?.length || 0,
        `"${post.media?.map(m => m.url).join('; ') || ''}"`,
        post.engagement?.likes || 0,
        post.engagement?.comments || 0,
        post.engagement?.reposts || 0,
        post.engagement?.shares || 0,
        `"${(post.firstComment?.text || '').replace(/"/g, '""')}"`,
        `"${(post.shopeeLinks?.join('; ') || '')}"`,
        `"${(post.shopeeLinksConverted?.join('; ') || '')}"`,
        downloadTime
      ]);
    });
  });

  const csv = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const filename = `threads_data_${Date.now()}.csv`;

  chrome.downloads.download({ url, filename, saveAs: true });
  URL.revokeObjectURL(url);
}

function exportToJSON(dataArray) {
  const json = JSON.stringify(dataArray, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `threads_data_${Date.now()}.json`;

  chrome.downloads.download({ url, filename, saveAs: true }, () => {
    URL.revokeObjectURL(url);
  });
}

function showResults(dataArray) {
  let totalPosts = 0;
  let totalMedia = 0;
  let totalShopee = 0;

  dataArray.forEach(data => {
    totalPosts += data.posts.length;
    data.posts.forEach(post => {
      totalMedia += post.media?.length || 0;
      totalShopee += post.shopeeLinks?.length || 0;
    });
  });

  document.getElementById('totalProfiles').textContent = dataArray.length;
  document.getElementById('totalPosts').textContent = totalPosts;
  document.getElementById('totalMedia').textContent = totalMedia;
  document.getElementById('totalShopeeLinks').textContent = totalShopee;
  
  resultsSection.classList.remove('hidden');
  updateStatus('ready', 'Tải xuống thành công! ✓');
}

// Schedule functions
function addSchedule() {
  const date = scheduleDate.value;
  const time = scheduleTime.value;
  const url = scheduleUrl.value.trim();

  if (!date || !time || !url) {
    alert('Vui lòng điền đầy đủ thông tin lịch trình!');
    return;
  }

  const scheduleTime = new Date(`${date}T${time}`);
  if (scheduleTime < new Date()) {
    alert('Thời gian phải sau thời điểm hiện tại!');
    return;
  }

  const schedule = {
    id: Date.now(),
    date,
    time,
    url,
    datetime: scheduleTime.getTime(),
    options: getOptions()
  };

  saveSchedule(schedule);
  displaySchedules();
  
  // Clear inputs
  scheduleDate.value = '';
  scheduleTime.value = '';
  scheduleUrl.value = '';
}

function saveSchedule(schedule) {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    schedules.push(schedule);
    chrome.storage.local.set({ schedules });
    
    // Set alarm
    chrome.alarms.create(`schedule_${schedule.id}`, {
      when: schedule.datetime
    });
  });
}

function loadScheduledTasks() {
  displaySchedules();
  
  // Check alarms
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('schedule_')) {
      const scheduleId = parseInt(alarm.name.replace('schedule_', ''));
      executeScheduledTask(scheduleId);
    }
  });
}

function displaySchedules() {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const now = Date.now();
    
    // Filter out past schedules
    const activeSchedules = schedules.filter(s => s.datetime > now);
    chrome.storage.local.set({ schedules: activeSchedules });

    if (activeSchedules.length === 0) {
      scheduleItems.innerHTML = '<p class="no-schedules">Chưa có lịch trình nào</p>';
      return;
    }

    scheduleItems.innerHTML = activeSchedules.map(s => `
      <div class="schedule-item" data-id="${s.id}">
        <div class="schedule-info">
          <div class="schedule-time">⏰ ${s.date} ${s.time}</div>
          <div class="schedule-url">${s.url}</div>
        </div>
        <button class="delete-schedule" data-id="${s.id}">🗑️</button>
      </div>
    `).join('');

    // Add delete handlers
    document.querySelectorAll('.delete-schedule').forEach(btn => {
      btn.addEventListener('click', () => deleteSchedule(parseInt(btn.dataset.id)));
    });
  });
}

function deleteSchedule(scheduleId) {
  chrome.storage.local.get(['schedules'], (result) => {
    const schedules = result.schedules || [];
    const filtered = schedules.filter(s => s.id !== scheduleId);
    chrome.storage.local.set({ schedules: filtered });
    chrome.alarms.clear(`schedule_${scheduleId}`);
    displaySchedules();
  });
}

function executeScheduledTask(scheduleId) {
  chrome.storage.local.get(['schedules'], async (result) => {
    const schedules = result.schedules || [];
    const schedule = schedules.find(s => s.id === scheduleId);
    
    if (schedule) {
      // Execute download
      const data = await downloadProfileByUrl(schedule.url, schedule.options);
      if (data) {
        exportAllData([data]);
      }
      
      // Remove schedule
      deleteSchedule(scheduleId);
    }
  });
}

// Utility functions
function getOptions() {
  return {
    includeMedia: includeMedia.checked,
    includeFirstComment: includeFirstComment.checked,
    includeEngagement: includeEngagement.checked,
    convertShopee: convertShopee.checked,
    limit: parseInt(postLimit.value) || 50
  };
}

function loadPreferences() {
  chrome.storage.sync.get([
    'includeMedia', 'includeFirstComment', 'includeEngagement', 
    'convertShopee', 'postLimit'
  ], (result) => {
    if (result.includeMedia !== undefined) includeMedia.checked = result.includeMedia;
    if (result.includeFirstComment !== undefined) includeFirstComment.checked = result.includeFirstComment;
    if (result.includeEngagement !== undefined) includeEngagement.checked = result.includeEngagement;
    if (result.convertShopee !== undefined) convertShopee.checked = result.convertShopee;
    if (result.postLimit) postLimit.value = result.postLimit;
  });
}

function savePreferences() {
  chrome.storage.sync.set({
    includeMedia: includeMedia.checked,
    includeFirstComment: includeFirstComment.checked,
    includeEngagement: includeEngagement.checked,
    convertShopee: convertShopee.checked,
    postLimit: parseInt(postLimit.value) || 50
  });
}

function checkIfOnThreadsPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && !tabs[0].url.includes('threads.com')) {
      if (currentTab === 'single') {
        updateStatus('error', 'Vui lòng mở trang Threads');
        downloadBtn.disabled = true;
      }
    }
  });
}

function stopDownload() {
  shouldStop = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stopDownload' });
    }
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

function updateMultiProgress(current, total, text) {
  multiProgressText.textContent = text;
  if (total > 0) {
    const percentage = (current / total) * 100;
    multiProgressFill.style.width = percentage + '%';
  }
}

function resetUI() {
  isDownloading = false;
  downloadBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
  
  setTimeout(() => {
    if (!isDownloading) {
      progressInfo.classList.add('hidden');
    }
  }, 3000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
