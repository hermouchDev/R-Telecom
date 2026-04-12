'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator as CalcIcon, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const offers = [
  { id: 'fibre-100', name: 'Fibre 100 Mbps', price: 400, serviceFee: 0, category: 'Fibre' },
  { id: 'fibre-200', name: 'Fibre 200 Mbps', price: 500, serviceFee: 0, category: 'Fibre' },
  { id: 'fibre-1000', name: 'Fibre 1 Gbps', price: 1000, serviceFee: 0, category: 'Fibre' },
  { id: '5g-box', name: '5G Box El Manzil', price: 400, serviceFee: 200, routerFee: 350, category: '5G' },
  { id: 'adsl-20', name: 'ADSL 20 Mbps', price: 250, serviceFee: 0, category: 'ADSL' },
  { id: 'adsl-fixe', name: 'ADSL + Ligne Fixe', price: 300, serviceFee: 0, category: 'ADSL' },
  { id: 'mobile-99', name: 'Mobile 20Go + 1H', price: 99, serviceFee: 0, category: 'Mobile' },
  { id: 'mobile-165', name: 'Mobile 140Go + 14H', price: 165, serviceFee: 0, category: 'Mobile' },
  { id: 'mobile-249', name: 'Mobile 250Go + 20H', price: 249, serviceFee: 0, category: 'Mobile' },
];

const Calculator = () => {
  const [selectedOfferId, setSelectedOfferId] = useState(offers[0].id);
  const [isFondation, setIsFondation] = useState(false);

  const selectedOffer = useMemo(() => 
    offers.find(o => o.id === selectedOfferId) || offers[0], 
    [selectedOfferId]
  );

  const results = useMemo(() => {
    const basePrice = selectedOffer.price;
    const discount = isFondation ? basePrice * 0.25 : 0;
    const discountedPrice = basePrice - discount;
    const serviceFee = isFondation ? 0 : (selectedOffer.serviceFee || 0);
    const routerFee = selectedOffer.routerFee || 0;
    const total = discountedPrice + serviceFee + routerFee;

    return {
      basePrice,
      discount,
      discountedPrice,
      serviceFee,
      routerFee,
      total
    };
  }, [selectedOffer, isFondation]);

  return (
    <section id="calculateur" className="py-24 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
          >
            <CalcIcon className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Calculateur Malin</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-dark mb-4">Simulez votre tarif <span className="text-primary italic">R+</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Calculez précisément vos frais mensuels et découvrez vos avantages fondations.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Configuration */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50"
          >
            <div className="space-y-8">
              {/* Offer Selector */}
              <div>
                <label className="block text-sm font-black text-dark uppercase tracking-widest mb-4">Choisissez votre offre</label>
                <div className="grid grid-cols-1 gap-3">
                  {offers.map((offer) => (
                    <button
                      key={offer.id}
                      onClick={() => setSelectedOfferId(offer.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedOfferId === offer.id 
                        ? 'border-primary bg-red-50 ring-4 ring-primary/5' 
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${selectedOfferId === offer.id ? 'border-primary' : 'border-gray-300'}`}>
                          {selectedOfferId === offer.id && <div className="w-2 h-2 bg-primary rounded-full transition-transform" />}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{offer.category}</p>
                          <p className={`font-bold ${selectedOfferId === offer.id ? 'text-primary' : 'text-dark'}`}>{offer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-dark">{offer.price} DH</span>
                        <span className="text-xs text-gray-400 block">/mois</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fondation Toggle */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark">Membre Fondation ?</h4>
                      <p className="text-xs text-gray-500 italic">Bénéficiez de -25% de remise immédiate.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsFondation(!isFondation)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isFondation ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isFondation ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Result Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="bg-dark p-1 rounded-[2.5rem] shadow-2xl shadow-primary/20 overflow-hidden">
              <div className="bg-[#1a1a1a] rounded-[2.3rem] p-10 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <h3 className="text-white text-xl font-bold mb-8 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-3">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </span>
                  Récapitulatif de votre offre
                </h3>

                <div className="space-y-6 text-gray-400 border-b border-white/10 pb-8 mb-8">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Prix de base ({selectedOffer.name})</span>
                    <span className="text-white font-bold">{results.basePrice} DH</span>
                  </div>

                  <AnimatePresence>
                    {isFondation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between items-center text-sm text-green-400 font-bold overflow-hidden"
                      >
                        <span>Remise Fondation (−25%)</span>
                        <span>−{results.discount} DH</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Frais de service (Installation)</span>
                    <span className={results.serviceFee === 0 ? 'text-green-400 font-bold uppercase text-[10px]' : 'text-white'}>
                      {results.serviceFee === 0 ? 'Gratuit' : `${results.serviceFee} DH`}
                    </span>
                  </div>

                  {results.routerFee > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Frais Routeur (Unique)</span>
                      <span className="text-white font-bold">{results.routerFee} DH</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Total Estimé</div>
                  <div className="flex items-baseline space-x-2">
                    <motion.span 
                      key={results.total}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-black text-primary tracking-tighter"
                    >
                      {results.total}
                    </motion.span>
                    <span className="text-2xl font-bold text-white italic">DH</span>
                    <span className="text-gray-500 font-medium">/mois</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-2 italic">* Prix Toutes Taxes Comprises (TTC) selon éligibilité technique.</p>
                </div>

                <Link 
                  href={`/souscrire?id=${selectedOffer.id}&fondation=${isFondation}`}
                  className="group flex items-center justify-center w-full bg-primary hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20"
                >
                  SOUSCRIRE MAINTENANT
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Visa.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paiement 100% Sécurisé</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
