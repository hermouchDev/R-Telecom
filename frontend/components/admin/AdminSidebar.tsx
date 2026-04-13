'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileStack,
  FolderOpen,
  LineChart,
  Settings,
  LogOut,
  UserCircle,
  Package
} from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '@/utils/api';

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = '', onNavigate }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const [adminName, setAdminName] = useState('Super Admin');

  const loadAdminName = () => {
    const savedName = localStorage.getItem('admin_name');
    setAdminName(savedName || 'Super Admin');
  };

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const response = await axios.get(apiUrl('/admin/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingCount(response.data.stats?.pending || 0);
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      setPendingCount(0);
    }
  };

  useEffect(() => {
    loadAdminName();
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); // 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onProfileUpdated = () => loadAdminName();
    window.addEventListener('admin-profile-updated', onProfileUpdated);
    return () => window.removeEventListener('admin-profile-updated', onProfileUpdated);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const navLinks = [
    { name: 'Tableau de bord', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Demandes', href: '/admin/demandes', icon: <FileStack className="w-5 h-5" />, badge: pendingCount },
    { name: 'Documents', href: '/admin/documents', icon: <FolderOpen className="w-5 h-5" /> },
    { name: 'Offres', href: '/admin/offres', icon: <Package className="w-5 h-5" /> },
    { name: 'Statistiques', href: '/admin/statistiques', icon: <LineChart className="w-5 h-5" /> },
    { name: 'Paramètres', href: '/admin/parametres', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className={`w-[260px] bg-dark text-white flex flex-col h-screen ${className}`}>
      <div className="p-8 border-b border-white/5 flex items-center space-x-2">
        <span className="text-3xl font-black text-primary italic tracking-tighter">R+</span>
        <span className="text-xl font-bold tracking-tight">ADMIN</span>
      </div>

      <nav className="flex-grow p-6 space-y-2 mt-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-red-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                {link.icon}
                <span>{link.name}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="flex items-center space-x-3 p-2">
          <UserCircle className="w-10 h-10 text-gray-500" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{adminName}</p>
            <p className="text-[10px] text-gray-400">v3.0</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-4 text-red-400 hover:bg-red-400/10 rounded-2xl font-bold transition-all px-6"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
