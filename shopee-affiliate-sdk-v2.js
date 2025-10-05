/**
 * Shopee Affiliate API SDK v2 - Updated with Correct Authentication Format
 * 
 * Based on official Shopee Affiliate API documentation
 * Authentication: SHA256 signature in Authorization header
 * 
 * Usage:
 * const ShopeeAffiliateAPI = require('./shopee-affiliate-sdk-v2');
 * const api = new ShopeeAffiliateAPI('YOUR_API_KEY', 'YOUR_SECRET_KEY');
 */

const axios = require('axios');
const crypto = require('crypto');

class ShopeeAffiliateAPI {
  constructor(partnerId, partnerKey, options = {}) {
    this.partnerId = partnerId; // Also called "Credential" or "API Key"
    this.partnerKey = partnerKey; // Secret key for signing
    this.baseUrl = options.baseUrl || 'https://open-api.affiliate.shopee.vn/graphql';
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * Generate SHA256 signature for authentication
   * Format: SHA256(partnerId|apiPath|timestamp|body|partnerKey)
   */
  generateSignature(timestamp, body) {
    const path = '/graphql';
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    
    // Shopee signature format
    const baseString = `${this.partnerId}|${path}|${timestamp}|${bodyStr}|${this.partnerKey}`;
    
    const signature = crypto
      .createHash('sha256')
      .update(baseString)
      .digest('hex');
    
    return signature;
  }

  /**
   * Generate Authorization header
   * Format: SHA256 Credential=<partnerId>, Signature=<signature>, Timestamp=<timestamp>
   */
  generateAuthHeader(timestamp, body) {
    const signature = this.generateSignature(timestamp, body);
    return `SHA256 Credential=${this.partnerId}, Signature=${signature}, Timestamp=${timestamp}`;
  }

  /**
   * Make authenticated GraphQL request
   */
  async request(query, variables = {}, attempt = 1) {
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const body = { query, variables };
    const bodyStr = JSON.stringify(body);

    const headers = {
      'Authorization': this.generateAuthHeader(timestamp, bodyStr),
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(
        this.baseUrl,
        bodyStr,
        { headers, timeout: this.timeout }
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

  shouldRetry(error) {
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status === 429 || status >= 500;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate short link (affiliate link)
   * @param {string} originUrl - Original Shopee product URL
   * @param {Array<string>} subIds - Array of sub IDs for tracking (max 5)
   * @returns {Promise<string>} - Short link URL
   */
  async generateShortLink(originUrl, subIds = []) {
    const query = `
      mutation generateShortLink($input: GenerateShortLinkInput!) {
        generateShortLink(input: $input) {
          shortLink
          error
          errorMessage
        }
      }
    `;

    // Ensure subIds is an array with max 5 elements
    const validSubIds = Array.isArray(subIds) ? subIds.slice(0, 5) : [];
    
    // Pad with empty strings if less than 5
    while (validSubIds.length < 5) {
      validSubIds.push('');
    }

    const variables = {
      input: {
        originUrl: originUrl,
        subIds: validSubIds
      }
    };

    const result = await this.request(query, variables);
    
    if (result.data.generateShortLink.error) {
      throw new Error(result.data.generateShortLink.errorMessage);
    }

    return result.data.generateShortLink.shortLink;
  }

  /**
   * Generate multiple short links in batch
   * @param {Array<{url: string, subIds?: Array<string>}>} products
   * @returns {Promise<Array<string>>}
   */
  async generateBatchShortLinks(products) {
    const promises = products.map(product => 
      this.generateShortLink(product.url, product.subIds || [])
    );
    return Promise.all(promises);
  }

  /**
   * Get product details
   * @param {Array<number>} itemIds - Array of product item IDs
   * @returns {Promise<Object>}
   */
  async getProductDetails(itemIds) {
    const query = `
      query getProductDetails($itemIds: [Int!]!) {
        productDetails(itemIds: $itemIds) {
          itemId
          shopId
          productName
          productLink
          productImage
          productPrice
          productOriginalPrice
          productDiscount
          productRating
          productSold
          commissionRate
          commission
          error
          errorMessage
        }
      }
    `;

    const variables = {
      itemIds: Array.isArray(itemIds) ? itemIds : [itemIds]
    };

    const result = await this.request(query, variables);
    return result.data.productDetails;
  }

  /**
   * Search products by keyword
   * @param {string} keyword - Search keyword
   * @param {Object} options - Search options
   * @returns {Promise<Object>}
   */
  async searchProducts(keyword, options = {}) {
    const {
      page = 1,
      pageSize = 20,
      categoryId = null,
      sortType = 1 // 1: relevance, 2: latest, 3: top sales, 4: price low-high, 5: price high-low
    } = options;

    const query = `
      query searchProducts($keyword: String!, $page: Int, $pageSize: Int, $categoryId: Int, $sortType: Int) {
        searchProducts(
          keyword: $keyword
          page: $page
          pageSize: $pageSize
          categoryId: $categoryId
          sortType: $sortType
        ) {
          totalCount
          products {
            itemId
            shopId
            productName
            productLink
            productImage
            productPrice
            productOriginalPrice
            productDiscount
            productRating
            productSold
            commissionRate
            commission
          }
        }
      }
    `;

    const variables = {
      keyword,
      page,
      pageSize,
      categoryId,
      sortType
    };

    const result = await this.request(query, variables);
    return result.data.searchProducts;
  }

  /**
   * Get recommended products
   * @param {Object} options - Options
   * @returns {Promise<Object>}
   */
  async getRecommendedProducts(options = {}) {
    const {
      page = 1,
      pageSize = 20,
      categoryId = null
    } = options;

    const query = `
      query getRecommendedProducts($page: Int, $pageSize: Int, $categoryId: Int) {
        recommendedProducts(
          page: $page
          pageSize: $pageSize
          categoryId: $categoryId
        ) {
          totalCount
          products {
            itemId
            shopId
            productName
            productLink
            productImage
            productPrice
            productOriginalPrice
            productDiscount
            productRating
            productSold
            commissionRate
            commission
            isFlashSale
            flashSaleEndTime
          }
        }
      }
    `;

    const variables = { page, pageSize, categoryId };
    const result = await this.request(query, variables);
    return result.data.recommendedProducts;
  }

  /**
   * Get product categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const query = `
      query {
        categories {
          categoryId
          categoryName
          parentCategoryId
          hasChildren
        }
      }
    `;

    const result = await this.request(query);
    return result.data.categories;
  }

  /**
   * Get order report (commission report)
   * @param {Object} options - Filter options
   * @returns {Promise<Object>}
   */
  async getOrderReport(options = {}) {
    const {
      startTime = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 30 days ago
      endTime = Math.floor(Date.now() / 1000),
      page = 1,
      pageSize = 50,
      orderStatus = null // null = all, 1 = completed, 2 = cancelled, 3 = pending
    } = options;

    const query = `
      query getOrderReport($startTime: Int!, $endTime: Int!, $page: Int, $pageSize: Int, $orderStatus: Int) {
        orderReport(
          startTime: $startTime
          endTime: $endTime
          page: $page
          pageSize: $pageSize
          orderStatus: $orderStatus
        ) {
          totalCount
          totalCommission
          orders {
            orderId
            orderTime
            productName
            productPrice
            quantity
            commissionRate
            commission
            orderStatus
            subId1
            subId2
            subId3
            subId4
            subId5
          }
        }
      }
    `;

    const variables = {
      startTime,
      endTime,
      page,
      pageSize,
      orderStatus
    };

    const result = await this.request(query, variables);
    return result.data.orderReport;
  }

  /**
   * Get affiliate account info
   * @returns {Promise<Object>}
   */
  async getAccountInfo() {
    const query = `
      query {
        accountInfo {
          partnerId
          partnerName
          email
          totalCommission
          availableBalance
          pendingBalance
          totalOrders
          totalClicks
          conversionRate
        }
      }
    `;

    const result = await this.request(query);
    return result.data.accountInfo;
  }

  /**
   * Parse Shopee URL to extract item_id and shop_id
   * @param {string} url - Shopee product URL
   * @returns {Object} - {itemId, shopId}
   */
  static parseShopeeUrl(url) {
    // Format 1: https://shopee.vn/product-name-i.{shop_id}.{item_id}
    const regex1 = /shopee\.vn\/.*-i\.(\d+)\.(\d+)/;
    const match1 = url.match(regex1);
    if (match1) {
      return {
        shopId: parseInt(match1[1]),
        itemId: parseInt(match1[2])
      };
    }

    // Format 2: https://shopee.vn/product/{shop_id}/{item_id}
    const regex2 = /shopee\.vn\/product\/(\d+)\/(\d+)/;
    const match2 = url.match(regex2);
    if (match2) {
      return {
        shopId: parseInt(match2[1]),
        itemId: parseInt(match2[2])
      };
    }

    throw new Error('Invalid Shopee URL format');
  }

  /**
   * Build product URL from item_id and shop_id
   * @param {number} itemId
   * @param {number} shopId
   * @returns {string}
   */
  static buildProductUrl(itemId, shopId) {
    return `https://shopee.vn/product/${shopId}/${itemId}`;
  }
}

// Export
module.exports = ShopeeAffiliateAPI;

// Example usage
if (require.main === module) {
  const api = new ShopeeAffiliateAPI('YOUR_PARTNER_ID', 'YOUR_PARTNER_KEY');

  // Example 1: Generate short link
  api.generateShortLink(
    'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
    ['facebook', 'post123', '', '', '']
  )
  .then(shortLink => {
    console.log('Short Link:', shortLink);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  // Example 2: Search products
  api.searchProducts('iphone', { pageSize: 10, sortType: 3 })
    .then(result => {
      console.log(`Found ${result.totalCount} products`);
      result.products.forEach(p => {
        console.log(`- ${p.productName}: ${p.productPrice} (${p.commissionRate}%)`);
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
    });

  // Example 3: Get commission report
  api.getOrderReport({ pageSize: 10 })
    .then(report => {
      console.log(`Total Orders: ${report.totalCount}`);
      console.log(`Total Commission: ${report.totalCommission}`);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}
