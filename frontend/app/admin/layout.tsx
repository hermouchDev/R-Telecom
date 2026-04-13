'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Menu, Search, X } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '@/utils/api';

type AdminNotification = {
  id: string;
  client_name: string;
  offer_name: string;
  created_at: string;
  status: string;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [adminInitials, setAdminInitials] = useState('AD');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const computeInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'AD';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  };

  const loadAdminProfile = () => {
    const savedName = localStorage.getItem('admin_name') || 'Admin';
    setAdminName(savedName);
    setAdminInitials(computeInitials(savedName));
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const [statsRes, subsRes] = await Promise.all([
        axios.get(apiUrl('/admin/stats'), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(apiUrl('/subscriptions?status=pending&page=1&limit=5'), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setPendingCount(statsRes.data?.stats?.pending || 0);
      setNotifications(subsRes.data?.data || []);
    } catch {
      setPendingCount(0);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    loadAdminProfile();
    fetchNotifications();
  }, [pathname, router]);

  useEffect(() => {
    const onProfileUpdated = () => loadAdminProfile();
    window.addEventListener('admin-profile-updated', onProfileUpdated);
    return () => window.removeEventListener('admin-profile-updated', onProfileUpdated);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const greetingRole = useMemo(() => 'Super Utilisateur', []);

  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar className="hidden lg:flex fixed left-0 top-0 z-40" />

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <AdminSidebar
        className={`fixed left-0 top-0 z-[60] lg:hidden transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onNavigate={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-grow lg:ml-[260px] flex flex-col">
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-grow lg:max-w-xl">
            <button
              onClick={() => setMobileSidebarOpen((v) => !v)}
              className="lg:hidden p-2 text-gray-500 hover:text-primary hover:bg-red-50 rounded-xl transition-colors"
              aria-label={mobileSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Recherche globale..."
                className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 lg:pr-6 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-2 text-gray-400 hover:text-primary transition-colors hover:bg-red-50 rounded-xl"
              >
                <Bell className="w-6 h-6" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-[92vw] max-w-[360px] bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-dark">Notifications</p>
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        router.push('/admin/demandes');
                      }}
                      className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-red-700"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-5 py-6 text-sm font-bold text-gray-400">Aucune nouvelle notification.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setNotifOpen(false);
                            router.push(`/admin/demandes/${n.id}`);
                          }}
                          className="w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-sm font-black text-dark">{n.client_name}</p>
                          <p className="text-xs text-gray-500 font-bold mt-1">Nouvelle demande: {n.offer_name}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-gray-100" />
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-dark leading-none">Bonjour, {adminName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{greetingRole}</p>
              </div>
              <div className="w-10 h-10 bg-dark text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-black/10">
                {adminInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-10 flex-grow">{children}</main>
      </div>
    </div>
  );
}
