# 🤖 HƯỚNG DẪN SỬ DỤNG BROWSER AUTOMATION

## ⚠️ DISCLAIMER - ĐỌC KỸ TRƯỚC KHI DÙNG!

### Cảnh báo quan trọng:

```
⚠️  Code này vi phạm Shopee Terms of Service
⚠️  Tài khoản có thể bị ban/suspend vĩnh viễn
⚠️  Chỉ dùng để học tập/nghiên cứu
⚠️  KHÔNG dùng cho mục đích thương mại
⚠️  BẠN TỰ CHỊU TRÁCH NHIỆM KHI SỬ DỤNG!
```

---

## 📋 YÊU CẦU HỆ THỐNG

- **Node.js**: >= 18.0.0
- **RAM**: >= 4GB (Puppeteer cần nhiều RAM)
- **Disk**: >= 500MB (cho Chromium)
- **Internet**: Kết nối ổn định

---

## 🚀 CÁCH CÀI ĐẶT

### Bước 1: Cài đặt Puppeteer

```bash
npm install puppeteer
```

⏳ **Lưu ý:** Lần đầu sẽ mất 3-5 phút vì Puppeteer tải Chromium (~170MB)

### Bước 2: Kiểm tra cài đặt

```bash
node -e "console.log(require('puppeteer'))"
```

Nếu không có lỗi → Cài đặt thành công!

---

## 🔧 BƯỚC 1: TÌM CSS SELECTORS (QUAN TRỌNG!)

**⚠️ Bạn PHẢI làm bước này trước!**

Shopee Affiliate Portal có thể thay đổi HTML, nên bạn cần tự tìm selectors.

### Chạy tool inspect:

```bash
node inspect-selectors.js
```

**Script này sẽ:**
1. Mở browser với DevTools
2. Bạn đăng nhập thủ công
3. Bạn inspect các elements và copy selectors
4. Cập nhật vào `shopee-automation.js`

### Các selectors cần tìm:

#### 1. **Login Page** (`/login`)

```javascript
// Username/Email input
const usernameSelector = 'input[name="username"]';  // ← Cập nhật selector này

// Password input
const passwordSelector = 'input[type="password"]';  // ← Cập nhật selector này

// Login button
const loginButtonSelector = 'button[type="submit"]'; // ← Cập nhật selector này
```

#### 2. **Create Link Page** (`/offer/product_link` hoặc tương tự)

```javascript
// Product URL input
const urlInputSelector = 'input[placeholder*="URL"]'; // ← Cập nhật selector này

// Generate button
const generateButtonSelector = 'button:has-text("Generate")'; // ← Cập nhật

// Short link result
const shortLinkSelector = 'input[readonly]'; // ← Cập nhật selector này
```

### Cách tìm selector:

1. **Mở DevTools** (F12)
2. **Click icon chọn element** (góc trên bên trái DevTools)
3. **Click vào element** cần inspect (ví dụ: input field)
4. **Chuột phải trong DevTools** → Copy → Copy selector
5. **Paste vào code** và test

### Test selector:

Mở Console trong DevTools và chạy:
```javascript
document.querySelector("your_selector_here")
```

Nếu trả về element → Selector đúng!  
Nếu trả về `null` → Selector sai, thử lại!

---

## 🎯 BƯỚC 2: CẤU HÌNH VÀ CHẠY

### Mở file `automation-example.js`:

```javascript
const CONFIG = {
  // ⚙️ Điền thông tin đăng nhập
  username: 'your_email@gmail.com',     // ← Email của bạn
  password: 'your_password',            // ← Password của bạn
  
  // 🎬 Browser settings
  headless: false,  // false = hiện browser, true = chạy ngầm
  slowMo: 100,      // Delay giữa actions (ms)
  
  // 📦 Products cần tạo link
  products: [
    'https://shopee.vn/product-i.123.456',
    'https://shopee.vn/product-i.789.012',
    // Thêm nhiều URLs ở đây...
  ]
};
```

### Chạy:

```bash
node automation-example.js
```

---

## 📊 CÁC OPTIONS

### `headless` - Hiện/Ẩn browser

```javascript
headless: false  // Hiện browser (để debug, xem quá trình)
headless: true   // Chạy ngầm (nhanh hơn, không hiện gì)
```

**Khuyến nghị:** 
- Lần đầu dùng `false` để xem có lỗi không
- Khi đã chạy ổn, dùng `true` để nhanh hơn

### `slowMo` - Tốc độ automation

```javascript
slowMo: 0      // Nhanh nhất (dễ bị phát hiện)
slowMo: 100    // Vừa phải (khuyến nghị)
slowMo: 500    // Chậm (giống người thật nhất)
```

**Khuyến nghị:** Dùng 100-300ms để giống người thật

---

## 🧪 EXAMPLES

### Example 1: Tạo 1 link đơn giản

```javascript
const ShopeeAffiliateAutomation = require('./shopee-automation');

async function simple() {
  const bot = new ShopeeAffiliateAutomation({ headless: false });
  
  try {
    await bot.init();
    await bot.login('email@gmail.com', 'password');
    
    const result = await bot.generateShortLink(
      'https://shopee.vn/product-i.123.456'
    );
    
    console.log('Short Link:', result.shortLink);
    
  } finally {
    await bot.close();
  }
}

simple();
```

### Example 2: Tạo nhiều links

```javascript
async function bulk() {
  const bot = new ShopeeAffiliateAutomation({ headless: true });
  
  try {
    await bot.init();
    await bot.login('email@gmail.com', 'password');
    
    const urls = [
      'https://shopee.vn/product1-i.123.456',
      'https://shopee.vn/product2-i.789.012',
      'https://shopee.vn/product3-i.345.678',
    ];
    
    const results = await bot.generateBulkShortLinks(urls);
    
    results.forEach(r => {
      if (r.success) {
        console.log('✅', r.shortLink);
      }
    });
    
  } finally {
    await bot.close();
  }
}

bulk();
```

### Example 3: Chạy định kỳ (cron job)

```javascript
// Chạy mỗi ngày lúc 9h sáng
const cron = require('node-cron');

cron.schedule('0 9 * * *', async () => {
  console.log('🕐 Chạy automation hàng ngày...');
  
  const bot = new ShopeeAffiliateAutomation({ headless: true });
  
  try {
    await bot.init();
    await bot.login('email@gmail.com', 'password');
    
    // Tạo links cho products mới
    const urls = getNewProductUrls(); // Function của bạn
    const results = await bot.generateBulkShortLinks(urls);
    
    // Save results
    saveToDatabase(results); // Function của bạn
    
  } finally {
    await bot.close();
  }
});
```

---

## ❌ TROUBLESHOOTING

### Lỗi: "Cannot find module 'puppeteer'"

**Giải pháp:**
```bash
npm install puppeteer
```

### Lỗi: "Timeout waiting for selector"

**Nguyên nhân:** Selector không đúng hoặc page load chậm

**Giải pháp:**
1. Chạy `node inspect-selectors.js` để kiểm tra lại selectors
2. Tăng timeout trong config:
```javascript
const bot = new ShopeeAffiliateAutomation({ 
  timeout: 60000  // 60 giây
});
```

### Lỗi: "Login failed"

**Nguyên nhân:** 
- Username/password sai
- Có 2FA/Captcha
- Selector không đúng

**Giải pháp:**
1. Kiểm tra username/password
2. Tắt 2FA trong tài khoản Shopee
3. Chạy với `headless: false` để xem lỗi
4. Có thể cần verify thủ công lần đầu

### Lỗi: "Navigation timeout"

**Nguyên nhân:** Internet chậm hoặc Shopee server chậm

**Giải pháp:**
```javascript
const bot = new ShopeeAffiliateAutomation({ 
  timeout: 60000  // Tăng timeout
});
```

### Browser bị phát hiện là bot

**Dấu hiệu:** 
- Bị redirect về login liên tục
- Captcha xuất hiện
- Account warning

**Giải pháp:**
1. Tăng `slowMo` để chậm hơn:
```javascript
slowMo: 300  // Chậm hơn
```

2. Thêm random delays trong code (đã có sẵn)

3. Giảm số lượng requests/ngày

4. Đổi IP (dùng VPN hoặc proxy)

### Lỗi: ECONNREFUSED

**Nguyên nhân:** Không có internet hoặc bị firewall chặn

**Giải pháp:**
- Kiểm tra kết nối internet
- Tắt firewall/antivirus tạm thời
- Thử lại sau vài phút

---

## 🛡️ TIPS ĐỂ TRÁNH BỊ PHÁT HIỆN

### 1. Rate Limiting

**Đừng tạo quá nhiều links quá nhanh!**

```javascript
// ❌ SAI - Tạo 100 links trong 1 phút
for (let url of urls) {
  await bot.generateShortLink(url);
}

// ✅ ĐÚNG - Có delay giữa các requests (code đã xử lý sẵn)
await bot.generateBulkShortLinks(urls); // Tự động có delay
```

### 2. Random Delays

Code đã có `randomDelay()` để delay ngẫu nhiên → giống người thật

### 3. Giới hạn số lượng

**Khuyến nghị:**
- **< 50 links/ngày:** An toàn
- **50-100 links/ngày:** Rủi ro trung bình
- **> 100 links/ngày:** Rủi ro cao, dễ bị phát hiện

### 4. Chạy vào giờ khác nhau

Đừng chạy cùng 1 giờ mỗi ngày → dễ phát hiện pattern

### 5. Dùng headless mode

Khi đã test xong, dùng `headless: true` để tiết kiệm tài nguyên

---

## 📝 CHECKLIST TRƯỚC KHI CHẠY

- [ ] Đã cài Puppeteer (`npm install puppeteer`)
- [ ] Đã tìm và cập nhật đúng CSS selectors
- [ ] Đã test selectors bằng `inspect-selectors.js`
- [ ] Đã điền username và password trong config
- [ ] Đã test với 1-2 links trước (headless: false)
- [ ] Đã hiểu rủi ro bị ban tài khoản
- [ ] Có backup plan nếu tài khoản bị ban

---

## ⚖️ LEGAL DISCLAIMER

**CẢNH BÁO PHÁP LÝ:**

1. Code này **VI PHẠM** Shopee Terms of Service
2. Sử dụng có thể dẫn đến:
   - Tài khoản bị suspend/ban vĩnh viễn
   - Mất toàn bộ commissions chưa thanh toán
   - Bị kiện vi phạm hợp đồng
3. Code chỉ để **học tập/nghiên cứu**
4. **KHÔNG dùng cho mục đích thương mại**
5. Tác giả **KHÔNG chịu trách nhiệm** về mọi hậu quả

**BẠN TỰ CHỊU TRÁCH NHIỆM 100% KHI SỬ DỤNG!**

---

## 🔄 ALTERNATIVE: XIN API CHÍNH THỨC

**Khuyến nghị mạnh mẽ:**

Thay vì dùng automation (rủi ro cao), hãy:

1. **Email xin API access:** affiliatesupport@shopee.vn
2. **Đợi 2-7 ngày** được duyệt
3. **Dùng API chính thức** - An toàn, ổn định, hợp pháp

Xem file `KHONG-CO-API-CREDENTIALS.md` để biết cách xin API.

---

## 📞 HỖ TRỢ

**Nếu gặp lỗi:**

1. Đọc phần Troubleshooting ở trên
2. Chạy với `headless: false` để xem lỗi
3. Chụp screenshot: `await bot.screenshot('error.png')`
4. Kiểm tra lại selectors

**Nhớ:** Code này không có official support vì vi phạm TOS!

---

## 🎯 TÓM TẮT NHANH

```bash
# 1. Cài đặt
npm install puppeteer

# 2. Tìm selectors
node inspect-selectors.js
# → Cập nhật selectors vào shopee-automation.js

# 3. Config
# → Sửa username, password trong automation-example.js

# 4. Chạy
node automation-example.js

# 5. Kiểm tra kết quả
# → Xem short links trong console
```

**Chúc may mắn! (và cẩn thận)** 🍀
