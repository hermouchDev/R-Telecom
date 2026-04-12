'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar,
  Zap,
  Loader2,
  CalendarDays
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const COLORS = ['#CC0000', '#111111', '#444444', '#888888', '#CCCCCC'];

const StatistiquesPage = () => {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`http://localhost:5000/api/admin/stats/full?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Calcul des statistiques...</p>
    </div>
  );

  const pieData = [
    { name: 'Grand Public', value: data?.publicVsFondation?.public || 0 },
    { name: 'Fondation', value: data?.publicVsFondation?.fondation || 0 },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Analyse de Performance</h1>
          <p className="text-gray-400">Suivi des revenus, conversions et tendances.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {['7d', '30d', '90d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                range === r ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-dark'
              }`}
            >
              {r === 'all' ? 'Tout' : r}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Souscriptions" value={data?.totalSubscriptions || 0} icon={<CalendarDays className="w-5 h-5"/>} color="blue" />
        <KPICard title="Revenus Total" value={data?.totalRevenue || 0} unit="DH" icon={<TrendingUp className="w-5 h-5"/>} color="green" />
        <KPICard title="Taux d'approbation" value={`${data?.approvalRate || 0}%`} icon={<Target className="w-5 h-5"/>} color="orange" />
        <KPICard title="Offre Populaire" value={data?.topOffer?.name || 'Fibre 100'} subText={`${data?.topOffer?.count || 0} ventes`} icon={<Zap className="w-5 h-5"/>} color="red" />
      </div>

      {/* Main Revenue Chart */}
      <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-dark tracking-tight">Courbe des Revenus</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Progression quotidienne des ventes</p>
          </div>
          <div className="text-right">
             <span className="text-2xl font-black text-dark">{data?.totalRevenue || 0} DH</span>
             <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Sur la période</p>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.revenueByDay || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CC0000" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#CC0000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#999'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#999'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }}
                itemStyle={{ color: '#CC0000', fontWeight: 800 }}
              />
              <Area type="monotone" dataKey="amount" stroke="#CC0000" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <h3 className="text-xl font-black text-dark tracking-tight mb-8 flex items-center">
            <BarChart3 className="w-5 h-5 mr-3 text-primary" />
            Souscriptions par catégorie
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.byCategory || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8f8f8'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#CC0000" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Public vs Fondation */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <h3 className="text-xl font-black text-dark tracking-tight mb-8 flex items-center">
            <PieIcon className="w-5 h-5 mr-3 text-primary" />
            Grand Public vs Fondation
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-3xl font-black text-dark leading-none">{data?.totalSubscriptions || 0}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <section className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
           <h3 className="text-xl font-black text-dark tracking-tight">Performance par offre</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-10 py-5">Offre</th>
                <th className="px-10 py-5 text-center">Souscriptions</th>
                <th className="px-10 py-5 text-center">Revenus DH</th>
                <th className="px-10 py-5 text-center">% Fondation</th>
                <th className="px-10 py-5 text-center">Taux approbation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.byCategory?.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6 font-bold text-dark">{item.category}</td>
                  <td className="px-10 py-6 text-center font-black text-dark/60">{item.count}</td>
                  <td className="px-10 py-6 text-center font-black text-primary">{item.revenue} DH</td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-xs font-bold text-gray-400">{item.fondationPct}%</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                       <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${item.approvalRate}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-dark">{item.approvalRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const KPICard = ({ title, value, unit, icon, color, subText }: any) => {
  const colorMap: any = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
    >
      <div className={`p-4 rounded-2xl ${colorMap[color]} w-fit mb-6 shadow-lg shadow-black/5`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline space-x-2">
           <span className="text-2xl font-black text-dark tracking-tighter">{value}</span>
           {unit && <span className="text-sm font-bold text-gray-400">{unit}</span>}
        </div>
        {subText && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{subText}</p>}
      </div>
    </motion.div>
  );
};

export default StatistiquesPage;
