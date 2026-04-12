'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Search } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      // Basic check (real apps should verify token validity with backend)
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If we are on the login page, don't show the sidebar/header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-[260px] flex flex-col">
        {/* Admin Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Recherche globale..." 
                className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors hover:bg-red-50 rounded-xl">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-100" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-black text-dark leading-none">Bonjour, Admin</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Super Utilisateur</p>
              </div>
              <div className="w-10 h-10 bg-dark text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-black/10">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-10 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
