'use client';

import React from 'react';
import { RequestKebun } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileDiff, Edit3, Clock, XCircle, CheckCircle2 } from 'lucide-react';

interface RequestsTableProps {
  data: RequestKebun[];
  isRegional: boolean;
  onReviewRequest?: (req: RequestKebun) => void;
  onApproveRequest?: (req: RequestKebun) => void;
  onRejectRequest?: (req: RequestKebun) => void;
  onEditRevisi?: (req: RequestKebun) => void;
}

export function RequestsTable({
  data,
  isRegional,
  onReviewRequest,
  onApproveRequest,
  onRejectRequest,
  onEditRevisi
}: RequestsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge className="bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1 inline" /> Menunggu Konfirmasi HO</Badge>;
      case 'REJECTED': return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1 inline" /> Ditolak (Revisi)</Badge>;
      case 'APPROVED': return <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1 inline" /> Disetujui (Approved)</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'CREATE' ? (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">TAMBAH BARU</span>
    ) : (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">UPDATE DATA</span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-semibold">Tipe & Status</th>
              <th className="py-3 px-4 font-semibold">Kebun / PT</th>
              <th className="py-3 px-4 font-semibold">Regional</th>
              <th className="py-3 px-4 font-semibold">Pemohon</th>
              <th className="py-3 px-4 font-semibold">Tanggal</th>
              {isRegional && <th className="py-3 px-4 font-semibold">Catatan Penolakan</th>}
              <th className="py-3 px-4 font-semibold text-center">Aksi / Kontrol Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  Tidak ada data pengajuan.
                </td>
              </tr>
            ) : (
              data.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 space-y-1">
                    <div>{getTypeBadge(req.request_type)}</div>
                    <div>{getStatusBadge(req.approval_status)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold block text-slate-900">{req.kode_tag_kebun || '-'}</span>
                    <span className="text-slate-700">{req.nama_kebun_aktual || '-'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{req.wilayah}</td>
                  <td className="py-3 px-4 text-slate-700">{req.requested_by_name || req.cro}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                  {isRegional && (
                    <td className="py-3 px-4 max-w-[200px] text-red-600">
                      {req.rejection_note || '-'}
                    </td>
                  )}
                  <td className="py-3 px-4 text-center">
                    {!isRegional && req.approval_status === 'PENDING' && (
                      <div className="flex items-center justify-center gap-1.5">
                        <Button size="sm" onClick={() => onReviewRequest?.(req)} className="bg-slate-800 hover:bg-slate-900 text-white gap-1 text-xs">
                          <FileDiff className="w-3 h-3" /> Review
                        </Button>
                        <Button size="sm" onClick={() => onApproveRequest?.(req)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" onClick={() => onRejectRequest?.(req)} className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 gap-1 text-xs">
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </div>
                    )}
                    {!isRegional && req.approval_status !== 'PENDING' && (
                      <Button variant="outline" size="sm" onClick={() => onReviewRequest?.(req)} className="border-slate-300 text-slate-600 text-xs">
                        Lihat Detail
                      </Button>
                    )}
                    {isRegional && req.approval_status === 'REJECTED' && (
                      <Button variant="outline" size="sm" onClick={() => onEditRevisi?.(req)} className="border-red-200 text-red-600 hover:bg-red-50 gap-1 text-xs">
                        <Edit3 className="w-3 h-3" /> Edit Revisi
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
