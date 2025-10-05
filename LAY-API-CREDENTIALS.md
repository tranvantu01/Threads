# 📘 HƯỚNG DẪN LẤY PARTNER ID VÀ PARTNER KEY

## ⚠️ Lưu ý quan trọng

**Partner ID và Partner Key KHÔNG phải là tài khoản/mật khẩu!**

- ❌ **KHÔNG phải**: Email + Password đăng nhập Shopee
- ✅ **MÀ LÀ**: API Credentials để gọi Shopee API

---

## 🎯 Các bước lấy Partner ID và Partner Key

### Bước 1: Đăng ký Shopee Affiliate (nếu chưa có)

1. Truy cập: **https://affiliate.shopee.vn/**
2. Click "Đăng ký" hoặc "Sign Up"
3. Đăng ký bằng:
   - Tài khoản Shopee hiện có
   - Hoặc tạo tài khoản mới

### Bước 2: Đăng nhập vào Shopee Affiliate Portal

1. Vào: **https://affiliate.shopee.vn/**
2. Đăng nhập bằng **tài khoản Shopee Affiliate** của bạn
   - Email/Phone + Password (tài khoản thông thường)

### Bước 3: Tìm mục API Settings

Sau khi đăng nhập, tìm menu:

**Cách 1:**
```
Sidebar Menu → Settings → API Settings
hoặc
Menu → Cài đặt → Cài đặt API
```

**Cách 2:** 
```
Profile/Account → Developer Tools → API Credentials
hoặc
Tài khoản → Công cụ nhà phát triển → Thông tin API
```

### Bước 4: Tạo API Credentials (nếu chưa có)

1. Click "Create API Credentials" hoặc "Tạo API"
2. Đặt tên cho credentials (ví dụ: "My Website API")
3. Click "Generate" hoặc "Tạo"

### Bước 5: Copy thông tin

Bạn sẽ thấy 2 thông tin:

#### 🔑 Partner ID (hoặc Credential ID)
```
Format: Một chuỗi số
Ví dụ: 123456 hoặc 789012345
```

#### 🔐 Partner Key (hoặc Secret Key)
```
Format: Một chuỗi ký tự dài
Ví dụ: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

⚠️ **QUAN TRỌNG:** 
- Partner Key chỉ hiển thị **MỘT LẦN** khi tạo
- Hãy copy và lưu lại ngay
- Nếu mất, bạn phải tạo credentials mới

---

## 📋 Format thông tin

### Ví dụ thực tế:

```javascript
// ĐÂY LÀ VÍ DỤ - Thay bằng thông tin thật của bạn

const partnerId = '123456';  
// ↑ Đây là Partner ID (một chuỗi số)

const partnerKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
// ↑ Đây là Partner Key (chuỗi ký tự dài)

// KHÔNG phải là:
// ❌ email: 'user@gmail.com'
// ❌ password: 'MyPassword123'
```

---

## 🔍 Nhận biết đúng/sai

### ✅ Đúng - API Credentials

```javascript
partnerId: '123456'
partnerKey: 'abc123def456ghi789jkl012mno345'
```

### ❌ Sai - Tài khoản/Mật khẩu

```javascript
email: 'myemail@gmail.com'
password: 'MyPassword123'
```

---

## ❓ FAQs

### Q1: Tôi không tìm thấy mục API Settings?

**Trả lời:** 
- Có thể tài khoản của bạn chưa được approve làm affiliate
- Hoặc cần liên hệ support Shopee Affiliate để kích hoạt API access

### Q2: Tôi quên Partner Key thì làm sao?

**Trả lời:**
- Partner Key chỉ hiện MỘT LẦN khi tạo
- Nếu quên, bạn phải:
  1. Xóa credentials cũ
  2. Tạo credentials mới
  3. Lấy Partner Key mới

### Q3: Tôi có thể dùng email/password để gọi API không?

**Trả lời:**
- KHÔNG được!
- API của Shopee chỉ chấp nhận Partner ID + Partner Key
- Đây là chuẩn bảo mật cho API (không dùng password trực tiếp)

### Q4: Partner ID có phải là số điện thoại không?

**Trả lời:**
- KHÔNG
- Partner ID là một ID số được Shopee tự động tạo
- Thường là 6-10 chữ số

### Q5: Affiliate ID là gì? Có phải Partner ID không?

**Trả lời:**
- **Partner ID**: Để xác thực API (bắt buộc)
- **Affiliate ID**: ID tùy chỉnh của bạn để tracking (không bắt buộc)
- Đây là 2 thứ khác nhau!

---

## 🔐 Bảo mật

### ⚠️ QUAN TRỌNG:

1. **KHÔNG BAO GIỜ** chia sẻ Partner Key với người khác
2. **KHÔNG BAO GIỜ** commit Partner Key vào Git/GitHub
3. **NÊN** lưu trong file `.env` (không commit file này)
4. **NÊN** rotate (đổi) Partner Key định kỳ

### ✅ Cách lưu trữ an toàn:

```bash
# Tạo file .env (file này KHÔNG được commit vào git)
SHOPEE_PARTNER_ID=123456
SHOPEE_PARTNER_KEY=your_secret_key_here
```

Thêm vào `.gitignore`:
```
.env
```

---

## 📞 Hỗ trợ

Nếu vẫn không lấy được thông tin:

1. **Shopee Affiliate Support:**
   - Email: affiliatesupport@shopee.vn
   - Hoặc liên hệ qua Affiliate Portal

2. **Documentation:**
   - https://open.shopee.com/documents/v2/v2.affiliate.generate_short_link

---

## ✅ Checklist

Sau khi có đủ thông tin, kiểm tra:

- [ ] Đã có Partner ID (chuỗi số)
- [ ] Đã có Partner Key (chuỗi ký tự dài)
- [ ] Đã lưu Partner Key an toàn (trong .env hoặc nơi bảo mật)
- [ ] KHÔNG dùng email/password
- [ ] Đã hiểu Partner ID ≠ Affiliate ID

➡️ **Giờ bạn có thể dùng `quick-start.js` để test!**
