# Shopee Affiliate API - Format Chính Xác

## ⚠️ CẬP NHẬT QUAN TRỌNG

Dựa trên API thực tế của Shopee, tôi đã cập nhật lại documentation và SDK với **format authentication đúng**.

---

## Authentication Format (ĐÚNG)

### Header Format

```
Authorization: SHA256 Credential=<PARTNER_ID>, Signature=<SIGNATURE>, Timestamp=<TIMESTAMP>
Content-Type: application/json
```

**KHÔNG PHẢI:**
```
X-API-Key: xxx
X-Timestamp: xxx
X-Signature: xxx
```

### Cách Tính Signature

```javascript
// Base string format
const baseString = `${partnerId}|${apiPath}|${timestamp}|${requestBody}|${partnerKey}`;

// Generate SHA256 hash
const signature = crypto
  .createHash('sha256')
  .update(baseString)
  .digest('hex');

// Example:
// partnerId: "123456"
// apiPath: "/graphql"
// timestamp: "1577836800"
// requestBody: '{"query":"mutation{...}"}'
// partnerKey: "your_secret_key"
//
// baseString = "123456|/graphql|1577836800|{...}|your_secret_key"
// signature = sha256(baseString)
```

### Ví Dụ Thực Tế

```bash
curl -X POST 'https://open-api.affiliate.shopee.vn/graphql' \
  -H 'Authorization: SHA256 Credential=123456, Signature=abc123...xyz, Timestamp=1577836800' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "query": "mutation { generateShortLink(input: {...}) { shortLink } }"
  }'
```

---

## API Endpoints Chính Xác

### 1. Generate Short Link (Affiliate Link)

**GraphQL Mutation:**
```graphql
mutation generateShortLink($input: GenerateShortLinkInput!) {
  generateShortLink(input: $input) {
    shortLink
    error
    errorMessage
  }
}
```

**Variables:**
```json
{
  "input": {
    "originUrl": "https://shopee.vn/product-name-i.52377417.6309028319",
    "subIds": ["s1", "s2", "s3", "s4", "s5"]
  }
}
```

**Notes:**
- `subIds` là array gồm **5 elements** (có thể để trống "")
- Dùng để tracking nguồn traffic
- Ví dụ: `["facebook", "post_123", "user_456", "", ""]`

**Response:**
```json
{
  "data": {
    "generateShortLink": {
      "shortLink": "https://shope.ee/XXXXX",
      "error": 0,
      "errorMessage": null
    }
  }
}
```

---

### 2. Get Product Details

**GraphQL Query:**
```graphql
query getProductDetails($itemIds: [Int!]!) {
  productDetails(itemIds: $itemIds) {
    itemId
    shopId
    productName
    productLink
    productImage
    productPrice
    productOriginalPrice
    productDiscount
    productRating
    productSold
    commissionRate
    commission
    error
    errorMessage
  }
}
```

**Variables:**
```json
{
  "itemIds": [6309028319, 6309028320]
}
```

---

### 3. Search Products

**GraphQL Query:**
```graphql
query searchProducts(
  $keyword: String!
  $page: Int
  $pageSize: Int
  $categoryId: Int
  $sortType: Int
) {
  searchProducts(
    keyword: $keyword
    page: $page
    pageSize: $pageSize
    categoryId: $categoryId
    sortType: $sortType
  ) {
    totalCount
    products {
      itemId
      shopId
      productName
      productLink
      productImage
      productPrice
      productOriginalPrice
      productDiscount
      productRating
      productSold
      commissionRate
      commission
    }
  }
}
```

**Variables:**
```json
{
  "keyword": "iphone",
  "page": 1,
  "pageSize": 20,
  "sortType": 3
}
```

**Sort Types:**
- `1`: Relevance (Liên quan nhất)
- `2`: Latest (Mới nhất)
- `3`: Top Sales (Bán chạy nhất)
- `4`: Price Low to High (Giá thấp đến cao)
- `5`: Price High to Low (Giá cao đến thấp)

---

### 4. Get Recommended Products (Hot Deals)

**GraphQL Query:**
```graphql
query getRecommendedProducts($page: Int, $pageSize: Int, $categoryId: Int) {
  recommendedProducts(page: $page, pageSize: $pageSize, categoryId: $categoryId) {
    totalCount
    products {
      itemId
      shopId
      productName
      productLink
      productImage
      productPrice
      productOriginalPrice
      productDiscount
      productRating
      productSold
      commissionRate
      commission
      isFlashSale
      flashSaleEndTime
    }
  }
}
```

---

### 5. Get Categories

**GraphQL Query:**
```graphql
query {
  categories {
    categoryId
    categoryName
    parentCategoryId
    hasChildren
  }
}
```

**Response Example:**
```json
{
  "data": {
    "categories": [
      {
        "categoryId": 100629,
        "categoryName": "Điện Thoại & Phụ Kiện",
        "parentCategoryId": 0,
        "hasChildren": true
      },
      {
        "categoryId": 100630,
        "categoryName": "Thời Trang Nam",
        "parentCategoryId": 0,
        "hasChildren": true
      }
    ]
  }
}
```

---

### 6. Get Order Report (Commission Report)

**GraphQL Query:**
```graphql
query getOrderReport(
  $startTime: Int!
  $endTime: Int!
  $page: Int
  $pageSize: Int
  $orderStatus: Int
) {
  orderReport(
    startTime: $startTime
    endTime: $endTime
    page: $page
    pageSize: $pageSize
    orderStatus: $orderStatus
  ) {
    totalCount
    totalCommission
    orders {
      orderId
      orderTime
      productName
      productPrice
      quantity
      commissionRate
      commission
      orderStatus
      subId1
      subId2
      subId3
      subId4
      subId5
    }
  }
}
```

**Variables:**
```json
{
  "startTime": 1609459200,
  "endTime": 1612137600,
  "page": 1,
  "pageSize": 50,
  "orderStatus": null
}
```

**Order Status:**
- `null`: All orders
- `1`: Completed (Đã hoàn thành)
- `2`: Cancelled (Đã hủy)
- `3`: Pending (Đang chờ)

**Response:**
```json
{
  "data": {
    "orderReport": {
      "totalCount": 150,
      "totalCommission": 5000000,
      "orders": [
        {
          "orderId": "210101XXXXXX",
          "orderTime": 1609502400,
          "productName": "iPhone 11",
          "productPrice": 10000000,
          "quantity": 1,
          "commissionRate": 5.0,
          "commission": 500000,
          "orderStatus": 1,
          "subId1": "facebook",
          "subId2": "post_123",
          "subId3": "",
          "subId4": "",
          "subId5": ""
        }
      ]
    }
  }
}
```

---

### 7. Get Account Info

**GraphQL Query:**
```graphql
query {
  accountInfo {
    partnerId
    partnerName
    email
    totalCommission
    availableBalance
    pendingBalance
    totalOrders
    totalClicks
    conversionRate
  }
}
```

---

## SDK Usage (Updated)

### JavaScript/Node.js

```javascript
const ShopeeAffiliateAPI = require('./shopee-affiliate-sdk-v2');

// Initialize với Partner ID và Partner Key (Secret)
const api = new ShopeeAffiliateAPI('YOUR_PARTNER_ID', 'YOUR_PARTNER_KEY');

// 1. Generate short link
const shortLink = await api.generateShortLink(
  'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
  ['facebook', 'post_123', 'user_456', '', ''] // 5 subIds
);
console.log('Short Link:', shortLink);

// 2. Search products
const result = await api.searchProducts('iphone', {
  page: 1,
  pageSize: 20,
  sortType: 3 // Best selling
});

console.log(`Found ${result.totalCount} products`);
result.products.forEach(p => {
  console.log(`${p.productName}: ${p.productPrice} VND (${p.commissionRate}%)`);
});

// 3. Get product details
const products = await api.getProductDetails([6309028319, 6309028320]);

// 4. Get recommended products (hot deals)
const deals = await api.getRecommendedProducts({ pageSize: 20 });

// 5. Get commission report
const report = await api.getOrderReport({
  startTime: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 30 days ago
  endTime: Math.floor(Date.now() / 1000),
  pageSize: 50
});

console.log(`Total Commission: ${report.totalCommission}`);
console.log(`Total Orders: ${report.totalCount}`);

// 6. Get account info
const account = await api.getAccountInfo();
console.log(`Balance: ${account.availableBalance}`);
```

---

## Credentials và Setup

### Lấy Partner ID và Partner Key

1. Đăng nhập https://affiliate.shopee.vn
2. Vào **Settings** > **Developer** > **API Credentials**
3. Copy:
   - **Partner ID** (Credential)
   - **Partner Key** (Secret Key)

### .env File

```bash
SHOPEE_PARTNER_ID=123456
SHOPEE_PARTNER_KEY=your_secret_key_here
```

### Code Example

```javascript
require('dotenv').config();

const api = new ShopeeAffiliateAPI(
  process.env.SHOPEE_PARTNER_ID,
  process.env.SHOPEE_PARTNER_KEY
);
```

---

## Important Notes

### SubIds Array Format

SubIds **PHẢI** là array gồm đúng **5 elements**:

```javascript
// ✅ ĐÚNG
['facebook', 'post_123', '', '', '']
['instagram', 'story_456', 'user_789', '', '']

// ❌ SAI
['facebook'] // Chỉ có 1 element
['a', 'b', 'c'] // Chỉ có 3 elements
```

SDK sẽ tự động pad thêm empty strings nếu ít hơn 5.

### Timestamp Format

- **Unix timestamp** tính bằng **GIÂY** (seconds)
- KHÔNG phải milliseconds

```javascript
// ✅ ĐÚNG
const timestamp = Math.floor(Date.now() / 1000); // 1577836800

// ❌ SAI
const timestamp = Date.now(); // 1577836800000 (quá dài)
```

### URL Formats

Shopee có 2 format URL chính:

```
1. https://shopee.vn/product-name-i.{shopId}.{itemId}
2. https://shopee.vn/product/{shopId}/{itemId}
```

SDK hỗ trợ parse cả 2 formats.

---

## Rate Limits

- **100 requests per minute**
- **10,000 requests per day**

SDK có built-in retry logic để handle rate limits.

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 1001 | Invalid signature | Check Partner ID và Partner Key |
| 1002 | Invalid timestamp | Timestamp phải là Unix time (seconds) |
| 1003 | Missing required parameters | Check input parameters |
| 2001 | Product not found | URL sản phẩm không tồn tại |
| 2002 | Product not available for affiliate | Sản phẩm không tham gia affiliate |
| 3001 | Rate limit exceeded | Wait và retry sau |

---

## Testing

```javascript
// Test authentication
const api = new ShopeeAffiliateAPI('test_partner_id', 'test_partner_key');

api.getAccountInfo()
  .then(info => {
    console.log('✅ Authentication successful!');
    console.log('Account:', info);
  })
  .catch(error => {
    console.error('❌ Authentication failed:', error.message);
  });
```

---

## Migration Guide

Nếu bạn đang dùng SDK cũ, đây là những thay đổi:

### Old Code
```javascript
const sdk = new ShopeeAffiliateSDK('API_KEY', 'API_SECRET');
const link = await sdk.generateAffiliateLink(url, 'subId');
```

### New Code
```javascript
const api = new ShopeeAffiliateAPI('PARTNER_ID', 'PARTNER_KEY');
const shortLink = await api.generateShortLink(url, ['subId', '', '', '', '']);
```

**Key Changes:**
1. Class name: `ShopeeAffiliateSDK` → `ShopeeAffiliateAPI`
2. Constructor params: `(apiKey, apiSecret)` → `(partnerId, partnerKey)`
3. Method: `generateAffiliateLink(url, subId)` → `generateShortLink(url, [subId, '', '', '', ''])`
4. SubIds: single string → array of 5 strings

---

## Files

- **`shopee-affiliate-sdk-v2.js`** - SDK mới với authentication đúng
- **`API_CHINH_XAC.md`** - Documentation này

Sử dụng SDK v2 cho tất cả projects mới!
