# 快速部署指南

## 前置需求

1. **VPS** - 至少 2GB RAM
2. **網域** - 已經購買的網域
3. **SSH 客戶端** - 連接到 VPS

---

## 步驟 1: 購買網域

推薦網域註冊商：
- Namecheap (~$1/年)
- Cloudflare (~$1/年)
- Gandi (~$2/年)

取得網域後，設置 DNS 指向你的 VPS IP。

---

## 步驟 2: 購買 VPS

推薦供應商：
- **Zeabur** - $5/月 (推薦)
- **DigitalOcean** - $4/月
- **Linode** - $5/月
- **Hetzner** - €3/月

取得 VPS 後，記下 IP 地址。

---

## 步驟 3: 配置 DNS

在你的網域註冊商網站，添加以下 DNS 記錄：

| 類型 | 主機 | 值 |
|------|------|-----|
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

等待 DNS 生效 (通常 5-30 分鐘)。

---

## 步驟 4: 連接到 VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## 步驟 5: 安裝 Docker

```bash
# 安裝 Docker
curl -fsSL https://get.docker.com | sh

# 啟動 Docker
systemctl start docker
systemctl enable docker

# 檢查 Docker 版本
docker --version
```

---

## 步驟 6: 部署 Miaoli House

```bash
# 克隆專案
git clone https://github.com/julianpjlee20-lang/miaoli-house.git
cd miaoli-house

# 執行安裝腳本
chmod +x install.sh
./install.sh
```

腳本會詢問：
1. 網域 (例如: example.com)
2. 管理員帳號 (email)
3. 管理員密碼

---

## 步驟 7: 驗證部署

打開瀏覽器訪問 `https://your-domain.com`

應該可以看到：
- 前端網站正常運作
- 可以訪問 PocketBase 管理介面

---

## 常用指令

```bash
# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f

# 重啟服務
docker-compose restart

# 停止服務
docker-compose down

# 更新並重啟
git pull
docker-compose up -d --build
```

---

## 故障排除

### 網站無法訪問

1. 檢查 Docker 服務狀態：
```bash
docker-compose ps
```

2. 檢查日誌：
```bash
docker-compose logs nginx
```

3. 檢查防火牆：
```bash
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### SSL 證書錯誤

重新產生證書：
```bash
cd miaoli-house
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=TW/ST=Taiwan/L=Taipei/O=MiaoliHouse/CN=your-domain.com"

docker-compose restart nginx
```

### DNS 問題

使用 dig 或 online DNS checker 驗證 DNS 設置：
```bash
dig your-domain.com
```

---

## 下一步

1. 登入 PocketBase 管理介面 (`https://your-domain.com/_/`)
2. 創建 Collection (如上方 API 文檔所述)
3. 自訂前端樣式
4. 添加更多功能

---

## 支援

如有問題，請開 GitHub Issue。
