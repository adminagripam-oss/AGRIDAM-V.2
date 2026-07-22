'use client';

import React, { useState, useEffect } from 'react';
import { MasterDataKebun } from '@/types/database.types';
import { supabase } from '@/lib/supabaseClient';
import { INITIAL_MASTER_DATA, DEMO_USERS } from '@/lib/mock-data';
import { Download, TrendingUp, TrendingDown, MapPin, BarChart3, Users, Building2, Trees } from 'lucide-react';
import { exportToCSV } from '@/lib/export-utils';

export default function ExecutiveDashboardPage() {
  const [masterData, setMasterData] = useState<MasterDataKebun[]>(INITIAL_MASTER_DATA);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem('userKey') || 'exec';
    setCurrentUser(DEMO_USERS[key as keyof typeof DEMO_USERS] || DEMO_USERS.exec);

    // Initial load from local
    const storedMaster = localStorage.getItem('masterData');
    if (storedMaster) setMasterData(JSON.parse(storedMaster));

    // Async sync from Supabase if active
    if (supabase) {
      supabase.from('master_data_kebun').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setMasterData(data as MasterDataKebun[]);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!currentUser) return null;

  // --- Analytics Calculations ---
  const totalKebun = masterData.length;
  const totalLuasBA = masterData.reduce((sum, item) => sum + (item.luas_ba || 0), 0);
  
  // Total aktual penguasaan = jumlah total dari dikuasai di semua kebun
  const totalLuasDikuasai = masterData.reduce((sum, item) => {
    return sum + (item.inti_dikuasai || 0) + (item.plasma_dikuasai || 0) + (item.masyarakat_dikuasai || 0) + (item.tbm_dikuasai || 0);
  }, 0);

  const totalLuasVerif = masterData.reduce((sum, item) => {
    return sum + (item.reg_planted_inti || 0) + (item.reg_planted_plasma || 0) + (item.reg_planted_masyarakat || 0) + (item.reg_tbm || 0) + (item.reg_areal_lain || 0);
  }, 0);

  const totalSelisih = masterData.reduce((sum, item) => {
    const hoVerif = (item.ho_planted_inti || 0) + (item.ho_planted_plasma || 0) + (item.ho_planted_masyarakat || 0) + (item.ho_tbm || 0) + (item.ho_areal_lain || 0);
    return sum + ((item.luas_ba || 0) - hoVerif);
  }, 0);
  const avgSelisih = totalKebun > 0 ? (totalSelisih / totalKebun) : 0;

  // Status Distribution
  const statusCounts = masterData.reduce((acc, item) => {
    const s = item.status || 'Belum Dikelola';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    exportToCSV(masterData, 'Laporan_Master_Data_Kebun_Nasional');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Ringkasan penguasaan lahan dan KPI verifikasi nasional.</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-slate-900 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Data (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Unit Kebun</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{totalKebun}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPin className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">100%</span> tercatat
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Luas BA Satgas (HO)</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{totalLuasBA.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Ha</span></h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BarChart3 className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            Baseline Nasional
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Luas Aktual Dikuasai</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">{totalLuasDikuasai.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Ha</span></h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Trees className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            Dari {totalLuasVerif.toLocaleString('id-ID')} Ha terverifikasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-rata Selisih BA</p>
              <h3 className={`text-3xl font-black mt-2 ${avgSelisih > 0 ? 'text-amber-600' : avgSelisih < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {avgSelisih > 0 ? '+' : ''}{avgSelisih.toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-sm font-medium text-slate-500">Ha</span>
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${avgSelisih > 0 ? 'bg-amber-50 text-amber-600' : avgSelisih < 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              {avgSelisih >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            Per unit kebun
          </div>
        </div>
      </div>

      {/* Grid for Charts/Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm col-span-1 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" /> Distribusi Status Operasional
          </h2>
          <div className="space-y-5">
            {['Dikelola Sendiri', 'Kelola Mandiri', 'KSO', 'Belum Dikelola'].map(status => {
              const count = statusCounts[status] || 0;
              const percent = totalKebun > 0 ? Math.round((count / totalKebun) * 100) : 0;
              let barColor = 'bg-slate-200';
              if (status === 'Dikelola Sendiri' || status === 'Kelola Mandiri') barColor = 'bg-emerald-500';
              if (status === 'KSO') barColor = 'bg-blue-500';
              if (status === 'Belum Dikelola') barColor = 'bg-slate-300';

              return (
                <div key={status}>
                  <div className="flex justify-between text-[13px] font-medium mb-1.5">
                    <span className="text-slate-700">{status}</span>
                    <span className="text-slate-900">{count} Unit ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> Top Regional (Berdasarkan Luas Dikuasai)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider">Wilayah / CRO</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-right">Unit Kebun</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-right">Luas Verifikasi (Ha)</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-right">Luas Dikuasai (Ha)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(
                  masterData.reduce((acc, item) => {
                    const key = item.wilayah;
                    if (!acc[key]) acc[key] = { cro: item.cro, count: 0, verif: 0, dikuasai: 0 };
                    acc[key].count += 1;
                    acc[key].verif += (item.reg_planted_inti || 0) + (item.reg_planted_plasma || 0) + (item.reg_planted_masyarakat || 0) + (item.reg_tbm || 0) + (item.reg_areal_lain || 0);
                    acc[key].dikuasai += (item.inti_dikuasai || 0) + (item.plasma_dikuasai || 0) + (item.masyarakat_dikuasai || 0) + (item.tbm_dikuasai || 0);
                    return acc;
                  }, {} as Record<string, { cro: string, count: number, verif: number, dikuasai: number }>)
                )
                .sort((a, b) => b[1].dikuasai - a[1].dikuasai)
                .slice(0, 5)
                .map(([wilayah, data], i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{wilayah}</div>
                      <div className="text-xs text-slate-500">{data.cro}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">{data.count}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">{data.verif.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{data.dikuasai.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
