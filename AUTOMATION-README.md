# 🤖 Shopee Affiliate - Browser Automation

## ⚠️ CẢNH BÁO QUAN TRỌNG

```
██╗    ██╗ █████╗ ██████╗ ██╗   ██╗██╗███╗   ██╗ ██████╗ 
██║    ██║██╔══██╗██╔══██╗████╗  ████║██║████╗  ██╔════╝ 
██║ █╗ ██║███████║██████╔╝██╔████╔██║██║██╔██╗ ██║  ███╗
██║███╗██║██╔══██║██╔══██╗██║╚██╔╝██║██║██║╚██╗██║   ██║
╚███╔███╔╝██║  ██║██║  ██║██║ ╚═╝ ██║██║██║ ╚████╚██████╔╝
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 

Code này VI PHẠM Shopee Terms of Service
Tài khoản có thể bị BAN VĨNH VIỄN
Chỉ dùng để HỌC TẬP/NGHIÊN CỨU
BẠN TỰ CHỊU TRÁCH NHIỆM!
```

---

## 📖 Code này làm gì?

**Browser Automation** để tự động tạo Shopee affiliate short links mà KHÔNG CẦN API credentials.

### Cách hoạt động:

```
Puppeteer → Mở browser → Login tự động → Tạo link → Lấy kết quả
```

### So với API chính thức:

| Tiêu chí | API chính thức | Automation này |
|----------|----------------|----------------|
| Cần credentials | ✅ Partner ID/Key | ❌ Chỉ cần login |
| Hợp pháp | ✅ Được phép | ❌ Vi phạm TOS |
| Rủi ro bị ban | ✅ 0% | ⚠️ CÓ THỂ bị ban |
| Ổn định | ✅ Ổn định | ⚠️ Phụ thuộc HTML |
| Setup | ⏳ Cần approval | ⚡ Dùng ngay |

---

## 🚀 QUICK START (3 BƯỚC)

### Bước 1: Cài Puppeteer

```bash
npm install puppeteer
```

⏳ Đợi 3-5 phút (tải Chromium ~170MB)

### Bước 2: Tìm CSS Selectors

**⚠️ QUAN TRỌNG:** Phải làm bước này!

```bash
node inspect-selectors.js
```

1. Script mở browser với DevTools
2. Đăng nhập thủ công
3. Inspect các elements (input, button, result)
4. Copy CSS selectors
5. Cập nhật vào `shopee-automation.js`

**Selectors cần tìm:**
- Login: username input, password input, login button
- Create Link: URL input, generate button, short link result

### Bước 3: Config và chạy

Mở `automation-example.js`:

```javascript
const CONFIG = {
  username: 'your_email@gmail.com',  // ← Email của bạn
  password: 'your_password',         // ← Password của bạn
  headless: false,  // false = hiện browser
  products: [
    'https://shopee.vn/product-i.123.456',
  ]
};
```

Chạy:

```bash
node automation-example.js
```

---

## 📁 FILES TRONG REPO

### Core Files:

- **`shopee-automation.js`** - Class chính để automation
- **`automation-example.js`** - Examples và cách dùng
- **`inspect-selectors.js`** - Tool để tìm CSS selectors

### Documentation:

- **`AUTOMATION-README.md`** (file này) - Tổng quan
- **`HUONG-DAN-AUTOMATION.md`** - Hướng dẫn chi tiết
- **`SU-DUNG-COOKIE-WARNING.md`** - Cảnh báo về cookie method
- **`KHONG-CO-API-CREDENTIALS.md`** - Alternative solutions

### Other:

- **`package.json`** - Dependencies (Puppeteer)
- **`.env.example`** - Template config

---

## ⚙️ FEATURES

### ✅ Đã implement:

- [x] Browser automation với Puppeteer
- [x] Auto login
- [x] Generate single link
- [x] Generate bulk links
- [x] Rate limiting (tránh spam)
- [x] Random delays (giống người thật)
- [x] Error handling
- [x] Screenshot on error
- [x] Hide automation signatures
- [x] Custom user agent

### 🔒 Bảo mật:

- [x] Không lưu password trong code (dùng env)
- [x] Hide webdriver property
- [x] Simulate human behavior
- [x] Rate limiting

---

## 📊 USE CASES

### Case 1: Test automation (1-5 links)

```bash
# Chạy với headless: false để xem
node automation-example.js
```

**Mục đích:** Kiểm tra xem automation có hoạt động không

### Case 2: Tạo links hàng loạt (10-50 links)

```javascript
const urls = [...]; // 50 URLs
await bot.generateBulkShortLinks(urls);
```

**⚠️ Rủi ro:** Trung bình - cao

### Case 3: Chạy định kỳ (cron job)

```javascript
// Chạy mỗi ngày
cron.schedule('0 9 * * *', async () => {
  // Generate links
});
```

**⚠️ Rủi ro:** Cao - Dễ bị phát hiện pattern

---

## ⚠️ RỦI RO VÀ CÁCH GIẢM THIỂU

### Rủi ro 1: Bị phát hiện là bot

**Dấu hiệu:**
- Tạo quá nhiều links/phút
- Pattern giống nhau mỗi ngày
- User agent không giống browser thật

**Cách giảm:**
- ✅ Dùng random delays (đã có)
- ✅ Giới hạn < 50 links/ngày
- ✅ Chạy vào giờ khác nhau
- ✅ Set realistic user agent (đã có)

### Rủi ro 2: HTML thay đổi

**Khi nào xảy ra:**
- Shopee update giao diện
- Thay đổi selectors

**Cách fix:**
- Chạy lại `inspect-selectors.js`
- Cập nhật selectors mới
- Test lại

### Rủi ro 3: Tài khoản bị ban

**Hậu quả:**
- Mất tài khoản vĩnh viễn
- Mất commissions chưa rút

**Cách phòng tránh:**
- ❌ Không dùng tài khoản chính
- ❌ Không có commissions quan trọng trong account
- ✅ Có backup plan
- ✅ Xin API chính thức thay vì dùng automation

---

## 🛡️ BEST PRACTICES

### DO ✅

- ✅ Test với tài khoản test trước
- ✅ Dùng headless: false lần đầu để debug
- ✅ Giới hạn < 50 links/ngày
- ✅ Add random delays
- ✅ Check selectors thường xuyên
- ✅ Có backup plan nếu bị ban

### DON'T ❌

- ❌ Dùng tài khoản chính có commissions lớn
- ❌ Tạo > 100 links/ngày
- ❌ Chạy liên tục 24/7
- ❌ Dùng cho mục đích thương mại
- ❌ Share credentials trong code
- ❌ Commit password vào git

---

## 🆚 SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC

### Phương pháp 1: API chính thức ⭐⭐⭐⭐⭐

```
Rủi ro: 0%
Ổn định: 100%
Setup: Cần xin approval (2-7 ngày)
→ KHUYẾN NGHỊ NHẤT
```

### Phương pháp 2: Tạo thủ công trên web ⭐⭐⭐⭐

```
Rủi ro: 0%
Ổn định: 100%
Tốc độ: Chậm (30s/link)
→ Phù hợp < 10 links/ngày
```

### Phương pháp 3: Browser Automation ⭐⭐ (Đây)

```
Rủi ro: Trung bình - Cao
Ổn định: Phụ thuộc HTML
Setup: Nhanh (cài Puppeteer)
→ Chỉ nên dùng để test/học tập
```

### Phương pháp 4: Dùng Cookie ⭐

```
Rủi ro: RẤT CAO
Bảo mật: Kém (cookie dễ lộ)
Ổn định: Kém (cookie hết hạn)
→ KHÔNG KHUYẾN NGHỊ
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Documentation trong repo:

1. **`HUONG-DAN-AUTOMATION.md`** - Hướng dẫn chi tiết từng bước
2. **`SU-DUNG-COOKIE-WARNING.md`** - Cảnh báo về cookie method
3. **`KHONG-CO-API-CREDENTIALS.md`** - Giải pháp thay thế
4. **`LAY-API-CREDENTIALS.md`** - Cách lấy API chính thức
5. **`TAO-LINK-THU-CONG.md`** - Hướng dẫn tạo thủ công

### External:

- Puppeteer Docs: https://pptr.dev/
- Shopee Affiliate: https://affiliate.shopee.vn/
- Shopee API Docs: https://open.shopee.com/

---

## ❓ FAQs

### Q: Tôi có thể dùng cho business thật không?

**A:** KHÔNG! Đây vi phạm TOS. Hãy xin API chính thức.

### Q: Tỷ lệ bị ban là bao nhiêu?

**A:** Không ai biết chính xác. Càng dùng nhiều, càng dễ bị phát hiện.

### Q: Có cách nào 100% an toàn không?

**A:** Có - Xin API chính thức từ Shopee (email: affiliatesupport@shopee.vn)

### Q: Tôi có thể bán service này không?

**A:** KHÔNG! Vi phạm TOS và có thể bị kiện.

### Q: Puppeteer có tốn tiền không?

**A:** KHÔNG, Puppeteer hoàn toàn miễn phí và open source.

### Q: HTML thay đổi thì sao?

**A:** Chạy lại `inspect-selectors.js` để tìm selectors mới.

---

## 🎯 KẾT LUẬN

### ✅ Phù hợp với bạn nếu:

- Cần test automation để học
- Tạo < 10 links để thử nghiệm
- Chưa được cấp API và cần gấp cho demo
- Hiểu rõ rủi ro và chấp nhận

### ❌ KHÔNG phù hợp nếu:

- Dùng cho business thật
- Tài khoản có commissions quan trọng
- Cần ổn định lâu dài
- Không chấp nhận rủi ro bị ban

### 💡 Khuyến nghị của tôi:

```
1. Nếu có thể → XIN API CHÍNH THỨC (email Shopee)
2. Trong lúc chờ → Tạo thủ công trên web
3. Chỉ dùng automation này → Để test/học tập
```

---

## 📞 SUPPORT

**Lưu ý:** Đây là code vi phạm TOS nên không có official support.

Nếu gặp technical issues:
1. Đọc `HUONG-DAN-AUTOMATION.md`
2. Check Troubleshooting section
3. Chạy với `headless: false` để debug
4. Screenshot error: `await bot.screenshot('error.png')`

---

## ⚖️ LEGAL DISCLAIMER

**ĐỌC KỸ:**

- Code này vi phạm Shopee Terms of Service
- Sử dụng có thể dẫn đến tài khoản bị ban
- Tác giả KHÔNG chịu trách nhiệm về mọi hậu quả
- Code chỉ để học tập/nghiên cứu
- KHÔNG dùng cho mục đích thương mại
- Bạn tự chịu 100% trách nhiệm khi sử dụng

**BY USING THIS CODE, YOU ACCEPT ALL RISKS.**

---

## 🔄 CHANGELOG

### Version 1.0.0 (2024-10-05)

- ✅ Initial release
- ✅ Browser automation với Puppeteer
- ✅ Auto login
- ✅ Generate single/bulk links
- ✅ Rate limiting
- ✅ Random delays
- ✅ Error handling

---

## 📝 TODO / FUTURE

- [ ] Support cho proxy/VPN
- [ ] Headful mode với GUI
- [ ] Docker container
- [ ] Better selector auto-detection
- [ ] Captcha handling (nếu có)

---

**Made with ❤️ (and ⚠️) for educational purposes only.**
