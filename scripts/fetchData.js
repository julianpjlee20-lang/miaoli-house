/**
 * 預售屋資料抓取腳本
 * 資料來源：
 * - 內政部實價登錄 OpenData
 * - 5168 實價登錄比價王
 * - 591 新建案
 * 
 * 使用方式：
 * node scripts/fetchData.js
 */

const fs = require('fs');
const path = require('path');

// 輸出目錄
const OUTPUT_DIR = path.join(__dirname, '../frontend/src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'presale.json');

// 地區列表
const REGIONS = [
  { id: 'houlong', name: '後龍', town: '後龍鎮' },
  { id: 'zhunan', name: '竹南', town: '竹南鎮' },
  { id: 'toufen', name: '頭份', town: '頭份市' }
];

// 模擬資料（實際需要從網路抓取）
// 這個腳本應該從以下來源抓取資料：
// 1. 內政部 OpenData API
// 2. 591 新建案
// 3. 5168 實價登錄比價王

async function fetchData() {
  console.log('開始抓取預售屋資料...');
  console.log('資料來源:');
  console.log('  - 內政部實價登錄: https://plvr.land.moi.gov.tw/');
  console.log('  - 5168實價登錄比價王: https://community.houseprice.tw/');
  console.log('  - 591新建案: https://newhouse.591.com.tw/');
  
  // TODO: 實作實際的資料抓取邏輯
  // 目前這個腳本只是範例
  // 
  // 實際資料抓取需要:
  // 1. 從內政部下載 CSV/ZIP 檔案
  // 2. 解析 CSV 資料
  // 3. 過濾苗栗縣的資料
  // 4. 從 591/5168 抓取建案資訊
  // 5. 合併資料並輸出 JSON
  
  const data = {
    lastUpdated: new Date().toISOString().split('T')[0],
    source: '5168實價登錄比價王 + 591新建案 + 內政部',
    regions: REGIONS,
    projects: {
      // 這裡應該從實際來源載入資料
    }
  };
  
  // 確保輸出目錄存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 寫入 JSON 檔案
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  
  console.log(`資料已輸出到: ${OUTPUT_FILE}`);
}

async function main() {
  try {
    await fetchData();
    console.log('完成!');
  } catch (error) {
    console.error('錯誤:', error);
    process.exit(1);
  }
}

main();
