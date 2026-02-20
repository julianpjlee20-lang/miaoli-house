'use client';

import { useState, useEffect } from 'react';

interface SaleRecord {
  id: number;
  address: string;
  buildingType: string;
  areaBuilding: number;
  areaLand: number;
  price: number;
  pricePerPing: number;
  transactionDate: string;
  transactionType: string;
}

interface PresaleRecord {
  id: number;
  projectName: string;
  address: string;
  unitPrice: number;
  totalPrice: number;
  area: number;
  transactionDate: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'sale' | 'presale'>('sale');
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [presales, setPresales] = useState<PresaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 從 Zeabur PostgreSQL API 獲取資料
        const response = await fetch('/api/transactions?type=all');
        const result = await response.json();
        
        if (result.sales) {
          setSales(result.sales);
        }
        if (result.presales) {
          setPresales(result.presales);
        }
      } catch (err) {
        console.error('Failed to fetch:', err);
        setError('無法載入資料');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入資料中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            苗栗縣後龍鎮 - 不動產交易資料
          </h1>
          <p className="mt-2 text-gray-600">
            資料來源：內政部實價登錄 (2025年)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 標籤切換 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('sale')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'sale'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                買賣成交 ({sales.length}筆)
              </button>
              <button
                onClick={() => setActiveTab('presale')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'presale'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                預售屋 ({presales.length}筆)
              </button>
            </nav>
          </div>
        </div>

        {/* 買賣成交列表 */}
        {activeTab === 'sale' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {sales.map((record) => (
                <li key={record.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {record.address || '-'}
                      </p>
                      <p className="text-sm text-gray-500">
                        類型：{record.buildingType || '-'} |
                        面積：{record.areaBuilding ? record.areaBuilding.toFixed(2) : '-'} ㎡
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(record.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.pricePerPing ? formatPrice(record.pricePerPing) + '/坪' : '-'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(record.transactionDate)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {sales.length === 0 && (
                <li className="px-6 py-4 text-center text-gray-500">
                  尚無買賣成交資料
                </li>
              )}
            </ul>
          </div>
        )}

        {/* 預售屋列表 */}
        {activeTab === 'presale' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {presales.map((record) => (
                <li key={record.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {record.projectName || '-'}
                      </p>
                      <p className="text-sm text-gray-500">
                        地址：{record.address || '-'} |
                        面積：{record.area ? record.area.toFixed(2) : '-'} ㎡
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(record.totalPrice)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.unitPrice ? formatPrice(record.unitPrice) + '/坪' : '-'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(record.transactionDate)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {presales.length === 0 && (
                <li className="px-6 py-4 text-center text-gray-500">
                  尚無預售屋資料
                </li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
