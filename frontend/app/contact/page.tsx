'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message envoyé avec succès ! Notre équipe vous répondra sous 24h.');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-red-50 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-dark mb-6">Contactez <span className="text-primary italic">Nous</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Une question technique ? Un besoin commercial ? Notre équipe d'experts R+ TELECOM est à votre disposition 7j/7.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          
          {/* Card Info */}
          <div className="bg-dark text-white rounded-[3rem] p-10 shadow-2xl shadow-dark/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="text-3xl font-black mb-8 relative z-10">Informations de Contact</h3>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Service Client</p>
                  <p className="text-2xl font-black">+212 666 38 76 94</p>
                  <p className="text-sm text-gray-400 mt-1">Lundi - Dimanche : 8h00 - 17h00</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Email</p>
                  <p className="text-xl font-bold">yahyahajar592@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Agence</p>
                  <p className="text-lg font-bold leading-relaxed">Ain Sbaa<br/>Casablanca<br/>Maroc</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-2xl font-black text-dark mb-8">Envoyez-nous un message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: Youssef..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Sujet</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Demande d'information commerciale</option>
                  <option>Support Technique (Panne)</option>
                  <option>Réclamation Facturation</option>
                  <option>Devenir Partenaire</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <span className="animate-pulse">ENVOI EN COURS...</span> : (
                  <>
                    <span>ENVOYER LE MESSAGE</span>
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
