'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  color: 'red' | 'orange' | 'green' | 'blue';
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, trend, trendDirection, color, icon }) => {
  const colorMap = {
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  const iconBgMap = {
    red: 'bg-red-600 text-white shadow-red-500/20',
    orange: 'bg-orange-500 text-white shadow-orange-500/20',
    green: 'bg-green-600 text-white shadow-green-500/20',
    blue: 'bg-blue-600 text-white shadow-blue-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className={`p-3 sm:p-4 rounded-2xl ${iconBgMap[color]} shadow-lg transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
            trendDirection === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {trendDirection === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-black text-dark tracking-tighter">{value}</span>
          {unit && <span className="text-sm font-bold text-gray-400 uppercase">{unit}</span>}
        </div>
        {trend && (
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">vs hier</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
