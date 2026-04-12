'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FolderOpen,
  FileText,
  User,
  Calendar,
  Loader2,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DocumentViewer from '@/components/admin/DocumentViewer';

const DocumentsPage = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const fetchDocs = async () => {
    try {
      // In a real app, there's a dedicated /api/admin/documents route
      // For now, use the main subscriptions list which contains doc URLs
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(response.data.data || []);
      setFilteredSubs(response.data.data || []);
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    let result = subscriptions;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(sub => 
        sub.client_name.toLowerCase().includes(s) || 
        sub.id.toLowerCase().includes(s)
      );
    }

    if (filter === 'cni') {
      result = result.filter(sub => sub.cin_url);
    } else if (filter === 'fondation') {
      result = result.filter(sub => sub.is_fondation && sub.fondation_card_url);
    } else if (filter === 'complete') {
      result = result.filter(sub => sub.cin_url && (!sub.is_fondation || sub.fondation_card_url));
    } else if (filter === 'incomplete') {
      result = result.filter(sub => !sub.cin_url || (sub.is_fondation && !sub.fondation_card_url));
    }

    setFilteredSubs(result);
  }, [search, filter, subscriptions]);

  const stats = {
    total: subscriptions.length,
    complete: subscriptions.filter(s => s.cin_url && (!s.is_fondation || s.fondation_card_url)).length,
    incomplete: subscriptions.filter(s => !s.cin_url || (s.is_fondation && !s.fondation_card_url)).length,
    noFondation: subscriptions.filter(s => !s.is_fondation).length
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-black text-dark tracking-tight">Gestion documentaire</h1>
        <p className="text-gray-400">Suivi et validation des justificatifs clients.</p>
      </header>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryItem label="Total documents" value={stats.total} color="text-dark" />
        <SummaryItem label="Complets" value={stats.complete} color="text-green-500" />
        <SummaryItem label="Incomplets" value={stats.incomplete} color="text-orange-500" />
        <SummaryItem label="Grand Public" value={stats.noFondation} color="text-gray-400" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par client ou ID..."
            className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>Tous</FilterButton>
          <FilterButton active={filter === 'cni'} onClick={() => setFilter('cni')}>CNI seulement</FilterButton>
          <FilterButton active={filter === 'fondation'} onClick={() => setFilter('fondation')}>Fondation seulement</FilterButton>
          <FilterButton active={filter === 'complete'} onClick={() => setFilter('complete')}>Complets</FilterButton>
          <FilterButton active={filter === 'incomplete'} onClick={() => setFilter('incomplete')}>Incomplets</FilterButton>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Synchronisation...</p>
        </div>
      ) : filteredSubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSubs.map((sub) => (
            <motion.div 
              layout
              key={sub.id}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID #{sub.id.substring(0, 8)}</p>
                  <p className="text-xs font-bold text-dark">{format(new Date(sub.created_at), 'dd MMM yyyy', { locale: fr })}</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-black text-dark leading-tight line-clamp-1">{sub.client_name}</h4>
                <p className="text-xs font-bold text-primary italic uppercase tracking-widest mt-1">{sub.offer_name}</p>
              </div>

              <div className="space-y-3 mb-8">
                <StatusRow label="CNI" exists={!!sub.cin_url} />
                <StatusRow label="Carte Fondation" exists={!!sub.fondation_card_url} notRequired={!sub.is_fondation} />
              </div>

              <button 
                onClick={() => {
                  setSelectedSub(sub);
                  setViewerOpen(true);
                }}
                className="w-full bg-dark text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-lg shadow-black/10"
              >
                <Eye className="w-5 h-5" />
                <span>VOIR LES DOCUMENTS</span>
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <FolderOpen className="w-16 h-16 text-gray-100 mx-auto mb-4" />
          <p className="text-gray-400 font-bold">Aucun document ne correspond à vos critères.</p>
        </div>
      )}

      {/* Viewer Modal */}
      <AnimatePresence>
        {viewerOpen && selectedSub && (
          <DocumentViewer 
            isOpen={viewerOpen}
            onClose={() => setViewerOpen(false)}
            clientName={selectedSub.client_name}
            cinUrl={selectedSub.cin_url}
            fondationUrl={selectedSub.fondation_card_url}
            isFondation={selectedSub.is_fondation}
            subscriptionId={selectedSub.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SummaryItem = ({ label, value, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value}</span>
  </div>
);

const FilterButton = ({ children, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
      active 
      ? 'bg-dark text-white border-dark transform scale-105 shadow-lg shadow-black/10' 
      : 'bg-white text-gray-400 border-gray-100 hover:border-dark hover:text-dark'
    }`}
  >
    {children}
  </button>
);

const StatusRow = ({ label, exists, notRequired }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    {notRequired ? (
      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded">N/A</span>
    ) : exists ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    )}
  </div>
);

export default DocumentsPage;
