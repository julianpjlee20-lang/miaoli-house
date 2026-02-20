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
  floor: string;
  totalFloors: string;
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
  floor: string;
  transactionDate: string;
}

// Theme tokens
const themes = {
  dark: {
    bgPrimary: '#0D0D0F',
    bgSecondary: '#141417',
    bgTertiary: '#1A1A1E',
    border: '#2A2A30',
    borderSubtle: '#1E1E23',
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8A8E',
    textTertiary: '#5C5C60',
    accent: '#5E6AD2',
    accentHover: '#6F7BE8',
    success: '#32D583',
  },
  light: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FA',
    bgTertiary: '#F1F3F5',
    border: '#E9ECEF',
    borderSubtle: '#DEE2E6',
    textPrimary: '#1A1A1E',
    textSecondary: '#6C757D',
    textTertiary: '#ADB5BD',
    accent: '#5E6AD2',
    accentHover: '#4A5AB9',
    success: '#32D583',
  }
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const t = themes[theme];

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('/api/transactions?type=all');
        const result = await response.json();
        
        const allData = [
          ...(result.sales || []).map((s: any) => ({ ...s, type: 'sale' })),
          ...(result.presales || []).map((p: any) => ({ ...p, type: 'presale' }))
        ];
        
        const found = allData.find((item: any) => 
          item.id === parseInt(id) || 
          (item.projectName && item.projectName.includes(decodeURIComponent(id)))
        );
        
        setData(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const formatPrice = (price: number) => {
    if (!price) return '—';
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: t.bgPrimary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 20, height: 20, border: `2px solid ${t.border}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ backgroundColor: t.bgPrimary, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.textSecondary }}>
        <p style={{ fontSize: 18 }}>找不到此物件</p>
        <a href="/" style={{ color: t.accent, marginTop: 12 }}>← 返回列表</a>
      </div>
    );
  }

  const isPresale = data.type === 'presale';

  return (
    <div style={{ backgroundColor: t.bgPrimary, minHeight: '100vh', fontFamily: '"Inter", -apple-system, sans-serif', color: t.textPrimary }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bgSecondary, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: t.textPrimary, fontSize: 18, fontWeight: 600 }}>← 返回</a>
        <button onClick={toggleTheme} style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.textPrimary, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {theme === 'dark' ? '☀️ 亮色' : '🌙 暗色'}
        </button>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ 
            background: t.accent + '20', 
            color: t.accent, 
            padding: '4px 12px', 
            borderRadius: 4, 
            fontSize: 12, 
            fontWeight: 500 
          }}>
            {isPresale ? '預售屋' : '買賣成交'}
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '16px 0 8px' }}>
            {isPresale ? data.projectName : data.address}
          </h1>
          <p style={{ color: t.textSecondary, fontSize: 14 }}>{formatDate(data.transactionDate)}</p>
        </div>

        {/* Price Card */}
        <div style={{ backgroundColor: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <p style={{ color: t.textSecondary, fontSize: 12, textTransform: 'uppercase', margin: 0 }}>總價</p>
          <p style={{ fontSize: 36, fontWeight: 700, color: t.success, margin: '8px 0 0' }}>
            {formatPrice(isPresale ? data.totalPrice : data.price)}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: '單價', value: isPresale 
              ? (data.unitPrice ? formatPrice(data.unitPrice) + '/坪' : '—')
              : (data.pricePerPing ? formatPrice(data.pricePerPing) + '/坪' : '—')
            },
            { label: '面積', value: (isPresale ? data.area : data.areaBuilding) ? `${(isPresale ? data.area : data.areaBuilding)?.toFixed(2)} 坪` : '—' },
            { label: '土地面積', value: data.areaLand ? `${data.areaLand.toFixed(2)} 坪` : '—' },
            { label: '樓層', value: data.floor || '—' },
            { label: '總樓層', value: data.totalFloors || '—' },
            { label: '類型', value: data.buildingType || '—' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px' }}>
              <p style={{ color: t.textSecondary, fontSize: 11, textTransform: 'uppercase', margin: 0 }}>{item.label}</p>
              <p style={{ color: t.textPrimary, fontSize: 16, fontWeight: 500, margin: '4px 0 0' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Address */}
        <div style={{ backgroundColor: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px' }}>
          <p style={{ color: t.textSecondary, fontSize: 11, textTransform: 'uppercase', margin: 0 }}>地址</p>
          <p style={{ color: t.textPrimary, fontSize: 14, margin: '4px 0 0' }}>{data.address || '—'}</p>
        </div>
      </main>
    </div>
  );
}
