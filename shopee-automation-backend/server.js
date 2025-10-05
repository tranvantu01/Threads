/**
 * Shopee Automation Backend Server
 * Chạy Puppeteer để convert Shopee links thành affiliate links
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ShopeeAutomation = require('./shopee-automation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store automation instance
let automation = null;

// Initialize automation
async function initAutomation() {
  if (!automation) {
    automation = new ShopeeAutomation({
      username: process.env.SHOPEE_USERNAME,
      password: process.env.SHOPEE_PASSWORD,
      affiliateId: process.env.SHOPEE_AFFILIATE_ID || '17357490088',
      headless: process.env.HEADLESS !== 'false'
    });
    await automation.init();
  }
  return automation;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Shopee Automation Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Convert single link
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
        error: 'Invalid Shopee URL' 
      });
    }

    const auto = await initAutomation();
    const affiliateLink = await auto.convertToAffiliateLink(url);

    res.json({
      success: true,
      originalUrl: url,
      affiliateUrl: affiliateLink,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error converting link:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Convert multiple links (batch)
app.post('/api/convert-links', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ 
        success: false, 
        error: 'URLs array is required' 
      });
    }

    const auto = await initAutomation();
    const results = [];

    for (const url of urls) {
      try {
        if (isShopeeUrl(url)) {
          const affiliateLink = await auto.convertToAffiliateLink(url);
          results.push({
            originalUrl: url,
            affiliateUrl: affiliateLink,
            success: true
          });
        } else {
          results.push({
            originalUrl: url,
            error: 'Invalid Shopee URL',
            success: false
          });
        }
      } catch (error) {
        results.push({
          originalUrl: url,
          error: error.message,
          success: false
        });
      }
    }

    res.json({
      success: true,
      results,
      total: urls.length,
      converted: results.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error converting links:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get affiliate stats
app.get('/api/stats', async (req, res) => {
  try {
    const auto = await initAutomation();
    const stats = await auto.getStats();

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Cleanup on shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (automation) {
    await automation.close();
  }
  process.exit(0);
});

// Helper function
function isShopeeUrl(url) {
  return url && (
    url.includes('shopee.vn') || 
    url.includes('shopee.com.vn') || 
    url.includes('shope.ee')
  );
}

// Start server
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

🔧 Configuration:
   Affiliate ID: ${process.env.SHOPEE_AFFILIATE_ID || '17357490088'}
   Headless: ${process.env.HEADLESS !== 'false'}

💡 Ready to receive requests from extension!
  `);
});
