# Giải Thích Chi Tiết về Curl Command của Shopee Affiliate

## 📋 Command Gốc

```bash
curl -X POST 'https://open-api.affiliate.shopee.vn/graphql' \
-H 'Authorization:SHA256 Credential=123456, Signature=x9bc0bd3ba6c41d98a591976bf95db97a58720a9e6d778845408765c3fafad69d, Timestamp=1577836800' \
-H 'Content-Type: application/json' \
--data-raw '{"query":"mutation{\n    generateShortLink(input:{originUrl:"https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319",subIds:["s1","s2","s3","s4","s5"]}){\n        shortLink\n    }\n}"}'
```

---

## 🔍 Phân Tích Từng Phần

### 1. URL Endpoint
```
https://open-api.affiliate.shopee.vn/graphql
```
- Đây là **GraphQL endpoint** của Shopee Affiliate API
- Tất cả requests đều gửi đến endpoint này
- Method: **POST**

---

### 2. Authorization Header

```
Authorization: SHA256 Credential=123456, Signature=x9bc0bd..., Timestamp=1577836800
```

#### Cấu trúc:
```
SHA256 Credential=<PARTNER_ID>, Signature=<HMAC_SHA256>, Timestamp=<UNIX_TIME>
```

#### Các thành phần:

**a) Credential (Partner ID)**
```
Credential=123456
```
- Đây là **Partner ID** của bạn
- Lấy từ Shopee Affiliate Dashboard > Developer > API Credentials

**b) Signature**
```
Signature=x9bc0bd3ba6c41d98a591976bf95db97a58720a9e6d778845408765c3fafad69d
```
- Chữ ký SHA256 để xác thực request
- Được tính bằng công thức:

```javascript
// Base string
const baseString = partnerId + "|" + apiPath + "|" + timestamp + "|" + requestBody + "|" + partnerKey;

// Ví dụ:
// "123456|/graphql|1577836800|{...query...}|your_secret_key"

// Generate SHA256
const signature = crypto.createHash('sha256').update(baseString).digest('hex');
```

**c) Timestamp**
```
Timestamp=1577836800
```
- Unix timestamp tính bằng **GIÂY** (không phải milliseconds)
- `1577836800` = Wed Jan 01 2020 00:00:00 GMT
- Dùng để prevent replay attacks

---

### 3. Content-Type Header
```
Content-Type: application/json
```
- Báo cho server biết request body là JSON
- Required cho GraphQL

---

### 4. Request Body (GraphQL Query)

#### Raw format (như trong curl):
```json
{
  "query": "mutation{\n    generateShortLink(input:{originUrl:\"https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319\",subIds:[\"s1\",\"s2\",\"s3\",\"s4\",\"s5\"]}){\n        shortLink\n    }\n}"
}
```

#### Formatted (dễ đọc):
```graphql
mutation {
  generateShortLink(input: {
    originUrl: "https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319"
    subIds: ["s1", "s2", "s3", "s4", "s5"]
  }) {
    shortLink
  }
}
```

#### Giải thích:

**a) Mutation Name**
```
generateShortLink
```
- Đây là API để tạo affiliate link (short link)
- Mutation (không phải query) vì nó tạo/thay đổi data

**b) Input Parameters**

**originUrl:**
```
"https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319"
```
- URL gốc của sản phẩm Shopee
- Format: `shopee.vn/{product-name}-i.{shop_id}.{item_id}`
- Trong ví dụ này:
  - Shop ID: `52377417`
  - Item ID: `6309028319`

**subIds:**
```
["s1", "s2", "s3", "s4", "s5"]
```
- Array gồm **5 sub IDs** để tracking
- Dùng để phân biệt nguồn traffic
- Có thể để trống: `["", "", "", "", ""]`
- Ví dụ thực tế: `["facebook", "post_123", "user_456", "campaign_new_year", ""]`

**c) Return Fields**
```
{
  shortLink
}
```
- Request chỉ lấy field `shortLink`
- Có thể request thêm: `error`, `errorMessage`

---

## 📤 Response Mẫu

### Success Response:
```json
{
  "data": {
    "generateShortLink": {
      "shortLink": "https://shope.ee/5KgBaYoQZ7"
    }
  }
}
```

### Error Response:
```json
{
  "data": {
    "generateShortLink": {
      "shortLink": null,
      "error": 2001,
      "errorMessage": "Product not found"
    }
  }
}
```

---

## 💻 Cách Implement trong Code

### JavaScript/Node.js

```javascript
const crypto = require('crypto');
const axios = require('axios');

// Credentials
const partnerId = '123456';
const partnerKey = 'your_secret_key';

// Request data
const query = `
  mutation {
    generateShortLink(input: {
      originUrl: "https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319"
      subIds: ["s1", "s2", "s3", "s4", "s5"]
    }) {
      shortLink
      error
      errorMessage
    }
  }
`;

const body = JSON.stringify({ query });

// Generate signature
const timestamp = Math.floor(Date.now() / 1000);
const apiPath = '/graphql';
const baseString = `${partnerId}|${apiPath}|${timestamp}|${body}|${partnerKey}`;
const signature = crypto.createHash('sha256').update(baseString).digest('hex');

// Make request
const response = await axios.post(
  'https://open-api.affiliate.shopee.vn/graphql',
  body,
  {
    headers: {
      'Authorization': `SHA256 Credential=${partnerId}, Signature=${signature}, Timestamp=${timestamp}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log('Short Link:', response.data.data.generateShortLink.shortLink);
```

### Python

```python
import hashlib
import time
import json
import requests

# Credentials
partner_id = '123456'
partner_key = 'your_secret_key'

# Request data
query = """
mutation {
  generateShortLink(input: {
    originUrl: "https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319"
    subIds: ["s1", "s2", "s3", "s4", "s5"]
  }) {
    shortLink
    error
    errorMessage
  }
}
"""

body = json.dumps({'query': query})

# Generate signature
timestamp = int(time.time())
api_path = '/graphql'
base_string = f"{partner_id}|{api_path}|{timestamp}|{body}|{partner_key}"
signature = hashlib.sha256(base_string.encode()).hexdigest()

# Make request
response = requests.post(
    'https://open-api.affiliate.shopee.vn/graphql',
    data=body,
    headers={
        'Authorization': f'SHA256 Credential={partner_id}, Signature={signature}, Timestamp={timestamp}',
        'Content-Type': 'application/json'
    }
)

result = response.json()
print('Short Link:', result['data']['generateShortLink']['shortLink'])
```

---

## 🎯 Use Cases

### 1. Generate Link cho một sản phẩm

```bash
curl -X POST 'https://open-api.affiliate.shopee.vn/graphql' \
  -H 'Authorization: SHA256 Credential=YOUR_ID, Signature=YOUR_SIG, Timestamp=1234567890' \
  -H 'Content-Type: application/json' \
  -d '{"query":"mutation{generateShortLink(input:{originUrl:\"https://shopee.vn/product-i.123.456\",subIds:[\"web\",\"\",\"\",\"\",\"\"]}) {shortLink}}"}'
```

### 2. Tracking theo platform

```javascript
// Facebook traffic
subIds: ["facebook", "page_id_123", "post_id_456", "", ""]

// Instagram traffic  
subIds: ["instagram", "user_789", "story_id_012", "", ""]

// Website traffic
subIds: ["website", "blog_post", "category_tech", "banner_top", ""]
```

### 3. Phân tích sau này

Khi có order, bạn sẽ nhận được data như:
```json
{
  "orderId": "210101XXXXXX",
  "commission": 50000,
  "subId1": "facebook",
  "subId2": "page_id_123",
  "subId3": "post_id_456",
  "subId4": "",
  "subId5": ""
}
```

Từ đó bạn có thể phân tích:
- Platform nào convert tốt nhất (Facebook, Instagram, Website)
- Post nào hiệu quả
- User nào share nhiều
- Campaign nào ROI cao

---

## ⚠️ Common Mistakes

### 1. Timestamp sai format
```javascript
// ❌ SAI - milliseconds
const timestamp = Date.now(); // 1577836800000

// ✅ ĐÚNG - seconds  
const timestamp = Math.floor(Date.now() / 1000); // 1577836800
```

### 2. Signature không đúng
```javascript
// ❌ SAI - thiếu partner key
const baseString = `${partnerId}|${apiPath}|${timestamp}|${body}`;

// ✅ ĐÚNG - có partner key ở cuối
const baseString = `${partnerId}|${apiPath}|${timestamp}|${body}|${partnerKey}`;
```

### 3. SubIds không đủ 5 elements
```javascript
// ❌ SAI
subIds: ["facebook", "post123"]

// ✅ ĐÚNG
subIds: ["facebook", "post123", "", "", ""]
```

### 4. JSON escaping trong GraphQL
```javascript
// ❌ SAI - thiếu escape quotes
originUrl: "https://shopee.vn/product"

// ✅ ĐÚNG - trong JSON string phải escape
originUrl: \"https://shopee.vn/product\"
```

---

## 🔧 Testing

### Test với curl:

```bash
# Replace YOUR_PARTNER_ID, YOUR_SIGNATURE, YOUR_TIMESTAMP
curl -X POST 'https://open-api.affiliate.shopee.vn/graphql' \
  -H 'Authorization: SHA256 Credential=YOUR_PARTNER_ID, Signature=YOUR_SIGNATURE, Timestamp=YOUR_TIMESTAMP' \
  -H 'Content-Type: application/json' \
  -d '{"query":"mutation{generateShortLink(input:{originUrl:\"https://shopee.vn/product-i.1.1\",subIds:[\"test\",\"\",\"\",\"\",\"\"]}) {shortLink error errorMessage}}"}'
```

### Test với SDK:

```javascript
const ShopeeAffiliateAPI = require('./shopee-affiliate-sdk-v2');

const api = new ShopeeAffiliateAPI('YOUR_PARTNER_ID', 'YOUR_PARTNER_KEY');

// Test
api.generateShortLink(
  'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
  ['test', '', '', '', '']
)
.then(shortLink => {
  console.log('✅ Success!');
  console.log('Short Link:', shortLink);
})
.catch(error => {
  console.error('❌ Error:', error.message);
});
```

---

## 📚 Related Files

- **`shopee-affiliate-sdk-v2.js`** - SDK đã implement sẵn
- **`API_CHINH_XAC.md`** - Full API documentation
- **`.env.example`** - Config template

---

## 🎓 Summary

Curl command này cho thấy:

1. ✅ **Đây ĐÚNG là API của Shopee Affiliate**
2. ✅ Dùng để **generate short link (affiliate link)**
3. ✅ Authentication format: `SHA256 Credential, Signature, Timestamp`
4. ✅ GraphQL mutation: `generateShortLink`
5. ✅ Input: `originUrl` + `subIds` (5 elements)
6. ✅ Output: `shortLink` (URL rút gọn)

**Sử dụng SDK v2 đã có sẵn trong repo này để dễ dàng tích hợp!** 🚀
