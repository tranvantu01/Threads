# Shopee Automation Backend Server

Backend server để tự động convert Shopee links thành affiliate links sử dụng Puppeteer.

## 🎯 Mục đích

Extension Chrome không thể chạy Puppeteer trực tiếp → Cần backend server:
- Extension gửi Shopee links đến backend
- Backend dùng Puppeteer automation để convert
- Backend trả về affiliate links cho extension

## 📦 Cài đặt

### 1. Install Dependencies

```bash
cd shopee-automation-backend
npm install
```

### 2. Configure

Copy `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
SHOPEE_USERNAME=your_email@example.com
SHOPEE_PASSWORD=your_password
SHOPEE_AFFILIATE_ID=17357490088
HEADLESS=true
PORT=3000
```

### 3. Thêm Automation Files

**Chờ bạn cung cấp 4 files:**
1. `shopee-automation.js` (main automation logic)
2. `automation-example.js` (example usage)
3. `inspect-selectors.js` (selector finder)
4. `AUTOMATION-README.md` (documentation)

**Copy vào thư mục này và update:**
- Selectors trong `shopee-automation.js`
- Login flow
- Link conversion flow

## 🚀 Chạy Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "Shopee Automation Backend",
  "version": "1.0.0",
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

### 2. Convert Single Link
```http
POST /api/convert-link
Content-Type: application/json

{
  "url": "https://shopee.vn/product-i.123.456"
}
```

Response:
```json
{
  "success": true,
  "originalUrl": "https://shopee.vn/product-i.123.456",
  "affiliateUrl": "https://shopee.vn/product-i.123.456?af_siteid=17357490088",
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

### 3. Convert Multiple Links (Batch)
```http
POST /api/convert-links
Content-Type: application/json

{
  "urls": [
    "https://shopee.vn/product1-i.1.2",
    "https://shopee.vn/product2-i.3.4",
    "https://shope.ee/ABC"
  ]
}
```

Response:
```json
{
  "success": true,
  "results": [
    {
      "originalUrl": "...",
      "affiliateUrl": "...",
      "success": true
    }
  ],
  "total": 3,
  "converted": 3,
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

### 4. Get Stats
```http
GET /api/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalConverted": 150,
    "successCount": 145,
    "failCount": 5,
    "isLoggedIn": true,
    "affiliateId": "17357490088"
  },
  "timestamp": "2025-10-05T10:30:00.000Z"
}
```

## 🔧 Integration với Extension

Extension sẽ gọi API backend:

```javascript
// Trong popup-v2.js hoặc content.js
async function convertShopeeLink(url) {
  const response = await fetch('http://localhost:3000/api/convert-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();
  return data.affiliateUrl;
}
```

## 📋 TODO - Sau khi nhận files từ bạn

- [ ] Copy 4 files automation vào thư mục này
- [ ] Update `shopee-automation.js` với logic thực tế
- [ ] Tìm selectors bằng `inspect-selectors.js`
- [ ] Update selectors vào automation code
- [ ] Test login flow
- [ ] Test link conversion flow
- [ ] Update error handling
- [ ] Add rate limiting
- [ ] Add caching

## 🧪 Testing

### Test Health Check
```bash
curl http://localhost:3000/health
```

### Test Convert Link
```bash
curl -X POST http://localhost:3000/api/convert-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.vn/test-i.123.456"}'
```

## ⚠️ Lưu ý

### Security
- Không commit `.env` file
- Không share username/password
- Sử dụng HTTPS trong production
- Thêm API key authentication nếu cần

### Rate Limiting
- Shopee có thể rate limit hoặc ban account
- Không gửi quá nhiều requests cùng lúc
- Implement delay giữa các requests
- Monitor for unusual activity

### Puppeteer
- Headless mode để chạy nhanh
- Non-headless để debug
- Handle timeouts và errors
- Close browser properly on exit

## 📊 Architecture

```
Extension (Browser)
    ↓ HTTP Request
Backend Server (Node.js + Express)
    ↓
Puppeteer Automation
    ↓
Shopee Affiliate Dashboard
    ↓
Affiliate Link
    ↓ HTTP Response
Extension (Browser)
```

## 🔄 Workflow

1. User tải profile Threads có link Shopee
2. Extension phát hiện link Shopee
3. Extension gửi link đến backend API
4. Backend dùng Puppeteer automation:
   - Login Shopee Affiliate (nếu chưa)
   - Navigate đến link generator
   - Paste link và generate
   - Get affiliate link
5. Backend trả về affiliate link
6. Extension lưu vào Excel
7. User có affiliate link để share và kiếm tiền!

## 🚀 Deployment

### Local
```bash
npm start
```

### Production (VPS/Cloud)
- Deploy to Heroku / AWS / DigitalOcean
- Set environment variables
- Enable HTTPS
- Monitor logs
- Auto-restart on crash (PM2)

### With PM2
```bash
npm install -g pm2
pm2 start server.js --name shopee-automation
pm2 logs shopee-automation
pm2 restart shopee-automation
```

## 📞 Support

Issues? Check:
1. `.env` config đúng chưa
2. Puppeteer installed chưa
3. Selectors còn đúng không (Shopee có thể thay đổi)
4. Network connection
5. Shopee account bị ban chưa

---

**Status:** ⏳ Đang chờ automation files từ bạn

**Next Steps:**
1. Bạn gửi 4 files automation
2. Tích hợp vào server.js và shopee-automation.js
3. Test thoroughly
4. Update extension để call API
5. Deploy và sử dụng!
