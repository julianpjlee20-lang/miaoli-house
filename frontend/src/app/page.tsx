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

// Linear-style colors
const colors = {
  bg: '#0D0D0F',
  card: '#1C1C1E',
  cardHover: '#252528',
  border: '#2C2C2E',
  text: '#EDEDEF',
  textSecondary: '#8A8A8E',
  accent: '#5E6AD2',
  accentHover: '#6F7BE8',
  green: '#32D583',
  blue: '#5E6AD2',
};

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
    if (!price || price === 0) return '-';
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatArea = (area: number) => {
    if (!area || area === 0) return '-';
    return area.toFixed(2) + ' 坪';
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 32, height: 32, 
            border: '3px solid ' + colors.border, 
            borderTopColor: colors.accent, 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: colors.textSecondary, marginTop: 16, fontSize: 14 }}>載入資料中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#FF6B6B' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        borderBottom: `1px solid ${colors.border}`, 
        backgroundColor: colors.card,
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ 
            color: colors.text, 
            fontSize: 24, 
            fontWeight: 600, 
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            苗栗縣後龍鎮 · 不動產交易資料
          </h1>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: 14, 
            margin: '8px 0 0 0' 
          }}>
            內政部實價登錄 · 2025年
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 24,
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: 0
        }}>
          <button
            onClick={() => setActiveTab('sale')}
            style={{
              background: activeTab === 'sale' ? colors.accent : 'transparent',
              color: activeTab === 'sale' ? '#fff' : colors.textSecondary,
              border: 'none',
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: -1,
              borderBottom: activeTab === 'sale' ? `2px solid ${colors.accent}` : '2px solid transparent'
            }}
          >
            買賣成交 ({sales.length})
          </button>
          <button
            onClick={() => setActiveTab('presale')}
            style={{
              background: activeTab === 'presale' ? colors.accent : 'transparent',
              color: activeTab === 'presale' ? '#fff' : colors.textSecondary,
              border: 'none',
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: -1,
              borderBottom: activeTab === 'presale' ? `2px solid ${colors.accent}` : '2px solid transparent'
            }}
          >
            預售屋 ({presales.length})
          </button>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16, 
          marginBottom: 32 
        }}>
          <div style={{ 
            backgroundColor: colors.card, 
            border: `1px solid ${colors.border}`, 
            borderRadius: 12, 
            padding: 20 
          }}>
            <p style={{ color: colors.textSecondary, fontSize: 13, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              總交易筆數
            </p>
            <p style={{ color: colors.text, fontSize: 28, fontWeight: 600, margin: '8px 0 0 0' }}>
              {activeTab === 'sale' ? sales.length : presales.length}
            </p>
          </div>
          <div style={{ 
            backgroundColor: colors.card, 
            border: `1px solid ${colors.border}`, 
            borderRadius: 12, 
            padding: 20 
          }}>
            <p style={{ color: colors.textSecondary, fontSize: 13, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              平均價格
            </p>
            <p style={{ color: colors.green, fontSize: 28, fontWeight: 600, margin: '8px 0 0 0' }}>
              {activeTab === 'sale' 
                ? formatPrice(sales.reduce((a, b) => a + b.price, 0) / (sales.length || 1))
                : formatPrice(presales.reduce((a, b) => a + b.totalPrice, 0) / (presales.length || 1))
              }
            </p>
          </div>
          <div style={{ 
            backgroundColor: colors.card, 
            border: `1px solid ${colors.border}`, 
            borderRadius: 12, 
            padding: 20 
          }}>
            <p style={{ color: colors.textSecondary, fontSize: 13, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              最高價格
            </p>
            <p style={{ color: colors.text, fontSize: 28, fontWeight: 600, margin: '8px 0 0 0' }}>
              {activeTab === 'sale'
                ? formatPrice(Math.max(...sales.map(s => s.price), 0))
                : formatPrice(Math.max(...presales.map(p => p.totalPrice), 0))
              }
            </p>
          </div>
        </div>

        {/* List */}
        <div style={{ 
          backgroundColor: colors.card, 
          border: `1px solid ${colors.border}`, 
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          {activeTab === 'sale' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>地址</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>類型</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>面積</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>總價</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>單價</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>日期</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((record) => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background 0.15s' }}>
                    <td style={{ padding: '16px 20px', color: colors.text, fontSize: 14 }}>{record.address || '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13 }}>{record.buildingType || '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{formatArea(record.areaBuilding)}</td>
                    <td style={{ padding: '16px 20px', color: colors.green, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{formatPrice(record.price)}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{record.pricePerPing > 0 ? formatPrice(record.pricePerPing) + '/坪' : '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{formatDate(record.transactionDate)}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>尚無資料</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>建案名稱</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>地址</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>面積</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>總價</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>單價</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', color: colors.textSecondary, fontSize: 12, fontWeight: 500, textTransform: 'uppercase' }}>日期</th>
                </tr>
              </thead>
              <tbody>
                {presales.map((record) => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '16px 20px', color: colors.accent, fontSize: 14, fontWeight: 500 }}>{record.projectName || '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.text, fontSize: 13 }}>{record.address || '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{formatArea(record.area)}</td>
                    <td style={{ padding: '16px 20px', color: colors.blue, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{formatPrice(record.totalPrice)}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{record.unitPrice > 0 ? formatPrice(record.unitPrice) + '/坪' : '-'}</td>
                    <td style={{ padding: '16px 20px', color: colors.textSecondary, fontSize: 13, textAlign: 'right' }}>{formatDate(record.transactionDate)}</td>
                  </tr>
                ))}
                {presales.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>尚無資料</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '32px 0', 
          color: colors.textSecondary, 
          fontSize: 12 
        }}>
          資料來源：內政部不動產交易實價查詢服務網 · 2025年
        </footer>
      </main>
    </div>
  );
}
