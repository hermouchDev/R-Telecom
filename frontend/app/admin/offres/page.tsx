'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Loader2, Package, Search,
  Zap, DollarSign, Star, ToggleRight, ToggleLeft, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import OfferModal from '@/components/admin/OfferModal';

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  fibre:  { color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Fibre' },
  '5g':   { color: 'text-purple-600', bg: 'bg-purple-100', label: '5G Box' },
  adsl:   { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'ADSL' },
  mobile: { color: 'text-green-600',  bg: 'bg-green-100',  label: 'Mobile' },
  '4g':   { color: 'text-orange-600', bg: 'bg-orange-100', label: '4G+' },
};

const OffresPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:5000/api/offers/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error('Erreur chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  useEffect(() => {
    let result = offers;
    if (catFilter !== 'all') result = result.filter(o => o.category === catFilter);
    if (search) result = result.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, catFilter, offers]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement "${name}" ?`)) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:5000/api/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Offre supprimée');
      fetchOffers();
    } catch (err) {
      toast.error('Erreur suppression');
    }
  };

  const handleToggleActive = async (offer: any) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`http://localhost:5000/api/offers/${offer.id}`, 
        { ...offer, isActive: !offer.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(offer.isActive ? 'Offre désactivée' : 'Offre activée');
      fetchOffers();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  // Stats
  const total = offers.length;
  const active = offers.filter(o => o.isActive).length;
  const categories = [...new Set(offers.map(o => o.category))].length;
  const avgPrice = offers.length ? Math.round(offers.reduce((s, o) => s + o.price, 0) / offers.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Catalogue des Offres</h1>
          <p className="text-gray-400 mt-1">Gérez les offres disponibles pour les clients.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOffers}
            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-2xl shadow-sm transition-all hover:border-red-100"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setSelectedOffer(null); setIsModalOpen(true); }}
            className="bg-primary hover:bg-red-700 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center space-x-2 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>NOUVELLE OFFRE</span>
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Offres', value: total, icon: <Package className="w-5 h-5" />, color: 'text-dark' },
          { label: 'Actives', value: active, icon: <ToggleRight className="w-5 h-5" />, color: 'text-green-600' },
          { label: 'Catégories', value: categories, icon: <Zap className="w-5 h-5" />, color: 'text-purple-600' },
          { label: 'Prix Moyen', value: `${avgPrice} DH`, icon: <DollarSign className="w-5 h-5" />, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${s.color} bg-gray-50 p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-xl font-black ${s.color} mt-0.5`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Rechercher une offre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'fibre', '5g', 'adsl', 'mobile', '4g'].map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                catFilter === cat
                  ? 'bg-primary text-white shadow-md shadow-red-500/20'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Toutes' : CATEGORY_CONFIG[cat]?.label || cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-400">Aucune offre trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((offer, i) => {
              const cat = CATEGORY_CONFIG[offer.category] || { color: 'text-gray-600', bg: 'bg-gray-100', label: offer.category };
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className={`group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 transition-all overflow-hidden ${!offer.isActive ? 'opacity-60' : ''}`}
                >
                  {/* Card Top */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </div>
                      {!offer.isActive && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400">
                          Inactif
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-dark mb-1 leading-tight">{offer.name}</h3>
                    {offer.speed && (
                      <p className="text-xs font-bold text-gray-400 flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-primary" /> {offer.speed}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-3xl font-black text-dark">{offer.price}</span>
                        <span className="text-xs font-bold text-gray-400 ml-1">DH/mois</span>
                      </div>
                      {offer.fondationPrice && (
                        <div className="text-right">
                          <Star className="w-3 h-3 text-primary inline mb-0.5" />
                          <span className="text-sm font-black text-primary ml-1">{offer.fondationPrice} DH</span>
                          <p className="text-[9px] text-gray-400 font-bold">Fondation</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  {offer.features?.length > 0 && (
                    <div className="px-6 pb-4 space-y-1">
                      {offer.features.slice(0, 3).map((f: string, fi: number) => (
                        <p key={fi} className="text-[10px] font-bold text-gray-400 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0" />
                          {f}
                        </p>
                      ))}
                      {offer.features.length > 3 && (
                        <p className="text-[10px] text-gray-300 font-bold">+{offer.features.length - 3} autres...</p>
                      )}
                    </div>
                  )}

                  {/* Extra fees */}
                  {(offer.serviceFee > 0 || offer.routerFee > 0) && (
                    <div className="mx-6 mb-4 bg-gray-50 rounded-2xl px-4 py-2 flex justify-between text-[10px] font-bold text-gray-400">
                      {offer.serviceFee > 0 && <span>Frais service: {offer.serviceFee} DH</span>}
                      {offer.routerFee > 0 && <span>Routeur: {offer.routerFee} DH</span>}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-gray-50 px-6 py-4 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${offer.isActive ? 'text-green-500 hover:text-red-500' : 'text-gray-300 hover:text-green-500'}`}
                    >
                      {offer.isActive
                        ? <><ToggleRight className="w-5 h-5" /><span>Actif</span></>
                        : <><ToggleLeft className="w-5 h-5" /><span>Inactif</span></>}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { setSelectedOffer(offer); setIsModalOpen(true); }}
                        className="p-2.5 bg-gray-100 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id, offer.name)}
                        className="p-2.5 bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
        onSuccess={fetchOffers}
      />
    </div>
  );
};

export default OffresPage;
