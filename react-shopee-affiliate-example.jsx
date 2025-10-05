/**
 * React Component Examples for Shopee Affiliate
 * 
 * Các component React để tích hợp Shopee Affiliate vào web app
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ==================== API Service ====================

class ShopeeAffiliateService {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint; // Your backend API endpoint
  }

  async generateAffiliateLink(productUrl, subId = '') {
    const response = await axios.post(`${this.apiEndpoint}/affiliate/generate-link`, {
      product_url: productUrl,
      sub_id: subId
    });
    return response.data;
  }

  async searchProducts(keyword, options = {}) {
    const response = await axios.get(`${this.apiEndpoint}/affiliate/search`, {
      params: { keyword, ...options }
    });
    return response.data;
  }

  async getProductDetails(itemId, shopId) {
    const response = await axios.get(`${this.apiEndpoint}/affiliate/product/${itemId}/${shopId}`);
    return response.data;
  }

  async getDeals(categoryId = 0, limit = 20) {
    const response = await axios.get(`${this.apiEndpoint}/affiliate/deals`, {
      params: { category_id: categoryId, limit }
    });
    return response.data;
  }
}

// Initialize service
const affiliateService = new ShopeeAffiliateService('http://localhost:3000/api');

// ==================== Component 1: Link Generator ====================

export function AffiliateLinkGenerator() {
  const [productUrl, setProductUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!productUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await affiliateService.generateAffiliateLink(productUrl);
      
      if (result.error === 0) {
        setAffiliateLink(result.data);
      } else {
        setError(result.error_msg);
      }
    } catch (err) {
      setError('Failed to generate affiliate link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="affiliate-link-generator">
      <h2>Tạo Link Affiliate Shopee</h2>
      
      <div className="input-group">
        <input
          type="text"
          placeholder="Nhập link sản phẩm Shopee..."
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          className="form-input"
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading || !productUrl}
          className="btn-primary"
        >
          {loading ? 'Đang tạo...' : 'Tạo Link'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {affiliateLink && (
        <div className="result-box">
          <h3>Affiliate Link của bạn:</h3>
          
          <div className="link-item">
            <label>Short Link (chia sẻ mạng xã hội):</label>
            <div className="link-display">
              <input type="text" value={affiliateLink.short_link} readOnly />
              <button onClick={() => copyToClipboard(affiliateLink.short_link)}>
                Copy
              </button>
            </div>
          </div>

          <div className="link-item">
            <label>Click URL (mobile app deep link):</label>
            <div className="link-display">
              <input type="text" value={affiliateLink.click_url} readOnly />
              <button onClick={() => copyToClipboard(affiliateLink.click_url)}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Component 2: Product Search ====================

export function ProductSearch() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async () => {
    if (!keyword) return;
    
    setLoading(true);
    
    try {
      const result = await affiliateService.searchProducts(keyword, {
        limit: 20,
        sort_type: 3 // Best Selling
      });
      
      setProducts(result.products);
      setTotalCount(result.total_count);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async (product) => {
    const productUrl = `https://shopee.vn/product/${product.shop_id}/${product.item_id}`;
    try {
      const result = await affiliateService.generateAffiliateLink(productUrl);
      if (result.error === 0) {
        window.open(result.data.short_link, '_blank');
      }
    } catch (err) {
      console.error('Generate link error:', err);
    }
  };

  return (
    <div className="product-search">
      <h2>Tìm Kiếm Sản Phẩm Shopee</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>

      {totalCount > 0 && (
        <p className="result-count">Tìm thấy {totalCount} sản phẩm</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={`${product.shop_id}-${product.item_id}`}
            product={product}
            onGenerateLink={generateLink}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== Component 3: Product Card ====================

function ProductCard({ product, onGenerateLink }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateCommission = () => {
    return (product.price * product.commission_rate / 100).toFixed(0);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <span className="discount-badge">{product.discount}</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.price_max > product.price && (
            <span className="original-price">{formatPrice(product.price_max)}</span>
          )}
        </div>

        <div className="product-stats">
          <span className="rating">
            ⭐ {product.rating_star} ({product.rating_count})
          </span>
          <span className="sold">Đã bán: {product.sold}</span>
        </div>

        <div className="commission-info">
          <span className="commission-rate">
            Hoa hồng: {product.commission_rate}%
          </span>
          <span className="commission-amount">
            ≈ {formatPrice(calculateCommission())}
          </span>
        </div>

        <button 
          className="btn-generate-link"
          onClick={() => onGenerateLink(product)}
        >
          Tạo Link & Chia Sẻ
        </button>
      </div>
    </div>
  );
}

// ==================== Component 4: Deals/Flash Sale ====================

export function DealsShowcase() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const result = await affiliateService.getDeals(0, 20);
      setDeals(result.products);
    } catch (err) {
      console.error('Load deals error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải deals...</div>;
  }

  return (
    <div className="deals-showcase">
      <h2>🔥 Deals Hấp Dẫn Hôm Nay</h2>
      
      <div className="deals-grid">
        {deals.map((deal) => (
          <DealCard key={`${deal.shop_id}-${deal.item_id}`} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }) {
  const [affiliateLink, setAffiliateLink] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (deal.price_before_discount) {
      const discount = ((deal.price_before_discount - deal.price) / deal.price_before_discount * 100);
      return Math.round(discount);
    }
    return deal.discount;
  };

  const handleShare = async () => {
    const productUrl = `https://shopee.vn/product/${deal.shop_id}/${deal.item_id}`;
    try {
      const result = await affiliateService.generateAffiliateLink(productUrl);
      if (result.error === 0) {
        setAffiliateLink(result.data.short_link);
        // Share via Web Share API if available
        if (navigator.share) {
          await navigator.share({
            title: deal.name,
            text: `Giảm ${getDiscountPercentage()}%! ${deal.name}`,
            url: result.data.short_link
          });
        }
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <div className="deal-card">
      <div className="deal-image">
        <img src={deal.image} alt={deal.name} />
        <div className="deal-badge">
          Giảm {getDiscountPercentage()}%
        </div>
        {deal.is_flash_sale && (
          <div className="flash-sale-badge">⚡ Flash Sale</div>
        )}
      </div>

      <div className="deal-info">
        <h4>{deal.name}</h4>
        
        <div className="price-section">
          <span className="sale-price">{formatPrice(deal.price)}</span>
          {deal.price_before_discount && (
            <span className="original-price">
              {formatPrice(deal.price_before_discount)}
            </span>
          )}
        </div>

        <div className="commission-highlight">
          💰 Hoa hồng: {deal.commission_rate}% 
          (≈ {formatPrice(deal.commission || 0)})
        </div>

        <button onClick={handleShare} className="btn-share">
          Chia Sẻ & Kiếm Tiền
        </button>

        {affiliateLink && (
          <div className="link-generated">
            <small>Link đã tạo: {affiliateLink}</small>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Component 5: Commission Dashboard ====================

export function CommissionDashboard() {
  const [stats, setStats] = useState(null);
  const [commissionReport, setCommissionReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load account stats and commission report in parallel
      const [accountInfo, report] = await Promise.all([
        affiliateService.getAccountInfo(),
        affiliateService.getCommissionReport(dateRange.start, dateRange.end)
      ]);
      
      setStats(accountInfo);
      setCommissionReport(report.records);
    } catch (err) {
      console.error('Load dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="commission-dashboard">
      <h2>Dashboard Hoa Hồng</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng Hoa Hồng</h3>
            <p className="stat-value">{formatCurrency(stats.total_commission)}</p>
          </div>

          <div className="stat-card">
            <h3>Số Dư Khả Dụng</h3>
            <p className="stat-value">{formatCurrency(stats.available_balance)}</p>
          </div>

          <div className="stat-card">
            <h3>Đang Chờ</h3>
            <p className="stat-value">{formatCurrency(stats.pending_balance)}</p>
          </div>

          <div className="stat-card">
            <h3>Tỷ Lệ Chuyển Đổi</h3>
            <p className="stat-value">{stats.conversion_rate}%</p>
          </div>

          <div className="stat-card">
            <h3>Tổng Click</h3>
            <p className="stat-value">{stats.total_clicks}</p>
          </div>

          <div className="stat-card">
            <h3>Tổng Đơn Hàng</h3>
            <p className="stat-value">{stats.total_orders}</p>
          </div>
        </div>
      )}

      <div className="commission-report">
        <h3>Lịch Sử Hoa Hồng</h3>
        
        <div className="date-range-filter">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>đến</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>

        <table className="commission-table">
          <thead>
            <tr>
              <th>Đơn Hàng</th>
              <th>Sản Phẩm</th>
              <th>Giá</th>
              <th>Số Lượng</th>
              <th>Tỷ Lệ</th>
              <th>Hoa Hồng</th>
              <th>Trạng Thái</th>
              <th>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {commissionReport.map((record) => (
              <tr key={record.order_id}>
                <td>{record.order_id}</td>
                <td className="product-name">{record.product_name}</td>
                <td>{formatCurrency(record.product_price)}</td>
                <td>{record.quantity}</td>
                <td>{record.commission_rate}%</td>
                <td className="commission-amount">
                  {formatCurrency(record.commission)}
                </td>
                <td>
                  <span className={`status-badge status-${record.order_status}`}>
                    {record.order_status}
                  </span>
                </td>
                <td>{new Date(record.order_time).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== CSS Styles (Tailwind alternative) ====================

const styles = `
.affiliate-link-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.form-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.btn-primary {
  padding: 12px 24px;
  background: #ee4d2d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-box {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.link-display {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.link-display input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ee4d2d;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin: 8px 0;
}

.current-price {
  color: #ee4d2d;
  font-size: 16px;
  font-weight: 600;
}

.original-price {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
  margin-left: 8px;
}

.commission-info {
  background: #fff3cd;
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.btn-generate-link {
  width: 100%;
  padding: 10px;
  background: #ee4d2d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #ee4d2d;
  margin-top: 8px;
}

.commission-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.commission-table th,
.commission-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.commission-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}
`;
