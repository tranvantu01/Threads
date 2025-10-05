/**
 * Express.js Backend Server for Shopee Affiliate API
 * 
 * Đây là server backend để xử lý các request Shopee Affiliate API
 * và expose REST API cho frontend sử dụng
 * 
 * Installation:
 *   npm install express cors dotenv
 *   npm install ./shopee-affiliate-sdk.js
 * 
 * Usage:
 *   node express-shopee-affiliate-backend.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ShopeeAffiliateSDK = require('./shopee-affiliate-sdk');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Shopee Affiliate SDK
const shopeeSDK = new ShopeeAffiliateSDK(
  process.env.SHOPEE_API_KEY,
  process.env.SHOPEE_API_SECRET,
  {
    timeout: 30000,
    retryAttempts: 3
  }
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== API Endpoints ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Shopee Affiliate API Server'
  });
});

/**
 * Generate affiliate link
 * POST /api/affiliate/generate-link
 * Body: { product_url: string, sub_id?: string }
 */
app.post('/api/affiliate/generate-link', async (req, res) => {
  try {
    const { product_url, sub_id = '' } = req.body;

    if (!product_url) {
      return res.status(400).json({
        error: 'product_url is required'
      });
    }

    const result = await shopeeSDK.generateAffiliateLink(product_url, sub_id);
    
    res.json(result);
  } catch (error) {
    console.error('Generate link error:', error);
    res.status(500).json({
      error: 'Failed to generate affiliate link',
      message: error.message
    });
  }
});

/**
 * Generate batch affiliate links
 * POST /api/affiliate/generate-links-batch
 * Body: { products: Array<{url: string, sub_id?: string}> }
 */
app.post('/api/affiliate/generate-links-batch', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        error: 'products array is required'
      });
    }

    const results = await shopeeSDK.generateBatchAffiliateLinks(products);
    
    res.json({
      results: results,
      total: results.length
    });
  } catch (error) {
    console.error('Batch generate error:', error);
    res.status(500).json({
      error: 'Failed to generate affiliate links',
      message: error.message
    });
  }
});

/**
 * Search products
 * GET /api/affiliate/search
 * Query params: keyword, limit, offset, sort_type, category_id, min_price, max_price
 */
app.get('/api/affiliate/search', async (req, res) => {
  try {
    const {
      keyword,
      limit = 20,
      offset = 0,
      sort_type = 1,
      category_id,
      min_price,
      max_price
    } = req.query;

    if (!keyword) {
      return res.status(400).json({
        error: 'keyword is required'
      });
    }

    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortType: parseInt(sort_type)
    };

    if (category_id) options.categoryId = parseInt(category_id);
    if (min_price) options.minPrice = parseFloat(min_price);
    if (max_price) options.maxPrice = parseFloat(max_price);

    const result = await shopeeSDK.searchProducts(keyword, options);
    
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Failed to search products',
      message: error.message
    });
  }
});

/**
 * Get product details
 * GET /api/affiliate/product/:itemId/:shopId
 */
app.get('/api/affiliate/product/:itemId/:shopId', async (req, res) => {
  try {
    const { itemId, shopId } = req.params;

    if (!itemId || !shopId) {
      return res.status(400).json({
        error: 'itemId and shopId are required'
      });
    }

    const result = await shopeeSDK.getProductDetails(
      parseInt(itemId),
      parseInt(shopId)
    );
    
    res.json(result);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Failed to get product details',
      message: error.message
    });
  }
});

/**
 * Get product from URL
 * POST /api/affiliate/product-from-url
 * Body: { url: string }
 */
app.post('/api/affiliate/product-from-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'url is required'
      });
    }

    const { itemId, shopId } = ShopeeAffiliateSDK.parseShopeeUrl(url);
    const result = await shopeeSDK.getProductDetails(itemId, shopId);
    
    res.json(result);
  } catch (error) {
    console.error('Get product from URL error:', error);
    res.status(500).json({
      error: 'Failed to get product details',
      message: error.message
    });
  }
});

/**
 * Get categories
 * GET /api/affiliate/categories
 */
app.get('/api/affiliate/categories', async (req, res) => {
  try {
    const result = await shopeeSDK.getCategories();
    
    res.json({
      categories: result
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

/**
 * Get deals
 * GET /api/affiliate/deals
 * Query params: category_id, limit, offset
 */
app.get('/api/affiliate/deals', async (req, res) => {
  try {
    const {
      category_id = 0,
      limit = 20,
      offset = 0
    } = req.query;

    const result = await shopeeSDK.getDeals({
      categoryId: parseInt(category_id),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({
      error: 'Failed to get deals',
      message: error.message
    });
  }
});

/**
 * Get commission report
 * GET /api/affiliate/commission-report
 * Query params: start_date, end_date, page, page_size
 */
app.get('/api/affiliate/commission-report', async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      page = 1,
      page_size = 50
    } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: 'start_date and end_date are required (YYYY-MM-DD format)'
      });
    }

    const result = await shopeeSDK.getCommissionReport(
      start_date,
      end_date,
      {
        page: parseInt(page),
        pageSize: parseInt(page_size)
      }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Get commission report error:', error);
    res.status(500).json({
      error: 'Failed to get commission report',
      message: error.message
    });
  }
});

/**
 * Get account info
 * GET /api/affiliate/account
 */
app.get('/api/affiliate/account', async (req, res) => {
  try {
    const result = await shopeeSDK.getAccountInfo();
    
    res.json(result);
  } catch (error) {
    console.error('Get account info error:', error);
    res.status(500).json({
      error: 'Failed to get account info',
      message: error.message
    });
  }
});

/**
 * Webhook endpoint for Shopee callbacks
 * POST /api/webhook/shopee
 */
app.post('/api/webhook/shopee', (req, res) => {
  try {
    const webhookData = req.body;
    
    console.log('Received Shopee webhook:', webhookData);
    
    // Process webhook data
    // You can emit events, update database, send notifications, etc.
    
    // Example: Handle different webhook events
    switch (webhookData.event_type) {
      case 'order_created':
        console.log('New order created:', webhookData.order_id);
        // Handle order creation
        break;
      
      case 'commission_earned':
        console.log('Commission earned:', webhookData.commission);
        // Handle commission event
        break;
      
      default:
        console.log('Unknown webhook event:', webhookData.event_type);
    }
    
    res.json({ status: 'received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

// ==================== Utility Endpoints ====================

/**
 * Parse Shopee URL
 * POST /api/utils/parse-url
 * Body: { url: string }
 */
app.post('/api/utils/parse-url', (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'url is required'
      });
    }

    const result = ShopeeAffiliateSDK.parseShopeeUrl(url);
    
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: 'Invalid Shopee URL',
      message: error.message
    });
  }
});

/**
 * Batch generate and analyze
 * POST /api/utils/analyze-products
 * Body: { urls: Array<string> }
 */
app.post('/api/utils/analyze-products', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        error: 'urls array is required'
      });
    }

    // Parse URLs and get product details
    const productDetailsPromises = urls.map(async (url) => {
      try {
        const { itemId, shopId } = ShopeeAffiliateSDK.parseShopeeUrl(url);
        const details = await shopeeSDK.getProductDetails(itemId, shopId);
        return { url, success: true, data: details };
      } catch (error) {
        return { url, success: false, error: error.message };
      }
    });

    const results = await Promise.all(productDetailsPromises);
    
    // Calculate analytics
    const successful = results.filter(r => r.success);
    const totalCommission = successful.reduce((sum, r) => {
      return sum + (r.data.data?.commission || 0);
    }, 0);
    
    const avgCommissionRate = successful.length > 0
      ? successful.reduce((sum, r) => sum + (r.data.data?.commission_rate || 0), 0) / successful.length
      : 0;

    res.json({
      total: urls.length,
      successful: successful.length,
      failed: results.length - successful.length,
      totalCommission: totalCommission,
      avgCommissionRate: avgCommissionRate.toFixed(2),
      results: results
    });
  } catch (error) {
    console.error('Analyze products error:', error);
    res.status(500).json({
      error: 'Failed to analyze products',
      message: error.message
    });
  }
});

// ==================== Error Handlers ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ==================== Start Server ====================

app.listen(PORT, () => {
  console.log(`🚀 Shopee Affiliate API Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  console.log('\nAvailable endpoints:');
  console.log('  POST /api/affiliate/generate-link');
  console.log('  GET  /api/affiliate/search');
  console.log('  GET  /api/affiliate/product/:itemId/:shopId');
  console.log('  GET  /api/affiliate/deals');
  console.log('  GET  /api/affiliate/commission-report');
  console.log('  GET  /api/affiliate/account');
  console.log('  POST /api/webhook/shopee');
});

module.exports = app;
