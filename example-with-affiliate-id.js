/**
 * Example: Sử dụng Shopee Affiliate API với Affiliate ID
 * 
 * DEMO: Cách gắn Affiliate ID vào short link
 */

const ShopeeAffiliateAPI = require('./shopee-affiliate');

// ===== CẤU HÌNH =====
const CONFIG = {
  partnerId: '123456',                    // Partner ID từ Shopee Affiliate
  partnerKey: 'your_partner_key_here',    // Partner Key từ Shopee Affiliate
  affiliateId: 'MY_AFFILIATE_ID',         // Affiliate ID của bạn
};

console.log('\n🚀 Shopee Affiliate API - Demo với Affiliate ID\n');
console.log('='.repeat(70));

// ===== CÁCH 1: Set default Affiliate ID trong constructor =====
async function method1() {
  console.log('\n📌 CÁCH 1: Set default Affiliate ID khi khởi tạo\n');
  
  // Khởi tạo với default affiliate ID
  const shopeeAPI = new ShopeeAffiliateAPI(
    CONFIG.partnerId,
    CONFIG.partnerKey,
    CONFIG.affiliateId  // ⭐ Set default affiliate ID ở đây
  );

  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  
  // Gọi function - không cần truyền affiliate ID nữa
  const result = await shopeeAPI.generateShortLinkWithAffiliateId(productUrl);
  
  if (result.success) {
    console.log('✅ Thành công!');
    console.log('Short Link:', result.shortLink);
    console.log('Affiliate ID:', result.affiliateId);
    console.log('Sub IDs:', result.subIds);
  } else {
    console.log('❌ Lỗi:', result.error);
  }
}

// ===== CÁCH 2: Truyền Affiliate ID khi gọi function =====
async function method2() {
  console.log('\n📌 CÁCH 2: Truyền Affiliate ID khi gọi function\n');
  
  const shopeeAPI = new ShopeeAffiliateAPI(CONFIG.partnerId, CONFIG.partnerKey);
  
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  
  // ⭐ Truyền affiliate ID trực tiếp
  const result = await shopeeAPI.generateShortLinkWithAffiliateId(
    productUrl,
    CONFIG.affiliateId
  );
  
  if (result.success) {
    console.log('✅ Thành công!');
    console.log('Short Link:', result.shortLink);
    console.log('Affiliate ID:', result.affiliateId);
    console.log('Sub IDs:', result.subIds);
  } else {
    console.log('❌ Lỗi:', result.error);
  }
}

// ===== CÁCH 3: Với thông tin tracking chi tiết =====
async function method3() {
  console.log('\n📌 CÁCH 3: Gắn Affiliate ID + Tracking Info chi tiết\n');
  
  const shopeeAPI = new ShopeeAffiliateAPI(CONFIG.partnerId, CONFIG.partnerKey);
  
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  
  // ⭐ Thông tin tracking chi tiết
  const trackingInfo = {
    source: 'facebook',      // Từ Facebook
    campaign: 'summer_sale', // Campaign mùa hè
    medium: 'social',        // Social media
    content: 'post_001'      // Bài post số 001
  };
  
  const result = await shopeeAPI.generateShortLinkWithAffiliateId(
    productUrl,
    CONFIG.affiliateId,
    trackingInfo
  );
  
  if (result.success) {
    console.log('✅ Thành công!');
    console.log('Short Link:', result.shortLink);
    console.log('Affiliate ID:', result.affiliateId);
    console.log('Tracking Info:', result.trackingInfo);
    console.log('Sub IDs:', result.subIds);
    console.log('\n💡 Sub IDs được build từ:');
    console.log('   [0] Affiliate ID:', result.subIds[0]);
    console.log('   [1] Source:', result.subIds[1]);
    console.log('   [2] Campaign:', result.subIds[2]);
    console.log('   [3] Medium:', result.subIds[3]);
    console.log('   [4] Content:', result.subIds[4]);
  } else {
    console.log('❌ Lỗi:', result.error);
  }
}

// ===== CÁCH 4: Generate nhiều links cùng lúc =====
async function method4() {
  console.log('\n📌 CÁCH 4: Generate nhiều links với cùng Affiliate ID\n');
  
  const shopeeAPI = new ShopeeAffiliateAPI(CONFIG.partnerId, CONFIG.partnerKey);
  
  const productUrls = [
    'https://shopee.vn/product1-i.123.456',
    'https://shopee.vn/product2-i.789.012',
    'https://shopee.vn/product3-i.345.678',
  ];
  
  const trackingInfo = {
    source: 'tiktok',
    campaign: 'viral_video',
  };
  
  console.log(`Đang xử lý ${productUrls.length} links...\n`);
  
  const results = await shopeeAPI.generateBulkShortLinks(
    productUrls,
    CONFIG.affiliateId,
    trackingInfo
  );
  
  results.forEach((result, index) => {
    console.log(`Link ${index + 1}:`);
    if (result.success) {
      console.log('  ✅', result.shortLink);
      console.log('  📊 Affiliate ID:', result.affiliateId);
    } else {
      console.log('  ❌', result.error);
    }
    console.log('');
  });
}

// ===== CÁCH 5: Extract thông tin sản phẩm =====
function method5() {
  console.log('\n📌 CÁCH 5: Extract thông tin sản phẩm từ URL\n');
  
  const shopeeAPI = new ShopeeAffiliateAPI(CONFIG.partnerId, CONFIG.partnerKey);
  
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  
  const info = shopeeAPI.extractProductInfo(productUrl);
  
  if (info.success) {
    console.log('✅ Extract thành công!');
    console.log('Shop ID:', info.shopId);
    console.log('Item ID:', info.itemId);
  } else {
    console.log('❌ Lỗi:', info.error);
  }
}

// ===== DEMO THỰC TẾ: Workflow hoàn chỉnh =====
async function realWorldExample() {
  console.log('\n📌 DEMO THỰC TẾ: Workflow hoàn chỉnh\n');
  console.log('Tình huống: Bạn đang chạy campaign trên Facebook\n');
  
  const shopeeAPI = new ShopeeAffiliateAPI(
    CONFIG.partnerId,
    CONFIG.partnerKey,
    CONFIG.affiliateId  // Set default
  );
  
  // 1. Extract thông tin sản phẩm
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  console.log('Bước 1: Extract thông tin sản phẩm');
  const productInfo = shopeeAPI.extractProductInfo(productUrl);
  console.log('  Shop ID:', productInfo.shopId);
  console.log('  Item ID:', productInfo.itemId);
  
  // 2. Tạo tracking info cho campaign Facebook
  console.log('\nBước 2: Setup tracking info');
  const facebookTracking = {
    source: 'facebook',
    campaign: 'iphone11_promo',
    medium: 'cpc',
    content: 'ad_creative_v2'
  };
  console.log('  Tracking:', facebookTracking);
  
  // 3. Generate short link với affiliate ID
  console.log('\nBước 3: Generate short link với Affiliate ID');
  const result = await shopeeAPI.generateShortLinkWithAffiliateId(
    productUrl,
    null,  // Dùng default affiliate ID
    facebookTracking
  );
  
  if (result.success) {
    console.log('  ✅ Thành công!\n');
    console.log('📋 KẾT QUẢ:');
    console.log('─'.repeat(70));
    console.log('🔗 Short Link:     ', result.shortLink);
    console.log('👤 Affiliate ID:   ', result.affiliateId);
    console.log('📊 Campaign:       ', result.trackingInfo.campaign);
    console.log('📱 Source:         ', result.trackingInfo.source);
    console.log('🎯 Sub IDs:        ', result.subIds.join(' | '));
    console.log('─'.repeat(70));
    console.log('\n💡 Bây giờ bạn có thể:');
    console.log('   1. Dùng link này trong Facebook Ads');
    console.log('   2. Track được traffic từ campaign này');
    console.log('   3. Phân tích hiệu quả từng ad creative');
  } else {
    console.log('  ❌ Lỗi:', result.error);
  }
}

// ===== CHẠY TẤT CẢ EXAMPLES =====
async function runAll() {
  try {
    await method1();
    console.log('\n' + '='.repeat(70));
    
    await method2();
    console.log('\n' + '='.repeat(70));
    
    await method3();
    console.log('\n' + '='.repeat(70));
    
    await method4();
    console.log('\n' + '='.repeat(70));
    
    method5();
    console.log('\n' + '='.repeat(70));
    
    await realWorldExample();
    console.log('\n' + '='.repeat(70));
    
    console.log('\n✨ HOÀN THÀNH!\n');
    console.log('📝 Lưu ý: Để chạy được thật, hãy thay đổi:');
    console.log('   • CONFIG.partnerId     → Partner ID thật của bạn');
    console.log('   • CONFIG.partnerKey    → Partner Key thật của bạn');
    console.log('   • CONFIG.affiliateId   → Affiliate ID thật của bạn');
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
  }
}

// Run
runAll();
