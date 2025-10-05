# 🚀 BẮT ĐẦU TỪ ĐÂY - Shopee Affiliate Link Generator

Chào mừng! Repo này có nhiều files, đây là hướng dẫn để bạn biết nên bắt đầu từ đâu.

---

## 🎯 BẠN MUỐN LÀM GÌ?

### 📍 Option 1: XIN API CHÍNH THỨC (⭐ Khuyến nghị nhất)

**Nếu bạn:**
- Muốn dùng lâu dài
- Không muốn rủi ro bị ban
- Chấp nhận đợi 2-7 ngày

**→ ĐỌC FILE:** `LAY-API-CREDENTIALS.md`

**Sau khi có API credentials, dùng:**
- `quick-start.js` - Cách nhanh nhất
- `shopee-affiliate.js` - API client chính thức
- `README.md` - Documentation đầy đủ

---

### 📍 Option 2: TẠO LINK THỦ CÔNG (⭐ An toàn 100%)

**Nếu bạn:**
- Chưa có API credentials
- Chỉ cần tạo < 10 links/ngày
- Muốn an toàn tuyệt đối

**→ ĐỌC FILE:** `TAO-LINK-THU-CONG.md`

**Cách làm:** Đăng nhập affiliate.shopee.vn → Create Link → Xong!

---

### 📍 Option 3: DÙNG BROWSER AUTOMATION (⚠️ Rủi ro)

**Nếu bạn:**
- Chưa có API credentials
- Cần tự động hóa ngay
- Chấp nhận rủi ro bị ban
- Chỉ để test/học tập

**→ ĐỌC FILE:** `AUTOMATION-README.md`

**Các bước:**
1. `npm install puppeteer`
2. `node inspect-selectors.js` (tìm selectors)
3. Sửa config trong `automation-example.js`
4. `node automation-example.js`

---

## 📂 TẤT CẢ FILES TRONG REPO

### 🔥 Core Files - Dùng API chính thức

| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| **`shopee-affiliate.js`** | API client chính thức | Khi có Partner ID/Key |
| **`quick-start.js`** | Cách nhanh nhất | Tạo 1 link ngay lập tức |
| **`example.js`** | 5 examples cơ bản | Học cách dùng API |
| **`example-with-affiliate-id.js`** | 6 examples với Affiliate ID | Gắn Affiliate ID vào link |

### 🤖 Automation Files - Browser automation

| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| **`shopee-automation.js`** | Automation class | Core automation |
| **`automation-example.js`** | Examples automation | Chạy automation |
| **`inspect-selectors.js`** | Tool tìm selectors | Trước khi dùng automation |

### 📚 Documentation - Đọc để hiểu

| File | Nội dung |
|------|----------|
| **`BAT-DAU-TU-DAY.md`** | File này - Hướng dẫn bắt đầu |
| **`README.md`** | Documentation chính - API chính thức |
| **`AUTOMATION-README.md`** | Documentation - Browser automation |
| **`HUONG-DAN-SU-DUNG.md`** | Hướng dẫn gắn Affiliate ID |
| **`HUONG-DAN-AUTOMATION.md`** | Hướng dẫn automation chi tiết |
| **`LAY-API-CREDENTIALS.md`** | Cách lấy Partner ID/Key |
| **`KHONG-CO-API-CREDENTIALS.md`** | Giải pháp khi chưa có API |
| **`TAO-LINK-THU-CONG.md`** | Hướng dẫn tạo link thủ công |
| **`SU-DUNG-COOKIE-WARNING.md`** | Cảnh báo về cookie method |

### ⚙️ Config Files

| File | Mô tả |
|------|-------|
| **`package.json`** | Dependencies (Puppeteer) |
| **`.env.example`** | Template cho credentials |

---

## 🎓 LEARNING PATH

### Bước 1: Hiểu có những cách nào

Đọc: `KHONG-CO-API-CREDENTIALS.md`

```
3 cách tạo link:
1. API chính thức (cần Partner ID/Key)
2. Tạo thủ công trên web
3. Browser automation (rủi ro)
```

### Bước 2: Chọn phương pháp phù hợp

**Có API credentials?**
- ✅ CÓ → Đọc `README.md` → Chạy `quick-start.js`
- ❌ CHƯA → Đọc tiếp...

**Chấp nhận tạo thủ công?**
- ✅ OK → Đọc `TAO-LINK-THU-CONG.md`
- ❌ Muốn tự động → Đọc tiếp...

**Chấp nhận rủi ro automation?**
- ✅ OK → Đọc `AUTOMATION-README.md`
- ❌ Không → Email xin API (đọc `LAY-API-CREDENTIALS.md`)

### Bước 3: Thực hành

**Nếu dùng API chính thức:**
```bash
# 1. Điền credentials vào quick-start.js
# 2. Chạy
node quick-start.js
```

**Nếu dùng automation:**
```bash
# 1. Cài Puppeteer
npm install puppeteer

# 2. Tìm selectors
node inspect-selectors.js

# 3. Config
# Sửa automation-example.js

# 4. Chạy
node automation-example.js
```

---

## 🚦 DECISION TREE

```
BẮT ĐẦU
    |
    ├─ Có Partner ID/Key?
    |       |
    |       ├─ CÓ → quick-start.js ✅
    |       |
    |       └─ CHƯA →
    |            |
    |            ├─ Sẵn sàng đợi 2-7 ngày?
    |            |       |
    |            |       ├─ CÓ → Email xin API ⭐
    |            |       |
    |            |       └─ KHÔNG →
    |            |            |
    |            |            ├─ < 10 links/ngày?
    |            |            |       |
    |            |            |       ├─ CÓ → Tạo thủ công trên web ✅
    |            |            |       |
    |            |            |       └─ KHÔNG → Automation ⚠️
    |            |            |
    |            |            └─ Chấp nhận rủi ro bị ban?
    |            |                    |
    |            |                    ├─ CÓ → automation-example.js
    |            |                    |
    |            |                    └─ KHÔNG → Quay lại email xin API
```

---

## 💡 KHUYẾN NGHỊ THEO TRƯỜNG HỢP

### Trường hợp 1: Newbie, mới bắt đầu affiliate

```
1. Đọc: TAO-LINK-THU-CONG.md
2. Tạo link thủ công trên web để làm quen
3. Sau 1-2 tuần, email xin API
4. Khi có API, dùng quick-start.js
```

### Trường hợp 2: Developer, cần tự động hóa

```
1. Đọc: LAY-API-CREDENTIALS.md
2. Email xin API ngay
3. Trong lúc chờ, đọc README.md để học
4. Khi có API, implement vào project của bạn
```

### Trường hợp 3: Cần gấp cho demo/presentation

```
1. Đọc: AUTOMATION-README.md
2. Cài Puppeteer: npm install puppeteer
3. Chạy: node inspect-selectors.js
4. Config và chạy: node automation-example.js
5. ⚠️ CHÚ Ý: Chỉ để demo, không dùng lâu dài
```

### Trường hợp 4: Có nhiều sản phẩm (> 100/ngày)

```
1. BẮT BUỘC phải có API chính thức
2. Đọc: LAY-API-CREDENTIALS.md
3. Email xin API với lý do rõ ràng
4. Khi có API, dùng shopee-affiliate.js
5. Implement bulk processing
```

---

## ❓ FAQs

### Q: File nào quan trọng nhất?

**A:** Tùy trường hợp:
- Có API → `quick-start.js` và `README.md`
- Chưa có API → `LAY-API-CREDENTIALS.md` và `KHONG-CO-API-CREDENTIALS.md`
- Muốn automation → `AUTOMATION-README.md`

### Q: Tôi nên đọc file nào trước?

**A:** Đọc file này (`BAT-DAU-TU-DAY.md`) → Sau đó chọn theo decision tree ở trên.

### Q: Có cần đọc hết tất cả files không?

**A:** KHÔNG! Chọn 2-3 files phù hợp với trường hợp của bạn là đủ.

### Q: Tôi bối rối quá, không biết làm gì?

**A:** Làm theo 3 bước đơn giản:
1. Đọc `LAY-API-CREDENTIALS.md`
2. Email xin API
3. Trong lúc chờ, đọc `TAO-LINK-THU-CONG.md` và tạo thủ công

---

## 🎯 TÓM TẮT 3 GIÂY

```
CÓ API → quick-start.js

CHƯA CÓ API:
  ├─ Đợi được → Email xin API
  ├─ Ít link → Tạo thủ công
  └─ Nhiều link + chấp nhận rủi ro → automation-example.js
```

---

## 📞 CONTACT / SUPPORT

**Shopee Affiliate Support:**
- Email: affiliatesupport@shopee.vn
- Portal: https://affiliate.shopee.vn/

**Repo này:**
- GitHub: (nếu có)
- Issues: (nếu có)

---

## ✅ CHECKLIST BẮT ĐẦU

- [ ] Đã đọc file này (`BAT-DAU-TU-DAY.md`)
- [ ] Đã quyết định phương pháp (API / Thủ công / Automation)
- [ ] Đã đọc file hướng dẫn tương ứng
- [ ] Đã cài dependencies (nếu cần)
- [ ] Đã test với 1-2 links
- [ ] Đã hiểu rủi ro (nếu dùng automation)

---

**🎉 Bắt đầu nào! Chọn phương pháp phù hợp và đọc file tương ứng.**

**💡 Khuyến nghị:** Email xin API ngay hôm nay, trong lúc chờ thì tạo thủ công!
