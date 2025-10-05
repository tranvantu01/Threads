# Threads Profile Data Downloader 📥

Extension Chrome/Edge chuyên nghiệp để tải dữ liệu từ các trang profile trên nền tảng Threads (Meta).

## ✨ Tính năng

Extension này cho phép bạn tải xuống dữ liệu chi tiết từ bất kỳ trang profile Threads nào, bao gồm:

- ✅ **Nội dung bài viết** - Toàn bộ text content
- ✅ **Media** - Tất cả ảnh và video trong bài viết
- ✅ **Số liệu tương tác** - Lượt tim (likes), share, đăng lại (reposts), và comments
- ✅ **Comment đầu tiên** - Text và các link có trong comment đầu tiên
- ✅ **Metadata** - Timestamp, URL bài viết, username
- ✅ **Export JSON** - Dữ liệu được export dưới dạng JSON có cấu trúc

## 🚀 Cài đặt

### Cài đặt cho Chrome/Edge (Developer Mode)

1. **Tải source code**
   ```bash
   git clone <repository-url>
   cd threads-downloader
   ```

2. **Mở Chrome/Edge Extensions**
   - Chrome: Truy cập `chrome://extensions/`
   - Edge: Truy cập `edge://extensions/`

3. **Bật Developer Mode**
   - Bật switch "Developer mode" ở góc trên bên phải

4. **Load Extension**
   - Click "Load unpacked" (Tải tiện ích đã giải nén)
   - Chọn thư mục chứa source code của extension

5. **Xác nhận cài đặt**
   - Icon extension sẽ xuất hiện trên thanh toolbar
   - Extension đã sẵn sàng sử dụng! 🎉

## 📖 Hướng dẫn sử dụng

### Bước 1: Mở trang Threads Profile
- Truy cập https://www.threads.net/@username (thay `username` bằng profile muốn tải)
- Ví dụ: https://www.threads.net/@zuck

### Bước 2: Mở Extension
- Click vào icon Threads Downloader trên thanh toolbar
- Popup extension sẽ hiển thị với giao diện thân thiện

### Bước 3: Cấu hình tùy chọn
Chọn dữ liệu bạn muốn tải:

- ☑️ **Tải media (ảnh & video)** - Bao gồm URL tất cả ảnh và video
- ☑️ **Lấy comment đầu tiên** - Trích xuất text và links từ comment đầu
- ☑️ **Số liệu tương tác** - Lấy số likes, shares, reposts, comments

**Giới hạn số bài viết**: Nhập số lượng bài viết muốn tải (1-1000)

### Bước 4: Bắt đầu tải
- Click nút **"Tải dữ liệu"**
- Extension sẽ tự động:
  - Scroll trang để load thêm bài viết
  - Trích xuất dữ liệu từ mỗi bài viết
  - Hiển thị progress bar với trạng thái real-time
- Bạn có thể click **"Dừng lại"** bất cứ lúc nào

### Bước 5: Lưu file
- Khi hoàn tất, extension sẽ tự động tạo file JSON
- Chọn vị trí lưu file (ví dụ: `threads_username_2025-10-05.json`)
- File JSON chứa toàn bộ dữ liệu đã trích xuất

## 📊 Cấu trúc dữ liệu Export

File JSON export có cấu trúc như sau:

```json
{
  "username": "username",
  "profileUrl": "https://www.threads.net/@username",
  "extractedAt": "2025-10-05T10:30:00.000Z",
  "totalPosts": 50,
  "posts": [
    {
      "id": "post_id",
      "timestamp": "2025-10-05T09:00:00.000Z",
      "content": "Nội dung bài viết...",
      "media": [
        {
          "type": "image",
          "url": "https://...",
          "alt": "Mô tả ảnh"
        },
        {
          "type": "video",
          "url": "https://...",
          "poster": "https://..."
        }
      ],
      "engagement": {
        "likes": 1234,
        "comments": 56,
        "reposts": 78,
        "shares": 90
      },
      "firstComment": {
        "text": "Comment đầu tiên...",
        "links": ["https://example.com"]
      },
      "postUrl": "https://www.threads.net/@username/post/..."
    }
  ],
  "options": {
    "includeMedia": true,
    "includeFirstComment": true,
    "includeEngagement": true,
    "limit": 50
  }
}
```

## 🎨 Giao diện

Extension có giao diện hiện đại với:
- 🎨 **Gradient theme** - Màu sắc gradient đẹp mắt
- 📊 **Progress tracking** - Hiển thị tiến trình real-time
- ✅ **Checkboxes đẹp** - Custom checkbox với animation
- 📈 **Statistics display** - Hiển thị tổng kết sau khi tải xong
- 🌍 **Vietnamese UI** - Giao diện tiếng Việt hoàn chỉnh

## 🔧 Cấu trúc Project

```
threads-downloader/
├── manifest.json          # Extension configuration
├── popup.html            # UI của extension popup
├── popup.js              # Logic xử lý UI và user interactions
├── content.js            # Script trích xuất dữ liệu từ Threads
├── background.js         # Background service worker
├── styles.css            # Styles cho giao diện đẹp
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Documentation
```

## 🛠️ Công nghệ sử dụng

- **Manifest V3** - Chrome Extension Manifest phiên bản mới nhất
- **Vanilla JavaScript** - Không dependencies, performance tối ưu
- **Modern CSS** - Flexbox, Grid, Gradients, Animations
- **Chrome APIs** - Storage, Downloads, Tabs, Runtime messaging
- **DOM Parsing** - Advanced selectors và data extraction

## ⚙️ Permissions

Extension yêu cầu các permissions sau:

- `activeTab` - Truy cập tab hiện tại để đọc dữ liệu Threads
- `storage` - Lưu preferences của người dùng
- `downloads` - Tải xuống file JSON
- `https://www.threads.net/*` - Chỉ hoạt động trên Threads

## 🔒 Bảo mật & Quyền riêng tư

- ✅ Extension **KHÔNG** thu thập dữ liệu cá nhân
- ✅ Tất cả dữ liệu được xử lý **local** trên máy bạn
- ✅ **KHÔNG** gửi dữ liệu đến server bên ngoài
- ✅ Chỉ truy cập Threads khi bạn kích hoạt
- ✅ Source code mở, có thể kiểm tra toàn bộ

## 🐛 Xử lý lỗi

### Extension không hoạt động
- Đảm bảo bạn đang ở trang Threads profile
- Refresh lại trang và thử lại
- Kiểm tra console (F12) để xem lỗi chi tiết

### Không tải được hết bài viết
- Threads có thể giới hạn số lượng posts load
- Thử giảm giới hạn số bài viết
- Scroll thủ công trước khi chạy extension

### Dữ liệu không chính xác
- Threads có thể thay đổi cấu trúc HTML
- Check phiên bản mới của extension
- Report issue nếu cần

## 📝 Tips & Best Practices

1. **Performance**
   - Bắt đầu với số lượng bài viết nhỏ (10-20) để test
   - Tăng dần nếu muốn tải nhiều hơn

2. **Giới hạn**
   - Threads có thể rate-limit nếu request quá nhanh
   - Extension đã có delay hợp lý giữa các scroll

3. **Media URLs**
   - URLs media có thể hết hạn sau một thời gian
   - Tải media về ngay nếu cần lưu trữ lâu dài

4. **Storage**
   - Preferences được lưu tự động
   - Extension nhớ cài đặt của bạn giữa các lần sử dụng

## 👨‍💻 Developer Info

Được phát triển bởi một chuyên gia extension với 30+ năm kinh nghiệm trong:
- Chrome Extension Development
- Web Scraping & Data Extraction
- Modern JavaScript & CSS
- UX/UI Design

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📮 Support

Nếu gặp vấn đề hoặc có câu hỏi:
- Mở issue trên GitHub
- Check documentation trong README
- Review source code

---

**Made with ❤️ by Expert Extension Developer**

*Phiên bản: 1.0.0*
*Cập nhật: 2025-10-05*
