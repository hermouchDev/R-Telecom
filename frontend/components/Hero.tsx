'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Users, Calendar, ArrowRight, Zap, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const FloatingCard = ({ icon, title, value, delay, className }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`absolute bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 ${className}`}
    >
      <div className="bg-primary/20 p-3 rounded-xl text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <section className="relative min-h-[92vh] bg-dark flex items-center overflow-hidden pt-16">
      {/* Background Gradients & Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -mr-64 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] -ml-32 -mb-32 pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 pl-2 pr-6 py-2 rounded-full backdrop-blur-md">
              <span className="flex items-center justify-center bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Nouveau
              </span>
              <span className="text-white/80 text-sm font-medium">Débit Fibre 1 Gbps ultra-symétrique disponible</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.1] tracking-tight"
            >
              La vitesse qui <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                change tout.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-400 max-w-xl leading-relaxed"
            >
              Internet ultra-rapide 100% Fibre Optique et 5G Box. Plongez dans la nouvelle dimension du très haut débit, disponible pour tous les foyers au Maroc.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/offres" 
                className="group inline-flex items-center justify-center bg-primary hover:bg-white text-white hover:text-dark px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-red-600/30 transition-all duration-300"
              >
                <span>DÉCOUVRIR LES OFFRES</span>
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/calculateur" 
                className="inline-flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-md transition-all duration-300"
              >
                Calculer mon tarif
              </Link>
            </motion.div>

            {/* Bottom Stats */}
            <motion.div 
              variants={itemVariants}
              className="pt-10 flex items-center gap-8 border-t border-white/10"
            >
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-4">
                  <div className="w-10 h-10 rounded-full border-2 border-dark bg-gray-800 flex items-center justify-center"><Users className="w-4 h-4 text-gray-400" /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-dark bg-gray-700 flex items-center justify-center"><Users className="w-4 h-4 text-gray-300" /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-dark bg-primary flex items-center justify-center text-xs font-black text-white">+</div>
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-none">500K+</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Clients satisfaits</p>
                </div>
              </div>

              <div className="w-px h-10 bg-white/10 hidden sm:block"></div>

              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-none">99.9%</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Disponibilité réseau</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Visual / Abstract Tech) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex relative h-[600px] items-center justify-center"
          >
            {/* Main Holographic Sphere */}
            <div className="relative w-[400px] h-[400px]">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[1px] border-dashed border-primary/30"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-[1px] border-primary/20 border-t-primary/60 scale-105"
              />
              
              <div className="absolute inset-10 bg-gradient-to-br from-primary/20 to-transparent rounded-full backdrop-blur-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.2)]">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-40 h-40 bg-primary/40 rounded-full blur-[50px]"
                />
                <Wifi className="w-32 h-32 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10" />
              </div>
            </div>

            {/* Floating Info Cards */}
            <FloatingCard 
              icon={<Zap className="w-6 h-6" />}
              title="Vitesse Max"
              value="1.2 Gbps"
              delay={0.6}
              className="top-10 -right-10"
            />
            
            <FloatingCard 
              icon={<Activity className="w-6 h-6" />}
              title="Ping Latence"
              value="< 5 ms"
              delay={0.8}
              className="bottom-20 -left-10"
            />

            {/* Decorative Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path 
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 20 80 Q 50 20 80 80" 
                fill="none" 
                stroke="white" 
                strokeWidth="0.5" 
                strokeDasharray="2 2"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
