'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ChevronRight, RefreshCw, User, Menu } from 'lucide-react';
import { UserProfile, NotificationItem } from '@/types/database.types';
import { NotificationBell } from '@/components/notification-bell';
import { REGIONAL_LIST, DEMO_USERS } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';

interface NavbarProps {
  user: UserProfile;
  notifications?: NotificationItem[];
  onSwitchUser?: (newUserKey: string) => void;
  onMarkNotifRead?: (id: string) => void;
  onMarkAllNotifsRead?: () => void;
  onToggleSidebar?: () => void;
}

export function Navbar({
  user,
  onToggleSidebar,
}: NavbarProps) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (pathname.includes('/head-office')) {
      return [
        { label: 'Dashboard', href: '/head-office/dashboard' },
        { label: 'Kebun', href: '#' }
      ];
    } else if (pathname.includes('/regional')) {
      return [
        { label: 'Dashboard', href: '/regional/input' },
        { label: 'Kebun', href: '#' }
      ];
    }
    return [{ label: 'Dashboard', href: '#' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-slate-900">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-slate-900 transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          {/* Using a placeholder for moon icon using standard lucide icon if available, or just text. Moon is available in lucide-react */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>
      </div>
    </header>
  );
}
