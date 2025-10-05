/**
 * Shopee Affiliate API SDK for Flutter/Dart
 * 
 * Ví dụ tích hợp Shopee Affiliate API vào Flutter app
 * 
 * Dependencies trong pubspec.yaml:
 *   dependencies:
 *     http: ^1.1.0
 *     crypto: ^3.0.3
 *     flutter_dotenv: ^5.1.0
 *     url_launcher: ^6.2.1
 *     share_plus: ^7.2.1
 */

import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:crypto/crypto.dart';

class ShopeeAffiliateSDK {
  final String apiKey;
  final String apiSecret;
  final String baseUrl;
  final int timeout;
  
  ShopeeAffiliateSDK({
    required this.apiKey,
    required this.apiSecret,
    this.baseUrl = 'https://open-api.affiliate.shopee.vn/graphql',
    this.timeout = 30,
  });
  
  /// Generate HMAC signature for authentication
  String _generateSignature(int timestamp, String query) {
    final message = '$timestamp$query';
    final key = utf8.encode(apiSecret);
    final bytes = utf8.encode(message);
    final hmacSha256 = Hmac(sha256, key);
    final digest = hmacSha256.convert(bytes);
    return digest.toString();
  }
  
  /// Make authenticated API request
  Future<Map<String, dynamic>> _request(
    String query, {
    Map<String, dynamic>? variables,
  }) async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final signature = _generateSignature(timestamp, query);
    
    final headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    };
    
    final body = jsonEncode({
      'query': query,
      'variables': variables ?? {},
    });
    
    try {
      final response = await http
          .post(
            Uri.parse(baseUrl),
            headers: headers,
            body: body,
          )
          .timeout(Duration(seconds: timeout));
      
      if (response.statusCode != 200) {
        throw Exception('HTTP ${response.statusCode}: ${response.body}');
      }
      
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      
      if (data.containsKey('errors')) {
        throw Exception('GraphQL Error: ${data['errors']}');
      }
      
      return data;
    } catch (e) {
      print('API Error: $e');
      rethrow;
    }
  }
  
  /// Generate affiliate link from product URL
  Future<AffiliateLink> generateAffiliateLink(
    String productUrl, {
    String? subId,
  }) async {
    const query = '''
    mutation(\$requests: [AffiliateRequest!]!) {
      generateAffiliateLink(requests: \$requests) {
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
    ''';
    
    final variables = {
      'requests': [
        {
          'product_url': productUrl,
          'sub_id': subId ?? '',
        }
      ]
    };
    
    final result = await _request(query, variables: variables);
    final linkData = result['data']['generateAffiliateLink']['result'][0];
    
    if (linkData['error'] != 0) {
      throw Exception(linkData['error_msg']);
    }
    
    return AffiliateLink.fromJson(linkData['data']);
  }
  
  /// Search products by keyword
  Future<ProductSearchResult> searchProducts(
    String keyword, {
    int limit = 20,
    int offset = 0,
    int sortType = 1,
  }) async {
    const query = '''
    query(\$keyword: String!, \$limit: Int, \$offset: Int, \$sortType: Int) {
      productSearch(
        keyword: \$keyword
        limit: \$limit
        offset: \$offset
        sort_type: \$sortType
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
          commission_rate
          commission
        }
      }
    }
    ''';
    
    final variables = {
      'keyword': keyword,
      'limit': limit,
      'offset': offset,
      'sortType': sortType,
    };
    
    final result = await _request(query, variables: variables);
    return ProductSearchResult.fromJson(result['data']['productSearch']);
  }
  
  /// Get product details by ID
  Future<Product> getProductDetails(int itemId, int shopId) async {
    const query = '''
    query(\$itemId: Int!, \$shopId: Int!) {
      productDetail(item_id: \$itemId, shop_id: \$shopId) {
        batch_result {
          error
          error_msg
          data {
            item_id
            shop_id
            name
            price
            discount
            stock
            sold
            rating_star
            rating_count
            image
            images
            commission_rate
            commission
            description
          }
        }
      }
    }
    ''';
    
    final variables = {
      'itemId': itemId,
      'shopId': shopId,
    };
    
    final result = await _request(query, variables: variables);
    final productData = result['data']['productDetail']['batch_result'][0];
    
    if (productData['error'] != 0) {
      throw Exception(productData['error_msg']);
    }
    
    return Product.fromJson(productData['data']);
  }
  
  /// Get deals and promotions
  Future<DealsResult> getDeals({
    int categoryId = 0,
    int limit = 20,
    int offset = 0,
  }) async {
    const query = '''
    query(\$categoryId: Int!, \$limit: Int, \$offset: Int) {
      getDeals(category_id: \$categoryId, limit: \$limit, offset: \$offset) {
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
        }
      }
    }
    ''';
    
    final variables = {
      'categoryId': categoryId,
      'limit': limit,
      'offset': offset,
    };
    
    final result = await _request(query, variables: variables);
    return DealsResult.fromJson(result['data']['getDeals']);
  }
  
  /// Parse Shopee URL to extract item_id and shop_id
  static Map<String, int> parseShopeeUrl(String url) {
    // Format: https://shopee.vn/product/{shop_id}/{item_id}
    final regex1 = RegExp(r'shopee\.vn/product/(\d+)/(\d+)');
    // Format: https://shopee.vn/product-name-i.{shop_id}.{item_id}
    final regex2 = RegExp(r'shopee\.vn/.*-i\.(\d+)\.(\d+)');
    
    var match = regex1.firstMatch(url);
    if (match != null) {
      return {
        'shop_id': int.parse(match.group(1)!),
        'item_id': int.parse(match.group(2)!),
      };
    }
    
    match = regex2.firstMatch(url);
    if (match != null) {
      return {
        'shop_id': int.parse(match.group(1)!),
        'item_id': int.parse(match.group(2)!),
      };
    }
    
    throw Exception('Invalid Shopee URL format');
  }
}

// ==================== Data Models ====================

class AffiliateLink {
  final String originUrl;
  final String shortLink;
  final String clickUrl;
  
  AffiliateLink({
    required this.originUrl,
    required this.shortLink,
    required this.clickUrl,
  });
  
  factory AffiliateLink.fromJson(Map<String, dynamic> json) {
    return AffiliateLink(
      originUrl: json['origin_url'],
      shortLink: json['short_link'],
      clickUrl: json['click_url'],
    );
  }
}

class Product {
  final int itemId;
  final int shopId;
  final String name;
  final double price;
  final String? discount;
  final int? stock;
  final int sold;
  final double? ratingStar;
  final int? ratingCount;
  final String image;
  final List<String>? images;
  final double commissionRate;
  final double? commission;
  final String? description;
  
  Product({
    required this.itemId,
    required this.shopId,
    required this.name,
    required this.price,
    this.discount,
    this.stock,
    required this.sold,
    this.ratingStar,
    this.ratingCount,
    required this.image,
    this.images,
    required this.commissionRate,
    this.commission,
    this.description,
  });
  
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      itemId: json['item_id'],
      shopId: json['shop_id'],
      name: json['name'],
      price: (json['price'] as num).toDouble(),
      discount: json['discount'],
      stock: json['stock'],
      sold: json['sold'] ?? 0,
      ratingStar: json['rating_star']?.toDouble(),
      ratingCount: json['rating_count'],
      image: json['image'],
      images: json['images'] != null 
          ? List<String>.from(json['images'])
          : null,
      commissionRate: (json['commission_rate'] as num).toDouble(),
      commission: json['commission']?.toDouble(),
      description: json['description'],
    );
  }
  
  String get productUrl => 'https://shopee.vn/product/$shopId/$itemId';
  
  double get estimatedCommission => price * commissionRate / 100;
}

class ProductSearchResult {
  final int totalCount;
  final List<Product> products;
  
  ProductSearchResult({
    required this.totalCount,
    required this.products,
  });
  
  factory ProductSearchResult.fromJson(Map<String, dynamic> json) {
    return ProductSearchResult(
      totalCount: json['total_count'],
      products: (json['products'] as List)
          .map((p) => Product.fromJson(p))
          .toList(),
    );
  }
}

class DealsResult {
  final int totalCount;
  final List<Product> products;
  
  DealsResult({
    required this.totalCount,
    required this.products,
  });
  
  factory DealsResult.fromJson(Map<String, dynamic> json) {
    return DealsResult(
      totalCount: json['total_count'],
      products: (json['products'] as List)
          .map((p) => Product.fromJson(p))
          .toList(),
    );
  }
}

// ==================== Flutter UI Examples ====================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';

/// Widget to generate affiliate link
class AffiliateLinkGenerator extends StatefulWidget {
  final ShopeeAffiliateSDK sdk;
  
  const AffiliateLinkGenerator({Key? key, required this.sdk}) : super(key: key);
  
  @override
  State<AffiliateLinkGenerator> createState() => _AffiliateLinkGeneratorState();
}

class _AffiliateLinkGeneratorState extends State<AffiliateLinkGenerator> {
  final _controller = TextEditingController();
  AffiliateLink? _affiliateLink;
  bool _loading = false;
  String? _error;
  
  Future<void> _generateLink() async {
    if (_controller.text.isEmpty) return;
    
    setState(() {
      _loading = true;
      _error = null;
    });
    
    try {
      final link = await widget.sdk.generateAffiliateLink(_controller.text);
      setState(() {
        _affiliateLink = link;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }
  
  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Đã copy link!')),
    );
  }
  
  void _shareLink(String link) {
    Share.share(link);
  }
  
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _controller,
            decoration: const InputDecoration(
              labelText: 'Nhập link sản phẩm Shopee',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loading ? null : _generateLink,
            child: _loading
                ? const CircularProgressIndicator()
                : const Text('Tạo Link Affiliate'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          if (_affiliateLink != null) ...[
            const SizedBox(height: 24),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Affiliate Link:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: Text(_affiliateLink!.shortLink),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy),
                          onPressed: () => _copyToClipboard(_affiliateLink!.shortLink),
                        ),
                        IconButton(
                          icon: const Icon(Icons.share),
                          onPressed: () => _shareLink(_affiliateLink!.shortLink),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Widget to display product card
class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;
  
  const ProductCard({
    Key? key,
    required this.product,
    required this.onTap,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 1,
              child: Image.network(
                product.image,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₫${product.price.toStringAsFixed(0)}',
                    style: const TextStyle(
                      color: Colors.deepOrange,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade100,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Hoa hồng: ${product.commissionRate}%',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Full product search screen example
class ProductSearchScreen extends StatefulWidget {
  final ShopeeAffiliateSDK sdk;
  
  const ProductSearchScreen({Key? key, required this.sdk}) : super(key: key);
  
  @override
  State<ProductSearchScreen> createState() => _ProductSearchScreenState();
}

class _ProductSearchScreenState extends State<ProductSearchScreen> {
  final _searchController = TextEditingController();
  List<Product> _products = [];
  bool _loading = false;
  
  Future<void> _search() async {
    if (_searchController.text.isEmpty) return;
    
    setState(() => _loading = true);
    
    try {
      final result = await widget.sdk.searchProducts(_searchController.text);
      setState(() {
        _products = result.products;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: $e')),
      );
    }
  }
  
  Future<void> _generateAndShare(Product product) async {
    try {
      final link = await widget.sdk.generateAffiliateLink(product.productUrl);
      Share.share('${product.name}\n${link.shortLink}');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tìm Sản Phẩm Shopee'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Tìm kiếm sản phẩm...',
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: _search,
                ),
              ),
              onSubmitted: (_) => _search(),
            ),
          ),
          if (_loading)
            const Expanded(
              child: Center(child: CircularProgressIndicator()),
            )
          else
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.7,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: _products.length,
                itemBuilder: (context, index) {
                  final product = _products[index];
                  return ProductCard(
                    product: product,
                    onTap: () => _generateAndShare(product),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
