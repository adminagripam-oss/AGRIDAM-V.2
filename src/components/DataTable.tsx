'use client';

import React, { useState } from 'react';
import { Search, Plus, FileSpreadsheet, SquarePen, Trash2, CircleCheckIcon, CircleAlertIcon } from 'lucide-react';
import { DEMO_USERS, REGIONAL_LIST } from '@/lib/mock-data';
import { Button } from './ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";


interface DataTableProps {
  data: any[];
  requests?: any[];
  onOpenAdd: () => void;
  onOpenEdit: (item: any) => void;
  onDeleteKebun: (id: string) => void;
}

export function DataTable({
  data,
  onOpenAdd,
  onOpenEdit,
  onDeleteKebun,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionalFilter, setRegionalFilter] = useState('');
  const [croFilter, setCroFilter] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  React.useEffect(() => {
    const key = localStorage.getItem('userKey') || 'ho';
    setCurrentUser(DEMO_USERS[key] || DEMO_USERS.ho);
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notification, setNotification] = useState<{type: 'success' | 'info' | 'destructive', title: string, desc: string} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'info' | 'destructive', title: string, desc: string) => {
    setNotification({ type, title, desc });
    setTimeout(() => setNotification(null), 5000);
  };

  const confirmDelete = (id: string) => {
    onDeleteKebun(id);
    setDeleteConfirmId(null);
    showNotification('destructive', 'Data Dihapus', 'Data kebun berhasil dihapus dari sistem.');
  };

  if (!currentUser) return null;

  const isRegional = currentUser.role === 'regional';
  const activeRegionalFilter = isRegional ? currentUser.regional_name : regionalFilter;

  const tableData = data || [];

  const availableRegionals = croFilter 
    ? REGIONAL_LIST.filter(reg => reg.cro === croFilter) 
    : REGIONAL_LIST;

  const filteredData = tableData.filter((item: any) => {
    const matchesSearch =
      String(item.pt_aktual || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.kode_tag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.pt || '').toLowerCase().includes(searchQuery.toLowerCase());

    const filterVal = activeRegionalFilter.toLowerCase().replace('regional ', '');
    const matchesRegional = !activeRegionalFilter || (item.wilayah && String(item.wilayah).toLowerCase().includes(filterVal));
    const matchesCro = !croFilter || item.cro === croFilter;

    return matchesSearch && matchesRegional && matchesCro;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const tdClass = "py-3 px-4 border-b border-slate-100 min-w-[120px] max-w-[200px] truncate text-slate-600";
  const thClass = "py-3 px-4 border-b border-slate-200 text-left font-semibold text-slate-700 bg-white";

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {notification && (
        <Alert variant={notification.type} className="mb-4 animate-in fade-in slide-in-from-top-4">
          {notification.type === 'success' ? <CircleCheckIcon className="h-4 w-4" /> : <CircleAlertIcon className="h-4 w-4" />}
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.desc}</AlertDescription>
        </Alert>
      )}

      {/* Delete Confirmation Alert */}
      {deleteConfirmId && (
        <Alert variant="info" className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Konfirmasi Hapus</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <span>Apakah Anda yakin ingin menghapus data kebun ini? Tindakan ini tidak dapat dibatalkan.</span>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)} className="bg-white">Batal</Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => confirmDelete(deleteConfirmId)}>
                Ya, Hapus
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              CRO
            </label>
            <select
              value={croFilter}
              onChange={(e) => setCroFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select CRO</option>
              <option value="CRO I">CRO I</option>
              <option value="CRO II">CRO II</option>
              <option value="CRO III">CRO III</option>
              <option value="CRO IV">CRO IV</option>
              <option value="CRO V">CRO V</option>
              <option value="CRO VI">CRO VI</option>
              <option value="CRO VII">CRO VII</option>
              <option value="CRO VIII">CRO VIII</option>
              <option value="CRO IX">CRO IX</option>
              <option value="CRO X">CRO X</option>
              <option value="CRO XI">CRO XI</option>
            </select>
          </div>

          {!isRegional && (
            <div className="w-full sm:w-56">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Regional
              </label>
              <select
                value={regionalFilter}
                onChange={(e) => setRegionalFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select Regional</option>
                {availableRegionals.map(reg => (
                  <option key={reg.key} value={reg.name}>{reg.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search kebun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <Button variant="outline" className="gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Export
          </Button>

          <Button onClick={onOpenAdd} variant="primary" className="shadow-sm px-4 py-2.5 text-xs sm:text-sm gap-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" />
            Tambah Kebun
          </Button>
        </div>
      </div>
      
      {/* Reset Filter Row */}
      {(searchQuery || regionalFilter || croFilter) && (
        <div className="flex justify-end">
          <button 
            onClick={() => {
              setSearchQuery('');
              setRegionalFilter('');
              setCroFilter('');
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto w-full" style={{ maxHeight: "70vh" }}>
          <table className="w-full text-xs text-left whitespace-nowrap border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 z-10">
              <tr>
                <th rowSpan={3} className={thClass}>No</th>
                <th rowSpan={3} className={thClass}>Aksi</th>
                <th rowSpan={3} className={thClass}>CRO</th>
                <th rowSpan={3} className={thClass}>Wilayah</th>
                <th rowSpan={3} className={thClass}>Nama Kebun/PT</th>
                <th rowSpan={3} className={thClass}>Nama Kebun/PT Aktual di Lapangan</th>
                <th rowSpan={3} className={thClass}>Nama Mitra/Vendor</th>
                <th rowSpan={3} className={thClass}>Kode/Tag Kebun</th>
                <th rowSpan={3} className={thClass}>Keterangan</th>
                <th rowSpan={3} className={thClass}>Tahapan</th>
                <th rowSpan={3} className={thClass}>Status</th>
                <th rowSpan={3} className={thClass}>Penjelasan</th>
                <th colSpan={10} className={thClass}>Luas Participatory Mapping & Drone (Ha) data Head Office PT Agrinas Palma Nusantara</th>
                <th colSpan={7} className={thClass}>Verifikasi Regional(Ha)</th>
                <th colSpan={9} className={thClass}>Pengusaan Areal Planted (Ha)</th>
                <th rowSpan={3} className={thClass}>Provinsi</th>
                <th rowSpan={3} className={thClass}>Kabupaten</th>
                <th colSpan={8} className={thClass}>Planted Dikelola atau Dipanen</th>
              </tr>
              <tr>
                <th rowSpan={2} className={thClass}>BA</th>
                <th rowSpan={2} className={thClass}>SHP Awal</th>
                <th rowSpan={2} className={thClass}>Planted Sawit Inti</th>
                <th rowSpan={2} className={thClass}>Planted Sawit Plasma</th>
                <th rowSpan={2} className={thClass}>Planted Sawit Masyarakat</th>
                <th rowSpan={2} className={thClass}>Total Planted Sawit</th>
                <th rowSpan={2} className={thClass}>TBM</th>
                <th rowSpan={2} className={thClass}>Areal Lain-lain</th>
                <th rowSpan={2} className={thClass}>Total Areal Verifikasi</th>
                <th rowSpan={2} className={thClass}>Selisih Verifikasi (BA - Verif)</th>
                
                <th rowSpan={2} className={thClass}>Planted Sawit Inti</th>
                <th rowSpan={2} className={thClass}>Planted Sawit Plasma</th>
                <th rowSpan={2} className={thClass}>Planted Sawit Masyarakat</th>
                <th rowSpan={2} className={thClass}>Total Planted Sawit</th>
                <th rowSpan={2} className={thClass}>TBM</th>
                <th rowSpan={2} className={thClass}>Areal Lain-lain</th>
                <th rowSpan={2} className={thClass}>Total Area</th>

                <th colSpan={2} className={thClass}>Inti</th>
                <th colSpan={2} className={thClass}>Plasma</th>
                <th colSpan={2} className={thClass}>Masyarakat</th>
                <th colSpan={2} className={thClass}>TBM</th>
                <th rowSpan={2} className={thClass}>Total</th>

                <th colSpan={2} className={thClass}>Inti</th>
                <th colSpan={2} className={thClass}>Plasma</th>
                <th colSpan={2} className={thClass}>Masyarakat</th>
                <th colSpan={2} className={thClass}>TBM</th>
              </tr>
              <tr>
                <th className={thClass}>Dikuasai</th>
                <th className={thClass}>Tidak Dikuasai</th>
                <th className={thClass}>Dikuasai</th>
                <th className={thClass}>Tidak Dikuasai</th>
                <th className={thClass}>Dikuasai</th>
                <th className={thClass}>Tidak Dikuasai</th>
                <th className={thClass}>Dikuasai</th>
                <th className={thClass}>Tidak Dikuasai</th>

                <th className={thClass}>Luas (Ha)</th>
                <th className={thClass}>Jumlah Pokok</th>
                <th className={thClass}>Luas (Ha)</th>
                <th className={thClass}>Jumlah Pokok</th>
                <th className={thClass}>Luas (Ha)</th>
                <th className={thClass}>Jumlah Pokok</th>
                <th className={thClass}>Luas (Ha)</th>
                <th className={thClass}>Jumlah Pokok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={47} className="py-12 text-center text-slate-500">
                    Tidak ada data kebun.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className={tdClass}>{item.no}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onOpenEdit(item)} className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-8 w-8 shadow-sm transition-colors" title="Edit Kebun">
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirmId(String(item.id || item.no))} className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 h-8 w-8 shadow-sm transition-colors" title="Hapus Kebun">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className={tdClass}>{item.cro}</td>
                    <td className={tdClass}>{item.wilayah}</td>
                    <td className={tdClass}>{item.pt}</td>
                    <td className={tdClass}>{item.pt_aktual}</td>
                    <td className={tdClass}>{item.vendor || '-'}</td>
                    <td className={tdClass}>{item.kode_tag}</td>
                    <td className={tdClass}>{item.ket || '-'}</td>
                    <td className={tdClass}>{item.tahap}</td>
                    <td className={tdClass}>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        item.status === 'KSO' ? 'bg-amber-100 text-amber-800' : 
                        item.status === 'Kelola Mandiri' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {item.status || '-'}
                      </span>
                    </td>
                    <td className={tdClass} title={item.penjelasan}>{item.penjelasan || '-'}</td>
                    
                    <td className={tdClass}>{item.pm_ba}</td>
                    <td className={tdClass}>{item.pm_shp}</td>
                    <td className={tdClass}>{item.pm_inti}</td>
                    <td className={tdClass}>{item.pm_plasma}</td>
                    <td className={tdClass}>{item.pm_masyarakat}</td>
                    <td className={tdClass}>{item.pm_total}</td>
                    <td className={tdClass}>{item.pm_tbm}</td>
                    <td className={tdClass}>{item.pm_lain}</td>
                    <td className={tdClass}>{item.pm_total_verif}</td>
                    <td className={tdClass}>{item.pm_selisih}</td>

                    <td className={tdClass}>{item.vr_inti}</td>
                    <td className={tdClass}>{item.vr_plasma}</td>
                    <td className={tdClass}>{item.vr_masyarakat}</td>
                    <td className={tdClass}>{item.vr_total}</td>
                    <td className={tdClass}>{item.vr_tbm}</td>
                    <td className={tdClass}>{item.vr_lain}</td>
                    <td className={tdClass}>{item.vr_total_area}</td>

                    <td className={tdClass}>{item.penguasaan_inti_di}</td>
                    <td className={tdClass}>{item.penguasaan_inti_td}</td>
                    <td className={tdClass}>{item.penguasaan_plasma_di}</td>
                    <td className={tdClass}>{item.penguasaan_plasma_td}</td>
                    <td className={tdClass}>{item.penguasaan_masyarakat_di}</td>
                    <td className={tdClass}>{item.penguasaan_masyarakat_td}</td>
                    <td className={tdClass}>{item.penguasaan_tbm_di}</td>
                    <td className={tdClass}>{item.penguasaan_tbm_td}</td>
                    <td className={tdClass}>{item.penguasaan_total}</td>

                    <td className={tdClass}>{item.prov}</td>
                    <td className={tdClass}>{item.kab}</td>

                    <td className={tdClass}>{item.pd_inti_luas}</td>
                    <td className={tdClass}>{item.pd_inti_pokok}</td>
                    <td className={tdClass}>{item.pd_plasma_luas}</td>
                    <td className={tdClass}>{item.pd_plasma_pokok}</td>
                    <td className={tdClass}>{item.pd_masyarakat_luas}</td>
                    <td className={tdClass}>{item.pd_masyarakat_pokok}</td>
                    <td className={tdClass}>{item.pd_tbm_luas}</td>
                    <td className={tdClass}>{item.pd_tbm_pokok}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between sticky bottom-0">
          <div className="flex items-center gap-3">
             <span className="text-sm text-slate-500">Rows per page:</span>
             <select
               value={rowsPerPage}
               onChange={(e) => {
                 setRowsPerPage(Number(e.target.value));
                 setCurrentPage(1);
               }}
               className="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
             >
               <option value={10}>10</option>
               <option value={100}>100</option>
               <option value={1000}>1000</option>
             </select>
          </div>
          <div className="text-sm text-slate-500">
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="px-3 py-1.5 text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
