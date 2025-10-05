# 🔌 Backend Integration Guide

Hướng dẫn tích hợp Shopee Automation Backend API vào Threads Downloader Extension.

---

## 🎯 Overview

```
EXTENSION (Browser) → API Calls → BACKEND SERVER (Node.js + Puppeteer)
                                          ↓
                                   Shopee Affiliate Dashboard
                                          ↓
                                   Affiliate Short Links
```

---

## 📋 Prerequisites

### 1. Backend Server đã chạy

```bash
cd /workspace/shopee-automation-backend
npm install
cp .env.example .env
# Edit .env với credentials
npm start

# Server chạy tại: http://localhost:3000
```

### 2. Extension đã cài đặt

```
- Load extension trong Chrome
- Extension ID và permissions đã OK
```

---

## 🔧 Integration Steps

### Bước 1: Update shopee-api-integration.js

File `/workspace/shopee-api-integration.js` đã có sẵn template. Copy vào extension:

```bash
# Copy vào root extension folder
cp /workspace/shopee-api-integration.js /workspace/
```

Nội dung file:

```javascript
/**
 * Shopee API Integration Client
 * For Threads Downloader Extension v2.0
 */

class ShopeeAPI {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.timeout = config.timeout || 10000;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      const data = await response.json();
      return data.status === 'ok' && data.initialized;
    } catch (error) {
      console.warn('Backend offline:', error);
      return false;
    }
  }

  async convertLink(url) {
    try {
      const response = await fetch(`${this.baseUrl}/api/convert-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        timeout: this.timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error converting link:', error);
      return {
        success: false,
        error: error.message,
        originalUrl: url,
        affiliateUrl: this.fallbackConvert(url)
      };
    }
  }

  async convertLinks(urls) {
    try {
      const response = await fetch(`${this.baseUrl}/api/convert-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
        timeout: this.timeout * urls.length
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error converting links:', error);
      // Fallback to URL parameter method
      return {
        success: true,
        results: urls.map(url => ({
          originalUrl: url,
          affiliateUrl: this.fallbackConvert(url),
          success: true,
          cached: false
        }))
      };
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`);
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fallback method: Simple URL parameter
  fallbackConvert(url) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('af_siteid', '17357490088');
      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }
}

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopeeAPI;
}
```

### Bước 2: Integrate vào popup-v2.js

Thêm ShopeeAPI client vào đầu file `popup-v2.js`:

```javascript
// ============================================
// SHOPEE API CLIENT
// ============================================

class ShopeeAPI {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.timeout = config.timeout || 10000;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET'
      });
      const data = await response.json();
      return data.status === 'ok' && data.initialized;
    } catch (error) {
      console.warn('⚠️ Backend offline, using fallback method');
      return false;
    }
  }

  async convertLink(url) {
    try {
      const response = await fetch(`${this.baseUrl}/api/convert-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error converting link:', error);
      return {
        success: false,
        error: error.message,
        originalUrl: url,
        affiliateUrl: this.fallbackConvert(url)
      };
    }
  }

  async convertLinks(urls) {
    try {
      const response = await fetch(`${this.baseUrl}/api/convert-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error converting links:', error);
      return {
        success: true,
        results: urls.map(url => ({
          originalUrl: url,
          affiliateUrl: this.fallbackConvert(url),
          success: true
        }))
      };
    }
  }

  fallbackConvert(url) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('af_siteid', '17357490088');
      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }
}

// Initialize API client
const shopeeAPI = new ShopeeAPI({
  baseUrl: 'http://localhost:3000'
});
```

### Bước 3: Update Shopee link processing

Tìm function xử lý Shopee links trong `popup-v2.js` và update:

```javascript
/**
 * Process Shopee links với backend API
 */
async function processShopeeLinks(data) {
  // Check if backend is online
  const backendOnline = await shopeeAPI.healthCheck();
  
  console.log(`🔗 Backend status: ${backendOnline ? '✅ Online (API mode)' : '⚠️ Offline (Fallback mode)'}`);
  
  // Collect all Shopee links from all posts
  const allShopeeLinks = [];
  for (const post of data.posts) {
    if (post.shopeeLinks && post.shopeeLinks.length > 0) {
      allShopeeLinks.push(...post.shopeeLinks);
    }
  }
  
  if (allShopeeLinks.length === 0) {
    return data; // No Shopee links to convert
  }
  
  // Convert links
  let convertedLinksMap = new Map();
  
  if (backendOnline) {
    // Use backend API (batch conversion)
    console.log(`📦 Converting ${allShopeeLinks.length} links via API...`);
    
    const result = await shopeeAPI.convertLinks(allShopeeLinks);
    
    if (result.success) {
      result.results.forEach(r => {
        if (r.success) {
          convertedLinksMap.set(r.originalUrl, r.affiliateUrl);
        }
      });
      console.log(`✅ Converted ${result.converted}/${result.total} links`);
    }
  } else {
    // Use fallback method
    console.log(`⚠️ Using fallback method for ${allShopeeLinks.length} links...`);
    
    allShopeeLinks.forEach(link => {
      convertedLinksMap.set(link, shopeeAPI.fallbackConvert(link));
    });
  }
  
  // Apply converted links back to posts
  for (const post of data.posts) {
    if (post.shopeeLinks && post.shopeeLinks.length > 0) {
      post.shopeeLinksConverted = post.shopeeLinks.map(link => 
        convertedLinksMap.get(link) || link
      );
    }
  }
  
  data.totalShopeeLinksConverted = convertedLinksMap.size;
  data.backendMode = backendOnline ? 'API' : 'Fallback';
  
  return data;
}
```

### Bước 4: Update UI để hiển thị backend status

Thêm status indicator trong popup:

```javascript
// Thêm vào HTML
<div class="backend-status" id="backendStatus">
  <span class="status-dot"></span>
  <span class="status-text">Checking backend...</span>
</div>

// CSS
.backend-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e0;
}

.status-dot.online {
  background: #48bb78;
  animation: pulse 2s infinite;
}

.status-dot.offline {
  background: #f56565;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// JavaScript để update status
async function updateBackendStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  
  const isOnline = await shopeeAPI.healthCheck();
  
  if (isOnline) {
    statusDot.classList.add('online');
    statusDot.classList.remove('offline');
    statusText.textContent = '🟢 API Mode (Backend Online)';
  } else {
    statusDot.classList.add('offline');
    statusDot.classList.remove('online');
    statusText.textContent = '🔴 Fallback Mode (Backend Offline)';
  }
}

// Check status on load
document.addEventListener('DOMContentLoaded', () => {
  updateBackendStatus();
  
  // Re-check every 30 seconds
  setInterval(updateBackendStatus, 30000);
});
```

---

## 🧪 Testing

### Test 1: Backend Health Check

```javascript
// Run in extension console (F12)
const api = new ShopeeAPI({ baseUrl: 'http://localhost:3000' });
const isOnline = await api.healthCheck();
console.log('Backend online:', isOnline);
```

### Test 2: Single Link Conversion

```javascript
const result = await api.convertLink('https://shopee.vn/product-i.123.456');
console.log('Result:', result);
// Expected: { success: true, originalUrl: '...', affiliateUrl: 'https://shope.ee/...' }
```

### Test 3: Batch Conversion

```javascript
const urls = [
  'https://shopee.vn/product1-i.1.2',
  'https://shopee.vn/product2-i.3.4'
];
const result = await api.convertLinks(urls);
console.log('Results:', result);
// Expected: { success: true, results: [...], converted: 2 }
```

### Test 4: Full Integration

```
1. Mở extension
2. Navigate to Threads profile có Shopee links
3. Click "Tải dữ liệu"
4. Check console logs:
   - "Backend status: ✅ Online (API mode)"
   - "Converting X links via API..."
   - "✅ Converted X/X links"
5. Export Excel
6. Verify column 12 có affiliate links
```

---

## 🔄 Workflow Diagram

```
USER clicks "Tải dữ liệu"
    ↓
Extension extracts Shopee links from Threads posts
    ↓
Check backend health: await shopeeAPI.healthCheck()
    ↓
    ├─ Backend ONLINE → Use API
    |       ↓
    |   POST /api/convert-links
    |       ↓
    |   Backend: Puppeteer automation
    |       ↓
    |   Return affiliate links
    |       ↓
    |   Extension: Update data
    |
    └─ Backend OFFLINE → Use Fallback
            ↓
        Simple URL parameter method
        url?af_siteid=17357490088
            ↓
        Extension: Update data
    ↓
Export to Excel với converted links
```

---

## ⚙️ Configuration

### Backend URL

```javascript
// Development (local)
const shopeeAPI = new ShopeeAPI({
  baseUrl: 'http://localhost:3000'
});

// Production (deployed)
const shopeeAPI = new ShopeeAPI({
  baseUrl: 'https://your-server.com'
});
```

### Timeout Settings

```javascript
const shopeeAPI = new ShopeeAPI({
  baseUrl: 'http://localhost:3000',
  timeout: 10000  // 10 seconds per link
});
```

### Fallback Affiliate ID

```javascript
// Update trong shopeeAPI.fallbackConvert()
urlObj.searchParams.set('af_siteid', 'YOUR_AFFILIATE_ID');
```

---

## 🐛 Troubleshooting

### Issue: "Backend offline" luôn luôn

**Kiểm tra:**
```bash
# 1. Backend có chạy không?
curl http://localhost:3000/health

# 2. CORS có OK không?
# Xem browser console (F12) → Network tab

# 3. Port đúng chưa?
# Check PORT trong .env
```

**Giải pháp:**
```bash
# Restart backend
cd /workspace/shopee-automation-backend
npm start

# Check logs
```

### Issue: "Failed to fetch" error

**Nguyên nhân:** CORS policy

**Giải pháp:** Đã có `cors()` middleware trong server.js, nhưng nếu vẫn lỗi:

```javascript
// Update server.js
app.use(cors({
  origin: '*',  // Allow all origins (development only)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

### Issue: Conversion chậm

**Nguyên nhân:** Puppeteer automation mất thời gian

**Giải pháp:**
```javascript
// Tăng timeout
const shopeeAPI = new ShopeeAPI({
  timeout: 30000  // 30 seconds
});

// Hoặc giảm slowMo trong backend .env
SLOWMO=50
```

### Issue: Extension crashes

**Nguyên nhân:** API timeout quá lâu

**Giải pháp:**
```javascript
// Add timeout cho fetch
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const response = await fetch(url, {
  signal: controller.signal
});
clearTimeout(timeoutId);
```

---

## 📊 Performance Tips

### 1. Batch Processing

```javascript
// ✅ GOOD: Batch all links together
await shopeeAPI.convertLinks(allLinks);

// ❌ BAD: Loop individual converts
for (const link of links) {
  await shopeeAPI.convertLink(link); // Slow!
}
```

### 2. Cache Check

```javascript
// Backend tự động cache, nhưng extension cũng có thể cache
const linkCache = new Map();

async function convertWithCache(url) {
  if (linkCache.has(url)) {
    return linkCache.get(url);
  }
  
  const result = await shopeeAPI.convertLink(url);
  if (result.success) {
    linkCache.set(url, result.affiliateUrl);
  }
  
  return result.affiliateUrl;
}
```

### 3. Parallel Downloads

```javascript
// Nếu tải nhiều profiles, xử lý parallel
const promises = urls.map(url => downloadAndConvert(url));
const results = await Promise.all(promises);
```

---

## ✅ Integration Checklist

- [ ] Backend server installed và chạy
- [ ] Backend health check returns OK
- [ ] ShopeeAPI class added to popup-v2.js
- [ ] processShopeeLinks() function updated
- [ ] UI status indicator added
- [ ] Test single link conversion
- [ ] Test batch conversion
- [ ] Test fallback mode (backend offline)
- [ ] Test full workflow: Threads → Download → Export
- [ ] Excel có column 12 với converted links
- [ ] Performance OK (không quá chậm)

---

## 🚀 Next Steps

1. ✅ Setup backend (SETUP.md)
2. ✅ Integrate API vào extension (this guide)
3. ✅ Test thoroughly
4. ✅ Deploy backend to VPS (optional)
5. ✅ Update extension URL to production backend
6. ✅ Publish extension
7. ✅ Kiếm tiền với affiliate links! 💰

---

**🎉 Integration complete! Extension giờ có thể tạo affiliate links tự động qua backend API!**
