/**
 * Shopee Automation Backend Server
 * Chạy Puppeteer để convert Shopee links thành affiliate links
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ShopeeAffiliateAutomation = require('./shopee-automation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store automation instance and cache
let automation = null;
let isInitialized = false;
let linkCache = new Map(); // Cache converted links
let stats = {
  totalConverted: 0,
  successCount: 0,
  failCount: 0,
  cacheHits: 0
};

/**
 * Initialize and login automation instance
 */
async function initAutomation() {
  if (!automation) {
    console.log('🚀 Initializing Shopee Automation...');
    
    automation = new ShopeeAffiliateAutomation({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOWMO) || 100,
      timeout: parseInt(process.env.TIMEOUT) || 30000
    });
    
    await automation.init();
    console.log('✅ Browser initialized');
    
    // Login
    const username = process.env.SHOPEE_USERNAME;
    const password = process.env.SHOPEE_PASSWORD;
    
    if (!username || !password) {
      throw new Error('SHOPEE_USERNAME and SHOPEE_PASSWORD must be set in .env');
    }
    
    console.log('🔐 Logging in to Shopee Affiliate...');
    const loginResult = await automation.login(username, password);
    
    if (!loginResult.success) {
      throw new Error(`Login failed: ${loginResult.error}`);
    }
    
    console.log('✅ Logged in successfully');
    isInitialized = true;
  }
  
  return automation;
}

/**
 * Get from cache or generate new link
 */
async function convertLinkWithCache(url) {
  // Check cache first
  if (linkCache.has(url)) {
    console.log('💾 Cache hit for:', url);
    stats.cacheHits++;
    return linkCache.get(url);
  }
  
  // Generate new link
  const auto = await initAutomation();
  const result = await auto.generateShortLink(url);
  
  if (result.success) {
    // Cache the result
    linkCache.set(url, result.shortLink);
    stats.totalConverted++;
    stats.successCount++;
    
    // Limit cache size to 1000 entries
    if (linkCache.size > 1000) {
      const firstKey = linkCache.keys().next().value;
      linkCache.delete(firstKey);
    }
  } else {
    stats.failCount++;
  }
  
  return result;
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Shopee Automation Backend',
    version: '1.0.0',
    initialized: isInitialized,
    cacheSize: linkCache.size,
    timestamp: new Date().toISOString()
  });
});

/**
 * Convert single link
 */
app.post('/api/convert-link', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    // Validate Shopee URL
    if (!isShopeeUrl(url)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid Shopee URL. Must contain shopee.vn, shopee.com.vn, or shope.ee' 
      });
    }

    console.log(`📥 Converting link: ${url}`);
    const result = await convertLinkWithCache(url);

    if (result.success) {
      res.json({
        success: true,
        originalUrl: url,
        affiliateUrl: result.shortLink,
        timestamp: new Date().toISOString(),
        cached: linkCache.has(url)
      });
    } else {
      res.status(500).json({
        success: false,
        originalUrl: url,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Error converting link:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Convert multiple links (batch)
 */
app.post('/api/convert-links', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ 
        success: false, 
        error: 'URLs array is required' 
      });
    }

    console.log(`📦 Converting ${urls.length} links...`);
    
    const results = [];
    const auto = await initAutomation();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[${i + 1}/${urls.length}] Processing: ${url}`);
      
      try {
        if (!isShopeeUrl(url)) {
          results.push({
            originalUrl: url,
            error: 'Invalid Shopee URL',
            success: false
          });
          continue;
        }

        // Check cache first
        if (linkCache.has(url)) {
          console.log(`💾 Cache hit for: ${url}`);
          stats.cacheHits++;
          results.push({
            originalUrl: url,
            affiliateUrl: linkCache.get(url),
            success: true,
            cached: true
          });
        } else {
          // Generate new link
          const result = await auto.generateShortLink(url);
          
          if (result.success) {
            linkCache.set(url, result.shortLink);
            stats.totalConverted++;
            stats.successCount++;
            
            results.push({
              originalUrl: url,
              affiliateUrl: result.shortLink,
              success: true,
              cached: false
            });
          } else {
            stats.failCount++;
            results.push({
              originalUrl: url,
              error: result.error,
              success: false
            });
          }
        }
        
      } catch (error) {
        stats.failCount++;
        results.push({
          originalUrl: url,
          error: error.message,
          success: false
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    console.log(`✅ Completed: ${successful}/${urls.length} successful`);

    res.json({
      success: true,
      results,
      total: urls.length,
      converted: successful,
      failed: urls.length - successful,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error converting links:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get affiliate stats
 */
app.get('/api/stats', async (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        ...stats,
        isLoggedIn: isInitialized,
        affiliateId: process.env.SHOPEE_AFFILIATE_ID || '17357490088',
        cacheSize: linkCache.size,
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Clear cache
 */
app.post('/api/clear-cache', async (req, res) => {
  try {
    const oldSize = linkCache.size;
    linkCache.clear();
    
    console.log(`🗑️ Cache cleared: ${oldSize} entries removed`);
    
    res.json({
      success: true,
      message: `Cache cleared (${oldSize} entries removed)`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Restart automation (re-login)
 */
app.post('/api/restart', async (req, res) => {
  try {
    console.log('🔄 Restarting automation...');
    
    if (automation) {
      await automation.close();
      automation = null;
      isInitialized = false;
    }
    
    await initAutomation();
    
    res.json({
      success: true,
      message: 'Automation restarted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error restarting automation:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// HELPERS
// ============================================

/**
 * Check if URL is a valid Shopee URL
 */
function isShopeeUrl(url) {
  return url && (
    url.includes('shopee.vn') || 
    url.includes('shopee.com.vn') || 
    url.includes('shope.ee')
  );
}

// ============================================
// CLEANUP
// ============================================

/**
 * Graceful shutdown
 */
async function shutdown() {
  console.log('\n🔒 Shutting down gracefully...');
  
  if (automation) {
    try {
      await automation.close();
      console.log('✅ Browser closed');
    } catch (error) {
      console.error('❌ Error closing browser:', error);
    }
  }
  
  // Save stats or cache if needed
  console.log(`📊 Final stats: ${stats.successCount} successful, ${stats.failCount} failed, ${stats.cacheHits} cache hits`);
  
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     🚀 SHOPEE AUTOMATION BACKEND SERVER STARTED                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

📡 Server running on: http://localhost:${PORT}

📋 Available endpoints:
   GET  /health                  - Health check
   POST /api/convert-link        - Convert single link
   POST /api/convert-links       - Convert multiple links (batch)
   GET  /api/stats              - Get affiliate stats
   POST /api/clear-cache         - Clear link cache
   POST /api/restart             - Restart automation (re-login)

🔧 Configuration:
   Affiliate ID: ${process.env.SHOPEE_AFFILIATE_ID || '17357490088'}
   Headless: ${process.env.HEADLESS !== 'false'}
   Username: ${process.env.SHOPEE_USERNAME ? '✅ Set' : '❌ Not set'}
   Password: ${process.env.SHOPEE_PASSWORD ? '✅ Set' : '❌ Not set'}

⚠️  Note: Browser will initialize on first API call

💡 Ready to receive requests from extension!
  `);
});
