'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Package, 
  Upload as UploadIcon, 
  CheckCircle2, 
  Download,
  AlertTriangle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import UploadForm from '@/components/UploadForm';

const steps = [
  { id: 1, name: 'Offre', icon: <Package className="w-5 h-5" /> },
  { id: 2, name: 'Infos', icon: <User className="w-5 h-5" /> },
  { id: 3, name: 'Documents', icon: <UploadIcon className="w-5 h-5" /> },
  { id: 4, name: 'Confirmation', icon: <CheckCircle2 className="w-5 h-5" /> },
];

const SouscrirePage = () => {
  const [step, setStep] = useState(1);
  const [isFondation, setIsFondation] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<any>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCIN: '',
    address: ''
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/offers');
        setOffers(response.data);
      } catch (err) {
        toast.error('Impossible de charger les offres');
      }
    };
    fetchOffers();
  }, []);

  const nextStep = () => {
    if (step === 1 && !selectedOffer) {
      toast.error('Veuillez choisir une offre');
      return;
    }
    if (step === 2) {
      const { clientName, clientEmail, clientPhone, clientCIN } = formData;
      if (!clientName || !clientEmail || !clientPhone || !clientCIN) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        offerId: selectedOffer.id,
        offerName: selectedOffer.name,
        offerCategory: selectedOffer.category,
        ...formData,
        isFondation,
        basePrice: selectedOffer.price,
        discount: isFondation ? selectedOffer.price * 0.25 : 0,
        serviceFee: isFondation ? 0 : (selectedOffer.serviceFee || 0),
        routerFee: selectedOffer.routerFee || 0,
        totalPrice: (isFondation ? selectedOffer.price * 0.75 : selectedOffer.price) + 
                    (isFondation ? 0 : (selectedOffer.serviceFee || 0)) + 
                    (selectedOffer.routerFee || 0)
      };

      const response = await axios.post('http://localhost:5000/api/subscriptions', payload);
      setSubscriptionId(response.data.subscriptionId);
      setStep(4);
      toast.success('Souscription confirmée !');
    } catch (err) {
      toast.error('Erreur lors de la souscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary mb-8 font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Link>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between z-10">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                  step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-red-500/20' : 'bg-white border-gray-200 text-gray-300'
                }`}>
                  {step > s.id ? <Check className="w-6 h-6" /> : s.icon}
                </div>
                <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-gray-300'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Offer Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-black text-dark mb-2">Choisissez votre offre</h2>
                  <p className="text-gray-400 text-sm">Sélectionnez le forfait qui vous correspond le mieux.</p>
                  
                  <div className="mt-8 flex items-center bg-gray-100 p-1 rounded-2xl">
                    <button 
                      onClick={() => setIsFondation(false)}
                      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isFondation ? 'bg-white text-dark shadow-sm' : 'text-gray-400 font-bold'}`}
                    >
                      Grand Public
                    </button>
                    <button 
                      onClick={() => setIsFondation(true)}
                      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isFondation ? 'bg-primary text-white shadow-xl shadow-red-500/20' : 'text-gray-400 font-bold'}`}
                    >
                      Fondations (-25%)
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {offers.map((offer) => (
                    <button
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer)}
                      className={`relative p-6 rounded-3xl border-2 transition-all text-left ${
                        selectedOffer?.id === offer.id 
                        ? 'border-primary bg-red-50 ring-8 ring-primary/5' 
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-red-100 shadow-sm">
                          {offer.category}
                        </span>
                        {selectedOffer?.id === offer.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                      <h4 className="font-bold text-dark text-lg mb-1">{offer.name}</h4>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black text-primary">{isFondation ? offer.fondationPrice : offer.price}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">DH/mois</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                  <button
                    onClick={nextStep}
                    disabled={!selectedOffer}
                    className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>CONTINUER</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-dark mb-2">Informations Personnelles</h2>
                  <p className="text-gray-400 text-sm">Saisissez vos coordonnées pour le contrat.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Nom et Prénom *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Mohamed Alami"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">CIN *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: AB123456"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.clientCIN}
                      onChange={(e) => setFormData({...formData, clientCIN: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Email *</label>
                    <input 
                      type="email" 
                      placeholder="Ex: mohamed@email.com"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Téléphone *</label>
                    <input 
                      type="tel" 
                      placeholder="Ex: 0612345678"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Adresse d'installation</label>
                    <textarea 
                      placeholder="Votre adresse complète..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-dark font-bold outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-2xl transition-all"
                  >
                    PRÉCÉDENT
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-[2] bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>CONTINUER</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black text-dark mb-2">Documents Requis</h2>
                  <p className="text-gray-400 text-sm">Veuillez télécharger les fichiers justificatifs.</p>
                </div>

                {subscriptionId ? (
                   <UploadForm 
                    subscriptionId={subscriptionId} 
                    isFondation={isFondation} 
                    onComplete={(urls) => { 
                      setUploadedUrls(urls);
                      nextStep();
                    }} 
                  />
                ) : (
                  <div className="bg-red-50 p-10 rounded-[2rem] text-center border-2 border-red-100 border-dashed">
                    <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-primary font-black uppercase tracking-widest text-sm mb-6">Validation Préléminaire Requise</p>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">Cliquez ci-dessous pour créer votre dossier de souscription et déverrouiller le téléchargement.</p>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-primary text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center mx-auto"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "CRÉER MON DOSSIER"}
                    </button>
                  </div>
                )}

                {!uploadedUrls && (
                  <button
                    onClick={prevStep}
                    className="w-full text-gray-400 font-bold hover:text-dark transition-colors"
                  >
                    Revenir aux informations
                  </button>
                )}
              </motion.div>
            )}

            {/* Step 4: Final Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-dark mb-4">Souscription Réussie !</h2>
                <p className="text-primary font-bold mb-2">Email de confirmation envoyé</p>
                <p className="text-gray-500 mb-10">Votre demande <span className="text-dark font-bold font-mono">#{subscriptionId?.substring(0, 8)}</span> a été envoyée avec succès.</p>

                <div className="bg-gray-50 rounded-3xl p-8 max-w-md mx-auto mb-10 border border-gray-100">
                  <h4 className="font-bold text-dark mb-4 flex items-center justify-center">
                    <Package className="w-5 h-5 mr-2 text-primary" />
                    Récapitulatif Offre
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Client :</span>
                      <span className="font-bold text-dark">{formData.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Offre :</span>
                      <span className="font-bold text-dark">{selectedOffer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mensualité :</span>
                      <span className="font-black text-primary">{isFondation ? selectedOffer.price * 0.75 : selectedOffer.price} DH</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-w-md mx-auto">
                  <a 
                    href={`http://localhost:5000/api/contracts/${subscriptionId}/download`}
                    target="_blank"
                    className="flex items-center justify-center bg-dark text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    TÉLÉCHARGER MON CONTRAT
                  </a>
                  <Link 
                    href="/"
                    className="flex items-center justify-center border-2 border-gray-200 text-gray-500 font-bold py-4 rounded-2xl transition-all hover:border-dark hover:text-dark"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SouscrirePage;
