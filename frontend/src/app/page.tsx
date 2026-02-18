'use client';

import { useState, useMemo } from 'react';
import presaleData from '@/data/presale.json';

type SortField = 'name' | 'avgPrice' | 'latestPrice' | 'units' | 'size';
type SortOrder = 'asc' | 'desc';

interface Project {
  id: string;
  name: string;
  address: string;
  avgPrice: number | null;
  latestPrice: number | null;
  size: string | null;
  units: number | null;
  age: number | null;
  builder: string | null;
  status: string;
  tags: string[];
  sourceUrl: string;
}

interface Region {
  id: string;
  name: string;
  town: string;
}

export default function Home() {
  const [region, setRegion] = useState<string>('houlong');
  const [sortField, setSortField] = useState<SortField>('latestPrice');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filter, setFilter] = useState<'all' | 'presale' | 'new'>('all');

  const regions = presaleData.regions as Region[];
  const projects = (presaleData.projects as Record<string, Project[]>)[region] || [];

  const filteredAndSorted = useMemo(() => {
    let filtered = projects;
    
    if (filter === 'presale') {
      filtered = filtered.filter(p => p.status === '銷售中' || p.status === '預售');
    } else if (filter === 'new') {
      filtered = filtered.filter(p => p.status === '新成屋' || p.status === '成屋');
    }

    return [...filtered].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'avgPrice':
          aVal = a.avgPrice || 0;
          bVal = b.avgPrice || 0;
          break;
        case 'latestPrice':
          aVal = a.latestPrice || 0;
          bVal = b.latestPrice || 0;
          break;
        case 'units':
          aVal = a.units || 0;
          bVal = b.units || 0;
          break;
        case 'size':
          aVal = a.size ? parseInt(a.size) : 0;
          bVal = b.size ? parseInt(b.size) : 0;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [projects, sortField, sortOrder, filter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-blue-400 ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const avgPrice = filteredAndSorted.length > 0 
    ? (filteredAndSorted.reduce((sum, p) => sum + (p.latestPrice || 0), 0) / filteredAndSorted.filter(p => p.latestPrice).length).toFixed(1)
    : '0';

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
            <h1 className="text-lg font-semibold">苗栗預售屋資訊</h1>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              {presaleData.lastUpdated}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">資料來源:</span>
            <a href="https://community.houseprice.tw" target="_blank" rel="noopener noreferrer" 
               className="text-blue-400 hover:underline">5168實價登錄比價王</a>
          </div>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="border-b border-gray-800 px-6 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-sm mr-2">地區:</span>
        {regions.map(r => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              region === r.id 
                ? 'bg-blue-600 text-white font-medium' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-gray-400">篩選</span>
        </div>
        <div className="flex gap-1">
          {[
            { key: 'all', label: '全部' },
            { key: 'presale', label: '預售屋' },
            { key: 'new', label: '新成屋' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1 text-sm rounded ${
                filter === key 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            共 <span className="text-white font-medium">{filteredAndSorted.length}</span> 筆
          </span>
          <span className="text-gray-500">
            平均單價 <span className="text-yellow-400 font-medium">{avgPrice}</span> 萬/坪
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-6 py-3 font-medium w-8">狀態</th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                建案名稱 <SortIcon field="name" />
              </th>
              <th className="px-6 py-3 font-medium">地址</th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-white text-right" onClick={() => handleSort('latestPrice')}>
                最新單價 <SortIcon field="latestPrice" />
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-white text-right" onClick={() => handleSort('avgPrice')}>
                平均單價 <SortIcon field="avgPrice" />
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-white text-right" onClick={() => handleSort('size')}>
                坪數 <SortIcon field="size" />
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-white text-right" onClick={() => handleSort('units')}>
                戶數 <SortIcon field="units" />
              </th>
              <th className="px-6 py-3 font-medium">建商</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((project, index) => (
              <tr 
                key={project.id} 
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                onClick={() => window.open(project.sourceUrl, '_blank')}
              >
                <td className="px-6 py-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    project.status === '銷售中' || project.status === '預售' ? 'bg-yellow-500' : 
                    project.status === '新成屋' || project.status === '成屋' ? 'bg-green-500' : 'bg-gray-500'
                  }`} title={project.status}></span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-mono w-8">#{index + 1}</span>
                    <span className="font-medium text-white hover:text-blue-400">{project.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-400">{project.address}</td>
                <td className="px-6 py-3 text-right">
                  {project.latestPrice ? (
                    <>
                      <span className="text-yellow-400 font-medium">{project.latestPrice}</span>
                      <span className="text-gray-500 text-xs ml-1">萬/坪</span>
                    </>
                  ) : (
                    <span className="text-gray-500">待詢</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right text-gray-400">
                  {project.avgPrice || '-'}
                </td>
                <td className="px-6 py-3 text-right text-gray-400">{project.size || '-'}</td>
                <td className="px-6 py-3 text-right text-gray-400">
                  {project.units ? `${project.units}戶` : '-'}
                </td>
                <td className="px-6 py-3">
                  <span className="text-gray-400 text-xs">{project.builder || '-'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-500 border-t border-gray-800">
        <p>💡 點擊列可查看詳細資訊 | 🟡 銷售中 | 🟢 新成屋 | ⚪ 待售</p>
        <p className="mt-1">📋 建材資訊需至各建案接待中心索取「建材設備表」</p>
        <p className="mt-1">🔗 內政部實價登錄：https://lvr.land.moi.gov.tw/ | 591新建案：https://newhouse.591.com.tw/</p>
      </div>
    </main>
  );
}
