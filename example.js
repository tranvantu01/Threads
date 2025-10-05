/**
 * Example: Cách sử dụng Shopee Affiliate API
 * 
 * Trước khi chạy:
 * 1. Tạo file .env với SHOPEE_PARTNER_ID và SHOPEE_PARTNER_KEY
 * 2. Hoặc thay thế trực tiếp giá trị partnerId và partnerKey bên dưới
 */

const ShopeeAffiliateAPI = require('./shopee-affiliate');

// Cách 1: Sử dụng environment variables (khuyến nghị)
// require('dotenv').config(); // Cần cài: npm install dotenv
// const partnerId = process.env.SHOPEE_PARTNER_ID;
// const partnerKey = process.env.SHOPEE_PARTNER_KEY;

// Cách 2: Hard-code (chỉ dùng để test)
const partnerId = '123456'; // Thay bằng Partner ID thật của bạn
const partnerKey = 'your_partner_key_here'; // Thay bằng Partner Key thật của bạn

// Khởi tạo API client
const shopeeAPI = new ShopeeAffiliateAPI(partnerId, partnerKey);

/**
 * Example 1: Generate short link cơ bản
 */
async function example1() {
  console.log('=== Example 1: Generate Short Link Cơ Bản ===\n');
  
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  
  const result = await shopeeAPI.generateShortLink(productUrl);
  
  if (result.success) {
    console.log('✅ Thành công!');
    console.log('Short Link:', result.shortLink);
    console.log('Original URL:', result.originalUrl);
  } else {
    console.log('❌ Thất bại!');
    console.log('Error:', result.error);
  }
  console.log('\n');
}

/**
 * Example 2: Generate short link với Sub IDs để tracking
 */
async function example2() {
  console.log('=== Example 2: Generate Short Link Với Sub IDs ===\n');
  
  const productUrl = 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319';
  const subIds = ['facebook', 'campaign_01', 'post_123', 'utm_source', 'utm_medium'];
  
  const result = await shopeeAPI.generateShortLink(productUrl, subIds);
  
  if (result.success) {
    console.log('✅ Thành công!');
    console.log('Short Link:', result.shortLink);
    console.log('Sub IDs:', subIds);
    console.log('Dùng sub IDs để tracking traffic từ các nguồn khác nhau');
  } else {
    console.log('❌ Thất bại!');
    console.log('Error:', result.error);
  }
  console.log('\n');
}

/**
 * Example 3: Xử lý nhiều links cùng lúc
 */
async function example3() {
  console.log('=== Example 3: Generate Nhiều Short Links ===\n');
  
  const productUrls = [
    'https://shopee.vn/product1-i.123.456',
    'https://shopee.vn/product2-i.789.012',
    'https://shopee.vn/product3-i.345.678',
  ];
  
  console.log(`Đang xử lý ${productUrls.length} links...\n`);
  
  const results = await Promise.all(
    productUrls.map(url => shopeeAPI.generateShortLink(url))
  );
  
  results.forEach((result, index) => {
    console.log(`Link ${index + 1}:`);
    if (result.success) {
      console.log('  ✅', result.shortLink);
    } else {
      console.log('  ❌', result.error);
    }
  });
  console.log('\n');
}

/**
 * Example 4: Test signature generation
 */
function example4() {
  console.log('=== Example 4: Test Signature Generation ===\n');
  
  const requestBody = '{"query":"mutation{generateShortLink}"}';
  const timestamp = Math.floor(Date.now() / 1000);
  
  const signature = shopeeAPI.generateSignature(requestBody, timestamp);
  const authHeader = shopeeAPI.createAuthHeader(signature, timestamp);
  
  console.log('Request Body:', requestBody);
  console.log('Timestamp:', timestamp);
  console.log('Signature:', signature);
  console.log('Auth Header:', authHeader);
  console.log('\n');
}

/**
 * Example 5: Error handling
 */
async function example5() {
  console.log('=== Example 5: Error Handling ===\n');
  
  // Test với URL không hợp lệ
  console.log('Test 1: URL không phải Shopee');
  const result1 = await shopeeAPI.generateShortLink('https://google.com');
  console.log(result1.success ? '✅' : '❌', result1.error || 'OK');
  
  // Test với subIds không đúng format
  console.log('\nTest 2: Sub IDs không đủ 5 phần tử');
  const result2 = await shopeeAPI.generateShortLink(
    'https://shopee.vn/test-i.123.456',
    ['only', 'three']
  );
  console.log(result2.success ? '✅' : '❌', result2.error || 'OK');
  
  console.log('\n');
}

// Chạy tất cả examples
async function runAllExamples() {
  console.log('\n🚀 Shopee Affiliate API - Examples\n');
  console.log('='.repeat(60));
  console.log('\n');
  
  await example1();
  await example2();
  await example3();
  example4();
  await example5();
  
  console.log('='.repeat(60));
  console.log('\n✨ Hoàn thành! Kiểm tra kết quả ở trên.\n');
  console.log('📝 Lưu ý: Để chạy được, bạn cần:');
  console.log('   1. Thay partnerId và partnerKey bằng credentials thật');
  console.log('   2. Hoặc tạo file .env với thông tin từ Shopee Affiliate Portal');
  console.log('\n');
}

// Run
runAllExamples().catch(console.error);
