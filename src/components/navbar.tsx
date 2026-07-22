'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Sprout, UserCheck, MapPin, LogOut, RefreshCw } from 'lucide-react';
import { UserProfile, NotificationItem } from '@/lib/types';
import { NotificationBell } from './notification-bell';
import { DEMO_USERS } from '@/lib/mock-data';

interface NavbarProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onSwitchUser?: (newUserKey: 'ho' | 'sumatra' | 'kalimantan') => void;
  onMarkNotifRead?: (id: string) => void;
  onMarkAllNotifsRead?: () => void;
}

export function Navbar({
  user,
  notifications,
  onSwitchUser,
  onMarkNotifRead,
  onMarkAllNotifsRead
}: NavbarProps) {
  const router = useRouter();

  const isHO = user.role === 'ho';

  return (
    <header className="sticky top-0 z-40 bg-[#07120e]/90 backdrop-blur-md border-b border-emerald-900/30 px-4 sm:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link href={isHO ? '/dashboard/ho' : '/dashboard/regional'} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200 bg-clip-text text-transparent">
                AGRIDAM
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MDM Sawit
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Master Data Management Perkebunan Kelapa Sawit</p>
          </div>
        </Link>

        {/* Right Section: Role Status, Switcher, Notifs & User Badge */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Quick Demo Switcher */}
          {onSwitchUser && (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 px-2 font-medium flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin-slow" /> Switch Role:
              </span>
              <button
                onClick={() => onSwitchUser('ho')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'ho'
                    ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                HO (Checker)
              </button>
              <button
                onClick={() => onSwitchUser('sumatra')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'regional' && user.regional_name?.includes('Sumatra')
                    ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Maker Sumatra
              </button>
              <button
                onClick={() => onSwitchUser('kalimantan')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  user.role === 'regional' && user.regional_name?.includes('Kalimantan')
                    ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Maker Kalimantan
              </button>
            </div>
          )}

          {/* Realtime Notification Bell */}
          <NotificationBell
            currentRole={user.role}
            currentUserId={user.id}
            notifications={notifications}
            onMarkAsRead={onMarkNotifRead || (() => {})}
            onMarkAllAsRead={onMarkAllNotifsRead || (() => {})}
          />

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-semibold text-slate-100">{user.full_name}</span>
                {isHO ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Shield className="w-3 h-3 mr-0.5" /> HO Checker
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    <MapPin className="w-3 h-3 mr-0.5" /> Regional Maker
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">{user.regional_name || 'All Regions'}</p>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/50 hover:text-red-400 text-slate-400 border border-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
