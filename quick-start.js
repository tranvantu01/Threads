/**
 * QUICK START - Cách nhanh nhất để sử dụng
 * 
 * Chỉ cần điền thông tin và chạy: node quick-start.js
 */

const ShopeeAffiliateAPI = require('./shopee-affiliate');

// ============================================
// ⚙️ ĐIỀN THÔNG TIN CỦA BẠN VÀO ĐÂY
// ============================================

const MY_CONFIG = {
  partnerId: '123456',                    // ← Thay bằng Partner ID của bạn
  partnerKey: 'your_partner_key_here',    // ← Thay bằng Partner Key của bạn
  affiliateId: 'MY_AFFILIATE_ID',         // ← Thay bằng Affiliate ID của bạn
  
  // URL sản phẩm Shopee bạn muốn tạo link
  productUrl: 'https://shopee.vn/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319',
  
  // Thông tin tracking (optional - dùng để phân biệt traffic)
  tracking: {
    source: 'facebook',      // Nguồn traffic
    campaign: 'summer_sale', // Tên campaign
    medium: 'social',        // Medium
    content: 'post_001'      // Content/Post ID
  }
};

// ============================================
// 🚀 CHẠY - Không cần sửa gì ở dưới này
// ============================================

async function generateLink() {
  console.log('\n🔗 Shopee Affiliate Link Generator\n');
  console.log('='.repeat(60));
  
  try {
    // Khởi tạo API
    const shopeeAPI = new ShopeeAffiliateAPI(
      MY_CONFIG.partnerId,
      MY_CONFIG.partnerKey,
      MY_CONFIG.affiliateId
    );
    
    console.log('\n📝 Thông tin:');
    console.log('  Partner ID:   ', MY_CONFIG.partnerId);
    console.log('  Affiliate ID: ', MY_CONFIG.affiliateId);
    console.log('  Product URL:  ', MY_CONFIG.productUrl);
    console.log('  Tracking:     ', JSON.stringify(MY_CONFIG.tracking, null, 2));
    
    console.log('\n⏳ Đang tạo short link...\n');
    
    // Generate short link
    const result = await shopeeAPI.generateShortLinkWithAffiliateId(
      MY_CONFIG.productUrl,
      null,  // Dùng default affiliate ID
      MY_CONFIG.tracking
    );
    
    if (result.success) {
      console.log('✅ THÀNH CÔNG!\n');
      console.log('='.repeat(60));
      console.log('\n🎯 SHORT LINK CỦA BẠN:');
      console.log('\n   ', result.shortLink);
      console.log('\n='.repeat(60));
      console.log('\n📊 Chi tiết:');
      console.log('  • Affiliate ID:  ', result.affiliateId);
      console.log('  • Original URL:  ', result.originalUrl);
      console.log('  • Sub IDs:       ', result.subIds.join(' | '));
      console.log('  • Timestamp:     ', new Date(result.timestamp * 1000).toLocaleString('vi-VN'));
      console.log('\n💡 Bạn có thể dùng link này để:');
      console.log('  ✓ Chia sẻ trên mạng xã hội');
      console.log('  ✓ Chạy quảng cáo');
      console.log('  ✓ Gửi qua email/tin nhắn');
      console.log('  ✓ Track hiệu quả từng campaign');
      console.log('\n');
    } else {
      console.log('❌ THẤT BẠI!\n');
      console.log('Lỗi:', result.error);
      console.log('\n💡 Giải pháp:');
      console.log('  1. Kiểm tra Partner ID và Partner Key có đúng không');
      console.log('  2. Kiểm tra URL sản phẩm có hợp lệ không');
      console.log('  3. Kiểm tra kết nối internet');
      console.log('  4. Xem chi tiết lỗi ở trên để biết nguyên nhân\n');
    }
    
  } catch (error) {
    console.log('\n❌ LỖI:\n');
    console.error(error.message);
    console.log('\n');
  }
  
  console.log('='.repeat(60));
  console.log('\n');
}

// Run
generateLink();
