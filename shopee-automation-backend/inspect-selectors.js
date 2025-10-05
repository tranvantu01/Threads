/**
 * Tool để inspect và tìm CSS selectors trên Shopee Affiliate Portal
 *
 * Chạy script này để mở browser và tự inspect các elements cần thiết
 */

const puppeteer = require('puppeteer');

async function inspectSelectors() {
  console.log('\n🔍 Shopee Affiliate - Selector Inspector\n');
  console.log('Script này giúp bạn tìm các CSS selectors cần thiết.\n');
  console.log('='.repeat(70));

  const browser = await puppeteer.launch({
    headless: false,  // Hiện browser
    slowMo: 100,
    devtools: true,   // Mở DevTools tự động
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('\n📝 HƯỚNG DẪN:\n');
  console.log('1. Browser sẽ mở với DevTools');
  console.log('2. Đăng nhập thủ công vào https://affiliate.shopee.vn/');
  console.log('3. Sau khi đăng nhập, vào trang "Create Link"');
  console.log('4. Dùng DevTools (F12) để inspect các elements:');
  console.log('   - Input field để paste URL sản phẩm');
  console.log('   - Button "Generate" / "Tạo Link"');
  console.log('   - Element chứa short link kết quả');
  console.log('5. Copy CSS selector của mỗi element');
  console.log('6. Cập nhật vào file shopee-automation.js\n');

  console.log('💡 TIPS:');
  console.log('   - Chuột phải element → Inspect');
  console.log('   - Chuột phải trong DevTools → Copy → Copy selector');
  console.log('   - Thử selector trong Console: document.querySelector("selector")');
  console.log('\n' + '='.repeat(70));
  console.log('\n🌐 Đang mở Shopee Affiliate...\n');

  // Mở trang login
  await page.goto('https://affiliate.shopee.vn/login', {
    waitUntil: 'networkidle2',
  });

  console.log('✅ Browser đã mở!');
  console.log('👉 Hãy đăng nhập và inspect các elements.');
  console.log('👉 Nhấn ENTER trong terminal khi muốn đóng browser...\n');

  // Đợi user nhấn Enter
  await waitForEnter();

  console.log('\n🔒 Đang đóng browser...');
  await browser.close();
  console.log('✅ Hoàn thành!\n');
}

/**
 * Đợi user nhấn Enter
 */
function waitForEnter() {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('', () => {
      rl.close();
      resolve();
    });
  });
}

// Helper: Log các selectors phổ biến
console.log('\n📋 CÁC SELECTORS PHỔ BIẾN CẦN TÌM:\n');
console.log('1. LOGIN PAGE:');
console.log('   - Username/Email input');
console.log('   - Password input');
console.log('   - Login button\n');

console.log('2. CREATE LINK PAGE:');
console.log('   - Product URL input field');
console.log('   - Generate/Create button');
console.log('   - Short link result (input hoặc div)\n');

console.log('3. (Optional) SUB IDs:');
console.log('   - Sub ID input fields (nếu có)');
console.log('   - Campaign name field\n');

console.log('='.repeat(70));

// Run
inspectSelectors().catch(console.error);
