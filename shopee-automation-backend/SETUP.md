# 🚀 Setup Guide - Shopee Automation Backend

Hướng dẫn setup và chạy backend server từng bước.

---

## 📋 Yêu cầu

### 1. Node.js
```bash
# Kiểm tra version (cần >= 16.x)
node --version

# Nếu chưa có, tải tại: https://nodejs.org/
```

### 2. Tài khoản Shopee Affiliate
- Đăng ký tại: https://affiliate.shopee.vn/
- Cần có username (email) và password

---

## 🔧 Cài đặt

### Bước 1: Clone hoặc Navigate đến thư mục backend

```bash
cd /workspace/shopee-automation-backend
```

### Bước 2: Install dependencies

```bash
npm install
```

Dependencies sẽ được cài đặt:
- `express` - Web server
- `cors` - CORS support
- `puppeteer` - Browser automation (⚠️ ~300MB download)
- `dotenv` - Environment variables

**Lưu ý:** Puppeteer sẽ tải Chromium (~300MB), có thể mất vài phút.

### Bước 3: Configure credentials

```bash
# Copy .env.example thành .env
cp .env.example .env

# Edit .env với editor
nano .env
# hoặc
vi .env
# hoặc
code .env
```

Điền thông tin:

```env
SHOPEE_USERNAME=your_email@gmail.com
SHOPEE_PASSWORD=your_password
SHOPEE_AFFILIATE_ID=17357490088

PORT=3000
HEADLESS=true
SLOWMO=100
TIMEOUT=30000
```

**⚠️ QUAN TRỌNG:**
- Không commit file `.env` lên git
- Không share username/password với ai
- `HEADLESS=false` để xem browser (debug)
- `HEADLESS=true` để chạy ngầm (production)

---

## 🧪 Test Automation

### Option 1: Test trực tiếp với inspect-selectors.js

```bash
# Mở browser và inspect các selectors
node inspect-selectors.js

# Browser sẽ mở với DevTools
# Đăng nhập thủ công và inspect elements
# Copy các CSS selectors
# Update vào shopee-automation.js (dòng 117-228)
```

### Option 2: Test automation-example.js

```bash
# Sửa config trong automation-example.js (line 14-27)
# Sau đó chạy:
node automation-example.js

# Browser sẽ mở và tự động:
# 1. Init browser
# 2. Login
# 3. Generate affiliate links
# 4. Display results
```

### Option 3: Test với test-automation.js

```bash
# Test đơn giản nhất
node test-automation.js

# Sẽ test:
# ✅ Browser init
# ✅ Login flow
# ✅ Generate 1 test link
# ✅ Display results
```

---

## 🚀 Chạy Server

### Development mode (với auto-reload)

```bash
npm run dev
```

Server sẽ:
- Chạy tại `http://localhost:3000`
- Auto-reload khi có thay đổi file
- Log chi tiết trong console

### Production mode

```bash
npm start
```

Server sẽ:
- Chạy tại `http://localhost:3000`
- Headless mode (không hiện browser)
- Production-ready

---

## 📡 Test API Endpoints

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "service": "Shopee Automation Backend",
  "version": "1.0.0",
  "initialized": true,
  "cacheSize": 0,
  "timestamp": "2025-10-05T..."
}
```

### 2. Convert Single Link

```bash
curl -X POST http://localhost:3000/api/convert-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.vn/product-i.123.456"}'
```

Response:
```json
{
  "success": true,
  "originalUrl": "https://shopee.vn/product-i.123.456",
  "affiliateUrl": "https://shope.ee/XXXXX",
  "timestamp": "2025-10-05T...",
  "cached": false
}
```

### 3. Convert Multiple Links

```bash
curl -X POST http://localhost:3000/api/convert-links \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://shopee.vn/product1-i.1.2",
      "https://shopee.vn/product2-i.3.4"
    ]
  }'
```

### 4. Get Stats

```bash
curl http://localhost:3000/api/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalConverted": 10,
    "successCount": 9,
    "failCount": 1,
    "cacheHits": 5,
    "isLoggedIn": true,
    "affiliateId": "17357490088",
    "cacheSize": 10,
    "uptime": 123.45
  }
}
```

### 5. Clear Cache

```bash
curl -X POST http://localhost:3000/api/clear-cache
```

### 6. Restart Automation

```bash
curl -X POST http://localhost:3000/api/restart
```

---

## 🔍 Troubleshooting

### Lỗi: "Login failed"

**Nguyên nhân:**
- Username/password sai
- 2FA enabled
- Selectors đã thay đổi

**Giải pháp:**
```bash
# 1. Kiểm tra credentials trong .env
cat .env | grep SHOPEE

# 2. Chạy với headless=false để xem lỗi
# Sửa .env: HEADLESS=false
npm start

# 3. Update selectors nếu cần
node inspect-selectors.js
# Copy selectors mới vào shopee-automation.js
```

### Lỗi: "Puppeteer not found"

```bash
# Re-install puppeteer
npm install puppeteer --save
```

### Lỗi: "Port 3000 already in use"

```bash
# Tìm process đang dùng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Hoặc đổi PORT trong .env
PORT=3001
```

### Lỗi: "Chromium not found"

```bash
# Linux: Cài dependencies
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 \
  libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libxss1 fonts-liberation libappindicator1 \
  libnss3 lsb-release xdg-utils wget

# Re-install puppeteer
npm install puppeteer --save
```

### Browser timeout errors

**Giải pháp:**
```env
# Tăng timeout trong .env
TIMEOUT=60000

# Hoặc tăng slowMo để chậm hơn
SLOWMO=200
```

---

## 🔒 Security Notes

### ⚠️ QUAN TRỌNG:

1. **Không commit `.env` lên git**
   ```bash
   # Đã có trong .gitignore
   echo ".env" >> .gitignore
   ```

2. **Không share credentials**
   - Username/password là private
   - API keys (nếu có) là secret

3. **Chạy local hoặc VPS private**
   - Không expose ra internet công khai
   - Dùng HTTPS nếu deploy

4. **Rate limiting**
   - Đã built-in trong code
   - Không spam requests
   - Tránh bị Shopee ban

---

## 📊 Monitoring

### Logs

```bash
# Xem logs real-time
npm start

# Hoặc với PM2
pm2 logs shopee-automation
```

### Stats

```bash
# Xem stats qua API
curl http://localhost:3000/api/stats

# Hoặc dùng browser
open http://localhost:3000/api/stats
```

---

## 🚀 Production Deployment

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start server với PM2
pm2 start server.js --name shopee-automation

# Auto-restart on crash
pm2 startup
pm2 save

# Monitor
pm2 monit

# Logs
pm2 logs shopee-automation

# Restart
pm2 restart shopee-automation

# Stop
pm2 stop shopee-automation
```

### Option 2: Docker (Advanced)

```dockerfile
# Dockerfile (tạo file này nếu cần)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV HEADLESS=true
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
```

Build và run:
```bash
docker build -t shopee-automation .
docker run -d -p 3000:3000 --env-file .env shopee-automation
```

### Option 3: Systemd Service

```bash
# Tạo service file: /etc/systemd/system/shopee-automation.service
[Unit]
Description=Shopee Automation Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/shopee-automation-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target

# Enable và start
sudo systemctl enable shopee-automation
sudo systemctl start shopee-automation
sudo systemctl status shopee-automation
```

---

## ✅ Setup Checklist

- [ ] Node.js installed (>= 16.x)
- [ ] Shopee Affiliate account created
- [ ] `npm install` completed
- [ ] `.env` file created and configured
- [ ] Credentials filled in `.env`
- [ ] Selectors updated (if needed)
- [ ] Test automation chạy thành công
- [ ] Server starts without errors
- [ ] API endpoints tested
- [ ] Extension integration tested

---

## 📞 Support

**Vấn đề với setup:**
1. Đọc Troubleshooting section
2. Check logs: `npm start` và xem console
3. Test từng bước: inspect → example → server

**Vấn đề với Shopee:**
- Email: affiliatesupport@shopee.vn
- Portal: https://affiliate.shopee.vn/

---

**🎉 Setup hoàn tất! Server đã sẵn sàng nhận requests từ extension.**
