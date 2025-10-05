# ⚠️ CHƯA CÓ PARTNER ID VÀ PARTNER KEY - LÀM SAO BÂY GIỜ?

## 🎯 Tình huống của bạn:

- ✅ Đã có tài khoản Shopee Affiliate
- ❌ Chưa có Partner ID và Partner Key (API Credentials)
- ❓ Muốn tạo short link affiliate

---

## 💡 CÓ 2 CÁCH ĐỂ LẤY SHORT LINK:

### **Cách 1: Tạo thủ công trên Web (KHÔNG CẦN API)** ⭐ Khuyến nghị nếu chưa có API

### **Cách 2: Dùng API để tự động (CẦN Partner ID/Key)**

---

## 🌐 CÁCH 1: Tạo Short Link thủ công trên Web

### ✅ Ưu điểm:
- KHÔNG cần Partner ID/Key
- Dễ dàng, nhanh chóng
- Phù hợp nếu tạo ít link

### ❌ Nhược điểm:
- Phải làm thủ công từng link
- Không tự động được
- Mất thời gian nếu tạo nhiều link

### 📝 Các bước thực hiện:

#### **Bước 1:** Đăng nhập Shopee Affiliate Portal
```
https://affiliate.shopee.vn/
```

#### **Bước 2:** Tìm sản phẩm

**Cách A: Tìm kiếm sản phẩm trong Portal**
1. Vào mục "Products" hoặc "Sản phẩm"
2. Tìm kiếm sản phẩm bạn muốn
3. Click "Get Link" hoặc "Lấy Link"

**Cách B: Dán link sản phẩm Shopee** (Nhanh hơn)
1. Copy link sản phẩm từ Shopee (vd: `https://shopee.vn/product-i.123.456`)
2. Vào mục "Create Link" hoặc "Tạo Link"
3. Dán link vào ô input
4. Click "Generate" hoặc "Tạo"

#### **Bước 3:** Nhận Short Link
```
Kết quả: https://shope.ee/xxxxx
```

#### **Bước 4:** (Optional) Thêm tracking parameters

Một số portal cho phép thêm:
- Sub IDs để tracking
- Campaign name
- Source

---

## 🤖 CÁCH 2: Xin cấp API Access để dùng code tự động

### ✅ Ưu điểm:
- Tự động hoàn toàn bằng code
- Tạo hàng trăm/nghìn links nhanh chóng
- Tích hợp vào website/app của bạn

### ❌ Nhược điểm:
- Cần xin phê duyệt từ Shopee
- Có thể mất vài ngày được duyệt
- Cần biết lập trình

### 📝 Các bước xin API Access:

#### **Bước 1:** Liên hệ Shopee Affiliate Support

**Email:** affiliatesupport@shopee.vn

**Nội dung email mẫu:**

```
Subject: Yêu cầu cấp API Access cho tài khoản Affiliate

Kính gửi Shopee Affiliate Support Team,

Tôi là affiliate partner của Shopee với thông tin:
- Tên tài khoản: [Tên của bạn]
- Email đăng ký: [Email của bạn]
- ID/Username: [Nếu có]

Tôi muốn xin cấp API Access (Partner ID và Partner Key) để:
- [Lý do: ví dụ tích hợp vào website, tự động tạo link, etc.]

Tôi cam kết sử dụng API đúng mục đích và tuân thủ các điều khoản của Shopee.

Xin cảm ơn!

[Tên của bạn]
[Số điện thoại]
```

#### **Bước 2:** Đợi phản hồi

- Thời gian: 2-7 ngày làm việc
- Shopee sẽ review và phê duyệt

#### **Bước 3:** Nhận API Credentials

Sau khi được duyệt:
1. Vào Portal → Settings → API
2. Tạo API Credentials
3. Lấy Partner ID và Partner Key

#### **Bước 4:** Dùng code

Sau khi có credentials, dùng code trong repo này:
```bash
node quick-start.js
```

---

## 🤔 NÊN CHỌN CÁCH NÀO?

### Chọn **Cách 1 (Thủ công)** nếu:
- ✅ Bạn tạo ít link (< 10 links/ngày)
- ✅ Không cần tự động
- ✅ Muốn dùng ngay lập tức
- ✅ Không biết lập trình

### Chọn **Cách 2 (API)** nếu:
- ✅ Bạn tạo nhiều link (> 50 links/ngày)
- ✅ Cần tự động hóa
- ✅ Tích hợp vào website/app
- ✅ Biết lập trình
- ✅ Sẵn sàng đợi vài ngày để được duyệt

---

## 💼 Use Cases thực tế:

### Tạo 1-10 links/ngày → Dùng Web (Cách 1)
```
Ví dụ: Bạn chạy Facebook page, mỗi ngày post 5 sản phẩm
→ Tạo thủ công trên web là đủ, nhanh gọn!
```

### Tạo 50-100 links/ngày → Nên dùng API (Cách 2)
```
Ví dụ: Bạn có website affiliate với 100 sản phẩm/ngày
→ Cần API để tự động, không thể làm thủ công được!
```

### Tạo 1000+ links hoặc real-time → BẮT BUỘC dùng API
```
Ví dụ: App mobile tạo link động khi user click
→ PHẢI có API!
```

---

## 📊 So sánh 2 cách:

| Tiêu chí | Cách 1: Web (Thủ công) | Cách 2: API (Code) |
|---|---|---|
| **Cần credentials?** | ❌ Không | ✅ Có (Partner ID/Key) |
| **Thời gian setup** | Ngay lập tức | 2-7 ngày (chờ duyệt) |
| **Tốc độ tạo link** | Chậm (thủ công) | Nhanh (tự động) |
| **Số lượng link** | Ít (< 10/ngày) | Nhiều (không giới hạn) |
| **Kỹ năng cần** | Không cần | Cần biết code |
| **Tích hợp app/web** | ❌ Không được | ✅ Được |

---

## ❓ FAQs

### Q1: Tôi không thấy mục "Create Link" trong Portal?

**Trả lời:** 
Tên mục có thể khác nhau:
- "Generate Link" 
- "Get Affiliate Link"
- "Tạo Link"
- "Product Links"
- Hoặc có biểu tượng link/chain icon

### Q2: Link tạo từ web có khác link tạo từ API không?

**Trả lời:**
KHÔNG! Link tạo từ cả 2 cách đều giống nhau và có tracking đầy đủ.

### Q3: Tôi có thể xin API ngay từ đầu không?

**Trả lời:**
Có, nhưng một số market yêu cầu:
- Tài khoản affiliate đã active 1-3 tháng
- Có doanh số nhất định
- Giải thích rõ mục đích sử dụng

### Q4: Nếu không được cấp API thì sao?

**Trả lời:**
- Tiếp tục dùng web interface
- Hoặc dùng browser automation (Selenium/Puppeteer) - nhưng vi phạm Terms
- Đợi thêm thời gian rồi xin lại

### Q5: Code trong repo này có dùng được không nếu không có API?

**Trả lời:**
KHÔNG! Code này cần Partner ID và Partner Key.
Nhưng bạn vẫn học được cách API hoạt động, để sau này khi có credentials thì dùng ngay.

---

## 🎯 KẾT LUẬN VÀ KHUYẾN NGHỊ

### Tình huống của bạn: Đã có tài khoản nhưng chưa có API

**Khuyến nghị:**

1. **Ngay bây giờ:** Dùng web interface để tạo link (Cách 1)
   - Đăng nhập affiliate.shopee.vn
   - Tạo link thủ công
   - Bắt đầu kiếm tiền ngay!

2. **Sau 1-2 tuần:** Nếu thấy cần nhiều link, email xin API access
   - Gửi email theo mẫu trên
   - Giải thích bạn cần tự động hóa
   - Đợi phê duyệt

3. **Khi có API:** Quay lại dùng code trong repo này
   - Copy Partner ID và Partner Key
   - Chạy `quick-start.js`
   - Tự động hóa hoàn toàn!

---

## 📞 Liên hệ Shopee

### Shopee Affiliate Support:
- **Email:** affiliatesupport@shopee.vn
- **Hotline:** (Xem trên Portal)
- **Live Chat:** Trong Affiliate Portal (nếu có)

### Shopee API Documentation:
- https://open.shopee.com/documents/v2/v2.affiliate.generate_short_link

---

## ✅ Tóm tắt nhanh

```
Chưa có API → Dùng WEB để tạo link thủ công (NGAY)
                  ↓
            Sau 1-2 tuần nếu cần nhiều link
                  ↓
            Email xin API Access
                  ↓
            Đợi 2-7 ngày
                  ↓
            Nhận Partner ID/Key
                  ↓
            Dùng CODE để tự động (SAU)
```

---

## 💡 Tips thêm

### Nếu đang chờ API approval:
1. Tạo list các sản phẩm cần link
2. Chuẩn bị tracking structure (campaign names, sources)
3. Học code trong repo này
4. Khi có API → Chỉ cần điền credentials và chạy ngay!

### Nếu không bao giờ được cấp API:
1. Dùng web interface
2. Có thể dùng browser automation (rủi ro, có thể bị ban)
3. Hoặc thuê developer làm tool riêng cho bạn

---

**🎯 Kết luận: Bạn VẪN TẠO ĐƯỢC link affiliate, chỉ là thủ công thay vì tự động!**
