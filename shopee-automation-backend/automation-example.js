/**
 * ⚠️ DISCLAIMER:
 * Code này vi phạm Shopee Terms of Service.
 * Chỉ dùng để học tập/nghiên cứu.
 * Bạn tự chịu trách nhiệm nếu tài khoản bị ban!
 */

const ShopeeAffiliateAutomation = require('./shopee-automation');

// ============================================
// ⚙️ CẤU HÌNH - Điền thông tin của bạn
// ============================================

const CONFIG = {
  // Thông tin đăng nhập Shopee Affiliate
  username: 'your_email@gmail.com',     // ← Email hoặc phone đăng nhập
  password: 'your_password',            // ← Password của bạn

  // Browser settings
  headless: false,  // false = hiện browser để xem, true = chạy ngầm
  slowMo: 100,      // Delay giữa các actions (ms) - càng cao càng giống người

  // Products cần tạo link
  products: [
    'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
    // Thêm nhiều URLs ở đây
  ]
};

// ============================================
// 🚀 MAIN FUNCTION
// ============================================

async function main() {
  console.log('\n⚠️  WARNING: Code này vi phạm Shopee TOS!');
  console.log('⚠️  Tài khoản có thể bị ban. Bạn tự chịu trách nhiệm!\n');
  console.log('='.repeat(70));
  console.log('\n🤖 Shopee Affiliate - Browser Automation\n');

  const automation = new ShopeeAffiliateAutomation({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo,
  });

  try {
    // Bước 1: Khởi động browser
    await automation.init();

    // Bước 2: Login
    console.log('='.repeat(70));
    const loginResult = await automation.login(CONFIG.username, CONFIG.password);

    if (!loginResult.success) {
      console.error('\n❌ Đăng nhập thất bại! Không thể tiếp tục.');
      console.error('💡 Kiểm tra lại username và password.');
      console.error('💡 Có thể cần tắt 2FA hoặc verify thủ công.\n');
      return;
    }

    console.log('='.repeat(70));

    // Bước 3: Generate short links
    const results = await automation.generateBulkShortLinks(CONFIG.products);

    // Bước 4: Hiển thị kết quả
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 KẾT QUẢ:\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Thành công: ${successful.length}/${results.length}`);
    console.log(`❌ Thất bại: ${failed.length}/${results.length}\n`);

    if (successful.length > 0) {
      console.log('🔗 SHORT LINKS:\n');
      successful.forEach((result, index) => {
        console.log(`${index + 1}. ${result.shortLink}`);
        console.log(`   Original: ${result.originalUrl}\n`);
      });
    }

    if (failed.length > 0) {
      console.log('❌ FAILED:\n');
      failed.forEach((result, index) => {
        console.log(`${index + 1}. ${result.originalUrl}`);
        console.log(`   Error: ${result.error}\n`);
      });
    }

    console.log('='.repeat(70));
    console.log('\n✨ Hoàn thành!\n');

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error('\n💡 Debug: Chụp screenshot để xem lỗi...');
    await automation.screenshot('error-screenshot.png');
  } finally {
    // Đợi 5 giây để xem kết quả (nếu headless = false)
    if (!CONFIG.headless) {
      console.log('⏳ Đợi 5 giây trước khi đóng browser...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    await automation.close();
  }
}

// ============================================
// 🎯 EXAMPLES KHÁC
// ============================================

/**
 * Example 1: Tạo 1 link đơn giản
 */
async function example1() {
  const automation = new ShopeeAffiliateAutomation({ headless: false });

  try {
    await automation.init();
    await automation.login('your_email@gmail.com', 'your_password');

    const result = await automation.generateShortLink(
      'https://shopee.vn/product-i.123.456'
    );

    if (result.success) {
      console.log('Short Link:', result.shortLink);
    }

  } finally {
    await automation.close();
  }
}

/**
 * Example 2: Chạy headless (chạy ngầm, không hiện browser)
 */
async function example2() {
  const automation = new ShopeeAffiliateAutomation({
    headless: true,  // Chạy ngầm
    slowMo: 50       // Nhanh hơn
  });

  try {
    await automation.init();
    await automation.login('your_email@gmail.com', 'your_password');

    const results = await automation.generateBulkShortLinks([
      'https://shopee.vn/product1-i.123.456',
      'https://shopee.vn/product2-i.789.012',
    ]);

    results.forEach(r => {
      if (r.success) console.log(r.shortLink);
    });

  } finally {
    await automation.close();
  }
}

// ============================================
// RUN
// ============================================

// Chạy main function
main().catch(console.error);

// Hoặc chạy examples:
// example1().catch(console.error);
// example2().catch(console.error);
