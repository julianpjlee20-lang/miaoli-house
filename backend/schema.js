/**
 * PocketBase Schema 初始化
 * 
 * 這個腳本定義了資料庫的 schema
 * 使用方式：
 * 1. 先啟動 PocketBase
 * 2. 登入管理員帳號
 * 3. 創建 collection
 */

export const collections = [
  // 用戶收藏
  {
    name: 'favorites',
    type: 'base',
    schema: [
      { name: 'user', type: 'relation', required: true, collectionId: 'users' },
      { name: 'project_id', type: 'text', required: true },
      { name: 'project_name', type: 'text', required: true },
      { name: 'region', type: 'text', required: true },
    ]
  },
  
  // 用戶設定
  {
    name: 'user_settings',
    type: 'base',
    schema: [
      { name: 'user', type: 'relation', required: true, collectionId: 'users' },
      { name: 'default_region', type: 'text' },
      { name: 'notifications', type: 'bool', default: true },
    ]
  },
  
  // 價格警示
  {
    name: 'price_alerts',
    type: 'base',
    schema: [
      { name: 'user', type: 'relation', required: true, collectionId: 'users' },
      { name: 'project_id', type: 'text', required: true },
      { name: 'target_price', type: 'number', required: true },
      { name: 'triggered', type: 'bool', default: false },
    ]
  },
  
  // 最後更新時間
  {
    name: 'metadata',
    type: 'base',
    schema: [
      { name: 'key', type: 'text', required: true, unique: true },
      { name: 'value', type: 'text' },
      { name: 'updated_at', type: 'date' },
    ]
  }
];

export default collections;
