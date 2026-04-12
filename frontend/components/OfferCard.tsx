'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OfferCardProps {
  title: string;
  speed: string;
  price: number;
  originalPrice?: number;
  features: string[];
  badge?: string;
  category?: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  title, 
  speed, 
  price, 
  originalPrice, 
  features, 
  badge,
  category 
}) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(204, 0, 0, 0.1)' }}
      className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl transition-all h-full flex flex-col"
    >
      {/* Top Red Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

      {/* Badge */}
      {badge && (
        <div className="absolute top-6 right-0">
          <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-l-full shadow-lg shadow-red-500/20">
            {badge}
          </span>
        </div>
      )}

      <div className="p-8 flex-grow">
        <div className="mb-6">
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">{category || 'Internet'}</p>
          <h3 className="text-2xl font-black text-dark">{title}</h3>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline space-x-1">
            <span className="text-5xl font-black text-dark tracking-tighter">{speed}</span>
            <span className="text-gray-400 font-medium">Mbps</span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-primary tracking-tighter">{price}</span>
            <span className="text-xl font-bold text-primary italic">DH</span>
            <span className="text-gray-400 font-medium">/mois</span>
            {originalPrice && (
              <span className="text-gray-300 line-through font-medium ml-2">{originalPrice} DH</span>
            )}
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mt-1 mr-3 p-0.5 bg-red-50 rounded-full">
                <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />
              </div>
              <span className="text-gray-600 text-sm font-medium leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer CTA */}
      <div className="p-6 pt-0 mt-auto">
        <Link 
          href={`/souscrire?offer=${encodeURIComponent(title)}`}
          className="group flex items-center justify-center w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-500/20"
        >
          <span>SOUSCRIRE</span>
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </motion.div>
  );
};

export default OfferCard;
