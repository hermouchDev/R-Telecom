'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { apiUrl } from '@/utils/api';

const ITEMS_PER_PAGE = 20;

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE)),
    [totalCount]
  );

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(apiUrl('/subscriptions'), {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          status: statusFilter,
          category: categoryFilter
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const rows = response.data.data || [];
      setSubscriptions(rows);
      setFilteredSubs(rows);
      setTotalCount(response.data.count || 0);
    } catch {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, statusFilter, categoryFilter]);

  useEffect(() => {
    let result = subscriptions;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((sub) =>
        sub.client_name?.toLowerCase().includes(s) ||
        sub.client_email?.toLowerCase().includes(s) ||
        sub.client_cin?.toLowerCase().includes(s)
      );
    }
    setFilteredSubs(result);
  }, [search, subscriptions]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(
        apiUrl(`/subscriptions/${id}/status`),
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Demande approuvee');
      fetchSubscriptions();
    } catch {
      toast.error('Erreur');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Etes-vous sur de vouloir rejeter cette demande ?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(
        apiUrl(`/subscriptions/${id}/status`),
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Demande rejetee');
      fetchSubscriptions();
    } catch {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ETES-VOUS SUR ? Cette action est irreversible.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(apiUrl(`/subscriptions/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Souscription supprimee');
      fetchSubscriptions();
    } catch {
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredSubs.length === 0) {
      toast.error('Aucune donnee a exporter');
      return;
    }

    const data = filteredSubs.map((s) => ({
      ID: s.id.substring(0, 8),
      Client: s.client_name,
      Email: s.client_email,
      Telephone: s.client_phone,
      Offre: s.offer_name,
      Montant: `${s.total_price} DH`,
      Statut: s.status === 'approved' ? 'Approuvee' : s.status === 'rejected' ? 'Rejetee' : 'En attente',
      Type: s.is_fondation ? 'Fondation' : 'Grand Public',
      Date: new Date(s.created_at).toLocaleDateString('fr-FR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demandes');
    XLSX.writeFile(workbook, `Demandes_RPlus_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Rapport Excel exporte');
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark tracking-tight">Gestion des Demandes</h1>
          <p className="text-sm text-gray-400">Consultez, modifiez ou gerez les souscriptions clients.</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-dark border border-gray-100 font-black px-4 sm:px-6 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">EXPORTER</span>
          </button>
          <button
            onClick={handleAddOpen}
            className="flex-1 sm:flex-none bg-primary hover:bg-red-700 text-white font-black px-5 sm:px-8 py-3 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>AJOUTER</span>
          </button>
        </div>
      </header>

      <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
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
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En Attente</option>
              <option value="approved">Approuvee</option>
              <option value="rejected">Refusee</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Categorie</label>
          <div className="relative group">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <select
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value="all">Toutes les Categories</option>
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
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs text-dark font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 sm:p-16 lg:p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest leading-none mt-4">Chargement des donnees...</p>
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
            <h3 className="text-xl font-bold text-dark">Aucun resultat trouve</h3>
            <p className="text-gray-400 text-sm">Reessayez avec d'autres filtres ou criteres de recherche.</p>
          </div>
        )}

        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
            Affichage de {filteredSubs.length} sur {totalCount} demandes
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg text-xs font-black transition-all bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {'<'}
            </button>

            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                  p === currentPage
                    ? 'bg-primary text-white shadow-lg shadow-red-500/20'
                    : 'bg-white text-gray-400 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg text-xs font-black transition-all bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

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
