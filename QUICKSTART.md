# ⚡ Quick Start Guide

Hướng dẫn nhanh để bắt đầu sử dụng Threads Profile Data Downloader trong 5 phút!

## 🎯 Mục tiêu

Download tất cả dữ liệu từ bất kỳ profile Threads nào, bao gồm:
- Text content
- Ảnh & video
- Lượt tim, share, đăng lại, comment
- Comment đầu tiên với links

## 📦 3 Bước Cài đặt

### Bước 1: Tải Extension (30 giây)

```bash
# Clone repository
git clone <repository-url>
cd threads-downloader
```

Hoặc download ZIP và giải nén.

### Bước 2: Load vào Chrome (30 giây)

1. Mở Chrome, vào `chrome://extensions/`
2. Bật "Developer mode"
3. Click "Load unpacked"
4. Chọn thư mục `threads-downloader`
5. Done! ✅

### Bước 3: Test Extension (30 giây)

1. Mở https://www.threads.net/@zuck
2. Click icon extension
3. Click "Tải dữ liệu"
4. Lưu file JSON

**Xong! Bạn đã có dữ liệu Threads trong tay! 🎉**

## 🚀 Sử dụng Cơ bản

### Tải dữ liệu từ Profile

```
1. Mở profile Threads bất kỳ
   https://www.threads.net/@username

2. Click icon Threads Downloader

3. Chọn tùy chọn:
   ☑ Tải media (ảnh & video)
   ☑ Lấy comment đầu tiên
   ☑ Số liệu tương tác
   
4. Nhập giới hạn: 50 bài viết

5. Click "Tải dữ liệu"

6. Chờ extension làm việc

7. Lưu file JSON khi prompt
```

### Đọc dữ liệu JSON

File JSON có cấu trúc:

```json
{
  "username": "zuck",
  "posts": [
    {
      "content": "...",
      "media": [...],
      "engagement": {
        "likes": 1234,
        "comments": 56
      }
    }
  ]
}
```

## 💡 Use Cases

### Use Case 1: Backup Profile

**Mục đích:** Backup tất cả bài viết của bạn

```
1. Mở profile của bạn
2. Set limit = 1000
3. Tải tất cả options
4. Download JSON
5. Lưu vào cloud/drive
```

### Use Case 2: Competitor Analysis

**Mục đích:** Phân tích nội dung competitor

```
1. Mở profile competitor
2. Set limit = 100
3. Bật "Số liệu tương tác"
4. Download data
5. Analyze engagement patterns
```

### Use Case 3: Content Research

**Mục đích:** Research nội dung popular

```
1. Mở profile influencer
2. Set limit = 50
3. Download data
4. Tìm posts với engagement cao
5. Study content patterns
```

### Use Case 4: Media Collection

**Mục đích:** Thu thập media từ profile

```
1. Mở profile target
2. Bật "Tải media"
3. Download
4. Extract media URLs từ JSON
5. Batch download images/videos
```

## 🎓 Tips & Tricks

### Tip 1: Start Small
```
Lần đầu test với 10-20 posts
Sau đó tăng dần lên 50, 100, 500
```

### Tip 2: Save Presets
```
Extension tự động lưu preferences
Không cần chọn lại mỗi lần
```

### Tip 3: Monitor Progress
```
Nhìn progress bar để biết tiến độ
Có thể stop bất cứ lúc nào
```

### Tip 4: Organize Downloads
```
Đặt tên file theo format:
threads_username_YYYY-MM-DD.json
```

### Tip 5: Parse JSON Easy
```javascript
// Node.js
const data = require('./threads_data.json');
console.log(data.posts.length);

// Python
import json
with open('threads_data.json') as f:
    data = json.load(f)
    print(len(data['posts']))
```

## 📊 Data Analysis Examples

### Count Total Engagement

```javascript
const data = require('./threads_data.json');

const totalEngagement = data.posts.reduce((sum, post) => {
  return sum + 
    (post.engagement.likes || 0) +
    (post.engagement.comments || 0) +
    (post.engagement.reposts || 0);
}, 0);

console.log(`Total engagement: ${totalEngagement}`);
```

### Find Top Posts

```javascript
const topPosts = data.posts
  .sort((a, b) => b.engagement.likes - a.engagement.likes)
  .slice(0, 10);

topPosts.forEach((post, i) => {
  console.log(`${i+1}. ${post.content.substring(0, 50)}...`);
  console.log(`   Likes: ${post.engagement.likes}`);
});
```

### Extract All Media URLs

```javascript
const mediaUrls = data.posts
  .flatMap(post => post.media || [])
  .map(media => media.url);

console.log(`Total media: ${mediaUrls.length}`);
mediaUrls.forEach(url => console.log(url));
```

### Posts with Comments

```javascript
const postsWithComments = data.posts
  .filter(post => post.firstComment)
  .map(post => ({
    content: post.content.substring(0, 50),
    comment: post.firstComment.text
  }));

console.log(JSON.stringify(postsWithComments, null, 2));
```

## 🐛 Troubleshooting

### Extension không load

```
✓ Check Developer mode đã bật
✓ Check thư mục đúng
✓ Reload extension (click refresh icon)
```

### Không tải được posts

```
✓ Check đang ở trang Threads profile
✓ Refresh trang web
✓ Try giảm limit xuống 10-20
```

### Download failed

```
✓ Check permissions "downloads" đã enable
✓ Try save as khác location
✓ Check disk space
```

### Data không đầy đủ

```
✓ Threads có thể giới hạn posts hiển thị
✓ Try scroll manual trước
✓ Giảm limit nếu cần
```

## 🎯 Best Practices

### Performance
- ✅ Start với limit nhỏ để test
- ✅ Không set limit quá cao (max 200-300 safety)
- ✅ Đợi page load đầy đủ trước khi click

### Data Quality
- ✅ Download ngay khi có update quan trọng
- ✅ Backup định kỳ
- ✅ Validate JSON sau khi download

### Etiquette
- ✅ Tôn trọng rate limits của Threads
- ✅ Không spam requests
- ✅ Chỉ download data public

## 📞 Cần Trợ giúp?

1. **Check README.md** - Comprehensive documentation
2. **Check INSTALL.md** - Detailed installation guide
3. **Check example_output.json** - Sample data structure
4. **Open Issue** - Report bugs or request features

## ✅ Checklist Hoàn thành

- [ ] Extension đã cài đặt
- [ ] Test trên 1 profile
- [ ] Download thành công JSON
- [ ] Mở và đọc được JSON
- [ ] Hiểu cấu trúc data
- [ ] Ready to use! 🚀

---

**Bây giờ bạn đã master extension này! Chúc download vui vẻ! 🎉**

**Thời gian hoàn thành guide:** ~5 phút  
**Thời gian master:** ~15 phút
