# Shopee Affiliate API - Node.js Client

Client Node.js để tạo short link affiliate cho sản phẩm Shopee Vietnam.

## ✨ Tính năng

- ✅ Generate HMAC-SHA256 signature đúng chuẩn Shopee API
- ✅ Tạo short link affiliate từ product URL
- ✅ Hỗ trợ Sub IDs để tracking nhiều traffic sources
- ✅ Error handling chi tiết
- ✅ TypeScript-ready (có thể thêm types)
- ✅ Không cần dependencies ngoài (sử dụng native Node.js APIs)

## 📋 Yêu cầu

- Node.js >= 18.0.0 (để sử dụng native `fetch` API)
- Shopee Affiliate Partner ID và Partner Key

## 🚀 Cài đặt

```bash
# Clone hoặc download code
git clone <repo-url>
cd shopee-affiliate-api

# Không cần cài thêm packages (zero dependencies!)
```

## ⚙️ Cấu hình

### Cách 1: Sử dụng Environment Variables (Khuyến nghị)

1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Điền thông tin credentials vào file `.env`:
```env
SHOPEE_PARTNER_ID=your_partner_id
SHOPEE_PARTNER_KEY=your_partner_key
```

3. Cài đặt `dotenv` (nếu dùng env):
```bash
npm install dotenv
```

### Cách 2: Hard-code trong code (chỉ dùng để test)

Sửa trực tiếp trong file `example.js` hoặc code của bạn.

## 📖 Cách sử dụng

### Basic Usage

```javascript
const ShopeeAffiliateAPI = require('./shopee-affiliate');

// Khởi tạo client
const shopeeAPI = new ShopeeAffiliateAPI(
  'your_partner_id',
  'your_partner_key'
);

// Generate short link
const result = await shopeeAPI.generateShortLink(
  'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319'
);

if (result.success) {
  console.log('Short Link:', result.shortLink);
} else {
  console.log('Error:', result.error);
}
```

### Với Sub IDs (để tracking)

```javascript
// Sub IDs giúp bạn tracking traffic từ các nguồn khác nhau
const subIds = [
  'facebook',      // Nguồn traffic
  'campaign_01',   // Tên campaign
  'post_123',      // ID bài post
  'utm_source',    // UTM source
  'utm_medium'     // UTM medium
];

const result = await shopeeAPI.generateShortLink(productUrl, subIds);
```

### Generate nhiều links cùng lúc

```javascript
const urls = [
  'https://shopee.vn/product1-i.123.456',
  'https://shopee.vn/product2-i.789.012',
  'https://shopee.vn/product3-i.345.678',
];

const results = await Promise.all(
  urls.map(url => shopeeAPI.generateShortLink(url))
);

results.forEach((result, index) => {
  console.log(`Link ${index + 1}:`, result.shortLink);
});
```

## 🧪 Chạy Examples

```bash
node example.js
```

File `example.js` chứa 5 examples:
1. Generate short link cơ bản
2. Generate với Sub IDs
3. Generate nhiều links cùng lúc
4. Test signature generation
5. Error handling demos

## 📚 API Reference

### Class: `ShopeeAffiliateAPI`

#### Constructor

```javascript
new ShopeeAffiliateAPI(partnerId, partnerKey)
```

**Parameters:**
- `partnerId` (string): Partner ID từ Shopee Affiliate Portal
- `partnerKey` (string): Partner Key (secret) để tạo signature

#### Methods

##### `generateSignature(requestBody, timestamp)`

Tạo HMAC-SHA256 signature cho API request.

**Parameters:**
- `requestBody` (string): JSON string của GraphQL query
- `timestamp` (number): Unix timestamp (giây)

**Returns:** `string` - Signature hex string

---

##### `createAuthHeader(signature, timestamp)`

Tạo Authorization header value.

**Parameters:**
- `signature` (string): HMAC-SHA256 signature
- `timestamp` (number): Unix timestamp

**Returns:** `string` - Authorization header value

---

##### `generateShortLink(originUrl, subIds = [])`

Generate short link affiliate từ product URL.

**Parameters:**
- `originUrl` (string): URL gốc của sản phẩm Shopee
- `subIds` (array, optional): Array 5 sub IDs để tracking

**Returns:** `Promise<Object>`

Response Object:
```javascript
{
  success: true,           // boolean
  shortLink: "https://...", // string (nếu success)
  originalUrl: "...",      // string
  timestamp: 1234567890,   // number
  error: "...",            // string (nếu có lỗi)
  errorType: "..."         // string (nếu có lỗi)
}
```

---

##### `testConnection()`

Test xem credentials có hợp lệ không.

**Returns:** `Promise<Object>`

## 🔒 Bảo mật

- ⚠️ **KHÔNG BAO GIỜ** commit file `.env` vào git
- ⚠️ **KHÔNG BAO GIỜ** share Partner Key publicly
- ✅ Sử dụng environment variables trong production
- ✅ Rotate Partner Key định kỳ

## ❌ Error Handling

API trả về object với `success: false` khi có lỗi:

```javascript
const result = await shopeeAPI.generateShortLink(invalidUrl);

if (!result.success) {
  console.error('Error:', result.error);
  console.error('Type:', result.errorType);
}
```

**Các loại lỗi thường gặp:**

1. **Invalid URL**: URL không phải là Shopee Vietnam
2. **Invalid Sub IDs**: Sub IDs không đúng format (phải 0 hoặc 5 phần tử)
3. **API Error**: Sai credentials hoặc API server lỗi
4. **GraphQL Error**: Query không hợp lệ
5. **Network Error**: Mất kết nối internet

## 📝 Lưu ý quan trọng

### Về Signature
- Signature được tạo từ: `HMAC-SHA256(PartnerKey, PartnerId + RequestBody + Timestamp)`
- Timestamp phải là Unix timestamp **tính bằng giây** (không phải milliseconds)
- Request body phải là JSON string chính xác (không được format lại)

### Về Sub IDs
- Sub IDs phải có **đúng 5 phần tử** hoặc để **array rỗng**
- Dùng Sub IDs để tracking traffic từ các nguồn khác nhau
- Ví dụ: `["facebook", "summer_sale", "post_001", "vn", "mobile"]`

### Về URL
- Chỉ chấp nhận URL từ `shopee.vn` (Shopee Vietnam)
- URL phải là link sản phẩm hợp lệ
- Format: `https://shopee.vn/Product-Name-i.SHOP_ID.ITEM_ID`

## 🐛 Troubleshooting

### Lỗi "fetch is not defined"
- Đảm bảo dùng Node.js >= 18.0.0
- Hoặc cài `node-fetch`: `npm install node-fetch`

### Lỗi "Invalid signature"
- Kiểm tra Partner ID và Partner Key có đúng không
- Đảm bảo timestamp đang tính bằng **giây** (không phải milliseconds)
- Kiểm tra request body có format đúng không

### Lỗi "GraphQL Error"
- Kiểm tra URL sản phẩm có hợp lệ không
- Kiểm tra Sub IDs có đúng 5 phần tử không

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📧 Support

Nếu có vấn đề, hãy tạo issue trên GitHub hoặc liên hệ support của Shopee Affiliate.
