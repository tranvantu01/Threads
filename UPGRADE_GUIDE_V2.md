# 🚀 Nâng cấp lên Version 2.0 Pro - Hướng dẫn

## 📦 Files Mới Đã Tạo

### 1. Extension Files v2.0 Pro
```
✅ popup-v2.html          (8.1 KB)  - UI mới với 3 tabs
✅ popup-v2.js            (21 KB)   - Logic mới + Excel export
✅ background-v2.js       (4.5 KB)  - Scheduler support
✅ content.js             (Updated) - Shopee conversion
✅ styles.css             (Updated) - New UI components
✅ manifest.json          (Updated) - v2.0.0 + new permissions
```

### 2. Package
```
✅ threads-downloader-pro-v2.0.zip (36 KB)
   → Extension hoàn chỉnh v2.0 Pro
```

### 3. Documentation
```
✅ README_V2_PRO.md       (13 KB)   - Comprehensive guide
✅ UPGRADE_GUIDE_V2.md    (This file)
```

---

## ✨ 5 Tính Năng Mới

### 1️⃣ Tải Nhiều URLs
```
Tab "Tải nhiều" → 
  • Nhập list URLs
  • Hoặc upload file TXT
  → Export tổng hợp Excel
```

### 2️⃣ Shopee Affiliate (ID: 17357490088)
```
Tự động:
  • Phát hiện link Shopee
  • Convert: shopee.vn/abc → shopee.vn/abc?af_siteid=17357490088
  • Export cả 2 versions
```

### 3️⃣ Excel Export
```
Format: 1 post = 1 dòng Excel
Cột: STT | Tên | Content | Media | Shopee Original | Shopee Converted | ...
```

### 4️⃣ Upload File TXT
```
File urls.txt:
  https://www.threads.com/@user1
  https://www.threads.com/@user2
  
→ Upload → Auto process
```

### 5️⃣ Scheduler
```
Tab "Lịch trình" →
  • Chọn ngày/giờ
  • Nhập URL
  → Tự động tải vào thời gian đã đặt
```

---

## 🔄 So sánh v1.0 vs v2.0 Pro

| Tính năng | v1.0 | v2.0 Pro |
|-----------|------|----------|
| Tải 1 profile | ✅ Có | ✅ Có |
| Tải nhiều profiles | ❌ Không | ✅ Có |
| Upload TXT file | ❌ Không | ✅ Có |
| Shopee affiliate | ❌ Không | ✅ Có (ID: 17357490088) |
| Excel export | ❌ Không (chỉ JSON) | ✅ Có (1 post/row) |
| Schedule | ❌ Không | ✅ Có |
| Format output | JSON only | Excel / CSV / JSON |

---

## 📥 Cài Đặt v2.0 Pro

### Option 1: Cài mới (Recommended)

```bash
# 1. Giải nén
unzip threads-downloader-pro-v2.0.zip

# 2. Load vào Chrome
chrome://extensions/
→ Load unpacked
→ Chọn thư mục vừa giải nén

# 3. Done!
```

### Option 2: Upgrade từ v1.0

```bash
# 1. Vào chrome://extensions/

# 2. Remove extension v1.0 cũ
→ Click "Remove"

# 3. Load v2.0 Pro mới
→ Load unpacked
→ Chọn thư mục v2.0

# Note: Settings sẽ reset, cần config lại
```

---

## 🎯 Quick Start v2.0

### Use Case 1: Tải 1 Profile Nhanh
```
1. Tab "Tải đơn"
2. Mở threads.com/@username
3. Click "Tải dữ liệu"
4. Chọn Excel
5. Save
```

### Use Case 2: Tải Nhiều Profiles
```
1. Tab "Tải nhiều"
2. Paste URLs:
   https://www.threads.com/@user1
   https://www.threads.com/@user2
3. Click "Tải dữ liệu"
4. Export Excel tổng hợp
```

### Use Case 3: Upload File TXT
```
1. Tạo urls.txt với danh sách URLs
2. Tab "Tải nhiều"
3. Click "📁 Upload file TXT"
4. Chọn urls.txt
5. Click "Tải dữ liệu"
```

### Use Case 4: Shopee Affiliate
```
1. Enable "Chuyển đổi link Shopee Affiliate"
2. Tải profile có link Shopee
3. Mở Excel → Check 2 cột:
   • "Link Shopee" (gốc)
   • "Link Shopee đã đổi ID" (affiliate)
4. Copy link affiliate để share
```

### Use Case 5: Schedule
```
1. Tab "Lịch trình"
2. Chọn: 06/10/2025, 14:30
3. URL: threads.com/@username
4. Click "Thêm lịch trình"
5. Extension tự động chạy lúc 14:30
```

---

## 📊 Format Excel Output

### Cấu trúc bảng:

| Column | Content | Example |
|--------|---------|---------|
| STT | Số thứ tự | 1, 2, 3... |
| Tên Tài Khoản | Username | user1, user2 |
| Content | Text bài viết | "Check this out..." |
| Số lượng media | Count | 0, 1, 2, 3... |
| Media URLs | URLs (newline separated) | url1\nurl2\nurl3 |
| Lượt thích | Likes count | 1234 |
| Bình luận | Comments count | 56 |
| Đăng lại | Reposts count | 78 |
| Chia sẻ | Shares count | 90 |
| Comment đầu | First comment text | "Great post!" |
| Link Shopee | Original Shopee links | shopee.vn/abc |
| Link Shopee đã đổi ID | Converted affiliate links | shopee.vn/abc?af_siteid=... |
| Thời gian tải | Download timestamp | 05/10/2025 14:30 |

### Đặc điểm:
✅ **1 post = 1 dòng** (trên cùng 1 hàng Excel)  
✅ Media URLs ngăn cách bởi line break trong cell  
✅ Shopee links: Original và Converted song song  
✅ Auto-width columns  

---

## 🛍️ Shopee Affiliate ID

### Cấu hình:

**Current ID:** `17357490088`

### Muốn thay đổi?

Edit file `popup-v2.js`:
```javascript
// Tìm dòng này (line ~6):
const SHOPEE_AFFILIATE_ID = '17357490088';

// Thay bằng ID của bạn:
const SHOPEE_AFFILIATE_ID = 'YOUR_ID_HERE';
```

Edit file `content.js`:
```javascript
// Tìm dòng này (~406):
const SHOPEE_AFFILIATE_ID = '17357490088';

// Thay bằng ID của bạn:
const SHOPEE_AFFILIATE_ID = 'YOUR_ID_HERE';
```

Sau đó:
```
1. Vào chrome://extensions/
2. Click reload icon extension
3. Done!
```

---

## 🔧 API Key cho Shopee (Optional)

**Hiện tại:** Extension dùng URL parameter trực tiếp

**Nếu bạn có Shopee API Key:**

Cung cấp cho tôi:
1. API Key
2. API Endpoint
3. Request format

Tôi sẽ tích hợp API để:
- Rút gọn links
- Tracking tốt hơn
- Analytics chi tiết

---

## ⚙️ Permissions Mới

v2.0 Pro yêu cầu thêm 2 permissions:

```json
{
  "alarms": "Cho scheduler functionality",
  "tabs": "Cho multiple downloads (tạo tabs background)"
}
```

**An toàn?** ✅ Có!
- Chỉ dùng cho tính năng schedule và multi-download
- Không track, không collect data
- Local processing only

---

## 📝 File TXT Format

### Chuẩn:
```
https://www.threads.com/@user1
https://www.threads.com/@user2
https://www.threads.com/@user3
```

### Rules:
- ✅ Mỗi dòng 1 URL
- ✅ URL phải có `threads.com`
- ✅ Format: `https://www.threads.com/@username`
- ❌ Không thêm text khác
- ❌ Không để dòng trống giữa URLs (OK ở cuối file)

### Example file (urls.txt):
```
https://www.threads.com/@zuck
https://www.threads.com/@instagram
https://www.threads.com/@meta
```

---

## 🐛 Troubleshooting

### Q: Excel không mở được?
```
A: Dùng Microsoft Excel hoặc LibreOffice.
   Google Sheets có thể lỗi format.
```

### Q: Shopee links không convert?
```
A: Check option "Chuyển đổi link Shopee Affiliate" đã bật chưa.
   Verify link có phải shopee.vn, shopee.com.vn, hoặc shope.ee
```

### Q: Schedule không chạy?
```
A: Browser phải đang mở (có thể minimize).
   Alarm chỉ trigger khi browser running.
```

### Q: Upload TXT bị lỗi?
```
A: Check file encoding UTF-8.
   Check mỗi dòng 1 URL.
   Remove dòng trống, text thừa.
```

### Q: Tải nhiều profiles bị lag?
```
A: Bình thường. Extension xử lý tuần tự.
   Mỗi profile ~2-3 phút.
   Giảm số profiles hoặc tăng limit/profile.
```

---

## 💡 Best Practices

### 1. Multiple Downloads
```
✅ Test với 2-3 profiles trước
✅ Set limit 20-50 posts/profile
✅ Monitor progress bar
❌ Không tải 100+ profiles cùng lúc
```

### 2. Excel Export
```
✅ Dùng Excel để mở (best)
✅ Enable "Wrap text" cho multi-line cells
✅ Freeze first row (header)
❌ Không edit trong Google Sheets (lỗi format)
```

### 3. Shopee Affiliate
```
✅ Copy link từ cột "Link Shopee đã đổi ID"
✅ Test link trước khi share
✅ Verify có "af_siteid=17357490088"
❌ Không dùng link gốc để share
```

### 4. Scheduler
```
✅ Set thời gian >5 phút từ bây giờ
✅ Test 1 schedule trước
✅ Check notifications
❌ Không đặt quá nhiều lịch cùng lúc
```

---

## 📊 Performance

### v2.0 Pro Stats:

| Metric | Value |
|--------|-------|
| Code size | ~1,500 lines |
| Extension size | 36 KB (compressed) |
| UI tabs | 3 tabs |
| Export formats | 3 (Excel, CSV, JSON) |
| Shopee domains | 3 (shopee.vn, .com.vn, shope.ee) |
| Max profiles | Unlimited (recommend 10-20) |
| Speed | ~2-3 min/profile (50 posts) |

---

## 🎯 Migration Checklist

Từ v1.0 → v2.0 Pro:

- [ ] Backup data v1.0 (nếu có)
- [ ] Remove extension v1.0
- [ ] Giải nén v2.0 Pro
- [ ] Load unpacked v2.0
- [ ] Verify icon xuất hiện
- [ ] Test "Tải đơn" tab
- [ ] Test "Tải nhiều" tab
- [ ] Test Shopee conversion
- [ ] Test Excel export
- [ ] Test Schedule (optional)
- [ ] Done! 🎉

---

## 📚 Documentation

### Files to read:

1. **README_V2_PRO.md** (13 KB)
   → Comprehensive guide cho v2.0

2. **UPGRADE_GUIDE_V2.md** (This file)
   → Migration và quick start

3. **INSTALL.md** (Updated)
   → Detailed installation

4. **QUICKSTART.md**
   → 5-minute quick start

---

## 🎉 You're Ready!

**Threads Profile Data Downloader Pro v2.0** installed!

### Next Steps:

1. ✅ Load extension vào Chrome
2. ✅ Explore 3 tabs (Tải đơn, Tải nhiều, Lịch trình)
3. ✅ Test Shopee affiliate conversion
4. ✅ Export Excel để xem format
5. ✅ Create schedule nếu cần

---

## 📞 Need Help?

### Resources:
- 📖 README_V2_PRO.md - Full documentation
- 💡 Example files trong workspace
- 🔍 Console (F12) - Check errors

### Common Issues:
- Extension not loading → Check Developer mode
- Shopee not converting → Enable option
- Excel format wrong → Use MS Excel
- Schedule not running → Browser must be open

---

**Made with ❤️ by Expert Extension Developer**

Version: 2.0.0 Pro  
Release: October 2025  
Features: 5 major upgrades  
Code: 1,500+ lines  

**Happy downloading with Shopee Affiliate! 🚀💰**
