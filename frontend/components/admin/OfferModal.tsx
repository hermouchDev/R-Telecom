'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Save, Loader2, Tag, Zap, DollarSign, Plus, Trash2, Package, ToggleLeft, ToggleRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: any;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: 'fibre', label: 'Fibre Optique', color: 'bg-blue-100 text-blue-600' },
  { value: '5g', label: '5G Box', color: 'bg-purple-100 text-purple-600' },
  { value: 'adsl', label: 'ADSL', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'mobile', label: 'Mobile', color: 'bg-green-100 text-green-600' },
  { value: '4g', label: '4G+ El Manzil', color: 'bg-orange-100 text-orange-600' },
];

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, offer, onSuccess }) => {
  const isEdit = !!offer;
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(['']);

  const [form, setForm] = useState({
    id: '',
    category: 'fibre',
    name: '',
    speed: '',
    price: '',
    fondationPrice: '',
    serviceFee: '0',
    routerFee: '0',
    isActive: true,
  });

  useEffect(() => {
    if (offer) {
      setForm({
        id: offer.id,
        category: offer.category,
        name: offer.name,
        speed: offer.speed || '',
        price: String(offer.price),
        fondationPrice: String(offer.fondationPrice || Math.round(offer.price * 0.75)),
        serviceFee: String(offer.serviceFee || 0),
        routerFee: String(offer.routerFee || 0),
        isActive: offer.isActive !== false,
      });
      setFeatures(offer.features?.length ? offer.features : ['']);
    } else {
      setForm({ id: '', category: 'fibre', name: '', speed: '', price: '', fondationPrice: '', serviceFee: '0', routerFee: '0', isActive: true });
      setFeatures(['']);
    }
  }, [offer, isOpen]);

  // Auto-calculate fondation price (25% off)
  const handlePriceChange = (val: string) => {
    const num = parseFloat(val) || 0;
    setForm({ ...form, price: val, fondationPrice: String(Math.round(num * 0.75 * 100) / 100) });
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => {
    const updated = [...features];
    updated[i] = val;
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error('Nom, catégorie et prix sont requis');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        ...form,
        price: parseFloat(form.price),
        fondationPrice: parseFloat(form.fondationPrice) || parseFloat(form.price) * 0.75,
        serviceFee: parseFloat(form.serviceFee) || 0,
        routerFee: parseFloat(form.routerFee) || 0,
        features: features.filter(f => f.trim() !== ''),
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/offers/${offer.id}`, payload, config);
        toast.success('Offre mise à jour !');
      } else {
        await axios.post('http://localhost:5000/api/offers', payload, config);
        toast.success('Offre créée !');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const catColor = CATEGORIES.find(c => c.value === form.category)?.color || 'bg-gray-100 text-gray-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${catColor}`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-dark tracking-tight">
                {isEdit ? 'Modifier l\'offre' : 'Nouvelle offre'}
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {isEdit ? `ID: ${offer.id}` : 'Catalogue R+ TELECOM'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 text-gray-400 hover:text-dark rounded-2xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-grow overflow-y-auto p-8">
          <form id="offer-form" onSubmit={handleSubmit} className="space-y-10">

            {/* Basic Info */}
            <div className="space-y-5">
              <SectionTitle icon={<Tag className="w-4 h-4" />} title="Informations Générales" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <Label>Nom de l'offre *</Label>
                  <input
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Ex: Fibre 500 Mbps Pro"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.value })}
                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                          form.category === cat.value
                            ? 'border-primary bg-red-50 text-primary'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Vitesse / Débit</Label>
                    <input
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ex: 200 Mbps"
                      value={form.speed}
                      onChange={e => setForm({ ...form, speed: e.target.value })}
                    />
                  </div>
                  {/* Active toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-xs font-black text-dark uppercase tracking-widest">Offre Active</p>
                      <p className="text-[10px] text-gray-400 font-bold">Visible sur le catalogue public</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className="transition-transform active:scale-95"
                    >
                      {form.isActive
                        ? <ToggleRight className="w-9 h-9 text-primary" />
                        : <ToggleLeft className="w-9 h-9 text-gray-300" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-5">
              <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Tarification" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PriceInput label="Prix Public (DH) *" value={form.price} onChange={handlePriceChange} placeholder="400" />
                <PriceInput label="Prix Fondation (DH)" value={form.fondationPrice} onChange={v => setForm({ ...form, fondationPrice: v })} placeholder="300" />
                <PriceInput label="Frais Service (DH)" value={form.serviceFee} onChange={v => setForm({ ...form, serviceFee: v })} placeholder="0" />
                <PriceInput label="Frais Routeur (DH)" value={form.routerFee} onChange={v => setForm({ ...form, routerFee: v })} placeholder="0" />
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-red-50/30 rounded-2xl p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                💡 Le prix Fondation est calculé automatiquement à -25% mais vous pouvez le modifier manuellement.
              </div>
            </div>

            {/* Features */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <SectionTitle icon={<Zap className="w-4 h-4" />} title="Caractéristiques" />
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
              <div className="space-y-3">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <input
                      className="flex-grow bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={`Caractéristique ${i + 1}...`}
                      value={feat}
                      onChange={e => updateFeature(i, e.target.value)}
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end items-center space-x-4">
          <button type="button" onClick={onClose} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark transition-all">
            Annuler
          </button>
          <button
            type="submit"
            form="offer-form"
            disabled={loading}
            className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-red-500/20 flex items-center space-x-3 hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isEdit ? 'ENREGISTRER' : 'CRÉER L\'OFFRE'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SectionTitle = ({ icon, title }: any) => (
  <div className="flex items-center space-x-3 text-primary">
    <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center">{icon}</div>
    <h3 className="font-black text-sm uppercase tracking-widest">{title}</h3>
  </div>
);

const Label = ({ children }: any) => (
  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{children}</label>
);

const PriceInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <input
      type="number"
      min="0"
      step="0.01"
      className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 text-center"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default OfferModal;
