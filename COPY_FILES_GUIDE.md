# 📁 Hướng Dẫn Copy Files vào Backend Folder

## 📍 Vị Trí Thư Mục

**Full Path:** `/workspace/shopee-automation-backend/`

## 🎯 Files Cần Copy Vào

Bạn cần copy **4 files automation** của bạn vào thư mục này:

1. `shopee-automation.js` (thay thế file placeholder hiện tại)
2. `automation-example.js` (file mới)
3. `inspect-selectors.js` (file mới)
4. `AUTOMATION-README.md` (file mới)

---

## 🔧 CÁCH 1: Dùng File Explorer trong IDE (KHUYÊN DÙNG)

### Nếu đang dùng **Cursor IDE** hoặc **VS Code**:

#### Bước 1: Tìm Thư Mục trong File Tree
```
1. Nhìn sang bên trái màn hình
2. Tìm "File Explorer" hoặc "Files" panel
3. Locate thư mục: shopee-automation-backend/
4. Click vào để mở
```

#### Bước 2: Copy Files
```
Option A - Drag & Drop:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Mở File Explorer máy tính (nơi có 4 files của bạn)
2. Select 4 files automation
3. Drag files vào thư mục shopee-automation-backend/
4. Drop vào
5. Done! ✅

Option B - Copy/Paste:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Copy 4 files từ máy (Ctrl+C hoặc Cmd+C)
2. Click chuột phải vào thư mục shopee-automation-backend/
3. Chọn "Paste" (Ctrl+V hoặc Cmd+V)
4. Done! ✅

Option C - Right Click Menu:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click chuột phải vào thư mục shopee-automation-backend/
2. Chọn "Reveal in File Explorer" hoặc "Open in Finder"
3. Thư mục sẽ mở trong File Explorer
4. Copy 4 files vào đây
5. Done! ✅
```

#### Bước 3: Verify
```
1. Expand thư mục shopee-automation-backend/
2. Check có đủ 4 files mới không
3. Should see:
   ✅ shopee-automation.js (updated)
   ✅ automation-example.js (new)
   ✅ inspect-selectors.js (new)
   ✅ AUTOMATION-README.md (new)
```

---

## 💻 CÁCH 2: Dùng Terminal/Command Line

### Nếu files của bạn ở Desktop:

#### Windows (PowerShell/CMD):
```powershell
# Navigate to backend folder
cd /workspace/shopee-automation-backend/

# Copy từ Desktop
copy "C:\Users\YourName\Desktop\shopee-automation.js" .
copy "C:\Users\YourName\Desktop\automation-example.js" .
copy "C:\Users\YourName\Desktop\inspect-selectors.js" .
copy "C:\Users\YourName\Desktop\AUTOMATION-README.md" .
```

#### macOS/Linux:
```bash
# Navigate to backend folder
cd /workspace/shopee-automation-backend/

# Copy từ Desktop
cp ~/Desktop/shopee-automation.js .
cp ~/Desktop/automation-example.js .
cp ~/Desktop/inspect-selectors.js .
cp ~/Desktop/AUTOMATION-README.md .
```

### Nếu files ở thư mục khác:
```bash
# Replace /path/to/your/files/ với đường dẫn thực tế
cd /workspace/shopee-automation-backend/

cp /path/to/your/files/shopee-automation.js .
cp /path/to/your/files/automation-example.js .
cp /path/to/your/files/inspect-selectors.js .
cp /path/to/your/files/AUTOMATION-README.md .
```

### Copy tất cả cùng lúc:
```bash
cd /workspace/shopee-automation-backend/

# Copy all files
cp /path/to/your/files/*.js .
cp /path/to/your/files/AUTOMATION-README.md .
```

---

## 🌐 CÁCH 3: Upload qua Web Interface (Nếu Remote)

### Nếu đang làm việc remote/cloud:

```
1. Vào file tree bên trái
2. Click chuột phải vào shopee-automation-backend/
3. Chọn "Upload Files..."
4. Browse và select 4 files
5. Click "Upload"
6. Wait for upload complete
7. Done! ✅
```

---

## ✅ VERIFY SAU KHI COPY

### Check files đã copy thành công:

```bash
# List files in backend folder
ls -la /workspace/shopee-automation-backend/

# Should see these files:
# -rw-r--r-- 1 user user XXXX shopee-automation.js
# -rw-r--r-- 1 user user XXXX automation-example.js
# -rw-r--r-- 1 user user XXXX inspect-selectors.js
# -rw-r--r-- 1 user user XXXX AUTOMATION-README.md
```

### Hoặc check bằng find:
```bash
find /workspace/shopee-automation-backend/ -name "*.js" -type f
```

### Expected output:
```
/workspace/shopee-automation-backend/server.js
/workspace/shopee-automation-backend/shopee-automation.js
/workspace/shopee-automation-backend/automation-example.js
/workspace/shopee-automation-backend/inspect-selectors.js
```

---

## 📋 CHECKLIST

Sau khi copy, check list này:

```
Backend Folder: /workspace/shopee-automation-backend/

Existing Files (đã có sẵn):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] server.js
[ ] package.json
[ ] .env.example
[ ] README.md

New Files (cần copy vào):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] shopee-automation.js (thay thế placeholder)
[ ] automation-example.js
[ ] inspect-selectors.js
[ ] AUTOMATION-README.md
```

---

## 🎯 SAU KHI COPY XONG

### Bước tiếp theo:

```bash
# 1. Vào thư mục backend
cd /workspace/shopee-automation-backend/

# 2. Đọc AUTOMATION-README.md để hiểu workflow
cat AUTOMATION-README.md

# 3. Cài dependencies
npm install

# 4. Configure .env
cp .env.example .env
nano .env  # Điền Shopee credentials

# 5. Tìm selectors
node inspect-selectors.js

# 6. Update selectors vào shopee-automation.js
nano shopee-automation.js

# 7. Test automation
node automation-example.js

# 8. Start server
npm start

# 9. Test API
curl http://localhost:3000/health
```

---

## 🐛 Troubleshooting

### Lỗi: Permission denied
```bash
# Thêm quyền write
chmod +w /workspace/shopee-automation-backend/
```

### Lỗi: File already exists
```bash
# Backup old file
mv shopee-automation.js shopee-automation.js.backup

# Rồi copy file mới vào
cp /path/to/new/shopee-automation.js .
```

### Lỗi: No such file or directory
```bash
# Tạo thư mục nếu chưa có
mkdir -p /workspace/shopee-automation-backend/

# Copy files vào
cp /path/to/files/* /workspace/shopee-automation-backend/
```

---

## 💡 Tips

### Tip 1: Check file size
```bash
ls -lh /workspace/shopee-automation-backend/*.js
# File size should be > 0
```

### Tip 2: Check file readable
```bash
head -5 /workspace/shopee-automation-backend/shopee-automation.js
# Should see JavaScript code
```

### Tip 3: Compare với backup
```bash
diff shopee-automation.js.backup shopee-automation.js
# See what changed
```

---

## 🎉 Done!

Sau khi copy xong 4 files:
✅ Backend structure complete
✅ Ready to configure
✅ Ready to test
✅ Ready to integrate với extension

Next: Follow AUTOMATION-README.md trong thư mục backend!

---

**Need help?** Check:
- File tree trong IDE
- Terminal/Command line
- Upload interface (if remote)
