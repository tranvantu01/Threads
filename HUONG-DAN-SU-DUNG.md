# 🎯 HƯỚNG DẪN SỬ DỤNG - Gắn Affiliate ID vào Shopee Link

## ⚡ Cách nhanh nhất (3 bước)

### Bước 1: Mở file `quick-start.js`

### Bước 2: Thay đổi thông tin của bạn

```javascript
const MY_CONFIG = {
  partnerId: '123456',                    // ← Thay bằng Partner ID của bạn
  partnerKey: 'your_partner_key_here',    // ← Thay bằng Partner Key của bạn
  affiliateId: 'MY_AFFILIATE_ID',         // ← Thay bằng Affiliate ID của bạn
  
  // URL sản phẩm Shopee bạn muốn tạo link
  productUrl: 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
  
  // Thông tin tracking (tùy chọn)
  tracking: {
    source: 'facebook',      // Nguồn traffic
    campaign: 'summer_sale', // Tên campaign
    medium: 'social',        // Medium
    content: 'post_001'      // Content/Post ID
  }
};
```

### Bước 3: Chạy

```bash
node quick-start.js
```

**Kết quả:** Bạn sẽ nhận được short link với Affiliate ID của bạn đã được gắn sẵn! 🎉

---

## 📝 Làm thế nào Affiliate ID được gắn vào?

Affiliate ID của bạn được gắn vào **Sub ID đầu tiên** (subIds[0]):

```javascript
// Sub IDs được build tự động:
subIds = [
  'MY_AFFILIATE_ID',  // [0] Affiliate ID của bạn
  'facebook',         // [1] Source (nguồn traffic)
  'summer_sale',      // [2] Campaign name
  'social',           // [3] Medium
  'post_001'          // [4] Content ID
]
```

Như vậy mỗi lần có người click vào link:
- ✅ Shopee biết đây là link của bạn (qua Partner ID + Partner Key)
- ✅ Bạn biết thêm chi tiết về traffic (qua Sub IDs)

---

## 💡 3 Cách sử dụng trong Code

### Cách 1: Set default Affiliate ID khi khởi tạo

```javascript
const shopeeAPI = new ShopeeAffiliateAPI(
  'partner_id',
  'partner_key',
  'MY_AFFILIATE_ID'  // ⭐ Set ở đây
);

// Sau đó không cần truyền lại
const result = await shopeeAPI.generateShortLinkWithAffiliateId(productUrl);
```

### Cách 2: Truyền Affiliate ID khi gọi function

```javascript
const shopeeAPI = new ShopeeAffiliateAPI('partner_id', 'partner_key');

const result = await shopeeAPI.generateShortLinkWithAffiliateId(
  productUrl,
  'MY_AFFILIATE_ID'  // ⭐ Truyền ở đây
);
```

### Cách 3: Với thông tin tracking chi tiết

```javascript
const result = await shopeeAPI.generateShortLinkWithAffiliateId(
  productUrl,
  'MY_AFFILIATE_ID',
  {
    source: 'facebook',
    campaign: 'summer_sale',
    medium: 'social',
    content: 'post_001'
  }
);

console.log(result.shortLink);    // Link rút gọn
console.log(result.affiliateId);  // MY_AFFILIATE_ID
console.log(result.subIds);       // ['MY_AFFILIATE_ID', 'facebook', ...]
```

---

## 🔥 Use Cases thực tế

### 1. Chạy Ads trên Facebook

```javascript
const fbResult = await shopeeAPI.generateShortLinkWithAffiliateId(
  productUrl,
  'MY_AFFILIATE_ID',
  {
    source: 'facebook',
    campaign: 'iphone_promo',
    medium: 'cpc',
    content: 'ad_creative_v1'
  }
);

// Dùng fbResult.shortLink trong Facebook Ads
```

### 2. Post trên TikTok

```javascript
const tiktokResult = await shopeeAPI.generateShortLinkWithAffiliateId(
  productUrl,
  'MY_AFFILIATE_ID',
  {
    source: 'tiktok',
    campaign: 'viral_video',
    medium: 'social',
    content: 'video_123'
  }
);

// Dùng tiktokResult.shortLink trong bio hoặc caption
```

### 3. Email Marketing

```javascript
const emailResult = await shopeeAPI.generateShortLinkWithAffiliateId(
  productUrl,
  'MY_AFFILIATE_ID',
  {
    source: 'email',
    campaign: 'newsletter_oct',
    medium: 'email',
    content: 'product_highlight'
  }
);

// Dùng emailResult.shortLink trong email
```

### 4. Generate nhiều links cùng lúc

```javascript
const urls = [
  'https://shopee.vn/product1-i.123.456',
  'https://shopee.vn/product2-i.789.012',
  'https://shopee.vn/product3-i.345.678',
];

const results = await shopeeAPI.generateBulkShortLinks(
  urls,
  'MY_AFFILIATE_ID',
  { source: 'website', campaign: 'product_list' }
);

results.forEach(r => console.log(r.shortLink));
```

---

## ❓ FAQs

### Tôi có bắt buộc phải có Affiliate ID không?

Không! Bạn có thể dùng function `generateShortLink()` thông thường mà không cần Affiliate ID. Nhưng với Affiliate ID thì bạn tracking được chi tiết hơn.

### Affiliate ID khác gì Partner ID?

- **Partner ID**: ID của bạn trong hệ thống Shopee Affiliate (bắt buộc)
- **Affiliate ID**: ID tùy chỉnh của bạn để tracking chi tiết (không bắt buộc)

### Sub IDs có thể chứa gì?

Bất kỳ string nào bạn muốn tracking:
- User ID
- Campaign name
- Ad ID
- Source
- Hoặc bất kỳ thông tin nào giúp bạn phân tích traffic

### Tôi lấy Partner ID và Partner Key ở đâu?

Đăng nhập vào **Shopee Affiliate Portal** → Settings → API Credentials

---

## 📞 Cần trợ giúp?

- **Xem examples:** `node example-with-affiliate-id.js`
- **Đọc docs:** Xem file `README.md`
- **Quick test:** `node quick-start.js`

Chúc bạn thành công! 🚀
