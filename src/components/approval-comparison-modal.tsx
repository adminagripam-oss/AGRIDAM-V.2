'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, FileDiff } from 'lucide-react';
import { RequestKebun, MasterDataKebun, calculateKebunTotals } from '@/types/database.types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";

interface ApprovalComparisonModalProps {
  isOpen: boolean;
  request: RequestKebun | null;
  masterKebun: MasterDataKebun | null;
  onClose: () => void;
  onApprove: (request: RequestKebun) => void;
  onOpenRejectModal: (request: RequestKebun) => void;
}

export function ApprovalComparisonModal({
  isOpen,
  request,
  masterKebun,
  onClose,
  onApprove,
  onOpenRejectModal
}: ApprovalComparisonModalProps) {
  if (!request) return null;

  const isUpdate = request.request_type === 'UPDATE' && masterKebun;

  const reqTotals = calculateKebunTotals(request);
  const masterTotals = masterKebun ? calculateKebunTotals(masterKebun) : null;

  const isChanged = (field: keyof MasterDataKebun) => {
    if (!isUpdate || !masterKebun) return false;
    return String((request as any)[field]) !== String((masterKebun as any)[field]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-white text-slate-900 border-l border-slate-200 shadow-xl">
        <SheetHeader className="pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-slate-900 text-lg font-bold">
              Review Pengajuan Maker ({request.request_type === 'CREATE' ? 'Tambah Kebun Baru' : 'Update Data Kebun'})
            </SheetTitle>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
              PENDING APPROVAL HO
            </span>
          </div>
          <SheetDescription className="text-slate-600 text-xs mt-1">
            Diajukan oleh: <span className="font-semibold text-slate-900">{request.requested_by_name || request.wilayah}</span> ({request.cro})
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isUpdate ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <strong>Side-by-Side Inspection Mode:</strong> Baris yang ditandai warna kuning/hijau menandakan data usulan mengalami perubahan dari Master Data eksisting.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <strong>Pengajuan Kebun Baru:</strong> Menyetujui pengajuan ini akan secara otomatis mendaftarkan kebun ke dalam Master Data HO.
              </div>
            </div>
          )}

          {/* Section 1: Identifikasi Kebun */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Identifikasi & Status Legal Kebun
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">CRO & Wilayah</span>
                <span className="font-semibold text-slate-900">{request.cro} — {request.wilayah}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Kode / Tag Kebun</span>
                <span className="font-mono font-bold text-slate-900">{request.kode_tag_kebun || '-'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Nama Kebun / PT</span>
                <span className="font-bold text-slate-900">{request.nama_kebun_aktual || '-'}</span>
                {request.nama_kebun_pt && request.nama_kebun_pt !== request.nama_kebun_aktual && (
                  <span className="text-[10px] text-slate-500 block">Legal: {request.nama_kebun_pt}</span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Mitra / Vendor & Status</span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{request.nama_mitra_vendor || '-'}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                    {request.status} ({request.tahapan})
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Penjelasan & Keterangan</span>
                <p className="text-slate-700 leading-relaxed">{request.penjelasan || request.keterangan || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Hectare Table Comparison */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
              Tabel Perbandingan Luasan Hektar (Ha)
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Kategori Data Hektar</th>
                    {isUpdate && <th className="py-2.5 px-4 text-right text-slate-500">Master Eksisting (Ha)</th>}
                    <th className="py-2.5 px-4 text-right text-emerald-700">Diusulkan Maker (Ha)</th>
                    {isUpdate && <th className="py-2.5 px-4 text-center">Selisih</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {/* BA */}
                  <tr className={isChanged('luas_ba') ? 'bg-amber-50 font-semibold' : ''}>
                    <td className="py-2.5 px-4 font-medium">Luas BA Satgas PKH (HO)</td>
                    {isUpdate && <td className="py-2.5 px-4 text-right font-mono text-slate-500">{masterKebun?.luas_ba.toFixed(2)}</td>}
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{request.luas_ba.toFixed(2)}</td>
                    {isUpdate && <td className="py-2.5 px-4 text-center font-mono">{(request.luas_ba - (masterKebun?.luas_ba || 0)).toFixed(2)}</td>}
                  </tr>

                  {/* HO Total Verif */}
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-2.5 px-4 text-slate-900">HO Total Verifikasi (Ha)</td>
                    {isUpdate && <td className="py-2.5 px-4 text-right font-mono text-slate-600">{masterTotals?.ho_total_verifikasi.toFixed(2)}</td>}
                    <td className="py-2.5 px-4 text-right font-mono text-slate-900 font-bold">{reqTotals.ho_total_verifikasi.toFixed(2)}</td>
                    {isUpdate && <td className="py-2.5 px-4 text-center font-mono text-slate-400">-</td>}
                  </tr>

                  {/* Selisih BA - Verif */}
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-2.5 px-4 text-slate-900">Selisih Verifikasi (BA - HO Verif)</td>
                    {isUpdate && <td className="py-2.5 px-4 text-right font-mono text-slate-600">{masterTotals?.selisih_verifikasi.toFixed(2)}</td>}
                    <td className="py-2.5 px-4 text-right font-mono text-slate-900 font-bold">{reqTotals.selisih_verifikasi.toFixed(2)}</td>
                    {isUpdate && <td className="py-2.5 px-4 text-center font-mono text-slate-400">-</td>}
                  </tr>

                  {/* Reg Total Area */}
                  <tr className={isChanged('reg_planted_inti') || isChanged('reg_tbm') || isChanged('reg_areal_lain') ? 'bg-amber-50 font-semibold' : ''}>
                    <td className="py-2.5 px-4 font-medium">Verifikasi Regional (Total Area)</td>
                    {isUpdate && <td className="py-2.5 px-4 text-right font-mono text-slate-500">{masterTotals?.reg_total_area.toFixed(2)}</td>}
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{reqTotals.reg_total_area.toFixed(2)}</td>
                    {isUpdate && <td className="py-2.5 px-4 text-center font-mono">{(reqTotals.reg_total_area - (masterTotals?.reg_total_area || 0)).toFixed(2)}</td>}
                  </tr>

                  {/* Total Penguasaan */}
                  <tr className="bg-slate-100 font-extrabold text-sm border-t-2 border-slate-300">
                    <td className="py-3 px-4 text-slate-900 uppercase">TOTAL PENGUASAAN AREAL (Ha)</td>
                    {isUpdate && <td className="py-3 px-4 text-right font-mono text-slate-600">{masterTotals?.total_penguasaan.toFixed(2)}</td>}
                    <td className="py-3 px-4 text-right font-mono text-emerald-700">{reqTotals.total_penguasaan.toFixed(2)}</td>
                    {isUpdate && <td className="py-3 px-4 text-center font-mono text-slate-700">-</td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8 pt-4 border-t border-slate-200 flex flex-row items-center justify-between gap-3">
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
              Tutup Preview
            </Button>
          </SheetClose>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => onOpenRejectModal(request)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-sm font-semibold gap-1.5"
            >
              <XCircle className="w-4 h-4 text-amber-700" /> Tolak (Reject)
            </Button>
            <Button
              type="button"
              onClick={() => onApprove(request)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Disetujui (Approve)
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
