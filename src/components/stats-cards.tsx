'use client';

import React from 'react';
import { MasterDataKebun, RequestKebun, calculateKebunTotals } from '@/types/database.types';

interface StatsCardsProps {
  masterDataList: MasterDataKebun[];
  requestsList: RequestKebun[];
  regionalFilter?: string;
}

export function StatsCards({ masterDataList, requestsList, regionalFilter }: StatsCardsProps) {
  const filteredMaster = regionalFilter
    ? masterDataList.filter((k) => k.wilayah === regionalFilter)
    : masterDataList;

  const filteredRequests = regionalFilter
    ? requestsList.filter((r) => r.wilayah === regionalFilter)
    : requestsList;

  const totalBaHa = filteredMaster.reduce((sum, item) => sum + (item.luas_ba || 0), 0);

  const totalRegAreaHa = filteredMaster.reduce((sum, item) => {
    const totals = calculateKebunTotals(item);
    return sum + totals.reg_total_area;
  }, 0);

  const totalPenguasaanHa = filteredMaster.reduce((sum, item) => {
    const totals = calculateKebunTotals(item);
    return sum + totals.total_penguasaan;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {/* CARD 1: LUAS BA (HO) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Total Luas BA (HO)</span>
          <p className="text-[11px] text-slate-400">AgriDaM Satgas PKH, 28 days</p>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {totalBaHa.toLocaleString('id-ID', { minimumFractionDigits: 1 })} <span className="text-xs font-bold text-slate-500">Ha</span>
          </div>
        </div>

        {/* Minimal Black/Slate Sparkline SVG */}
        <div className="w-24 h-12">
          <svg viewBox="0 0 100 40" className="w-full h-full text-slate-800 fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
            <path d="M 0 30 Q 15 10, 30 25 T 60 15 T 80 35 T 100 10" />
          </svg>
        </div>
      </div>

      {/* CARD 2: VERIFIKASI REGIONAL */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Verifikasi Regional</span>
          <p className="text-[11px] text-slate-400">Last 28 days, 23 Regionals</p>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {totalRegAreaHa.toLocaleString('id-ID', { minimumFractionDigits: 1 })} <span className="text-xs font-bold text-slate-500">Ha</span>
          </div>
        </div>

        {/* Minimal Black/Slate Sparkline SVG */}
        <div className="w-24 h-12">
          <svg viewBox="0 0 100 40" className="w-full h-full text-slate-800 fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
            <path d="M 0 25 Q 20 5, 40 30 T 70 10 T 85 28 T 100 20" />
          </svg>
        </div>
      </div>

      {/* CARD 3: STATUS PENGUASAAN (APPROVED METRIC -> GREEN ACCENT) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-700">Status Penguasaan Areal</span>
          <p className="text-[11px] text-slate-400">Approved Control, 28 days</p>
          <div className="text-2xl font-extrabold text-emerald-700 tracking-tight mt-1">
            {totalPenguasaanHa.toLocaleString('id-ID', { minimumFractionDigits: 1 })} <span className="text-xs font-bold text-emerald-600">Ha</span>
          </div>
        </div>

        {/* Green Sparkline SVG for Approved Metric */}
        <div className="w-24 h-12">
          <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-600 fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
            <path d="M 0 35 Q 25 15, 50 30 T 75 5 T 90 25 T 100 15" />
          </svg>
        </div>
      </div>
    </div>
  );
}
