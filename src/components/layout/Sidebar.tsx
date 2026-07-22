'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Building, FileInput, LogOut, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/types/database.types';

interface SidebarProps {
  user: UserProfile;
  isExpanded?: boolean;
}

export function Sidebar({ user, isExpanded = true }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`bg-white flex flex-col shrink-0 border-r border-slate-200 min-h-screen py-4 transition-all duration-300 ${isExpanded ? 'w-64 px-4' : 'w-16 items-center px-0'}`}>
      {/* Brand Logo */}
      <div className={`h-10 w-10 mb-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden shrink-0 ${isExpanded ? 'ml-2' : ''}`}>
        <img src="/agridam-logo.jpeg" alt="AgriDaM Logo" className="w-full h-full object-cover" />
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 flex flex-col gap-2 w-full ${isExpanded ? '' : 'px-3 items-center'}`}>
        <Link
          href="/head-office/dashboard"
          title="Master Data HO"
          className={`flex items-center h-10 rounded-xl transition-all ${isExpanded ? 'px-3 w-full justify-start' : 'w-10 justify-center'} ${
            pathname.includes('/head-office')
              ? 'bg-slate-100 text-slate-900 shadow-sm font-medium'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <Building className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="ml-3 text-sm">Dashboard Kebun</span>}
        </Link>

        {user.role === 'regional' && (
          <Link
            href="/regional/input"
            title="Form Pendataan"
            className={`flex items-center h-10 rounded-xl transition-all ${isExpanded ? 'px-3 w-full justify-start' : 'w-10 justify-center'} ${
              pathname.includes('/regional')
                ? 'bg-slate-100 text-slate-900 shadow-sm font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <FileInput className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="ml-3 text-sm">Form Pendataan</span>}
          </Link>
        )}
      </nav>

      {/* User Info (Expanded Only) */}
      {isExpanded && (
        <div className="mb-4 px-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-semibold text-slate-900 truncate">{user.full_name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{user.role} {user.regional_name ? `- ${user.regional_name}` : ''}</div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={`mt-auto pt-4 ${isExpanded ? 'px-3 w-full' : 'px-3'}`}>
        <Link
          href="/login"
          title="Logout"
          className={`flex items-center h-10 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${isExpanded ? 'px-3 w-full justify-start' : 'w-10 justify-center'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="ml-3 text-sm font-medium">Keluar</span>}
        </Link>
      </div>
    </aside>
  );
}
