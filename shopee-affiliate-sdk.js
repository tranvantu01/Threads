/**
 * Shopee Affiliate API SDK for Node.js/JavaScript
 * 
 * Usage:
 * const ShopeeAffiliateSDK = require('./shopee-affiliate-sdk');
 * const sdk = new ShopeeAffiliateSDK('API_KEY', 'API_SECRET');
 */

const axios = require('axios');
const crypto = require('crypto');

class ShopeeAffiliateSDK {
  constructor(apiKey, apiSecret, options = {}) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = options.baseUrl || 'https://open-api.affiliate.shopee.vn/graphql';
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * Generate HMAC signature for authentication
   */
  generateSignature(timestamp, query) {
    const message = `${timestamp}${query}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }

  /**
   * Make authenticated API request with retry logic
   */
  async request(query, variables = {}, attempt = 1) {
    const timestamp = Date.now();
    const signature = this.generateSignature(timestamp, query);

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          query: query,
          variables: variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Timestamp': timestamp.toString(),
            'X-Signature': signature
          },
          timeout: this.timeout
        }
      );

      // Check for GraphQL errors
      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data;
    } catch (error) {
      // Retry on network errors or rate limits
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.sleep(this.retryDelay * attempt);
        return this.request(query, variables, attempt + 1);
      }

      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error) {
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status === 429 || status >= 500; // Rate limit or server error
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate affiliate link from product URL
   * @param {string} productUrl - Shopee product URL
   * @param {string} subId - Optional tracking ID
   * @returns {Promise<Object>}
   */
  async generateAffiliateLink(productUrl, subId = '') {
    const query = `
      mutation($requests: [AffiliateRequest!]!) {
        generateAffiliateLink(requests: $requests) {
          result {
            error
            error_msg
            data {
              origin_url
              short_link
              click_url
            }
          }
        }
      }
    `;

    const variables = {
      requests: [{
        product_url: productUrl,
        sub_id: subId
      }]
    };

    const result = await this.request(query, variables);
    return result.data.generateAffiliateLink.result[0];
  }

  /**
   * Generate multiple affiliate links at once
   * @param {Array<{url: string, subId?: string}>} products
   * @returns {Promise<Array>}
   */
  async generateBatchAffiliateLinks(products) {
    const query = `
      mutation($requests: [AffiliateRequest!]!) {
        generateAffiliateLink(requests: $requests) {
          result {
            error
            error_msg
            data {
              origin_url
              short_link
              click_url
            }
          }
        }
      }
    `;

    const variables = {
      requests: products.map(p => ({
        product_url: p.url,
        sub_id: p.subId || ''
      }))
    };

    const result = await this.request(query, variables);
    return result.data.generateAffiliateLink.result;
  }

  /**
   * Search products by keyword
   * @param {string} keyword - Search keyword
   * @param {Object} options - Search options
   * @returns {Promise<Object>}
   */
  async searchProducts(keyword, options = {}) {
    const {
      limit = 20,
      offset = 0,
      sortType = 1, // 1: Popular, 2: Latest, 3: Best Selling, 4: Price Low-High, 5: Price High-Low
      categoryId = null,
      minPrice = null,
      maxPrice = null
    } = options;

    const query = `
      query($keyword: String!, $limit: Int, $offset: Int, $sortType: Int, $categoryId: Int, $minPrice: Float, $maxPrice: Float) {
        productSearch(
          keyword: $keyword
          limit: $limit
          offset: $offset
          sort_type: $sortType
          category_id: $categoryId
          min_price: $minPrice
          max_price: $maxPrice
        ) {
          total_count
          products {
            item_id
            shop_id
            name
            price
            price_max
            price_min
            discount
            stock
            sold
            rating_star
            rating_count
            image
            images
            commission_rate
            commission
          }
        }
      }
    `;

    const variables = {
      keyword,
      limit,
      offset,
      sortType,
      categoryId,
      minPrice,
      maxPrice
    };

    const result = await this.request(query, variables);
    return result.data.productSearch;
  }

  /**
   * Get product details by ID
   * @param {number} itemId - Product item ID
   * @param {number} shopId - Shop ID
   * @returns {Promise<Object>}
   */
  async getProductDetails(itemId, shopId) {
    const query = `
      query($itemId: Int!, $shopId: Int!) {
        productDetail(item_id: $itemId, shop_id: $shopId) {
          batch_result {
            error
            error_msg
            data {
              item_id
              shop_id
              name
              price
              price_max
              price_min
              discount
              stock
              sold
              rating_star
              rating_count
              image
              images
              categories
              shop_name
              commission_rate
              commission
              description
            }
          }
        }
      }
    `;

    const variables = { itemId, shopId };
    const result = await this.request(query, variables);
    return result.data.productDetail.batch_result[0];
  }

  /**
   * Get product categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const query = `
      query {
        categories {
          category_id
          category_name
          parent_category_id
          has_children
        }
      }
    `;

    const result = await this.request(query);
    return result.data.categories;
  }

  /**
   * Get deals and promotions
   * @param {Object} options - Filter options
   * @returns {Promise<Object>}
   */
  async getDeals(options = {}) {
    const {
      categoryId = 0,
      limit = 20,
      offset = 0
    } = options;

    const query = `
      query($categoryId: Int!, $limit: Int, $offset: Int) {
        getDeals(category_id: $categoryId, limit: $limit, offset: $offset) {
          total_count
          products {
            item_id
            shop_id
            name
            price
            price_before_discount
            discount
            sold
            rating_star
            image
            commission_rate
            commission
            is_flash_sale
            flash_sale_end_time
          }
        }
      }
    `;

    const variables = { categoryId, limit, offset };
    const result = await this.request(query, variables);
    return result.data.getDeals;
  }

  /**
   * Get commission report
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>}
   */
  async getCommissionReport(startDate, endDate, options = {}) {
    const {
      page = 1,
      pageSize = 50
    } = options;

    const query = `
      query($startDate: String!, $endDate: String!, $page: Int, $pageSize: Int) {
        getCommissionReport(
          start_date: $startDate
          end_date: $endDate
          page: $page
          page_size: $pageSize
        ) {
          total_count
          total_commission
          records {
            order_id
            product_name
            product_price
            quantity
            commission_rate
            commission
            order_status
            order_time
            sub_id
          }
        }
      }
    `;

    const variables = { startDate, endDate, page, pageSize };
    const result = await this.request(query, variables);
    return result.data.getCommissionReport;
  }

  /**
   * Get account information
   * @returns {Promise<Object>}
   */
  async getAccountInfo() {
    const query = `
      query {
        getAccountInfo {
          user_id
          username
          email
          total_commission
          available_balance
          pending_balance
          total_clicks
          total_orders
          conversion_rate
        }
      }
    `;

    const result = await this.request(query);
    return result.data.getAccountInfo;
  }

  /**
   * Extract item_id and shop_id from Shopee URL
   * @param {string} url - Shopee product URL
   * @returns {Object} - {itemId, shopId}
   */
  static parseShopeeUrl(url) {
    // Format: https://shopee.vn/product/{shop_id}/{item_id}
    // or: https://shopee.vn/product-name-i.{shop_id}.{item_id}
    
    const regex1 = /shopee\.vn\/product\/(\d+)\/(\d+)/;
    const regex2 = /shopee\.vn\/.*-i\.(\d+)\.(\d+)/;
    
    let match = url.match(regex1);
    if (match) {
      return { shopId: parseInt(match[1]), itemId: parseInt(match[2]) };
    }
    
    match = url.match(regex2);
    if (match) {
      return { shopId: parseInt(match[1]), itemId: parseInt(match[2]) };
    }
    
    throw new Error('Invalid Shopee URL format');
  }
}

// Export for CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopeeAffiliateSDK;
}

// Export for ES6
if (typeof exports !== 'undefined') {
  exports.ShopeeAffiliateSDK = ShopeeAffiliateSDK;
}
