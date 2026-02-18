#!/bin/bash

# ============================================
# Miaoli House Deploy Script
# ============================================

set -e

echo "🚀 開始部署..."

# 顏色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 檢查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}錯誤: Docker 未安裝${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}錯誤: Docker Compose 未安裝${NC}"
    exit 1
fi

# 檢查環境變數
if [ ! -f .env ]; then
    echo -e "${YELLOW}警告: .env 檔案不存在，使用範例${NC}"
    cp .env.example .env
fi

# 建置並啟動
echo -e "${GREEN}1/3 建置 Docker 映像...${NC}"
docker-compose build

echo -e "${GREEN}2/3 啟動服務...${NC}"
docker-compose up -d

# 等待服務啟動
echo -e "${GREEN}3/3 檢查服務狀態...${NC}"
sleep 10

# 顯示狀態
docker-compose ps

echo ""
echo -e "${GREEN}✅ 部署完成!${NC}"
echo ""
echo "服務網址:"
echo "  - 前端: http://localhost:3000"
echo "  - API: http://localhost:8090"
echo "  - MinIO Console: http://localhost:9001"
echo ""
echo "停止服務: docker-compose down"
