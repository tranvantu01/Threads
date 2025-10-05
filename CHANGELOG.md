# Changelog

Tất cả các thay đổi quan trọng của project sẽ được ghi lại trong file này.

## [1.0.0] - 2025-10-05

### 🎉 Initial Release

Phiên bản đầu tiên của Threads Profile Data Downloader với đầy đủ tính năng.

### ✨ Features

#### Core Functionality
- ✅ **Data Extraction** - Trích xuất dữ liệu từ profile Threads
- ✅ **Content Scraping** - Lấy toàn bộ text content của bài viết
- ✅ **Media Download** - Extract URLs của tất cả ảnh và video
- ✅ **Engagement Metrics** - Thu thập likes, shares, reposts, comments
- ✅ **First Comment** - Lấy text và links của comment đầu tiên
- ✅ **Auto Scroll** - Tự động scroll để load thêm posts
- ✅ **JSON Export** - Export dữ liệu dạng JSON có cấu trúc

#### User Interface
- ✅ **Modern UI** - Giao diện đẹp với gradient theme
- ✅ **Vietnamese** - Hoàn toàn tiếng Việt
- ✅ **Progress Bar** - Hiển thị tiến trình real-time
- ✅ **Custom Checkboxes** - Checkboxes đẹp với animation
- ✅ **Status Indicator** - Dot animation cho status
- ✅ **Results Display** - Hiển thị statistics sau khi download

#### User Experience
- ✅ **Options Panel** - Tùy chọn linh hoạt cho user
- ✅ **Post Limit** - Cho phép giới hạn số bài viết (1-1000)
- ✅ **Stop Function** - Dừng download giữa chừng
- ✅ **Save Preferences** - Lưu settings tự động
- ✅ **Error Handling** - Xử lý lỗi graceful

#### Technical
- ✅ **Manifest V3** - Sử dụng Chrome Extension Manifest V3
- ✅ **Service Worker** - Background service worker
- ✅ **Content Script** - Efficient DOM parsing
- ✅ **Message Passing** - Chrome runtime messaging
- ✅ **Storage API** - Chrome storage cho preferences
- ✅ **Downloads API** - Chrome downloads API

### 📦 Architecture

#### Files Structure
```
threads-downloader/
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html            # Extension popup UI
├── popup.js              # UI logic and interactions
├── content.js            # Content script for data extraction
├── background.js         # Background service worker
├── styles.css            # Modern CSS styling
├── icons/                # Extension icons (16, 48, 128)
└── docs/                 # Documentation
```

#### Key Components

**popup.js** (6.8 KB)
- UI state management
- User preferences handling
- Progress tracking
- Download orchestration
- Message handling

**content.js** (11 KB)
- DOM parsing and extraction
- Auto-scrolling logic
- Post data extraction
- Media URL collection
- Engagement parsing
- Comment extraction

**background.js** (2.1 KB)
- Service worker setup
- Message forwarding
- Download handling
- Preference initialization

**styles.css** (5.7 KB)
- Modern gradient design
- Responsive layout
- Custom checkboxes
- Progress animations
- Status indicators

### 🎨 Design

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: System font stack for native feel
- **Layout**: Modern card-based design
- **Animations**: Subtle transitions and pulse effects
- **Icons**: Custom gradient circular icons

### 🔧 Technical Details

#### Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave Browser
- ✅ Opera/Vivaldi

#### Permissions Required
- `activeTab` - Access current Threads page
- `storage` - Save user preferences
- `downloads` - Download JSON file
- `https://www.threads.net/*` - Host permissions

#### APIs Used
- Chrome Extension APIs
- DOM APIs
- Storage API
- Downloads API
- Runtime Messaging

### 📊 Performance

- **Fast Extraction**: Efficient DOM queries
- **Memory Optimized**: Streaming approach
- **Non-blocking**: Async operations
- **Rate Limiting**: Respectful delays
- **Deduplication**: Map-based post tracking

### 🔒 Security & Privacy

- ✅ No external servers
- ✅ Local processing only
- ✅ No data collection
- ✅ No tracking
- ✅ Open source
- ✅ Minimal permissions

### 📝 Documentation

- ✅ Comprehensive README.md
- ✅ Detailed INSTALL.md
- ✅ Example output JSON
- ✅ Inline code comments
- ✅ Vietnamese documentation

### 🐛 Known Issues

**Minor**
- Threads may limit number of posts loaded
- Media URLs may expire after some time
- Comment extraction may vary with Threads UI changes

**Workarounds**
- Adjust post limit if hitting rate limits
- Download media immediately if needed long-term
- Extension will be updated if Threads changes structure

### 🔮 Future Plans

Potential features for future releases:
- [ ] Export to CSV format
- [ ] Download media files directly
- [ ] Schedule automatic downloads
- [ ] Multiple profile support
- [ ] Comparison between downloads
- [ ] Advanced filtering options
- [ ] Export to database
- [ ] API integration
- [ ] Cloud backup option

### 🙏 Acknowledgments

- Threads team for the platform
- Chrome Extension developers community
- All testers and early users

---

## Version History

- **1.0.0** (2025-10-05) - Initial release

---

**Format**: [Semantic Versioning](https://semver.org/)
**Types**: Added, Changed, Deprecated, Removed, Fixed, Security
