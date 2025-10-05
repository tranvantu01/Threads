# 🎯 HƯỚNG DẪN TẠO LINK AFFILIATE THỦ CÔNG (KHÔNG CẦN CODE)

## ⚡ Dành cho người CHƯA có API credentials

---

## 🌐 CÁCH 1: Tạo link trực tiếp trên Shopee Affiliate Portal

### Bước 1: Đăng nhập
```
🔗 https://affiliate.shopee.vn/
```
Dùng tài khoản Shopee Affiliate của bạn

### Bước 2: Tìm mục "Tạo Link"

Tên có thể là:
- ✅ "Create Link"
- ✅ "Generate Link" 
- ✅ "Get Link"
- ✅ "Tạo liên kết"
- ✅ "Link Generator"

Thường ở menu bên trái hoặc tab "Tools"

### Bước 3: Dán link sản phẩm Shopee

**Input:** 
```
https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319
```

**Hoặc tìm sản phẩm trực tiếp trong Portal**

### Bước 4: (Optional) Thêm tracking

Một số portal cho phép thêm:
- Sub IDs
- Campaign name
- Affiliate ID tùy chỉnh

### Bước 5: Click "Generate" / "Tạo"

### Bước 6: Copy short link

**Output:**
```
https://shope.ee/xxxxxxxxxxxx
```

✅ **XONG!** Link này đã có tracking affiliate của bạn!

---

## 📱 CÁCH 2: Tạo link từ App Shopee (nếu có tính năng)

### Bước 1: Mở app Shopee
### Bước 2: Tìm sản phẩm
### Bước 3: Click "Share" / "Chia sẻ"
### Bước 4: Chọn "Get Affiliate Link" (nếu có)
### Bước 5: Copy link

⚠️ **Lưu ý:** Không phải mọi market đều có tính năng này trong app

---

## 🔧 CÁCH 3: Dùng Browser Extension (nếu có)

Shopee Affiliate có thể cung cấp browser extension:
1. Cài extension từ Chrome Web Store
2. Duyệt shopee.vn như bình thường
3. Click extension icon khi đang xem sản phẩm
4. Tự động tạo affiliate link

⚠️ **Kiểm tra:** Vào Affiliate Portal → Tools → Extensions

---

## 💡 TIPS để tạo link hiệu quả

### 1. Tạo link theo batch (theo lô)

```
Thay vì tạo từng link một
→ Chuẩn bị list 10-20 sản phẩm
→ Tạo hết trong một lần
→ Lưu vào spreadsheet
```

### 2. Đặt tên tracking có hệ thống

```
Campaign: facebook_summer_2024
Sub ID 1: fb_post_001
Sub ID 2: audience_women_25_35
```

### 3. Lưu links đã tạo

Tạo Google Sheet:
```
| Sản phẩm | Link gốc | Short Link | Campaign | Ngày tạo |
|----------|----------|------------|----------|----------|
| iPhone   | shopee.. | shope.ee.. | FB_Sale  | 05/10/24 |
```

---

## ⏱️ Ước tính thời gian

| Số lượng links | Thời gian (thủ công) |
|----------------|----------------------|
| 1 link         | ~30 giây             |
| 10 links       | ~5 phút              |
| 50 links       | ~25 phút             |
| 100 links      | ~50 phút             |

💡 **Lưu ý:** Nếu bạn cần tạo > 50 links/ngày → Nên xin API access!

---

## ✅ Checklist khi tạo link

- [ ] Đã đăng nhập Shopee Affiliate Portal
- [ ] Đã tìm đúng mục "Create Link" / "Tạo Link"
- [ ] Đã copy link sản phẩm chính xác
- [ ] Đã thêm tracking info (nếu cần)
- [ ] Đã test link xem có hoạt động không
- [ ] Đã lưu link vào nơi an toàn

---

## 🧪 Test link đã tạo

### Cách test:

1. **Copy short link**
2. **Mở trình duyệt ẩn danh (Incognito)**
3. **Paste và truy cập link**
4. **Kiểm tra:**
   - Link có redirect đến đúng sản phẩm không?
   - URL có chứa tracking parameters không?

### Link đúng sẽ có dạng:
```
shope.ee/xxxx → redirect → shopee.vn/product?af_id=xxx&sub_id=xxx
```

---

## ❌ Troubleshooting

### Lỗi: "Invalid URL"
- ✅ Kiểm tra link có đúng format `shopee.vn/product-i.xxx.xxx`
- ✅ Đảm bảo link là sản phẩm Vietnam (không phải .sg, .tw)

### Lỗi: "Product not eligible for affiliate"
- Sản phẩm này không tham gia chương trình affiliate
- Thử sản phẩm khác

### Không tìm thấy mục "Create Link"
- Kiểm tra tài khoản đã được approve chưa
- Liên hệ support: affiliatesupport@shopee.vn

---

## 📊 So sánh: Thủ công vs API

| Tiêu chí           | Thủ công (Web)      | Tự động (API/Code) |
|--------------------|---------------------|--------------------|
| Setup              | ⚡ Ngay lập tức     | ⏳ 2-7 ngày        |
| Tốc độ             | 🐢 30s/link         | 🚀 0.1s/link       |
| Số lượng           | 📝 < 50 links/ngày  | 🔥 Không giới hạn  |
| Cần biết code?     | ❌ Không            | ✅ Có              |
| Cần credentials?   | ❌ Không            | ✅ Có              |
| Tích hợp website?  | ❌ Không            | ✅ Có              |

---

## 🎯 KẾT LUẬN

### Bạn có thể tạo affiliate link NGAY BÂY GIỜ mà KHÔNG CẦN:
- ❌ Partner ID
- ❌ Partner Key
- ❌ Biết code
- ❌ Chờ approval

### Chỉ cần:
- ✅ Tài khoản Shopee Affiliate
- ✅ Truy cập affiliate.shopee.vn
- ✅ Click "Create Link"
- ✅ Paste URL sản phẩm

→ **XONG trong 30 giây!**

---

## 📞 Cần thêm trợ giúp?

**Shopee Affiliate Support:**
- Email: affiliatesupport@shopee.vn
- Portal: affiliate.shopee.vn (có live chat)

**Documentation:**
- Xem mục "Getting Started" trong Portal
- Video tutorials (nếu có)

---

## 💼 Workflow đề xuất cho bạn:

```
1. HÔM NAY: Tạo link thủ công trên web
   ↓
2. Test và bắt đầu kiếm tiền
   ↓
3. SAU 1-2 TUẦN: Nếu thấy cần tự động
   ↓
4. Email xin API access
   ↓
5. KHI CÓ API: Dùng code để scale up!
```

**🎉 Bắt đầu ngay - Đăng nhập affiliate.shopee.vn và tạo link đầu tiên!**
