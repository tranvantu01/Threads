# Hướng Dẫn Sử Dụng Shopee Affiliate API

## 📋 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Đăng Ký API Key](#đăng-ký-api-key)
3. [Cài Đặt](#cài-đặt)
4. [Sử Dụng SDK](#sử-dụng-sdk)
5. [Ví Dụ Ứng Dụng](#ví-dụ-ứng-dụng)
6. [Best Practices](#best-practices)

---

## Giới Thiệu

Repo này cung cấp đầy đủ công cụ để tích hợp Shopee Affiliate API vào ứng dụng của bạn:

- **SDK JavaScript/Node.js** (`shopee-affiliate-sdk.js`)
- **SDK Python** (`shopee_affiliate_sdk.py`)
- **SDK Flutter/Dart** (`shopee_affiliate_flutter.dart`)
- **Backend Server Example** (Express.js)
- **Frontend Components** (React)
- **API Documentation** (`SHOPEE_AFFILIATE_API.md`)

---

## Đăng Ký API Key

### Bước 1: Đăng ký tài khoản Shopee Affiliate

1. Truy cập: https://affiliate.shopee.vn
2. Đăng ký tài khoản affiliate
3. Hoàn thành verification

### Bước 2: Lấy API Credentials

1. Đăng nhập vào Shopee Affiliate Dashboard
2. Vào mục **Developer** hoặc **API Settings**
3. Tạo API Key mới
4. Copy **API Key** và **API Secret**

⚠️ **Lưu ý:** Giữ API Secret của bạn an toàn, không commit vào git!

---

## Cài Đặt

### Node.js Project

```bash
# Clone hoặc copy các file vào project
npm install

# Copy .env.example thành .env
cp .env.example .env

# Điền API credentials vào .env
# SHOPEE_API_KEY=your_api_key_here
# SHOPEE_API_SECRET=your_api_secret_here

# Chạy server
npm start
```

### Python Project

```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Tạo .env file
cp .env.example .env

# Điền API credentials

# Sử dụng trong code
python
>>> from shopee_affiliate_sdk import ShopeeAffiliateSDK
>>> sdk = ShopeeAffiliateSDK('API_KEY', 'API_SECRET')
```

### Flutter Project

```yaml
# Thêm vào pubspec.yaml
dependencies:
  http: ^1.1.0
  crypto: ^3.0.3
  flutter_dotenv: ^5.1.0
  url_launcher: ^6.2.1
  share_plus: ^7.2.1

# Copy file shopee_affiliate_flutter.dart vào lib/
# Import và sử dụng:
# import 'shopee_affiliate_flutter.dart';
```

---

## Sử Dụng SDK

### JavaScript/Node.js

```javascript
const ShopeeAffiliateSDK = require('./shopee-affiliate-sdk');

// Initialize SDK
const sdk = new ShopeeAffiliateSDK('API_KEY', 'API_SECRET');

// 1. Generate affiliate link
const link = await sdk.generateAffiliateLink(
  'https://shopee.vn/product/123/456',
  'my_tracking_id' // optional
);
console.log('Short Link:', link.data.short_link);

// 2. Search products
const products = await sdk.searchProducts('điện thoại', {
  limit: 20,
  sortType: 3 // Best Selling
});

products.products.forEach(p => {
  console.log(`${p.name} - Commission: ${p.commission_rate}%`);
});

// 3. Get product details
const { itemId, shopId } = ShopeeAffiliateSDK.parseShopeeUrl(
  'https://shopee.vn/product/123/456'
);
const product = await sdk.getProductDetails(itemId, shopId);

// 4. Get deals
const deals = await sdk.getDeals({ limit: 20 });

// 5. Get commission report
const report = await sdk.getCommissionReport(
  '2024-01-01',
  '2024-01-31'
);
```

### Python

```python
from shopee_affiliate_sdk import ShopeeAffiliateSDK

# Initialize SDK
sdk = ShopeeAffiliateSDK('API_KEY', 'API_SECRET')

# 1. Generate affiliate link
result = sdk.generate_affiliate_link(
    'https://shopee.vn/product/123/456',
    sub_id='my_tracking_id'
)
print('Short Link:', result['data']['short_link'])

# 2. Search products
products = sdk.search_products('điện thoại', limit=20)
for product in products['products']:
    print(f"{product['name']} - Commission: {product['commission_rate']}%")

# 3. Get product details
parsed = ShopeeAffiliateSDK.parse_shopee_url('https://shopee.vn/product/123/456')
product = sdk.get_product_details(parsed['item_id'], parsed['shop_id'])

# 4. Get deals
deals = sdk.get_deals(limit=20)

# 5. Get account info
account = sdk.get_account_info()
print(f"Total Commission: {account['total_commission']}")
```

### Flutter/Dart

```dart
import 'shopee_affiliate_flutter.dart';

// Initialize SDK
final sdk = ShopeeAffiliateSDK(
  apiKey: 'API_KEY',
  apiSecret: 'API_SECRET',
);

// 1. Generate affiliate link
final link = await sdk.generateAffiliateLink(
  'https://shopee.vn/product/123/456',
  subId: 'my_tracking_id',
);
print('Short Link: ${link.shortLink}');

// 2. Search products
final result = await sdk.searchProducts('điện thoại', limit: 20);
for (var product in result.products) {
  print('${product.name} - ${product.commissionRate}%');
}

// 3. Get product details
final ids = ShopeeAffiliateSDK.parseShopeeUrl(
  'https://shopee.vn/product/123/456'
);
final product = await sdk.getProductDetails(ids['item_id']!, ids['shop_id']!);

// 4. Get deals
final deals = await sdk.getDeals(limit: 20);
```

---

## Ví Dụ Ứng Dụng

### 1. Chạy Backend Server

```bash
# Đảm bảo đã điền API credentials trong .env
npm start

# Server sẽ chạy tại http://localhost:3000
```

Test API endpoints:

```bash
# Generate affiliate link
curl -X POST http://localhost:3000/api/affiliate/generate-link \
  -H "Content-Type: application/json" \
  -d '{"product_url": "https://shopee.vn/product/123/456"}'

# Search products
curl "http://localhost:3000/api/affiliate/search?keyword=điện+thoại&limit=10"

# Get deals
curl "http://localhost:3000/api/affiliate/deals?limit=20"
```

### 2. React Frontend

React components trong `react-shopee-affiliate-example.jsx` bao gồm:

- **AffiliateLinkGenerator**: Tạo affiliate links
- **ProductSearch**: Tìm kiếm sản phẩm
- **ProductCard**: Hiển thị thông tin sản phẩm
- **DealsShowcase**: Hiển thị deals/flash sales
- **CommissionDashboard**: Dashboard báo cáo hoa hồng

Import và sử dụng:

```jsx
import { 
  AffiliateLinkGenerator,
  ProductSearch,
  CommissionDashboard 
} from './react-shopee-affiliate-example';

function App() {
  return (
    <div>
      <AffiliateLinkGenerator />
      <ProductSearch />
      <CommissionDashboard />
    </div>
  );
}
```

### 3. Flutter App

Xem ví dụ đầy đủ trong `shopee_affiliate_flutter.dart`:

```dart
// Main app
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  final sdk = ShopeeAffiliateSDK(
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
  );

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ProductSearchScreen(sdk: sdk),
    );
  }
}
```

---

## Best Practices

### 1. Bảo Mật API Credentials

❌ **KHÔNG BAO GIỜ:**
```javascript
// ĐỪNG commit API credentials vào code
const API_KEY = "123abc456def";
```

✅ **NÊN:**
```javascript
// Sử dụng environment variables
const API_KEY = process.env.SHOPEE_API_KEY;
```

### 2. Caching

Implement caching để giảm số lượng API calls:

```javascript
// Node.js với node-cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

async function getProductWithCache(itemId, shopId) {
  const cacheKey = `product_${itemId}_${shopId}`;
  
  // Check cache first
  let product = cache.get(cacheKey);
  if (product) return product;
  
  // Fetch from API
  product = await sdk.getProductDetails(itemId, shopId);
  cache.set(cacheKey, product);
  
  return product;
}
```

### 3. Error Handling

```javascript
try {
  const link = await sdk.generateAffiliateLink(url);
  console.log('Success:', link);
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limit - wait and retry
    console.log('Rate limited, waiting...');
    await sleep(5000);
    // Retry logic here
  } else if (error.response?.status === 401) {
    // Invalid credentials
    console.error('Invalid API credentials');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### 4. Rate Limiting

Shopee API có giới hạn:
- **100 requests/phút**
- **10,000 requests/ngày**

Implement rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 90, // 90 requests per minute (leave some buffer)
});

app.use('/api/', limiter);
```

### 5. Sub ID Tracking

Sử dụng `sub_id` để tracking hiệu quả:

```javascript
// Ví dụ sub_id format
const subId = `${platform}_${userId}_${timestamp}`;
// VD: "facebook_user123_20240105"

const link = await sdk.generateAffiliateLink(url, subId);
```

Sau đó có thể phân tích:
```javascript
const report = await sdk.getCommissionReport(startDate, endDate);
report.records.forEach(record => {
  const [platform, userId, timestamp] = record.sub_id.split('_');
  // Analyze by platform, user, etc.
});
```

### 6. Deep Linking cho Mobile Apps

```javascript
// Web: Sử dụng short_link
const webLink = affiliateLink.short_link;

// Mobile: Sử dụng click_url hoặc deep link
const mobileLink = affiliateLink.click_url;

// iOS Universal Link format
const iosLink = `shopee://product/${itemId}/${shopId}?affiliate=${token}`;

// Android App Link format
const androidLink = `https://shopee.vn/universal-link/product/${itemId}/${shopId}?affiliate=${token}`;
```

---

## Các Use Cases Phổ Biến

### 1. Price Comparison App

```javascript
async function compareProductPrices(keyword) {
  const results = await sdk.searchProducts(keyword, {
    limit: 50,
    sortType: 4 // Price low to high
  });
  
  // Sort by price and commission
  const sorted = results.products.sort((a, b) => {
    const commissionA = a.price * a.commission_rate / 100;
    const commissionB = b.price * b.commission_rate / 100;
    return commissionB - commissionA; // Highest commission first
  });
  
  return sorted;
}
```

### 2. Deal Hunting Bot (Telegram/Discord)

```javascript
// Telegram bot example
bot.onText(/\/deals/, async (msg) => {
  const deals = await sdk.getDeals({ limit: 10 });
  
  for (const deal of deals.products) {
    const link = await sdk.generateAffiliateLink(
      `https://shopee.vn/product/${deal.shop_id}/${deal.item_id}`,
      `telegram_${msg.from.id}`
    );
    
    const message = `
🔥 ${deal.name}
💰 ${deal.price.toLocaleString()} VND (Giảm ${deal.discount})
💵 Hoa hồng: ${deal.commission_rate}%
🔗 ${link.data.short_link}
    `;
    
    bot.sendMessage(msg.chat.id, message);
  }
});
```

### 3. Cashback App

```javascript
// User generates link -> Gets cashback from your commission
async function generateCashbackLink(userId, productUrl, cashbackPercent) {
  // Generate affiliate link
  const link = await sdk.generateAffiliateLink(
    productUrl,
    `cashback_${userId}`
  );
  
  // Get product to calculate potential cashback
  const { itemId, shopId } = ShopeeAffiliateSDK.parseShopeeUrl(productUrl);
  const product = await sdk.getProductDetails(itemId, shopId);
  
  const commission = product.data.commission;
  const cashback = commission * (cashbackPercent / 100);
  
  // Store in database
  await db.cashback.create({
    user_id: userId,
    product_id: itemId,
    affiliate_link: link.data.short_link,
    commission: commission,
    cashback_amount: cashback,
    cashback_percent: cashbackPercent
  });
  
  return {
    link: link.data.short_link,
    cashback: cashback
  };
}
```

### 4. Auto Link Converter (Browser Extension)

```javascript
// Content script - detect Shopee links and convert
document.querySelectorAll('a[href*="shopee.vn"]').forEach(async (link) => {
  const originalUrl = link.href;
  
  // Skip if already affiliate link
  if (originalUrl.includes('c.shopee.vn')) return;
  
  try {
    const affiliateLink = await generateAffiliateLink(originalUrl);
    link.href = affiliateLink.short_link;
    link.style.color = 'green';
    link.title = 'Affiliate Link (kiếm hoa hồng khi mua)';
  } catch (e) {
    console.error('Failed to convert link:', e);
  }
});
```

---

## Troubleshooting

### Lỗi: "Invalid API Key"

- Kiểm tra lại API Key và Secret trong `.env`
- Đảm bảo không có khoảng trắng thừa
- Verify API credentials tại Shopee Affiliate Dashboard

### Lỗi: "Rate Limit Exceeded"

- Giảm số lượng requests
- Implement caching
- Sử dụng exponential backoff khi retry

### Lỗi: "Product Not Found"

- URL sản phẩm có thể không hợp lệ
- Sản phẩm có thể đã bị xóa hoặc hết hàng
- Verify item_id và shop_id

### Performance Issues

- Enable caching cho product details và affiliate links
- Sử dụng batch operations khi có thể
- Consider CDN cho static assets

---

## Resources

- **Official Docs**: https://open.shopee.com/documents/v1/v1.affiliate.introduction
- **Affiliate Dashboard**: https://affiliate.shopee.vn
- **Developer Portal**: https://affiliate.shopee.vn/developer
- **Support**: affiliate-support@shopee.com

---

## License

MIT License - Free to use for personal and commercial projects

---

**Chúc bạn thành công với Shopee Affiliate! 🚀💰**
