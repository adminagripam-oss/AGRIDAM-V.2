'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { NotificationItem, UserRole } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface NotificationBellProps {
  currentRole: UserRole;
  currentUserId: string;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationBell({
  currentRole,
  currentUserId,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter notifications relevant to role/user
  const relevantNotifs = notifications.filter(
    (n) => n.target_role === currentRole || n.user_id === currentUserId || (!n.target_role && !n.user_id)
  );

  const unreadCount = relevantNotifs.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/50 text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        title="Notifikasi Realtime"
      >
        <Bell className="w-5 h-5 text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 animate-pulse shadow-lg shadow-emerald-500/50">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-emerald-500/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3.5 border-b border-emerald-900/40 flex items-center justify-between bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-100">Notifikasi Realtime</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Tandai Dibaca
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {relevantNotifs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  Belum ada notifikasi
                </div>
              ) : (
                relevantNotifs.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-emerald-950/30 transition-colors flex items-start gap-3 ${
                      !item.is_read ? 'bg-emerald-950/20 border-l-2 border-l-emerald-500' : 'opacity-80'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.title.toLowerCase().includes('disetujui') ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : item.title.toLowerCase().includes('ditolak') ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Info className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                      {!item.is_read && (
                        <button
                          onClick={() => onMarkAsRead(item.id)}
                          className="mt-2 text-[11px] text-emerald-400 hover:underline inline-block font-medium"
                        >
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 bg-slate-950/60 text-center border-t border-slate-800/60 text-[11px] text-slate-400">
              Agridam Realtime Notification Engine
            </div>
          </div>
        </>
      )}
    </div>
  );
}
