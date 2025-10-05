# 🎯 HƯỚNG DẪN TẠO EXTENSION THỦ CÔNG (KHÔNG CẦN DOWNLOAD)

## Nếu bạn KHÔNG THỂ download file ZIP, làm theo hướng dẫn này!

---

## 📋 BƯỚC 1: Tạo folder trên máy tính

### **Windows:**
1. Nhấn phím `Win + E` (mở File Explorer)
2. Click vào **Desktop** bên trái
3. Click chuột phải vào chỗ trống
4. Chọn **New** → **Folder**
5. Đặt tên: `threads-extension`
6. Nhấn Enter
7. **Double click** vào folder `threads-extension` để vào trong

### **Mac:**
1. Mở **Finder**
2. Click vào **Desktop**
3. Click chuột phải vào chỗ trống
4. Chọn **New Folder**
5. Đặt tên: `threads-extension`
6. Nhấn Enter
7. **Double click** vào folder để vào trong

---

## 📋 BƯỚC 2: Tạo các file trong folder

Bây giờ bạn đang ở trong folder `threads-extension`. Tạo các file sau:

---

### FILE 1: `manifest.json`

**Cách tạo:**
1. Click chuột phải trong folder
2. New → Text Document (Windows) hoặc TextEdit (Mac)
3. Đặt tên: `manifest.json` (xóa .txt nếu có)
4. Double click để mở
5. **COPY đoạn code sau và PASTE vào:**

```json
{
  "manifest_version": 3,
  "name": "Threads Profile Data Downloader Pro",
  "version": "2.0.0",
  "description": "Download multiple Threads profiles, convert Shopee affiliate links, export to Excel",
  "permissions": [
    "activeTab",
    "storage",
    "downloads",
    "alarms",
    "tabs"
  ],
  "host_permissions": [
    "https://www.threads.com/*"
  ],
  "action": {
    "default_popup": "popup-v2.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background-v2.js"
  },
  "content_scripts": [
    {
      "matches": ["https://www.threads.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

6. Save file (Ctrl+S hoặc Cmd+S)
7. Đóng file

---

### FILE 2: `popup-v2.html`

**Cách tạo:**
1. Tạo file mới tên `popup-v2.html`
2. Mở file
3. **Đây là file dài ~300 dòng**

**⚠️ VẤN ĐỀ:** File này quá dài để paste hết ở đây!

---

## 🎯 GIẢI PHÁP TỐT HƠN: SỬ DỤNG GIT

Thay vì copy-paste từng file (rất mất công), bạn có thể:

### **Option 1: Download ZIP trực tiếp từ GitHub** (NẾU có repo)
```
1. Vào GitHub repository
2. Click nút "Code" màu xanh
3. Click "Download ZIP"
4. Giải nén
5. Load vào Chrome
```

### **Option 2: Tôi sẽ tạo link download**
Cho tôi biết nếu bạn cần link download trực tiếp.

---

## ⚠️ LƯU Ý QUAN TRỌNG

Extension có tổng cộng:
- **13 files code**
- **3 files icon**
- Tổng ~3,400 dòng code

Copy-paste thủ công sẽ RẤT MẤT THỜI GIAN và DỄ SAI!

**Khuyến nghị:** Hãy chờ tôi hướng dẫn download từ Cursor web interface!

---

**Hãy đợi hướng dẫn chi tiết từ tôi ở phần tiếp theo! 📥**
