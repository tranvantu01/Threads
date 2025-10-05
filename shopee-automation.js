/**
 * ⚠️ WARNING - DISCLAIMER
 * 
 * Code này sử dụng browser automation để tự động tạo Shopee affiliate links.
 * 
 * RỦI RO:
 * - Vi phạm Shopee Terms of Service
 * - Tài khoản có thể bị ban/suspend
 * - Chỉ dùng để học tập/nghiên cứu
 * - KHÔNG dùng cho mục đích thương mại
 * 
 * BẠN TỰ CHỊU TRÁCH NHIỆM KHI SỬ DỤNG CODE NÀY!
 */

const puppeteer = require('puppeteer');

class ShopeeAffiliateAutomation {
  constructor(config = {}) {
    this.config = {
      headless: config.headless !== false, // Default: true (chạy ngầm)
      slowMo: config.slowMo || 100,        // Delay giữa các actions (ms)
      timeout: config.timeout || 30000,    // Timeout cho mỗi action (ms)
      ...config
    };
    
    this.browser = null;
    this.page = null;
    this.isLoggedIn = false;
    
    // Rate limiting để tránh bị phát hiện
    this.lastRequestTime = 0;
    this.minDelayBetweenRequests = 2000; // 2 giây giữa mỗi request
  }

  /**
   * Khởi tạo browser
   */
  async init() {
    console.log('🚀 Đang khởi động browser...');
    
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled', // Ẩn dấu hiệu automation
      ],
    });
    
    this.page = await this.browser.newPage();
    
    // Set user agent để giống browser thật
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Ẩn các dấu hiệu automation
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });
    
    console.log('✅ Browser đã sẵn sàng!');
  }

  /**
   * Random delay để giống người thật
   */
  async randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Rate limiting
   */
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minDelayBetweenRequests) {
      const waitTime = this.minDelayBetweenRequests - timeSinceLastRequest;
      console.log(`⏳ Đợi ${waitTime}ms để tránh rate limit...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Login vào Shopee Affiliate
   * @param {string} username - Email hoặc phone
   * @param {string} password - Password
   */
  async login(username, password) {
    try {
      console.log('🔐 Đang đăng nhập Shopee Affiliate...');
      
      // Truy cập trang login
      await this.page.goto('https://affiliate.shopee.vn/login', {
        waitUntil: 'networkidle2',
        timeout: this.config.timeout,
      });
      
      await this.randomDelay(2000, 4000);
      
      // Tìm và điền username
      console.log('📝 Đang điền thông tin đăng nhập...');
      
      // NOTE: Selector có thể thay đổi, cần kiểm tra lại
      // Đây là ví dụ, bạn cần inspect trang web để lấy selector đúng
      const usernameSelector = 'input[name="username"], input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]';
      const passwordSelector = 'input[name="password"], input[type="password"]';
      const loginButtonSelector = 'button[type="submit"], button:has-text("Login"), button:has-text("Đăng nhập")';
      
      // Wait for login form
      await this.page.waitForSelector(usernameSelector, { timeout: 10000 });
      
      // Type username với delay giống người thật
      await this.page.type(usernameSelector, username, { delay: 100 });
      await this.randomDelay(500, 1500);
      
      // Type password
      await this.page.type(passwordSelector, password, { delay: 100 });
      await this.randomDelay(500, 1500);
      
      // Click login button
      await this.page.click(loginButtonSelector);
      
      console.log('⏳ Đang chờ đăng nhập...');
      
      // Wait for navigation hoặc dashboard
      await this.page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 30000 
      }).catch(() => {
        // Có thể đã ở trang dashboard rồi
      });
      
      await this.randomDelay(2000, 4000);
      
      // Kiểm tra login thành công
      const currentUrl = this.page.url();
      if (currentUrl.includes('login')) {
        throw new Error('Đăng nhập thất bại! Kiểm tra username/password.');
      }
      
      this.isLoggedIn = true;
      console.log('✅ Đăng nhập thành công!');
      
      return {
        success: true,
        message: 'Đăng nhập thành công'
      };
      
    } catch (error) {
      console.error('❌ Lỗi khi đăng nhập:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate short link từ product URL
   * @param {string} productUrl - URL sản phẩm Shopee
   * @param {Object} options - Tracking options
   */
  async generateShortLink(productUrl, options = {}) {
    try {
      if (!this.isLoggedIn) {
        throw new Error('Chưa đăng nhập! Gọi login() trước.');
      }
      
      // Validate URL
      if (!productUrl.includes('shopee.vn')) {
        throw new Error('URL phải là link Shopee Vietnam (shopee.vn)');
      }
      
      await this.enforceRateLimit();
      
      console.log('🔗 Đang tạo short link cho:', productUrl);
      
      // Navigate to link generator page
      // NOTE: URL này có thể thay đổi, cần kiểm tra lại
      const linkGeneratorUrl = 'https://affiliate.shopee.vn/offer/product_link';
      
      await this.page.goto(linkGeneratorUrl, {
        waitUntil: 'networkidle2',
        timeout: this.config.timeout,
      });
      
      await this.randomDelay(1000, 2000);
      
      // Tìm input field để paste URL
      // NOTE: Selector cần được cập nhật dựa trên trang thật
      const urlInputSelector = 'input[placeholder*="URL"], input[placeholder*="url"], input[type="text"]';
      
      await this.page.waitForSelector(urlInputSelector, { timeout: 10000 });
      
      // Clear input field
      await this.page.click(urlInputSelector, { clickCount: 3 });
      await this.page.keyboard.press('Backspace');
      
      // Type product URL
      await this.page.type(urlInputSelector, productUrl, { delay: 50 });
      await this.randomDelay(500, 1000);
      
      // Click generate button
      const generateButtonSelector = 'button:has-text("Generate"), button:has-text("Tạo"), button[type="submit"]';
      await this.page.click(generateButtonSelector);
      
      console.log('⏳ Đang chờ tạo link...');
      
      // Wait for result
      await this.randomDelay(2000, 4000);
      
      // Extract short link từ page
      // NOTE: Selector cần được cập nhật
      const shortLinkSelector = 'input[readonly], div.short-link, span.affiliate-link';
      await this.page.waitForSelector(shortLinkSelector, { timeout: 10000 });
      
      const shortLink = await this.page.$eval(shortLinkSelector, el => {
        return el.value || el.textContent || el.innerText;
      });
      
      if (!shortLink || !shortLink.includes('http')) {
        throw new Error('Không thể lấy short link từ trang');
      }
      
      console.log('✅ Tạo short link thành công!');
      
      return {
        success: true,
        shortLink: shortLink.trim(),
        originalUrl: productUrl,
        timestamp: Math.floor(Date.now() / 1000),
      };
      
    } catch (error) {
      console.error('❌ Lỗi khi tạo short link:', error.message);
      return {
        success: false,
        error: error.message,
        originalUrl: productUrl,
      };
    }
  }

  /**
   * Generate nhiều short links
   * @param {string[]} productUrls - Array các URL sản phẩm
   * @param {Object} options - Options
   */
  async generateBulkShortLinks(productUrls, options = {}) {
    const results = [];
    
    console.log(`\n📦 Đang tạo ${productUrls.length} short links...\n`);
    
    for (let i = 0; i < productUrls.length; i++) {
      const url = productUrls[i];
      console.log(`[${i + 1}/${productUrls.length}] Đang xử lý: ${url}`);
      
      const result = await this.generateShortLink(url, options);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ [${i + 1}/${productUrls.length}] Thành công: ${result.shortLink}\n`);
      } else {
        console.log(`❌ [${i + 1}/${productUrls.length}] Thất bại: ${result.error}\n`);
      }
      
      // Random delay giữa các requests
      if (i < productUrls.length - 1) {
        await this.randomDelay(3000, 6000);
      }
    }
    
    return results;
  }

  /**
   * Take screenshot (để debug)
   */
  async screenshot(filename = 'screenshot.png') {
    if (this.page) {
      await this.page.screenshot({ path: filename, fullPage: true });
      console.log(`📸 Screenshot saved: ${filename}`);
    }
  }

  /**
   * Đóng browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser đã đóng.');
    }
  }
}

module.exports = ShopeeAffiliateAutomation;
