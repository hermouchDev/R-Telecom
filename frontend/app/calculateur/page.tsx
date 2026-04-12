'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CalculateurPage = () => {
  const [data, setData] = useState(50);
  const [calls, setCalls] = useState(10);
  const [isFondation, setIsFondation] = useState(false);

  // Estimation basique logic
  const basePrice = (data * 1.5) + (calls * 5);
  const finalPrice = isFondation ? basePrice * 0.75 : basePrice;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-red-50 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-dark mb-6">Simulateur de <span className="text-primary italic">Facture</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Estimez vos besoins et découvrez le coût mensuel approximatif de votre forfait idéal chez R+ TELECOM.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="space-y-12">
            
            {/* Slider Data */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-lg font-black text-dark">Combien de Data (Internet) utilisez-vous ?</label>
                <span className="text-2xl font-black text-primary">{data} Go</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="200" 
                step="5"
                value={data}
                onChange={(e) => setData(Number(e.target.value))}
                className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Slider Calls */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-lg font-black text-dark">Heures d'appels hebdomadaires estimées :</label>
                <span className="text-2xl font-black text-primary">{calls} H</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="1"
                value={calls}
                onChange={(e) => setCalls(Number(e.target.value))}
                className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Fondation toggle */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h4 className="text-dark font-black">Adhérent Fondation Hassan II ?</h4>
                <p className="text-sm text-gray-500 font-bold">Bénéficiez instantanément de -25% de remise</p>
              </div>
              <button 
                onClick={() => setIsFondation(!isFondation)}
                className={`w-16 h-8 rounded-full p-1 transition-colors ${isFondation ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isFondation ? 'translate-x-8' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Estimation Result */}
            <div className="border-t border-gray-100 pt-8 pt-8 flex flex-col md:flex-row items-center justify-between bg-white">
               <div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Votre Mensualité Estimée</p>
                  <div className="flex items-end space-x-2">
                    <span className="text-5xl font-black text-dark">{Math.round(finalPrice)}</span>
                    <span className="text-xl font-bold text-gray-400 mb-1">DH / mois</span>
                  </div>
               </div>
               <Link href="/souscrire" className="mt-8 md:mt-0 w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-dark text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-primary transition-all">
                  <span>VOIR LES OFFRES</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculateurPage;
