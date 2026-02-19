#!/bin/bash

# ============================================
# Miaoli House - 一鍵部署腳本
# ============================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 變數
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Miaoli House - 一鍵部署腳本${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# ============================================
# 步驟 1: 檢查環境
# ============================================
echo -e "${YELLOW}步驟 1/5: 檢查環境...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}錯誤: Docker 未安裝${NC}"
    echo "請先安裝 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo -e "${RED}錯誤: Docker Compose 未安裝${NC}"
    echo "請先安裝 Docker Compose"
    exit 1
fi

# 檢查 Docker 服務
if ! docker info &> /dev/null; then
    echo -e "${RED}錯誤: Docker 服務未啟動${NC}"
    echo "請啟動 Docker 服務"
    exit 1
fi

echo -e "${GREEN}✅ 環境檢查通過${NC}"
echo ""

# ============================================
# 步驟 2: 輸入配置
# ============================================
echo -e "${YELLOW}步驟 2/5: 輸入配置...${NC}"
echo ""

# 網域
read -p "請輸入你的網域 (例如: example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}錯誤: 網域不能為空${NC}"
    exit 1
fi

# 管理員帳號
read -p "請輸入管理員帳號 (email): " ADMIN_EMAIL
if [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${RED}錯誤: 管理員帳號不能為空${NC}"
    exit 1
fi

# 管理員密碼
read -s -p "請輸入管理員密碼: " ADMIN_PASSWORD
echo ""
if [ -z "$ADMIN_PASSWORD" ]; then
    echo -e "${RED}錯誤: 管理員密碼不能為空${NC}"
    exit 1
fi

echo ""

# ============================================
# 步驟 3: 產生 SSL 證書
# ============================================
echo -e "${YELLOW}步驟 3/5: 產生 SSL 證書...${NC}"

# 創建 SSL 目錄
mkdir -p "$SCRIPT_DIR/nginx/ssl"

# 產生 SSL 證書 (自簽名)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SCRIPT_DIR/nginx/ssl/key.pem" \
    -out "$SCRIPT_DIR/nginx/ssl/cert.pem" \
    -subj "/C=TW/ST=Taiwan/L=Taipei/O=MiaoliHouse/CN=$DOMAIN" \
    2>/dev/null

echo -e "${GREEN}✅ SSL 證書已產生${NC}"
echo ""

# ============================================
# 步驟 4: 配置環境變數
# ============================================
echo -e "${YELLOW}步驟 4/5: 配置環境變數...${NC}"

# 複製環境變數檔案
cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"

# 產生隨機密鑰
PB_SECRETS=$(openssl rand -base64 32 2>/dev/null)

# 更新環境變數
sed -i "s/your-domain.com/$DOMAIN/g" "$SCRIPT_DIR/.env"
sed -i "s|admin@your-domain.com|$ADMIN_EMAIL|g" "$SCRIPT_DIR/.env"
sed -i "s|change-this-password|$ADMIN_PASSWORD|g" "$SCRIPT_DIR/.env"
sed -i "s|change-this-to-random-string-generated-by-openssl|$PB_SECRETS|g" "$SCRIPT_DIR/.env"

echo -e "${GREEN}✅ 環境變數已配置${NC}"
echo ""

# ============================================
# 步驟 5: 啟動服務
# ============================================
echo -e "${YELLOW}步驟 5/5: 啟動服務...${NC}"

# 進入目錄
cd "$SCRIPT_DIR"

# 拉取最新映像
echo "拉取 Docker 映像..."
docker-compose pull

# 啟動服務
echo "啟動服務..."
docker-compose up -d --build

# 等待服務啟動
echo "等待服務啟動..."
sleep 30

# ============================================
# 完成
# ============================================
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}              🎉 部署完成!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "服務網址:"
echo -e "  ${BLUE}前端網站:${NC} https://$DOMAIN"
echo -e "  ${BLUE}PocketBase:${NC} https://$DOMAIN/_/"
echo -e "  ${BLUE}MinIO Console:${NC} https://$DOMAIN/minio/"
echo ""
echo -e "登入資訊:"
echo -e "  ${BLUE}帳號:${NC} $ADMIN_EMAIL"
echo -e "  ${BLUE}密碼:${NC} [你輸入的密碼]"
echo ""
echo -e "${YELLOW}提示:${NC} 第一次登入後，請在 PocketBase 中創建以下 Collection:"
echo "  - favorites (用戶收藏)"
echo "  - user_settings (用戶設定)"
echo "  - price_alerts (價格提醒)"
echo ""
echo -e "常用指令:"
echo -e "  ${BLUE}查看狀態:${NC} docker-compose ps"
echo -e "  ${BLUE}查看日誌:${NC} docker-compose logs -f"
echo -e "  ${BLUE}停止服務:${NC} docker-compose down"
echo -e "  ${BLUE}重啟服務:${NC} docker-compose restart"
echo ""
