'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Menu, X } from 'lucide-react';
import { DEMO_USERS, INITIAL_NOTIFICATIONS } from '@/lib/mock-data';
import { UserProfile, NotificationItem } from '@/types/database.types';

export default function RegionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile>(DEMO_USERS.aceh || DEMO_USERS.ho);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleSwitchUser = (key: string) => {
    if (DEMO_USERS[key]) {
      setUser(DEMO_USERS[key]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-16 h-full bg-white shadow-xl">
            <button
              className="absolute top-4 right-4 text-slate-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <Sidebar user={user} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <Sidebar user={user} isExpanded={sidebarOpen} />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          user={user}
          notifications={notifications}
          onSwitchUser={handleSwitchUser}
          onMarkNotifRead={(id) =>
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
          }
          onMarkAllNotifsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
          }
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
