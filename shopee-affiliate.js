const crypto = require('crypto');

/**
 * Shopee Affiliate API Client
 * Xử lý việc tạo signature và gọi API Shopee Affiliate
 */
class ShopeeAffiliateAPI {
  constructor(partnerId, partnerKey) {
    if (!partnerId || !partnerKey) {
      throw new Error('Partner ID và Partner Key là bắt buộc!');
    }
    this.partnerId = partnerId;
    this.partnerKey = partnerKey;
    this.apiUrl = 'https://open-api.affiliate.shopee.vn/graphql';
  }

  /**
   * Generate HMAC-SHA256 signature cho Shopee API
   * @param {string} requestBody - JSON string của GraphQL query
   * @param {number} timestamp - Unix timestamp (giây)
   * @returns {string} Signature hex string
   */
  generateSignature(requestBody, timestamp) {
    try {
      // Tạo base string: PartnerId + RequestBody + Timestamp
      const baseString = this.partnerId + requestBody + timestamp;
      
      // Tạo HMAC-SHA256 signature
      const signature = crypto
        .createHmac('sha256', this.partnerKey)
        .update(baseString)
        .digest('hex');
      
      return signature;
    } catch (error) {
      throw new Error(`Lỗi khi tạo signature: ${error.message}`);
    }
  }

  /**
   * Tạo Authorization header cho Shopee API
   * @param {string} signature - HMAC-SHA256 signature
   * @param {number} timestamp - Unix timestamp (giây)
   * @returns {string} Authorization header value
   */
  createAuthHeader(signature, timestamp) {
    return `SHA256 Credential=${this.partnerId}, Signature=${signature}, Timestamp=${timestamp}`;
  }

  /**
   * Generate short link từ Shopee product URL
   * @param {string} originUrl - URL gốc của sản phẩm Shopee
   * @param {string[]} subIds - Array 5 sub IDs để tracking (optional)
   * @returns {Promise<Object>} Response với shortLink
   */
  async generateShortLink(originUrl, subIds = []) {
    try {
      // Validate input
      if (!originUrl) {
        throw new Error('originUrl là bắt buộc!');
      }

      if (!originUrl.includes('shopee.vn')) {
        throw new Error('originUrl phải là link Shopee Vietnam (shopee.vn)');
      }

      // Validate subIds
      if (subIds.length > 0 && subIds.length !== 5) {
        throw new Error('subIds phải có đúng 5 phần tử hoặc để trống');
      }

      // Tạo GraphQL query
      const graphqlQuery = {
        query: `mutation {
  generateShortLink(input: {
    originUrl: "${originUrl}",
    subIds: ${JSON.stringify(subIds)}
  }) {
    shortLink
  }
}`
      };

      const requestBody = JSON.stringify(graphqlQuery);
      const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp (giây)

      // Generate signature
      const signature = this.generateSignature(requestBody, timestamp);
      const authHeader = this.createAuthHeader(signature, timestamp);

      // Gọi API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      // Parse response
      const responseData = await response.json();

      // Kiểm tra lỗi từ API
      if (!response.ok) {
        throw new Error(
          `API Error (${response.status}): ${JSON.stringify(responseData)}`
        );
      }

      // Kiểm tra GraphQL errors
      if (responseData.errors && responseData.errors.length > 0) {
        const errorMessages = responseData.errors
          .map(err => err.message)
          .join(', ');
        throw new Error(`GraphQL Error: ${errorMessages}`);
      }

      // Kiểm tra data
      if (!responseData.data || !responseData.data.generateShortLink) {
        throw new Error('Response không chứa dữ liệu hợp lệ');
      }

      return {
        success: true,
        shortLink: responseData.data.generateShortLink.shortLink,
        originalUrl: originUrl,
        timestamp: timestamp,
      };

    } catch (error) {
      // Error handling chi tiết
      return {
        success: false,
        error: error.message,
        errorType: error.name,
        originalUrl: originUrl,
      };
    }
  }

  /**
   * Test connection với Shopee API
   * Kiểm tra xem credentials có hợp lệ không
   * @returns {Promise<Object>} Kết quả test
   */
  async testConnection() {
    try {
      const testUrl = 'https://shopee.vn/product/123456/987654321';
      const result = await this.generateShortLink(testUrl);
      
      if (result.success) {
        return {
          success: true,
          message: 'Kết nối API thành công!',
          credentials: 'Valid',
        };
      } else {
        return {
          success: false,
          message: 'Kết nối thất bại',
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi khi test connection',
        error: error.message,
      };
    }
  }
}

module.exports = ShopeeAffiliateAPI;
