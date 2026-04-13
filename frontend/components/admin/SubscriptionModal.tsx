'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  User, 
  Package, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  Hash,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { apiUrl } from '@/utils/api';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: any; // If provided, we are in Edit mode
  onSuccess: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  subscription, 
  onSuccess 
}) => {
  const isEdit = !!subscription;
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    offerId: '',
    offerName: '',
    offerCategory: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCIN: '',
    clientAddress: '',
    isFondation: false,
    basePrice: 0,
    totalPrice: 0,
    discount: 0,
    serviceFee: 0,
    routerFee: 0,
    status: 'pending'
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(apiUrl('/offers'));
        setOffers(response.data);
      } catch (err) {
        toast.error('Erreur chargement offres');
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    if (subscription) {
      setFormData({
        offerId: subscription.offer_id,
        offerName: subscription.offer_name,
        offerCategory: subscription.offer_category,
        clientName: subscription.client_name,
        clientEmail: subscription.client_email,
        clientPhone: subscription.client_phone,
        clientCIN: subscription.client_cin,
        clientAddress: subscription.client_address || '',
        isFondation: subscription.is_fondation,
        basePrice: subscription.base_price,
        totalPrice: subscription.total_price,
        discount: subscription.discount || 0,
        serviceFee: subscription.service_fee || 0,
        routerFee: subscription.router_fee || 0,
        status: subscription.status
      });
    } else {
      setFormData({
        offerId: '',
        offerName: '',
        offerCategory: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientCIN: '',
        clientAddress: '',
        isFondation: false,
        basePrice: 0,
        totalPrice: 0,
        discount: 0,
        serviceFee: 0,
        routerFee: 0,
        status: 'pending'
      });
    }
  }, [subscription, isOpen]);

  const handleOfferChange = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      const discount = formData.isFondation ? offer.price * 0.25 : 0;
      const serviceFee = formData.isFondation ? 0 : (offer.serviceFee || 0);
      const routerFee = offer.routerFee || 0;
      const totalPrice = (offer.price - discount) + serviceFee + routerFee;

      setFormData({
        ...formData,
        offerId: offer.id,
        offerName: offer.name,
        offerCategory: offer.category,
        basePrice: offer.price,
        discount,
        serviceFee,
        routerFee,
        totalPrice
      });
    }
  };

  const handleFondationToggle = (val: boolean) => {
    const offer = offers.find(o => o.id === formData.offerId);
    if (offer) {
      const discount = val ? offer.price * 0.25 : 0;
      const serviceFee = val ? 0 : (offer.serviceFee || 0);
      const routerFee = offer.routerFee || 0;
      const totalPrice = (offer.price - discount) + serviceFee + routerFee;

      setFormData({
        ...formData,
        isFondation: val,
        discount,
        serviceFee,
        totalPrice
      });
    } else {
      setFormData({ ...formData, isFondation: val });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const selectedOffer = offers.find((o) => String(o.id) === String(formData.offerId));
      const normalizedClientName = formData.clientName.trim();
      const normalizedClientEmail = formData.clientEmail.trim();
      const normalizedClientPhone = formData.clientPhone.trim();
      const normalizedClientCIN = formData.clientCIN.trim();
      const normalizedOfferId = String(formData.offerId || selectedOffer?.id || '').trim();

      if (!normalizedOfferId || !normalizedClientName || !normalizedClientEmail || !normalizedClientPhone || !normalizedClientCIN) {
        toast.error('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const payload = {
        offerId: normalizedOfferId,
        offerName: formData.offerName || selectedOffer?.name || '',
        offerCategory: formData.offerCategory || selectedOffer?.category || '',
        clientName: normalizedClientName,
        clientEmail: normalizedClientEmail,
        clientPhone: normalizedClientPhone,
        clientCIN: normalizedClientCIN,
        clientAddress: formData.clientAddress.trim(),
        address: formData.clientAddress.trim(),
        isFondation: formData.isFondation,
        basePrice: formData.basePrice,
        totalPrice: formData.totalPrice,
        discount: formData.discount,
        serviceFee: formData.serviceFee,
        routerFee: formData.routerFee,
        status: formData.status
      };

      if (isEdit) {
        await axios.put(apiUrl(`/subscriptions/${subscription.id}`), payload, config);
        toast.success('Mise à jour réussie');
      } else {
        await axios.post(apiUrl('/subscriptions'), payload, config);
        toast.success('Souscription ajoutée');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="admin-modal relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-dark tracking-tight">
              {isEdit ? 'Modifier la souscription' : 'Nouvelle souscription'}
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {isEdit ? `ID: #${subscription.id.substring(0, 8)}` : 'Saisie manuelle administrateur'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white hover:text-primary rounded-2xl transition-all text-gray-400 shadow-sm border border-transparent hover:border-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <form id="sub-form" onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Client */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest">Informations Client</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Nom complet" 
                  value={formData.clientName} 
                  onChange={(v) => setFormData({...formData, clientName: v})} 
                  placeholder="Mohamed Alami"
                  icon={<User className="w-4 h-4" />}
                />
                <FormInput 
                  label="CIN" 
                  value={formData.clientCIN} 
                  onChange={(v) => setFormData({...formData, clientCIN: v})} 
                  placeholder="AB123456"
                  icon={<Hash className="w-4 h-4" />}
                />
                <FormInput 
                  label="Email" 
                  type="email"
                  value={formData.clientEmail} 
                  onChange={(v) => setFormData({...formData, clientEmail: v})} 
                  placeholder="client@mail.com"
                  icon={<Mail className="w-4 h-4" />}
                />
                <FormInput 
                  label="Téléphone" 
                  value={formData.clientPhone} 
                  onChange={(v) => setFormData({...formData, clientPhone: v})} 
                  placeholder="0612345678"
                  icon={<Phone className="w-4 h-4" />}
                />
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-primary" /> Adresse d'installation
                  </label>
                  <textarea 
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm text-dark placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 h-24 resize-none transition-all outline-none font-bold"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                    placeholder="Adresse complète..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Offre */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-widest">Détails de l'Offre</h3>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => handleFondationToggle(false)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!formData.isFondation ? 'bg-white text-dark shadow-sm' : 'text-gray-400'}`}
                  >
                    Public
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleFondationToggle(true)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.isFondation ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
                  >
                    Fondation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Sélectionner Offre</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm text-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none font-black"
                    value={formData.offerId}
                    onChange={(e) => handleOfferChange(e.target.value)}
                  >
                    <option value="" disabled>Choisir une offre...</option>
                    {offers.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.category.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Statut</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm text-dark focus:ring-2 focus:ring-primary/20 transition-all outline-none font-black"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">En Attente</option>
                    <option value="approved">Approuvée</option>
                    <option value="rejected">Refusée</option>
                  </select>
                </div>
              </div>

              {/* Price Recap */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <PriceItem label="Prix Base" value={formData.basePrice} />
                <PriceItem label="Remise" value={formData.discount} color="text-red-500" />
                <PriceItem label="Frais Service" value={formData.serviceFee + formData.routerFee} />
                <PriceItem label="Total Final" value={formData.totalPrice} highlight />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end items-center space-x-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            form="sub-form"
            disabled={loading || !formData.offerId}
            className="px-10 py-4 bg-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10 flex items-center space-x-3 hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isEdit ? 'ENREGISTRER LES MODIFICATIONS' : 'CRÉER LA SOUSCRIPTION'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text", icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center">
      {icon && <span className="mr-1 text-primary">{icon}</span>}
      {label}
    </label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm text-dark placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const PriceItem = ({ label, value, color = "text-dark", highlight = false }: any) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{label}</span>
    <span className={`${highlight ? 'text-lg' : 'text-sm'} font-black ${color}`}>{value} DH</span>
  </div>
);

export default SubscriptionModal;
