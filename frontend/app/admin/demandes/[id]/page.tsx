'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Package, 
  Download, 
  CheckCircle2, 
  XCircle, 
  FileText,
  AlertCircle,
  QrCode,
  Smartphone,
  Mail,
  CreditCard,
  MapPin,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SubscriptionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`http://localhost:5000/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSub(response.data || null);
    } catch (err) {
      toast.error('Détails introuvables');
      router.push('/admin/demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!confirm(`Voulez-vous ${status === 'approved' ? 'approuver' : 'rejeter'} cette demande ?`)) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.patch(
        `http://localhost:5000/api/subscriptions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSub(response.data);
      toast.success(`Statut mis à jour : ${status}`);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!sub) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
       <button 
        onClick={() => router.back()}
        className="inline-flex items-center text-gray-400 hover:text-dark font-black text-xs uppercase tracking-[0.2em] transition-all group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Retour à la liste
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Data */}
        <div className="flex-[2] space-y-8">
          {/* Client Info Card */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-dark tracking-tight mb-8 flex items-center">
              <div className="p-2 bg-primary/10 text-primary rounded-xl mr-4">
                <User className="w-5 h-5" />
              </div>
              Informations Client
            </h3>
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
              <DetailField label="Nom Complet" value={sub.client_name} icon={<User className="w-4 h-4" />} />
              <DetailField label="Numéro CIN" value={sub.client_cin} icon={<CreditCard className="w-4 h-4" />} />
              <DetailField label="Adresse Email" value={sub.client_email} icon={<Mail className="w-4 h-4" />} />
              <DetailField label="Téléphone" value={sub.client_phone} icon={<Smartphone className="w-4 h-4" />} />
              <DetailField label="Type Client" value={sub.is_fondation ? 'Fondation' : 'Grand Public'} highlighted={sub.is_fondation} />
              <div className="sm:col-span-2">
                 <DetailField label="Adresse d'installation" value={sub.client_address || 'Non renseignée'} icon={<MapPin className="w-4 h-4" />} />
              </div>
            </div>
          </section>

          {/* Offer Details Card */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
             <h3 className="text-xl font-black text-dark tracking-tight mb-8 flex items-center">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mr-4">
                <Package className="w-5 h-5" />
              </div>
              Détails de l'Offre
            </h3>
            <div className="bg-gray-50 rounded-3xl p-8 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Offre Souscrite</span>
                <span className="font-black text-dark">{sub.offer_name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Catégorie</span>
                <span className="font-black text-primary uppercase tracking-widest text-[10px] bg-white px-3 py-1 rounded-full border border-red-100">{sub.offer_category}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="space-y-3">
                <PriceItem label="Prix de base" value={sub.base_price} />
                {sub.is_fondation && <PriceItem label="Remise Fondation (-25%)" value={-sub.discount} isHighlight />}
                <PriceItem label="Frais de service" value={sub.service_fee} />
                <PriceItem label="Frais routeur" value={sub.router_fee} />
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-dark font-black uppercase tracking-widest text-xs">Total Mensuel</span>
                  <span className="text-2xl font-black text-primary">{sub.total_price} DH</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Actions & Documents */}
        <div className="flex-1 space-y-8">
          {/* Status Actions */}
          <section className="bg-dark text-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/10">
            <h3 className="text-lg font-black tracking-tight mb-8">Statut du Dossier</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Statut Actuel</span>
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${
                   sub.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                   sub.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                   'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {sub.status === 'approved' ? 'Approuvée' : sub.status === 'rejected' ? 'Refusée' : 'En attente'}
                </span>
              </div>

              {sub.status === 'pending' ? (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateStatus('approved')}
                    className="bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-900/40"
                  >
                    APPROUVER
                  </button>
                  <button 
                    onClick={() => updateStatus('rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-900/40"
                  >
                    REJETER
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Actions Disponibles</p>
                  <a 
                    href={`http://localhost:5000/api/contracts/${id}/download`}
                    target="_blank"
                    className="w-full bg-white text-dark font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    <span>CONTRAT PDF</span>
                  </a>
                   <button 
                     onClick={() => setQrOpen(true)}
                     className="w-full bg-white/5 text-white border border-white/10 font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 hover:bg-white/10"
                   >
                    <QrCode className="w-5 h-5" />
                    <span>CODE QR SUIVI</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Documents Section */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-lg font-black text-dark tracking-tight mb-8">Pièces Jointes</h3>
            <div className="space-y-4">
              <DocumentRow label="Carte Nationale (CNI)" url={sub.cin_url} />
              {sub.is_fondation && <DocumentRow label="Carte Fondation" url={sub.fondation_card_url} />}
            </div>
          </section>

          {/* Activity Log Placeholder */}
          <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Créé le {format(new Date(sub.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
      </div>

      {/* QR Modal Overlay */}
      {qrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/80 backdrop-blur-sm" onClick={() => setQrOpen(false)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center relative"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-dark mb-2">Code de Suivi</h3>
            <p className="text-sm text-gray-400 mb-8">Scannez pour suivre l'état de l'installation.</p>
            <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-100 mb-8">
              <img src={`http://localhost:5000/api/qrcode/subscription/${id}`} alt="QR Code" className="w-full aspect-square" />
            </div>
            <button 
              onClick={() => setQrOpen(false)}
              className="w-full bg-dark text-white font-black py-4 rounded-2xl"
            >
              FERMER
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const DetailField = ({ label, value, icon, highlighted }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
      {icon && <span className="mr-2 text-gray-300">{icon}</span>}
      {label}
    </label>
    <p className={`text-sm font-bold ${highlighted ? 'text-primary' : 'text-dark'}`}>{value}</p>
  </div>
);

const PriceItem = ({ label, value, isHighlight }: any) => (
  <div className="flex justify-between items-center text-xs">
    <span className={isHighlight ? 'text-primary font-bold' : 'text-gray-500 font-medium'}>{label}</span>
      <span className={`font-bold ${isHighlight ? 'text-primary' : 'text-dark'}`}>
      {value > 0 ? `+${value}` : value} DH
    </span>
  </div>
);

const DocumentRow = ({ label, url }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary transition-colors">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-black text-dark leading-none">{label}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{url ? 'Disponible' : 'Non fourni'}</p>
      </div>
    </div>
    {url ? (
      <a 
        href={url} 
        target="_blank" 
        className="p-2 bg-white text-gray-400 hover:text-primary rounded-lg shadow-sm transition-all"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    ) : (
      <AlertCircle className="w-4 h-4 text-orange-300" />
    )}
  </div>
);

const ExternalLink = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default SubscriptionDetailPage;
