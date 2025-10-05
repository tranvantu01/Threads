# 📦 Hướng dẫn Cài đặt Chi tiết

## Yêu cầu Hệ thống

- ✅ Google Chrome phiên bản 88 trở lên
- ✅ Microsoft Edge phiên bản 88 trở lên
- ✅ Brave Browser (tương thích Chrome)
- ✅ Opera/Vivaldi (tương thích Chrome)

## 🚀 Cài đặt cho Chrome/Edge

### Phương án 1: Developer Mode (Khuyên dùng để phát triển)

#### Bước 1: Tải Source Code

**Option A: Clone từ Git**
```bash
git clone <repository-url>
cd threads-downloader
```

**Option B: Download ZIP**
1. Click nút "Code" > "Download ZIP"
2. Giải nén file ZIP vào thư mục bất kỳ

#### Bước 2: Mở Extension Management

**Trên Chrome:**
1. Mở Chrome
2. Vào menu (⋮) > More Tools > Extensions
3. Hoặc truy cập trực tiếp: `chrome://extensions/`

**Trên Edge:**
1. Mở Edge
2. Vào menu (⋮) > Extensions > Manage Extensions
3. Hoặc truy cập trực tiếp: `edge://extensions/`

#### Bước 3: Kích hoạt Developer Mode

1. Tìm switch "Developer mode" ở góc trên bên phải
2. Bật switch này lên (màu xanh)

![Developer Mode](https://i.imgur.com/placeholder_dev_mode.png)

#### Bước 4: Load Extension

1. Click nút **"Load unpacked"** (hoặc "Tải tiện ích đã giải nén")
2. Trong dialog chọn thư mục, navigate đến thư mục `threads-downloader`
3. Chọn thư mục (không phải file) và click "Select Folder"

#### Bước 5: Xác nhận

- Icon Threads Downloader sẽ xuất hiện trên thanh extensions
- Nếu không thấy icon, click vào biểu tượng puzzle (🧩) để pin extension

![Extension Icon](https://i.imgur.com/placeholder_icon.png)

### Phương án 2: Package Extension (.crx)

#### Tạo Package File

1. Vào `chrome://extensions/`
2. Bật Developer Mode
3. Click "Pack extension"
4. Chọn thư mục extension
5. Click "Pack Extension"
6. File `.crx` và `.pem` sẽ được tạo

#### Cài đặt từ .crx

**Lưu ý:** Chrome hiện chặn cài đặt trực tiếp .crx từ bên ngoài Chrome Web Store

**Workaround:**
1. Giữ Developer Mode bật
2. Kéo thả file `.crx` vào trang `chrome://extensions/`
3. Click "Add extension" khi có prompt

## 🔧 Cấu hình Sau Cài đặt

### Kiểm tra Permissions

Extension cần các quyền sau:
- ✅ Read data on threads.com
- ✅ Download files
- ✅ Storage

### Test Extension

1. Mở https://www.threads.com/@zuck (hoặc profile bất kỳ)
2. Click icon Threads Downloader
3. Popup sẽ hiện với status "Sẵn sàng"

## ❗ Xử lý Lỗi Cài đặt

### Lỗi: "Manifest file is invalid"

**Nguyên nhân:** File manifest.json bị lỗi format

**Giải pháp:**
1. Đảm bảo file `manifest.json` có trong thư mục
2. Kiểm tra JSON syntax (dùng JSONLint)
3. Download lại source code nếu cần

### Lỗi: "Extensions must be installed from Chrome Web Store"

**Nguyên nhân:** Policy của tổ chức/công ty

**Giải pháp:**
1. Liên hệ IT admin để whitelist extension
2. Hoặc sử dụng Chrome portable
3. Hoặc cài trên máy cá nhân

### Lỗi: "This extension may have been corrupted"

**Nguyên nhân:** File bị hỏng khi download

**Giải pháp:**
1. Xóa extension
2. Download lại source code
3. Cài đặt lại từ đầu

### Extension không xuất hiện sau cài

**Giải pháp:**
1. Kiểm tra extension có được enable không
2. Click icon puzzle (🧩) trên thanh toolbar
3. Tìm "Threads Profile Data Downloader"
4. Click pin icon để ghim lên toolbar

## 🔄 Cập nhật Extension

### Update Manual

1. Vào `chrome://extensions/`
2. Tìm Threads Downloader
3. Click nút refresh (🔄) để reload
4. Hoặc xóa và cài lại version mới

### Auto-reload khi Development

Khi đang develop, Chrome tự động reload khi:
- Sửa file manifest.json
- Có thể cần reload manual với các file khác

## 📱 Cài đặt trên Mobile

**Lưu ý:** Chrome Mobile không hỗ trợ extensions

**Alternatives:**
- Kiwi Browser (Android) - Hỗ trợ Chrome extensions
- Firefox Mobile - Hỗ trợ add-ons giới hạn

## 🛡️ Bảo mật

### Verify Source Code

Trước khi cài đặt, kiểm tra:
1. Source code từ nguồn tin cậy
2. Review code trong các file .js
3. Kiểm tra permissions trong manifest.json

### Recommended Security

- ✅ Chỉ cài từ source official
- ✅ Review code trước khi dùng
- ✅ Không share file .pem (private key)
- ✅ Update thường xuyên

## 💡 Tips

### Pin Extension

1. Click icon puzzle (🧩)
2. Tìm Threads Downloader
3. Click pin icon
4. Extension sẽ luôn visible trên toolbar

### Keyboard Shortcuts

Có thể set shortcut để mở extension:
1. Vào `chrome://extensions/shortcuts`
2. Tìm Threads Downloader
3. Set shortcut (VD: Ctrl+Shift+T)

### Multiple Profiles

Nếu dùng nhiều Chrome profiles:
- Cài extension riêng cho mỗi profile
- Preferences không share giữa profiles

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check console: F12 > Console tab
2. Xem error messages
3. Report issue với log đầy đủ

## ✅ Checklist Cài đặt

- [ ] Download/clone source code
- [ ] Mở Chrome/Edge extensions page
- [ ] Bật Developer mode
- [ ] Load unpacked extension
- [ ] Verify icon xuất hiện
- [ ] Test trên trang Threads
- [ ] Pin extension vào toolbar
- [ ] Done! 🎉

---

**Chúc bạn sử dụng extension hiệu quả!**
