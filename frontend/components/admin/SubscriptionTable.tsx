'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SubscriptionTableProps {
  subscriptions: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (sub: any) => void;
  onDelete: (id: string) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ 
  subscriptions, 
  onApprove, 
  onReject,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto text-nowrap">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
            <th className="px-8 py-5"># ID</th>
            <th className="px-8 py-5">Client</th>
            <th className="px-8 py-5">Offre</th>
            <th className="px-8 py-5 text-center">Montant</th>
            <th className="px-8 py-5 text-center">Statut</th>
            <th className="px-8 py-5 text-center">Date</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50/50 transition-all group">
              <td className="px-8 py-6 font-mono text-[11px] font-bold text-gray-400">
                {sub.id.substring(0, 8).toUpperCase()}
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-dark">{sub.client_name}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{sub.client_email}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                 <div className="flex flex-col items-start space-y-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    sub.offer_category.toLowerCase() === 'fibre' ? 'bg-blue-100 text-blue-600' :
                    sub.offer_category.toLowerCase() === 'mobile' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {sub.offer_category}
                  </span>
                  <span className="text-xs font-bold text-dark">{sub.offer_name}</span>
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-black text-dark">{sub.total_price} DH</span>
                    {sub.is_fondation && <Star className="w-3 h-3 text-primary fill-primary" />}
                  </div>
                  {sub.is_fondation && (
                    <span className="text-[10px] text-primary font-black uppercase tracking-tighter">Fondation</span>
                  )}
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                <StatusBadge status={sub.status} />
              </td>
              <td className="px-8 py-6 text-center">
                <div className="inline-flex flex-col items-center justify-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                   <span className="text-[10px] font-black text-dark">{format(new Date(sub.created_at), 'dd/MM/yyyy')}</span>
                   <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(sub.created_at), 'HH:mm')}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex justify-end items-center space-x-2">
                  <Link 
                    href={`/admin/demandes/${sub.id}`}
                    className="p-2 bg-gray-100 text-gray-400 hover:text-dark hover:bg-gray-200 rounded-xl transition-all"
                    title="Voir Détails"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  
                  <button 
                    onClick={() => onEdit(sub)}
                    className="p-2 bg-gray-100 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => onDelete(sub.id)}
                    className="p-2 bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {sub.status === 'pending' && (
                    <div className="flex items-center space-x-2 border-l border-gray-100 pl-2 ml-2">
                      <button 
                        onClick={() => onApprove(sub.id)}
                        className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Approuver"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onReject(sub.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Rejeter"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    pending: { color: 'bg-orange-100 text-orange-600 border-orange-200', label: 'En Attente' },
    approved: { color: 'bg-green-100 text-green-600 border-green-200', label: 'Approuvée' },
    rejected: { color: 'bg-red-100 text-red-600 border-red-200', label: 'Refusée' }
  };
  const config = configs[status] || configs.pending;
  return (
    <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border shadow-sm ${config.color}`}>
      {config.label}
    </span>
  );
};

export default SubscriptionTable;
