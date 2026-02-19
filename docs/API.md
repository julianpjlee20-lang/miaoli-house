# Miaoli House API 文檔

## 概述

Miaoli House 提供了完整的 REST API，用於管理預售屋資料、用戶收藏和價格提醒。

## Base URL

```
https://your-domain.com/api/
```

## 認證

使用 PocketBase 認證系統：

### 登入
```bash
POST /api/collections/users/auth-with-password
Content-Type: application/json

{
  "identity": "user@example.com",
  "password": "your-password"
}
```

### 註冊
```bash
POST /api/collections/users/records
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password",
  "passwordConfirm": "your-password"
}
```

### 登出
```bash
POST /api/collections/users/auth-refresh
Authorization: Bearer [your-token]
```

---

## API 端點

### 1. 預售屋資料 (靜態 JSON)

**獲取所有建案**
```bash
GET /api/projects
```

Response:
```json
{
  "lastUpdated": "2026-02-18",
  "source": "5168實價登錄比價王 + 591新建案",
  "regions": [
    { "id": "houlong", "name": "後龍", "town": "後龍鎮" },
    { "id": "zhunan", "name": "竹南", "town": "竹南鎮" },
    { "id": "toufen", "name": "頭份", "town": "頭份市" }
  ],
  "projects": {
    "houlong": [...],
    "zhunan": [...],
    "toufen": [...]
  }
}
```

**按地區獲取**
```bash
GET /api/projects?region=houlong
```

**按 ID 獲取**
```bash
GET /api/projects/1
```

---

### 2. 用戶收藏

**獲取收藏列表**
```bash
GET /api/collections/favorites/records
Authorization: Bearer [your-token]
```

**添加收藏**
```bash
POST /api/collections/favorites/records
Authorization: Bearer [your-token]
Content-Type: application/json

{
  "user": "user_id",
  "project_id": "hl1",
  "project_name": "八宅",
  "region": "houlong"
}
```

**刪除收藏**
```bash
DELETE /api/collections/favorites/records/[record_id]
Authorization: Bearer [your-token]
```

---

### 3. 用戶設定

**獲取設定**
```bash
GET /api/collections/user_settings/records
Authorization: Bearer [your-token]
```

**更新設定**
```bash
PATCH /api/collections/user_settings/records/[record_id]
Authorization: Bearer [your-token]
Content-Type: application/json

{
  "default_region": "houlong",
  "notifications": true
}
```

---

### 4. 價格提醒

**獲取提醒列表**
```bash
GET /api/collections/price_alerts/records
Authorization: Bearer [your-token]
```

**創建提醒**
```bash
POST /api/collections/price_alerts/records
Authorization: Bearer [your-token]
Content-Type: application/json

{
  "user": "user_id",
  "project_id": "hl1",
  "target_price": 30,
  "triggered": false
}
```

**刪除提醒**
```bash
DELETE /api/collections/price_alerts/records/[record_id]
Authorization: Bearer [your-token]
```

---

### 5. 文件上傳 (MinIO)

**上傳文件**
```bash
POST /api/files/upload
Authorization: Bearer [your-token]
Content-Type: multipart/form-data

file: [file]
bucket: presale-data
```

**獲取文件列表**
```bash
GET /api/files/list
Authorization: Bearer [your-token]
```

**刪除文件**
```bash
DELETE /api/files/[filename]
Authorization: Bearer [your-token]
```

---

## 錯誤碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 400 | 請求錯誤 |
| 401 | 未授權 |
| 403 | 禁止訪問 |
| 404 | 找不到資源 |
| 500 | 伺服器錯誤 |

---

## 示例

### 使用 JavaScript

```javascript
// 初始化 PocketBase
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://your-domain.com');

// 登入
const authData = await pb.collection('users').authWithPassword(
  'user@example.com',
  'your-password'
);

// 獲取收藏
const favorites = await pb.collection('favorites').getList(1, 50, {
  filter: `user = "${pb.authStore.model.id}"`
});

// 添加收藏
await pb.collection('favorites').create({
  user: pb.authStore.model.id,
  project_id: 'hl1',
  project_name: '八宅',
  region: 'houlong'
});
```

### 使用 curl

```bash
# 登入
curl -X POST "https://your-domain.com/api/collections/users/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"user@example.com","password":"your-password"}'

# 獲取收藏 (需要帶上 token)
curl -X GET "https://your-domain.com/api/collections/favorites/records" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 開發指南

### 添加新的 API 端點

1. 在 `backend/schema.js` 中添加新的 Collection
2. 重啟 PocketBase 容器
3. 在 `frontend/src/lib/` 中添加 API 調用函數

### 添加定時任務

1. 在 `scripts/` 中編寫腳本
2. 更新 `crontab` 文件
3. 重新構建 Cron 容器
