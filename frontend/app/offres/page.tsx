'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ShieldCheck, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const OffresPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-dark mb-6">Nos Offres <span className="text-primary italic">R+</span></h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">Découvrez nos solutions Fibre, 5G Box et Mobile. Profitez d'une connectivité sans faille adaptée à vos besoins, que vous soyez un professionnel ou un particulier.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Fibre */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-primary transition-all group">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Server className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-dark mb-4">Fibre Optique</h3>
            <p className="text-gray-500 mb-6">La vitesse de la lumière directement chez vous. Idéal pour le télétravail, le streaming 4K et le gaming sans latence.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Jusqu'à 200 Mbps</li>
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Routeur WiFi 6 inclus</li>
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Installation gratuite</li>
            </ul>
            <Link href="/souscrire" className="w-full inline-flex items-center justify-center bg-gray-50 text-dark font-black py-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
              SOUSCRIRE <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          {/* 5G Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark text-white rounded-[2.5rem] p-8 shadow-2xl shadow-red-500/20 border border-dark transform md:-translate-y-4">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Le plus populaire</div>
            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4">5G Box Premium</h3>
            <p className="text-gray-400 mb-6">L'internet très haut débit sans installation complexe. Branchez, c'est connecté en un clin d'œil.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm font-bold text-gray-300"><ShieldCheck className="w-5 h-5 text-primary mr-2" /> Débit illimité 5G</li>
              <li className="flex items-center text-sm font-bold text-gray-300"><ShieldCheck className="w-5 h-5 text-primary mr-2" /> Connectez jusqu'à 64 appareils</li>
              <li className="flex items-center text-sm font-bold text-gray-300"><ShieldCheck className="w-5 h-5 text-primary mr-2" /> Pas de câblage nécessaire</li>
            </ul>
            <Link href="/souscrire" className="w-full inline-flex items-center justify-center bg-primary text-white shadow-xl shadow-red-500/30 font-black py-4 rounded-2xl hover:bg-white hover:text-dark transition-colors">
              SOUSCRIRE <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

           {/* Mobile */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-primary transition-all group">
            <div className="w-16 h-16 bg-red-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-dark mb-4">Forfaits Mobiles</h3>
            <p className="text-gray-500 mb-6">Gardez le contact où que vous soyez avec nos forfaits riches en données et appels illimités.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Volume Data 4G+/5G massif</li>
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Appels nationaux illimités</li>
              <li className="flex items-center text-sm font-bold text-gray-600"><ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> Pass Roaming inclus</li>
            </ul>
            <Link href="/souscrire" className="w-full inline-flex items-center justify-center bg-gray-50 text-dark font-black py-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
              SOUSCRIRE <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OffresPage;
