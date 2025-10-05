/**
 * Shopee API Integration for Extension
 * 
 * File này dùng để extension gọi backend API để convert Shopee links
 * Include file này vào extension hoặc copy code vào popup-v2.js
 */

class ShopeeAPI {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.timeout = config.timeout || 10000; // 10 seconds
    this.retries = config.retries || 2;
  }

  /**
   * Check if backend server is running
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Convert single Shopee link to affiliate link
   */
  async convertLink(url, attempt = 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/convert-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Conversion failed');
      }

      return {
        success: true,
        originalUrl: data.originalUrl,
        affiliateUrl: data.affiliateUrl
      };

    } catch (error) {
      console.error(`Conversion attempt ${attempt + 1} failed:`, error);

      // Retry logic
      if (attempt < this.retries) {
        await this.delay(1000 * (attempt + 1)); // Exponential backoff
        return this.convertLink(url, attempt + 1);
      }

      // Fallback: Use simple parameter method
      console.warn('Falling back to simple parameter method');
      return {
        success: true,
        originalUrl: url,
        affiliateUrl: this.fallbackConvert(url),
        fallback: true
      };
    }
  }

  /**
   * Convert multiple Shopee links (batch)
   */
  async convertLinks(urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout * urls.length);

      const response = await fetch(`${this.baseUrl}/api/convert-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Batch conversion failed:', error);

      // Fallback: Convert individually with simple method
      const results = urls.map(url => ({
        originalUrl: url,
        affiliateUrl: this.fallbackConvert(url),
        success: true,
        fallback: true
      }));

      return {
        success: true,
        results,
        total: urls.length,
        converted: urls.length,
        fallback: true
      };
    }
  }

  /**
   * Get backend statistics
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.stats;

    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }

  /**
   * Fallback conversion method (simple URL parameter)
   */
  fallbackConvert(url, affiliateId = '17357490088') {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('af_siteid', affiliateId);
      return urlObj.toString();
    } catch (e) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}af_siteid=${affiliateId}`;
    }
  }

  /**
   * Helper: Delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if URL is Shopee URL
   */
  isShopeeUrl(url) {
    return url && (
      url.includes('shopee.vn') || 
      url.includes('shopee.com.vn') || 
      url.includes('shope.ee')
    );
  }
}

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopeeAPI;
}
