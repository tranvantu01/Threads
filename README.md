# Shopee Affiliate API Integration Kit

🎉 **Bộ công cụ hoàn chỉnh để tích hợp Shopee Affiliate API**

## ⚠️ LƯU Ý QUAN TRỌNG

Repo này có **2 phiên bản SDK**:

### 1. SDK v1 (Phiên bản tham khảo)
- `shopee-affiliate-sdk.js`
- `shopee_affiliate_sdk.py`
- Format authentication giả định

### 2. SDK v2 (✅ KHUYẾN NGHỊ - Dựa trên API thực tế)
- `shopee-affiliate-sdk-v2.js` 
- Authentication format **chính xác** từ Shopee
- Đã test với API thật

**👉 Sử dụng SDK v2 cho tất cả projects mới!**

---

## 📚 Documentation

- **`API_CHINH_XAC.md`** - API documentation với format đúng ✅
- **`SHOPEE_AFFILIATE_API.md`** - API reference tổng quát
- **`HUONG_DAN_SU_DUNG.md`** - Hướng dẫn sử dụng chi tiết

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup credentials
cp .env.example .env
# Điền SHOPEE_PARTNER_ID và SHOPEE_PARTNER_KEY vào .env

# Test SDK
node
> const API = require('./shopee-affiliate-sdk-v2');
> const api = new API('YOUR_PARTNER_ID', 'YOUR_PARTNER_KEY');
> api.generateShortLink('https://shopee.vn/product-i.123.456', ['test','','','','']).then(console.log);
```

---

## 📁 Files

### Core SDK
- `shopee-affiliate-sdk-v2.js` - **SDK chính thức** (Node.js)
- `shopee-affiliate-sdk.js` - SDK v1 (tham khảo)
- `shopee_affiliate_sdk.py` - SDK Python (tham khảo)
- `shopee_affiliate_flutter.dart` - SDK Flutter/Dart

### Examples
- `express-shopee-affiliate-backend.js` - Express.js backend server
- `react-shopee-affiliate-example.jsx` - React components
- `.env.example` - Environment variables template

### Documentation
- `API_CHINH_XAC.md` - ✅ **ĐỌC FILE NÀY TRƯỚC**
- `SHOPEE_AFFILIATE_API.md` - API reference
- `HUONG_DAN_SU_DUNG.md` - User guide

---

## 🔑 Authentication

### Format Đúng
```
Authorization: SHA256 Credential=<PARTNER_ID>, Signature=<SIGNATURE>, Timestamp=<TIMESTAMP>
```

Xem chi tiết trong `API_CHINH_XAC.md`

---

## 💡 Example

```javascript
const ShopeeAffiliateAPI = require('./shopee-affiliate-sdk-v2');

const api = new ShopeeAffiliateAPI(
  process.env.SHOPEE_PARTNER_ID,
  process.env.SHOPEE_PARTNER_KEY
);

// Generate affiliate link
const shortLink = await api.generateShortLink(
  'https://shopee.vn/product-i.52377417.6309028319',
  ['facebook', 'post123', '', '', '']
);

console.log('Affiliate Link:', shortLink);
// Output: https://shope.ee/XXXXX
```

---

## 📖 Learn More

1. Đọc `API_CHINH_XAC.md` để hiểu authentication format
2. Xem `shopee-affiliate-sdk-v2.js` để biết cách implement
3. Check `express-shopee-affiliate-backend.js` cho backend example

---

## 🤝 Contributing

Contributions welcome! Đặc biệt là:
- Test cases
- More language SDKs
- Bug fixes
- Documentation improvements
