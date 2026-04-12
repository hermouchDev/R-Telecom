'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Loader2, 
  Calendar,
  Layers,
  Plus
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import SubscriptionTable from '@/components/admin/SubscriptionTable';
import SubscriptionModal from '@/components/admin/SubscriptionModal';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(response.data.data || []);
      setFilteredSubs(response.data.data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    let result = subscriptions;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(sub => 
        sub.client_name?.toLowerCase().includes(s) || 
        sub.client_email?.toLowerCase().includes(s) ||
        sub.client_cin?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(sub => sub.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(sub => sub.offer_category === categoryFilter);
    }

    setFilteredSubs(result);
  }, [search, statusFilter, categoryFilter, subscriptions]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(`http://localhost:5000/api/subscriptions/${id}/status`, 
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Demande approuvée');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(`http://localhost:5000/api/subscriptions/${id}/status`, 
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Demande rejetée');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ÊTES-VOUS SÛR ? Cette action est irréversible et supprimera définitivement la souscription.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:5000/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Souscription supprimée');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Erreur suppression');
    }
  };

  const handleEditOpen = (sub: any) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const handleAddOpen = () => {
    setSelectedSub(null);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    if (filteredSubs.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const data = filteredSubs.map(s => ({
      ID: s.id.substring(0, 8),
      Client: s.client_name,
      Email: s.client_email,
      Téléphone: s.client_phone,
      Offre: s.offer_name,
      Montant: `${s.total_price} DH`,
      Statut: s.status === 'approved' ? 'Approuvée' : s.status === 'rejected' ? 'Rejetée' : 'En attente',
      Type: s.is_fondation ? 'Fondation' : 'Grand Public',
      Date: new Date(s.created_at).toLocaleDateString('fr-FR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes");
    XLSX.writeFile(workbook, `Demandes_RPlus_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Rapport Excel exporté !');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Gestion des Demandes</h1>
          <p className="text-gray-400">Consultez, modifiez ou gérez les souscriptions clients.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExport}
            className="bg-white hover:bg-gray-50 text-dark border border-gray-100 font-black px-6 py-3 rounded-2xl shadow-sm transition-all flex items-center space-x-3 text-sm"
          >
            <Download className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">EXPORTER</span>
          </button>
          <button 
            onClick={handleAddOpen}
            className="bg-primary hover:bg-red-700 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center space-x-3 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>AJOUTER</span>
          </button>
        </div>
      </header>

      {/* Filters Bar */}
      {/* ... (filters keep as before) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Recherche</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Nom, Email ou CIN..."
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Statut</label>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <select 
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En Attente</option>
              <option value="approved">Approuvée</option>
              <option value="rejected">Refusée</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Catégorie</label>
          <div className="relative group">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <select 
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes les Catégories</option>
              <option value="Fibre">Fibre Optique</option>
              <option value="5G">5G Box</option>
              <option value="ADSL">ADSL</option>
              <option value="Mobile">Mobile</option>
              <option value="4G+">4G+ El Manzil</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Date</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="date"
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest leading-none mt-4">Chargement des données...</p>
          </div>
        ) : filteredSubs.length > 0 ? (
          <SubscriptionTable 
            subscriptions={filteredSubs} 
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEditOpen}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-24 space-y-4">
            <div className="p-6 bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-gray-200">
                <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-dark">Aucun résultat trouvé</h3>
            <p className="text-gray-400 text-sm">Réessayez avec d'autres filtres ou critères de recherche.</p>
          </div>
        )}

        {/* Pagination placeholder */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Affichage de {filteredSubs.length} sur {subscriptions.length} demandes
          </p>
          <div className="flex space-x-2">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscription={selectedSub}
        onSuccess={fetchSubscriptions}
      />
    </div>
  );
};

export default SubscriptionsPage;
