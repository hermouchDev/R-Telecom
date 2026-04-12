'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Headphones, Zap, TrendingUp, Cloud, Smartphone } from 'lucide-react';
import Hero from '@/components/Hero';
import OfferCard from '@/components/OfferCard';
import Calculator from '@/components/Calculator';
import Chatbot from '@/components/Chatbot';

const offersData = {
  fibre: [
    { title: "Fibre 100 Mbps", speed: "100", price: 400, features: ["Connexion symétrique", "Installation gratuite", "WiFi 6 inclus"], badge: "Populaire" },
    { title: "Fibre 200 Mbps", speed: "200", price: 500, features: ["Idéal pour Netflix 4K", "WiFi ultra-performant", "Support VIP"], badge: "Meilleure Valeur" },
    { title: "Fibre 1 Gbps", speed: "1000", price: 1000, features: ["Vitesse ultime", "Gaming & Pro", "Zéro latence"] }
  ],
  '5g': [
    { title: "5G Box El Manzil", speed: "100", price: 400, features: ["Sans ligne fixe", "Plug & Play", "Vitesse 5G instantanée"], badge: "Sans engagement" }
  ],
  adsl: [
    { title: "ADSL 20 Mbps", speed: "20", price: 250, features: ["Connexion stable", "Illimité", "Installation rapide"] },
    { title: "ADSL + Ligne Fixe", speed: "20", price: 300, features: ["Internet + Téléphone", "Appels vers fixe", "Réseau national"] }
  ],
  mobile: [
    { title: "Forfait 140Go", speed: "4G+", price: 165, features: ["140Go Internet", "14H Appels", "Réseaux sociaux illimités"], badge: "Top Vente" },
    { title: "Forfait 550Go", speed: "5G", price: 349, features: ["550Go Internet", "15H Appels international", "World Pass"] }
  ],
  '4g': [
    { title: "4G+ 40Go+1H", speed: "4G+", price: 199, features: ["40Go Internet", "1H Appels", "Box offerte"], badge: "Nouveau" },
    { title: "4G+ 70Go+2H", speed: "4G+", price: 350, features: ["70Go Internet", "2H Appels", "Débit prioritaire"] }
  ]
};

const Home = () => {
  const [activeTab, setActiveTab] = useState<'fibre' | '5g' | 'adsl' | 'mobile' | '4g'>('fibre');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex flex-col">
      <Hero />

      {/* Offers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-dark mb-4 tracking-tight">Nos Offres Internet</h2>
            <div className="flex justify-center flex-wrap gap-2 mt-8 bg-gray-50 p-1.5 rounded-2xl w-fit mx-auto border border-gray-100">
              {Object.keys(offersData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-3 rounded-[14px] text-sm font-black transition-all uppercase tracking-widest ${
                    activeTab === tab 
                    ? 'bg-primary text-white shadow-xl shadow-red-500/20 scale-105' 
                    : 'text-gray-400 hover:text-dark'
                  }`}
                >
                  {tab === '5g' ? '5G Box' : tab === '4g' ? '4G+' : tab}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {offersData[activeTab].map((offer, index) => (
              <OfferCard 
                key={index}
                {...offer}
                category={activeTab.toUpperCase()}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-dark mb-4 tracking-tight">Pourquoi choisir <span className="text-primary italic">R+</span> ?</h2>
            <p className="text-gray-500">L'excellence technologique au service de votre connexion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 group hover:-translate-y-2 transition-transform">
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">Réseau Fiable</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Une infrastructure robuste garantissant une disponibilité de 99.9% pour que vous ne soyez jamais déconnecté.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 group hover:-translate-y-2 transition-transform">
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Headphones className="w-8 h-8 text-primary group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">Support 24/7</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nos experts sont à votre écoute jour et nuit pour répondre à toutes vos questions techniques.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 group hover:-translate-y-2 transition-transform">
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <TrendingUp className="w-8 h-8 text-primary group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">Meilleurs Prix</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Le meilleur rapport qualité-prix du marché marocain, avec des offres adaptées à tous les budgets.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>

      <Calculator />



      <Chatbot />
    </div>
  );
};

export default Home;
