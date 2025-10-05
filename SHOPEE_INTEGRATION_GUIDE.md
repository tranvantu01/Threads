# 🛍️ Shopee Automation Integration Guide

Hướng dẫn tích hợp Shopee Automation với Puppeteer vào extension.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  THREADS DOWNLOADER EXTENSION (Browser)                     │
│                                                              │
│  1. User tải profile Threads                                │
│  2. Extension phát hiện Shopee links                        │
│  3. Extension gọi API backend ─────────┐                    │
│                                         │                    │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          │ HTTP Request
                                          ↓
┌─────────────────────────────────────────────────────────────┐
│  SHOPEE AUTOMATION BACKEND (Node.js Server)                 │
│                                                              │
│  1. Nhận Shopee link từ extension                          │
│  2. Dùng Puppeteer automation                              │
│  3. Login Shopee Affiliate Dashboard                       │
│  4. Generate affiliate link                                │
│  5. Trả về cho extension ──────────┐                       │
│                                     │                        │
└─────────────────────────────────────┼────────────────────────┘
                                      │
                                      │ HTTP Response
                                      ↓
┌─────────────────────────────────────────────────────────────┐
│  EXTENSION (Browser)                                         │
│                                                              │
│  1. Nhận affiliate link                                     │
│  2. Lưu vào Excel (cột 12)                                 │
│  3. User copy link để share → Kiếm tiền! 💰               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Đã Chuẩn Bị Sẵn

### Backend Server Structure
```
/workspace/shopee-automation-backend/
├── server.js                 ✅ Express server với API endpoints
├── shopee-automation.js      ⏳ PLACEHOLDER - Chờ file của bạn
├── package.json              ✅ Dependencies configured
├── .env.example              ✅ Config template
└── README.md                 ✅ Documentation
```

### Extension Integration
```
/workspace/
├── shopee-api-integration.js ✅ API client for extension
└── SHOPEE_INTEGRATION_GUIDE.md ✅ This file
```

## 🚀 Setup Instructions

### BƯỚC 1: Setup Backend Server

```bash
# 1. Vào thư mục backend
cd /workspace/shopee-automation-backend

# 2. Install dependencies
npm install

# 3. Configure
cp .env.example .env
nano .env  # Edit với username/password Shopee

# 4. Chờ bạn cung cấp 4 files automation:
#    - shopee-automation.js
#    - automation-example.js
#    - inspect-selectors.js
#    - AUTOMATION-README.md

# 5. Copy files vào thư mục này
# cp path/to/your/files/* .

# 6. Tìm selectors
# node inspect-selectors.js

# 7. Update selectors vào shopee-automation.js

# 8. Test automation
# node automation-example.js

# 9. Start server
npm start
```

Server chạy tại: `http://localhost:3000`

### BƯỚC 2: Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Test convert link
curl -X POST http://localhost:3000/api/convert-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.vn/test-i.123.456"}'
```

Expected response:
```json
{
  "success": true,
  "originalUrl": "https://shopee.vn/test-i.123.456",
  "affiliateUrl": "https://shopee.vn/test-i.123.456?af_siteid=17357490088",
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

### BƯỚC 3: Integrate vào Extension

#### Option A: Gọi API trực tiếp trong extension

Copy code từ `shopee-api-integration.js` vào `popup-v2.js`:

```javascript
// Thêm vào popup-v2.js

// Initialize Shopee API client
const shopeeAPI = new ShopeeAPI({
  baseUrl: 'http://localhost:3000'
});

// Check backend status
async function checkBackendStatus() {
  const isOnline = await shopeeAPI.healthCheck();
  if (!isOnline) {
    console.warn('Shopee backend offline, using fallback method');
  }
  return isOnline;
}

// Modify processShopeeLinks function
async function processShopeeLinks(data) {
  let shopeeCount = 0;
  
  // Check if backend available
  const useAPI = await checkBackendStatus();

  for (const post of data.posts) {
    if (post.shopeeLinks && post.shopeeLinks.length > 0) {
      post.shopeeLinksConverted = [];
      
      for (const link of post.shopeeLinks) {
        try {
          let converted;
          
          if (useAPI) {
            // Use backend API
            const result = await shopeeAPI.convertLink(link);
            converted = result.affiliateUrl;
          } else {
            // Use fallback method
            converted = shopeeAPI.fallbackConvert(link);
          }
          
          post.shopeeLinksConverted.push(converted);
          shopeeCount++;
          
        } catch (error) {
          console.error('Error converting link:', error);
          // Use fallback
          post.shopeeLinksConverted.push(
            shopeeAPI.fallbackConvert(link)
          );
        }
      }
    }
  }

  data.totalShopeeLinksConverted = shopeeCount;
  return data;
}
```

#### Option B: Add as separate script

1. Copy `shopee-api-integration.js` vào extension folder
2. Add vào manifest.json:

```json
{
  "background": {
    "service_worker": "background-v2.js"
  },
  "content_scripts": [
    {
      "matches": ["https://www.threads.com/*"],
      "js": ["shopee-api-integration.js", "content.js"]
    }
  ]
}
```

## 📋 TODO Checklist

### Backend Setup
- [ ] Bạn gửi 4 files automation
- [ ] Copy files vào `/workspace/shopee-automation-backend/`
- [ ] Run `npm install`
- [ ] Configure `.env` với Shopee credentials
- [ ] Run `inspect-selectors.js` để tìm selectors
- [ ] Update selectors vào `shopee-automation.js`
- [ ] Test với `automation-example.js`
- [ ] Start server: `npm start`
- [ ] Verify API endpoints work

### Extension Integration
- [ ] Copy `shopee-api-integration.js` code vào extension
- [ ] Update `popup-v2.js` để gọi API
- [ ] Test với backend running
- [ ] Test fallback khi backend offline
- [ ] Update UI để show backend status
- [ ] Test end-to-end flow

### Testing
- [ ] Test single link conversion
- [ ] Test batch conversion (multiple links)
- [ ] Test với Threads profile có Shopee links
- [ ] Test Excel export với converted links
- [ ] Test error handling
- [ ] Test fallback method

## 🔧 Configuration

### Backend (.env)
```env
SHOPEE_USERNAME=your_email@example.com
SHOPEE_PASSWORD=your_password
SHOPEE_AFFILIATE_ID=17357490088
HEADLESS=true
PORT=3000
```

### Extension (popup-v2.js)
```javascript
const BACKEND_URL = 'http://localhost:3000';
const USE_BACKEND_API = true; // false = use fallback only
const API_TIMEOUT = 10000; // 10 seconds
```

## 🎯 API Endpoints

### 1. Health Check
```
GET /health
```

### 2. Convert Single Link
```
POST /api/convert-link
Body: { "url": "https://shopee.vn/..." }
```

### 3. Convert Multiple Links
```
POST /api/convert-links
Body: { "urls": ["url1", "url2", ...] }
```

### 4. Get Stats
```
GET /api/stats
```

## ⚠️ Important Notes

### Security
- Backend chạy local (localhost:3000)
- Không expose ra internet (hoặc dùng HTTPS)
- Không commit `.env` với credentials
- Consider API key authentication

### Performance
- Backend cache results để tránh duplicate conversions
- Rate limiting để tránh bị Shopee ban
- Batch processing để tối ưu
- Timeout và retry logic

### Fallback Strategy
- Extension luôn có fallback method (URL parameter)
- Nếu backend offline → dùng fallback
- Nếu API timeout → dùng fallback
- Nếu error → dùng fallback

### User Experience
- Show backend status indicator trong UI
- "🟢 API Mode" hoặc "🔴 Fallback Mode"
- Loading states cho API calls
- Clear error messages

## 🔄 Workflow Example

```javascript
// User tải profile Threads
const data = await downloadProfile(url);

// Process Shopee links
for (const post of data.posts) {
  const shopeeLinks = extractShopeeLinks(post.content);
  
  if (shopeeLinks.length > 0) {
    // Try API first
    const results = await shopeeAPI.convertLinks(shopeeLinks);
    
    // Save to data
    post.shopeeLinks = shopeeLinks;
    post.shopeeLinksConverted = results.map(r => r.affiliateUrl);
  }
}

// Export to Excel
exportToExcel(data);
// Column 11: Original Shopee links
// Column 12: Converted affiliate links ✅
```

## 📊 Excel Output Format

| Link Shopee (Original) | Link Shopee đã đổi ID (Affiliate) |
|------------------------|-----------------------------------|
| shopee.vn/product-i.1.2 | shopee.vn/product-i.1.2?af_siteid=17357490088 |
| shope.ee/ABC | shope.ee/ABC?af_siteid=17357490088 |

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check port already in use
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

### API calls failing
```bash
# Check backend is running
curl http://localhost:3000/health

# Check network
ping localhost

# Check logs
npm start  # See console output
```

### Puppeteer errors
```bash
# Install dependencies (Linux)
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
  libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
  libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
  libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
  libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
  libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Selectors not working
```bash
# Run inspector
node inspect-selectors.js

# Update selectors in shopee-automation.js
# Test again
node automation-example.js
```

## 🚀 Production Deployment

### Deploy Backend to VPS/Cloud

1. **Setup Server**
```bash
# SSH to server
ssh user@your-server.com

# Clone/upload code
git clone your-repo
cd shopee-automation-backend

# Install
npm install --production

# Configure
nano .env
```

2. **Use PM2**
```bash
npm install -g pm2
pm2 start server.js --name shopee-api
pm2 save
pm2 startup
```

3. **Setup NGINX (optional)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Update Extension**
```javascript
// Change backend URL
const BACKEND_URL = 'https://your-domain.com';
```

## 📞 Next Steps

1. **Bạn gửi 4 files automation**
2. **Tôi tích hợp vào backend**
3. **Test thoroughly**
4. **Deploy và sử dụng**
5. **Kiếm tiền với affiliate links! 💰**

---

**Status:** ⏳ Đang chờ files automation từ bạn

**Chuẩn bị sẵn:**
- ✅ Backend server structure
- ✅ API endpoints
- ✅ Extension integration code
- ✅ Documentation
- ⏳ Chờ automation logic từ bạn

**Khi có files → Tích hợp ngay → Test → Done!**
