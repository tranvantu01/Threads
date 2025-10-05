"""
Shopee Affiliate API SDK for Python

Usage:
    from shopee_affiliate_sdk import ShopeeAffiliateSDK
    
    sdk = ShopeeAffiliateSDK('API_KEY', 'API_SECRET')
    result = sdk.generate_affiliate_link('https://shopee.vn/product/123/456')
"""

import requests
import hashlib
import hmac
import time
import json
import re
from typing import Dict, List, Optional, Any
from urllib.parse import urlparse, parse_qs


class ShopeeAffiliateSDK:
    """Shopee Affiliate API SDK"""
    
    def __init__(self, api_key: str, api_secret: str, base_url: Optional[str] = None,
                 timeout: int = 30, retry_attempts: int = 3, retry_delay: int = 1):
        """
        Initialize SDK
        
        Args:
            api_key: Your API key
            api_secret: Your API secret
            base_url: API base URL (default: production URL)
            timeout: Request timeout in seconds
            retry_attempts: Number of retry attempts on failure
            retry_delay: Delay between retries in seconds
        """
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url or 'https://open-api.affiliate.shopee.vn/graphql'
        self.timeout = timeout
        self.retry_attempts = retry_attempts
        self.retry_delay = retry_delay
    
    def generate_signature(self, timestamp: int, query: str) -> str:
        """Generate HMAC signature for authentication"""
        message = f"{timestamp}{query}"
        signature = hmac.new(
            self.api_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def request(self, query: str, variables: Optional[Dict] = None, attempt: int = 1) -> Dict:
        """
        Make authenticated API request with retry logic
        
        Args:
            query: GraphQL query
            variables: Query variables
            attempt: Current attempt number
            
        Returns:
            API response data
        """
        timestamp = int(time.time() * 1000)
        signature = self.generate_signature(timestamp, query)
        
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Timestamp': str(timestamp),
            'X-Signature': signature
        }
        
        payload = {
            'query': query,
            'variables': variables or {}
        }
        
        try:
            response = requests.post(
                self.base_url,
                json=payload,
                headers=headers,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Check for GraphQL errors
            if 'errors' in data:
                raise Exception(f"GraphQL Error: {json.dumps(data['errors'])}")
            
            return data
        
        except requests.exceptions.RequestException as e:
            # Retry on network errors or rate limits
            if attempt < self.retry_attempts and self._should_retry(e):
                time.sleep(self.retry_delay * attempt)
                return self.request(query, variables, attempt + 1)
            
            print(f'API Error: {e}')
            raise
    
    def _should_retry(self, error: Exception) -> bool:
        """Determine if request should be retried"""
        if isinstance(error, requests.exceptions.ConnectionError):
            return True
        if isinstance(error, requests.exceptions.Timeout):
            return True
        if hasattr(error, 'response') and error.response is not None:
            status = error.response.status_code
            return status == 429 or status >= 500
        return False
    
    def generate_affiliate_link(self, product_url: str, sub_id: str = '') -> Dict:
        """
        Generate affiliate link from product URL
        
        Args:
            product_url: Shopee product URL
            sub_id: Optional tracking ID
            
        Returns:
            Affiliate link data
        """
        query = '''
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
        '''
        
        variables = {
            'requests': [{
                'product_url': product_url,
                'sub_id': sub_id
            }]
        }
        
        result = self.request(query, variables)
        return result['data']['generateAffiliateLink']['result'][0]
    
    def generate_batch_affiliate_links(self, products: List[Dict[str, str]]) -> List[Dict]:
        """
        Generate multiple affiliate links at once
        
        Args:
            products: List of dicts with 'url' and optional 'sub_id'
            
        Returns:
            List of affiliate link data
        """
        query = '''
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
        '''
        
        variables = {
            'requests': [{
                'product_url': p['url'],
                'sub_id': p.get('sub_id', '')
            } for p in products]
        }
        
        result = self.request(query, variables)
        return result['data']['generateAffiliateLink']['result']
    
    def search_products(self, keyword: str, limit: int = 20, offset: int = 0,
                       sort_type: int = 1, category_id: Optional[int] = None,
                       min_price: Optional[float] = None, max_price: Optional[float] = None) -> Dict:
        """
        Search products by keyword
        
        Args:
            keyword: Search keyword
            limit: Results per page
            offset: Results offset
            sort_type: 1=Popular, 2=Latest, 3=Best Selling, 4=Price Low-High, 5=Price High-Low
            category_id: Filter by category
            min_price: Minimum price
            max_price: Maximum price
            
        Returns:
            Search results with products
        """
        query = '''
        query($keyword: String!, $limit: Int, $offset: Int, $sortType: Int,
              $categoryId: Int, $minPrice: Float, $maxPrice: Float) {
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
        '''
        
        variables = {
            'keyword': keyword,
            'limit': limit,
            'offset': offset,
            'sortType': sort_type,
            'categoryId': category_id,
            'minPrice': min_price,
            'maxPrice': max_price
        }
        
        result = self.request(query, variables)
        return result['data']['productSearch']
    
    def get_product_details(self, item_id: int, shop_id: int) -> Dict:
        """
        Get product details by ID
        
        Args:
            item_id: Product item ID
            shop_id: Shop ID
            
        Returns:
            Product details
        """
        query = '''
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
        '''
        
        variables = {
            'itemId': item_id,
            'shopId': shop_id
        }
        
        result = self.request(query, variables)
        return result['data']['productDetail']['batch_result'][0]
    
    def get_categories(self) -> List[Dict]:
        """
        Get product categories
        
        Returns:
            List of categories
        """
        query = '''
        query {
            categories {
                category_id
                category_name
                parent_category_id
                has_children
            }
        }
        '''
        
        result = self.request(query)
        return result['data']['categories']
    
    def get_deals(self, category_id: int = 0, limit: int = 20, offset: int = 0) -> Dict:
        """
        Get deals and promotions
        
        Args:
            category_id: Filter by category (0 for all)
            limit: Results per page
            offset: Results offset
            
        Returns:
            Deals data with products
        """
        query = '''
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
        '''
        
        variables = {
            'categoryId': category_id,
            'limit': limit,
            'offset': offset
        }
        
        result = self.request(query, variables)
        return result['data']['getDeals']
    
    def get_commission_report(self, start_date: str, end_date: str,
                             page: int = 1, page_size: int = 50) -> Dict:
        """
        Get commission report
        
        Args:
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            page: Page number
            page_size: Results per page
            
        Returns:
            Commission report data
        """
        query = '''
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
        '''
        
        variables = {
            'startDate': start_date,
            'endDate': end_date,
            'page': page,
            'pageSize': page_size
        }
        
        result = self.request(query, variables)
        return result['data']['getCommissionReport']
    
    def get_account_info(self) -> Dict:
        """
        Get account information
        
        Returns:
            Account info data
        """
        query = '''
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
        '''
        
        result = self.request(query)
        return result['data']['getAccountInfo']
    
    @staticmethod
    def parse_shopee_url(url: str) -> Dict[str, int]:
        """
        Extract item_id and shop_id from Shopee URL
        
        Args:
            url: Shopee product URL
            
        Returns:
            Dict with 'item_id' and 'shop_id'
        """
        # Format: https://shopee.vn/product/{shop_id}/{item_id}
        # or: https://shopee.vn/product-name-i.{shop_id}.{item_id}
        
        pattern1 = r'shopee\.vn/product/(\d+)/(\d+)'
        pattern2 = r'shopee\.vn/.*-i\.(\d+)\.(\d+)'
        
        match = re.search(pattern1, url)
        if match:
            return {'shop_id': int(match.group(1)), 'item_id': int(match.group(2))}
        
        match = re.search(pattern2, url)
        if match:
            return {'shop_id': int(match.group(1)), 'item_id': int(match.group(2))}
        
        raise ValueError('Invalid Shopee URL format')


# Example usage
if __name__ == '__main__':
    # Initialize SDK
    sdk = ShopeeAffiliateSDK('YOUR_API_KEY', 'YOUR_API_SECRET')
    
    # Generate affiliate link
    try:
        result = sdk.generate_affiliate_link('https://shopee.vn/product/123/456', 'my_tracking_id')
        print('Affiliate Link:', result)
    except Exception as e:
        print('Error:', e)
    
    # Search products
    try:
        products = sdk.search_products('điện thoại', limit=10)
        print(f"Found {products['total_count']} products")
        for product in products['products']:
            print(f"- {product['name']}: {product['price']} VND (Commission: {product['commission_rate']}%)")
    except Exception as e:
        print('Error:', e)
