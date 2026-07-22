'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { RequestKebun } from '@/types/database.types';

interface RejectionModalProps {
  isOpen: boolean;
  request: RequestKebun | null;
  onClose: () => void;
  onSubmit: (id: string, rejectionNote: string) => void;
}

export function RejectionModal({
  isOpen,
  request,
  onClose,
  onSubmit
}: RejectionModalProps) {
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Catatan/alasan penolakan wajib diisi untuk pemberitahuan ke pihak Regional.');
      return;
    }
    onSubmit(request.id, note.trim());
    setNote('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-amber-900/40 bg-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Konfirmasi Penolakan Request</h3>
              <p className="text-xs text-amber-300/80">Kebun: {request.nama_kebun_aktual} ({request.wilayah})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Pihak Head Office akan menolak pengajuan ini. Berikan catatan atau rekomendasi perbaikan agar pihak Regional dapat melakukan revisi ulang.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Alasan / Catatan Penolakan HO <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Luasan Planted Sawit Inti tidak sesuai dengan dokumen ukur BPN terbaru. Silakan upload ulang atau revisi ke 1.400 Ha."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {error && <p className="text-xs text-amber-400 mt-1 font-medium">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" /> Kirim Penolakan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
