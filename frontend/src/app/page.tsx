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

// Linear design tokens
const tokens = {
  // Background colors
  bgPrimary: '#0D0D0F',
  bgSecondary: '#141417',
  bgTertiary: '#1A1A1E',
  bgElevated: '#222226',
  
  // Border colors
  border: '#2A2A30',
  borderSubtle: '#1E1E23',
  
  // Text colors  
  textPrimary: '#FFFFFF',
  textSecondary: '#8A8A8E',
  textTertiary: '#5C5C60',
  
  // Accent - Linear purple
  accent: '#5E6AD2',
  accentHover: '#6F7BE8',
  accentMuted: 'rgba(94, 106, 210, 0.15)',
  
  // Status colors
  success: '#32D583',
  warning: '#F5A623',
  error: '#FF6B6B',
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
      try {
        const response = await fetch('/api/transactions?type=all');
        const result = await response.json();
        if (result.sales) setSales(result.sales);
        if (result.presales) setPresales(result.presales);
      } catch (err) {
        setError('無法載入資料');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    if (!price) return '—';
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  };

  const avgPrice = activeTab === 'sale' 
    ? (sales.reduce((a, b) => a + b.price, 0) / (sales.length || 1))
    : (presales.reduce((a, b) => a + b.totalPrice, 0) / (presales.length || 1));

  const maxPrice = activeTab === 'sale'
    ? Math.max(...sales.map(s => s.price), 0)
    : Math.max(...presales.map(p => p.totalPrice), 0);

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: tokens.bgPrimary, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{ 
          width: 20, height: 20, 
          border: '2px solid ' + tokens.border, 
          borderTopColor: tokens.accent, 
          borderRadius: '50%', 
          animation: 'spin 0.8s linear infinite' 
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: tokens.bgPrimary, 
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: tokens.textPrimary,
      lineHeight: 1.5
    }}>
      {/* Header */}
      <header style={{ 
        borderBottom: `1px solid ${tokens.border}`, 
        backgroundColor: tokens.bgSecondary,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 18, 
            fontWeight: 600, 
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            苗栗縣後龍鎮 · 不動產交易資料
          </h1>
          <p style={{ color: tokens.textSecondary, fontSize: 13, margin: '4px 0 0 0' }}>
            內政部實價登錄 · 2025年
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Tabs - Linear style */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {[
            { key: 'sale', label: '買賣成交', count: sales.length },
            { key: 'presale', label: '預售屋', count: presales.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                background: activeTab === tab.key ? tokens.accentMuted : 'transparent',
                color: activeTab === tab.key ? tokens.accent : tokens.textSecondary,
                border: activeTab === tab.key ? `1px solid ${tokens.accent}` : '1px solid transparent',
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
              <span style={{ 
                marginLeft: 6, 
                fontSize: 12, 
                opacity: 0.7 
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Stats - Linear cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: '總筆數', value: activeTab === 'sale' ? sales.length : presales.length },
            { label: '平均價格', value: formatPrice(avgPrice) },
            { label: '最高價格', value: formatPrice(maxPrice) }
          ].map((stat, i) => (
            <div key={i} style={{ 
              backgroundColor: tokens.bgSecondary, 
              border: `1px solid ${tokens.border}`, 
              borderRadius: 8, 
              padding: '16px 20px'
            }}>
              <p style={{ color: tokens.textSecondary, fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </p>
              <p style={{ color: tokens.textPrimary, fontSize: 20, fontWeight: 600, margin: '4px 0 0 0' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table - Linear style */}
        <div style={{ 
          backgroundColor: tokens.bgSecondary, 
          border: `1px solid ${tokens.border}`, 
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: tokens.textSecondary, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeTab === 'sale' ? '地址' : '建案'}
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: tokens.textSecondary, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  類型
                </th>
                <th style={{ textAlign: 'right', padding: '12px 16px', color: tokens.textSecondary, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  面積
                </th>
                <th style={{ textAlign: 'right', padding: '12px 16px', color: tokens.textSecondary, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  價格
                </th>
                <th style={{ textAlign: 'right', padding: '12px 16px', color: tokens.textSecondary, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  日期
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'sale' ? (
                sales.map((record) => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${tokens.borderSubtle}` }}>
                    <td style={{ padding: '14px 16px', color: tokens.textPrimary, fontWeight: 500 }}>{record.address || '—'}</td>
                    <td style={{ padding: '14px 16px', color: tokens.textSecondary, fontSize: 12 }}>{record.buildingType || '—'}</td>
                    <td style={{ padding: '14px 16px', color: tokens.textSecondary, textAlign: 'right', fontSize: 12 }}>
                      {record.areaBuilding ? record.areaBuilding.toFixed(1) + ' 坪' : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: tokens.success, fontWeight: 600, textAlign: 'right', fontSize: 13 }}>
                      {formatPrice(record.price)}
                    </td>
                    <td style={{ padding: '14px 16px', color: tokens.textTertiary, textAlign: 'right', fontSize: 12 }}>
                      {formatDate(record.transactionDate)}
                    </td>
                  </tr>
                ))
              ) : (
                presales.map((record) => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${tokens.borderSubtle}` }}>
                    <td style={{ padding: '14px 16px', color: tokens.accent, fontWeight: 500 }}>{record.projectName || '—'}</td>
                    <td style={{ padding: '14px 16px', color: tokens.textSecondary, fontSize: 12 }}>{record.address || '—'}</td>
                    <td style={{ padding: '14px 16px', color: tokens.textSecondary, textAlign: 'right', fontSize: 12 }}>
                      {record.area ? record.area.toFixed(1) + ' 坪' : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: tokens.accent, fontWeight: 600, textAlign: 'right', fontSize: 13 }}>
                      {formatPrice(record.totalPrice)}
                    </td>
                    <td style={{ padding: '14px 16px', color: tokens.textTertiary, textAlign: 'right', fontSize: 12 }}>
                      {formatDate(record.transactionDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer style={{ textAlign: 'center', padding: '32px 0', color: tokens.textTertiary, fontSize: 11 }}>
          資料來源：內政部不動產交易實價查詢服務網
        </footer>
      </main>
    </div>
  );
}
