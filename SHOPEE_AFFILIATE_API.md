# Shopee Affiliate API Documentation

## Tổng quan
Tài liệu này cung cấp thông tin chi tiết về Shopee Affiliate API để tích hợp vào ứng dụng.

## Base URL
```
https://open-api.affiliate.shopee.vn/graphql
```

## Authentication

### API Key và Secret
Bạn cần đăng ký tài khoản Shopee Affiliate và lấy:
- `API Key`
- `API Secret`

### Headers yêu cầu
```
Content-Type: application/json
```

---

## Các API Endpoints Chính

### 1. Generate Affiliate Link

**Mô tả:** Tạo link affiliate từ link sản phẩm Shopee thường

**GraphQL Query:**
```graphql
mutation {
  generateAffiliateLink(
    requests: [{
      product_url: "https://shopee.vn/product/123456789/987654321"
      sub_id: "optional_tracking_id"
    }]
  ) {
    result {
      error
      error_msg
      data {
        origin_url
        short_link
        click_url
      }
    }
  }
}
```

**Response Example:**
```json
{
  "data": {
    "generateAffiliateLink": {
      "result": [{
        "error": 0,
        "error_msg": "",
        "data": {
          "origin_url": "https://shopee.vn/product/123456789/987654321",
          "short_link": "https://s.shopee.vn/XXXXX",
          "click_url": "https://c.shopee.vn/XXXXX"
        }
      }]
    }
  }
}
```

---

### 2. Get Product Details

**Mô tả:** Lấy thông tin chi tiết sản phẩm

**GraphQL Query:**
```graphql
query {
  productDetail(
    item_id: 123456789
    shop_id: 987654321
  ) {
    batch_result {
      error
      error_msg
      data {
        item_id
        shop_id
        name
        price
        price_max
        price_min
        discount
        stock
        sold
        rating_star
        rating_count
        image
        images
        categories
        shop_name
        commission_rate
        commission
      }
    }
  }
}
```

**Response Example:**
```json
{
  "data": {
    "productDetail": {
      "batch_result": [{
        "error": 0,
        "error_msg": "",
        "data": {
          "item_id": 123456789,
          "shop_id": 987654321,
          "name": "Tên sản phẩm",
          "price": 100000,
          "discount": "20%",
          "stock": 100,
          "sold": 500,
          "rating_star": 4.5,
          "rating_count": 200,
          "commission_rate": 5.0,
          "commission": 5000,
          "image": "https://cf.shopee.vn/file/xxxxx",
          "images": ["url1", "url2"]
        }
      }]
    }
  }
}
```

---

### 3. Search Products

**Mô tả:** Tìm kiếm sản phẩm theo từ khóa

**GraphQL Query:**
```graphql
query {
  productSearch(
    keyword: "điện thoại"
    limit: 20
    offset: 0
    sort_type: 1  # 1: Phổ biến, 2: Mới nhất, 3: Bán chạy, 4: Giá thấp->cao, 5: Giá cao->thấp
  ) {
    total_count
    products {
      item_id
      shop_id
      name
      price
      price_max
      price_min
      discount
      stock
      sold
      rating_star
      image
      commission_rate
    }
  }
}
```

---

### 4. Get Product Categories

**Mô tả:** Lấy danh sách danh mục sản phẩm

**GraphQL Query:**
```graphql
query {
  categories {
    category_id
    category_name
    parent_category_id
    has_children
  }
}
```

---

### 5. Get Deals/Promotions

**Mô tả:** Lấy danh sách sản phẩm đang khuyến mãi

**GraphQL Query:**
```graphql
query {
  getDeals(
    category_id: 0
    limit: 20
    offset: 0
  ) {
    total_count
    products {
      item_id
      shop_id
      name
      price
      price_before_discount
      discount
      sold
      rating_star
      image
      commission_rate
      commission
      is_flash_sale
      flash_sale_end_time
    }
  }
}
```

---

### 6. Get Commission Report

**Mô tả:** Lấy báo cáo hoa hồng

**GraphQL Query:**
```graphql
query {
  getCommissionReport(
    start_date: "2024-01-01"
    end_date: "2024-01-31"
    page: 1
    page_size: 50
  ) {
    total_count
    total_commission
    records {
      order_id
      product_name
      product_price
      quantity
      commission_rate
      commission
      order_status
      order_time
      sub_id
    }
  }
}
```

---

### 7. Get Account Info

**Mô tả:** Lấy thông tin tài khoản affiliate

**GraphQL Query:**
```graphql
query {
  getAccountInfo {
    user_id
    username
    email
    total_commission
    available_balance
    pending_balance
    total_clicks
    total_orders
    conversion_rate
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 0 | Success | Thành công |
| 1001 | Invalid API Key | API Key không hợp lệ |
| 1002 | Invalid Signature | Chữ ký không hợp lệ |
| 1003 | Missing Required Parameters | Thiếu tham số bắt buộc |
| 2001 | Product Not Found | Không tìm thấy sản phẩm |
| 2002 | Product Not Available | Sản phẩm không khả dụng |
| 3001 | Rate Limit Exceeded | Vượt quá giới hạn request |
| 4001 | Invalid URL Format | Format URL không đúng |

---

## Best Practices

### 1. Caching
- Cache thông tin sản phẩm trong 1-24 giờ để giảm số lượng API calls
- Cache affiliate links để tránh tạo duplicate links

### 2. Rate Limiting
- Giới hạn: 100 requests/phút
- Implement exponential backoff khi gặp rate limit

### 3. Error Handling
```javascript
try {
  const response = await shopeeAffiliateAPI.generateLink(productUrl);
  if (response.error !== 0) {
    console.error('API Error:', response.error_msg);
    // Handle error
  }
} catch (error) {
  console.error('Network Error:', error);
  // Retry logic
}
```

### 4. Deep Linking
Sử dụng `click_url` cho mobile apps và `short_link` cho web/social media

---

## Ví dụ Implementation (JavaScript/Node.js)

```javascript
const axios = require('axios');
const crypto = require('crypto');

class ShopeeAffiliateAPI {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = 'https://open-api.affiliate.shopee.vn/graphql';
  }

  // Generate signature for authentication
  generateSignature(timestamp, query) {
    const message = `${timestamp}${query}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }

  // Make API request
  async request(query, variables = {}) {
    const timestamp = Date.now();
    const signature = this.generateSignature(timestamp, query);

    try {
      const response = await axios.post(this.baseUrl, {
        query: query,
        variables: variables
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Timestamp': timestamp,
          'X-Signature': signature
        }
      });

      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate affiliate link
  async generateAffiliateLink(productUrl, subId = '') {
    const query = `
      mutation($requests: [AffiliateRequest!]!) {
        generateAffiliateLink(requests: $requests) {
          result {
            error
            error_msg
            data {
              origin_url
              short_link
              click_url
            }
          }
        }
      }
    `;

    const variables = {
      requests: [{
        product_url: productUrl,
        sub_id: subId
      }]
    };

    return await this.request(query, variables);
  }

  // Search products
  async searchProducts(keyword, limit = 20, offset = 0) {
    const query = `
      query($keyword: String!, $limit: Int, $offset: Int) {
        productSearch(keyword: $keyword, limit: $limit, offset: $offset) {
          total_count
          products {
            item_id
            shop_id
            name
            price
            discount
            sold
            rating_star
            image
            commission_rate
          }
        }
      }
    `;

    const variables = { keyword, limit, offset };
    return await this.request(query, variables);
  }

  // Get product details
  async getProductDetails(itemId, shopId) {
    const query = `
      query($itemId: Int!, $shopId: Int!) {
        productDetail(item_id: $itemId, shop_id: $shopId) {
          batch_result {
            error
            error_msg
            data {
              item_id
              shop_id
              name
              price
              discount
              stock
              sold
              rating_star
              rating_count
              image
              images
              commission_rate
              commission
            }
          }
        }
      }
    `;

    const variables = { itemId, shopId };
    return await this.request(query, variables);
  }

  // Get deals
  async getDeals(categoryId = 0, limit = 20) {
    const query = `
      query($categoryId: Int!, $limit: Int) {
        getDeals(category_id: $categoryId, limit: $limit) {
          total_count
          products {
            item_id
            shop_id
            name
            price
            price_before_discount
            discount
            image
            commission_rate
            is_flash_sale
          }
        }
      }
    `;

    const variables = { categoryId, limit };
    return await this.request(query, variables);
  }
}

// Usage example
const api = new ShopeeAffiliateAPI('YOUR_API_KEY', 'YOUR_API_SECRET');

// Generate affiliate link
api.generateAffiliateLink('https://shopee.vn/product/123/456', 'my_tracking_id')
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Search products
api.searchProducts('điện thoại samsung', 20, 0)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

## Ví dụ Implementation (Python)

```python
import requests
import hashlib
import hmac
import time
import json

class ShopeeAffiliateAPI:
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = 'https://open-api.affiliate.shopee.vn/graphql'
    
    def generate_signature(self, timestamp, query):
        message = f"{timestamp}{query}"
        signature = hmac.new(
            self.api_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def request(self, query, variables=None):
        timestamp = int(time.time() * 1000)
        signature = self.generate_signature(timestamp, query)
        
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Timestamp': str(timestamp),
            'X-Signature': signature
        }
        
        payload = {
            'query': query,
            'variables': variables or {}
        }
        
        try:
            response = requests.post(self.base_url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f'API Error: {e}')
            raise
    
    def generate_affiliate_link(self, product_url, sub_id=''):
        query = '''
        mutation($requests: [AffiliateRequest!]!) {
            generateAffiliateLink(requests: $requests) {
                result {
                    error
                    error_msg
                    data {
                        origin_url
                        short_link
                        click_url
                    }
                }
            }
        }
        '''
        
        variables = {
            'requests': [{
                'product_url': product_url,
                'sub_id': sub_id
            }]
        }
        
        return self.request(query, variables)
    
    def search_products(self, keyword, limit=20, offset=0):
        query = '''
        query($keyword: String!, $limit: Int, $offset: Int) {
            productSearch(keyword: $keyword, limit: $limit, offset: $offset) {
                total_count
                products {
                    item_id
                    shop_id
                    name
                    price
                    discount
                    sold
                    rating_star
                    image
                    commission_rate
                }
            }
        }
        '''
        
        variables = {
            'keyword': keyword,
            'limit': limit,
            'offset': offset
        }
        
        return self.request(query, variables)
    
    def get_product_details(self, item_id, shop_id):
        query = '''
        query($itemId: Int!, $shopId: Int!) {
            productDetail(item_id: $itemId, shop_id: $shopId) {
                batch_result {
                    error
                    error_msg
                    data {
                        item_id
                        shop_id
                        name
                        price
                        discount
                        stock
                        sold
                        rating_star
                        commission_rate
                    }
                }
            }
        }
        '''
        
        variables = {
            'itemId': item_id,
            'shopId': shop_id
        }
        
        return self.request(query, variables)

# Usage
api = ShopeeAffiliateAPI('YOUR_API_KEY', 'YOUR_API_SECRET')

# Generate affiliate link
result = api.generate_affiliate_link('https://shopee.vn/product/123/456')
print(result)

# Search products
products = api.search_products('điện thoại', limit=20)
print(products)
```

---

## Use Cases cho App Development

### 1. Price Comparison App
- Sử dụng `searchProducts` để tìm sản phẩm
- So sánh giá giữa các shop
- Generate affiliate links cho mỗi sản phẩm

### 2. Deal Hunting App
- Sử dụng `getDeals` để lấy sản phẩm giảm giá
- Filter theo `commission_rate` cao
- Notification cho flash sales

### 3. Product Review App
- Lấy thông tin sản phẩm qua `getProductDetails`
- Hiển thị rating và reviews
- Embed affiliate links trong reviews

### 4. Shopping Assistant Bot
- Tích hợp vào Telegram/Discord/Facebook Messenger
- Auto-generate affiliate links khi user share Shopee links
- Track conversions qua `sub_id`

### 5. Cashback/Rewards App
- Generate affiliate links
- Track orders qua `getCommissionReport`
- Chia sẻ commission với users dưới dạng cashback

---

## Tips & Tricks

1. **Sub ID Tracking**: Sử dụng `sub_id` để track nguồn traffic (VD: `facebook_post_001`, `instagram_story_002`)

2. **Deep Linking**: Cho mobile apps, sử dụng format: `shopee://product/{item_id}/{shop_id}?affiliate_token={token}`

3. **Image Optimization**: Shopee images có thể resize bằng cách thêm suffix `_tn` (thumbnail) vào URL

4. **Cron Jobs**: Setup cron để update product prices và stock mỗi ngày

5. **Webhook Integration**: Nếu có, setup webhook để nhận real-time updates về orders

---

## Testing

### Test Endpoints
```
https://open-api.test-stable.affiliate.shopee.vn/graphql
```

### Test Credentials
- Đăng ký tài khoản test tại: https://affiliate.shopee.vn/developer
- Lấy test API keys từ dashboard

---

## Resources

- Official Documentation: https://open.shopee.com/documents/v1/v1.affiliate.introduction
- Developer Portal: https://affiliate.shopee.vn/developer
- Support: affiliate-support@shopee.com
- Rate Limits: 100 requests/minute, 10000 requests/day

---

## Notes

- API này là tài liệu tham khảo. Một số endpoints có thể khác nhau tùy theo region (VN, MY, SG, etc.)
- Luôn check official documentation của Shopee để có thông tin mới nhất
- Comply với Shopee Affiliate Terms of Service
- Không được manipulate hoặc hide affiliate links

---

*Last Updated: 2025-10-05*
