'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Lock, Bell, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ParametresPage = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('Administrateur R+');
  const [email, setEmail] = useState('admin@rplustelecom.ma');

  useEffect(() => {
    const savedName = localStorage.getItem('admin_name');
    const token = localStorage.getItem('admin_token');

    if (savedName) setFullName(savedName);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.email) setEmail(payload.email);
      } catch {
        // Ignore decode failures and keep defaults.
      }
    }
  }, []);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('admin_name', fullName.trim() || 'Administrateur R+');
    window.dispatchEvent(new Event('admin-profile-updated'));
    // Simulate API call for settings
    setTimeout(() => {
      setLoading(false);
      toast.success('Paramètres enregistrés avec succès');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <header>
        <h1 className="text-3xl font-black text-dark tracking-tight">Paramètres</h1>
        <p className="text-gray-400 mt-1">Gérez votre compte et vos préférences.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section Profil */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-dark tracking-tight">Profil Administrateur</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-dark outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de contact</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full bg-gray-100/50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Section Sécurité */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-dark tracking-tight">Sécurité</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
              <input 
                type="password" 
                placeholder="Laisser vide pour ne pas changer"
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-dark outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmer</label>
              <input 
                type="password" 
                placeholder="Répétez le mot de passe"
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-dark outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="bg-orange-50/50 p-4 rounded-2xl flex items-start space-x-3">
             <ShieldCheck className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
             <p className="text-xs font-bold text-orange-700/80 leading-relaxed">
               L'accès administrateur est protégé par une clé JWT statique et les identifiants d'environnement actuels. Contactez le service technique pour une rotation complète des clés.
             </p>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button type="button" className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark transition-all">
            Annuler
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-red-500/20 flex items-center space-x-3 hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>ENREGISTRER</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParametresPage;
