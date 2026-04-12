'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  FileStack, 
  BarChart3, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const subsRes = await axios.get('http://localhost:5000/api/subscriptions?limit=10&sort=newest', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(statsRes.data.stats);
      setRecentSubs(subsRes.data.data.slice(0, 10)); // Access the .data property of the response object
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Demandes aujourd'hui" 
          value={stats?.total || 0} 
          trend="+12%" 
          trendDirection="up"
          color="blue" 
          icon={<Package className="w-6 h-6" />} 
        />
        <StatsCard 
          title="En attente" 
          value={stats?.pending || 0} 
          color="orange" 
          icon={<Clock className="w-6 h-6" />} 
        />
        <StatsCard 
          title="Revenus du mois" 
          value={stats?.monthlyRevenue || 0} 
          unit="DH"
          trend="+8.5%" 
          trendDirection="up"
          color="green" 
          icon={<TrendingUp className="w-6 h-6" />} 
        />
        <StatsCard 
          title="Clients actifs" 
          value={stats?.active || 0} 
          trend="+5" 
          trendDirection="up"
          color="red" 
          icon={<Users className="w-6 h-6" />} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-dark tracking-tight">Activité Récente</h3>
            <Link href="/admin/demandes" className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center">
              Voir tout <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {recentSubs.length > 0 ? (
              recentSubs.map((sub, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={sub.id} 
                  className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {sub.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark">{sub.client_name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mt-0.5">{sub.offer_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      sub.status === 'approved' ? 'bg-green-100 text-green-600' : 
                      sub.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {sub.status === 'approved' ? 'Approuvée' : sub.status === 'rejected' ? 'Refusée' : 'En attente'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase w-24 text-right">
                      {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true, locale: fr })}
                    </span>
                    <Link 
                      href={`/admin/demandes`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Package className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400">Aucune activité récente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-dark tracking-tight">Actions Rapides</h3>
          <div className="space-y-4">
            <QuickActionButton 
              title="Gérer les demandes" 
              subtitle="Approuver ou rejeter" 
              href="/admin/demandes" 
              icon={<FileStack className="w-5 h-5" />} 
              color="bg-primary"
            />
            <QuickActionButton 
              title="Voir Statistiques" 
              subtitle="Analyse des ventes" 
              href="/admin/statistiques" 
              icon={<BarChart3 className="w-5 h-5" />} 
              color="bg-dark"
            />
            <button
              onClick={async () => {
                try {
                  toast.loading('Génération du rapport...', { id: 'report' });
                  const token = localStorage.getItem('admin_token');
                  const res = await axios.get('http://localhost:5000/api/admin/report', {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                  });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `rapport-rplus-${new Date().getTime()}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  toast.success('Rapport téléchargé !', { id: 'report' });
                } catch (err) {
                  toast.error('Erreur de génération', { id: 'report' });
                }
              }}
              className="w-full flex items-center p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="p-3 bg-green-50 text-green-600 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Télécharger Rapport</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Format CSV • Mensuel</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ title, subtitle, href, icon, color }: any) => (
  <Link href={href} className="flex items-center p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className={`p-3 ${color} text-white rounded-xl mr-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="flex-grow">
      <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">{title}</p>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{subtitle}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

export default AdminOverview;
