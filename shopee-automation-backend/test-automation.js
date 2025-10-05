/**
 * Test file để kiểm tra Shopee Automation
 * Chạy: node test-automation.js
 */

const ShopeeAffiliateAutomation = require('./shopee-automation');

async function test() {
  console.log('\n🧪 Testing Shopee Automation...\n');
  console.log('='.repeat(70));
  
  // Config
  const CONFIG = {
    username: process.env.SHOPEE_USERNAME || 'your_email@gmail.com',
    password: process.env.SHOPEE_PASSWORD || 'your_password',
    headless: false, // Hiện browser để xem
    slowMo: 100
  };
  
  // Test URLs
  const testUrls = [
    'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
  ];
  
  const automation = new ShopeeAffiliateAutomation({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });
  
  try {
    // Step 1: Init
    console.log('\n📝 Step 1: Initializing browser...');
    await automation.init();
    console.log('✅ Browser initialized\n');
    
    // Step 2: Login
    console.log('📝 Step 2: Logging in...');
    console.log(`   Username: ${CONFIG.username}`);
    const loginResult = await automation.login(CONFIG.username, CONFIG.password);
    
    if (!loginResult.success) {
      throw new Error(`Login failed: ${loginResult.error}`);
    }
    console.log('✅ Login successful\n');
    
    // Step 3: Generate links
    console.log('📝 Step 3: Generating affiliate links...');
    const results = await automation.generateBulkShortLinks(testUrls);
    
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 RESULTS:\n');
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.originalUrl}`);
      if (result.success) {
        console.log(`   ✅ Short Link: ${result.shortLink}`);
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
      console.log('');
    });
    
    const successful = results.filter(r => r.success).length;
    console.log('='.repeat(70));
    console.log(`\n✅ Test completed: ${successful}/${results.length} successful\n`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Take screenshot for debugging
    try {
      await automation.screenshot('test-error.png');
      console.log('📸 Screenshot saved: test-error.png');
    } catch (e) {
      // Ignore screenshot error
    }
    
  } finally {
    // Cleanup
    console.log('\n🔒 Closing browser...');
    await automation.close();
    console.log('✅ Done!\n');
  }
}

// Check if .env is loaded
require('dotenv').config();

if (!process.env.SHOPEE_USERNAME || !process.env.SHOPEE_PASSWORD) {
  console.warn('\n⚠️  WARNING: SHOPEE_USERNAME and SHOPEE_PASSWORD not set in .env');
  console.warn('    Please create .env file from .env.example\n');
}

// Run test
test().catch(console.error);
