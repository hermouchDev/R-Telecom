'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  cinUrl?: string;
  fondationUrl?: string;
  isFondation: boolean;
  subscriptionId?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ isOpen, onClose, clientName, cinUrl, fondationUrl, isFondation, subscriptionId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-dark/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-dark tracking-tight">Documents — {clientName}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Vérification des pièces justificatives</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-dark rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 gap-8 custom-scrollbar">

          {/* Contract Panel */}
          <DocumentPanel 
            title="Contrat (Auto-Généré)" 
            url={subscriptionId ? `http://localhost:5000/api/contracts/${subscriptionId}/download` : undefined} 
          />
        </div>
      </motion.div>
    </div>
  );
};

const DocumentPanel = ({ title, url }: { title: string, url?: string }) => {
  const isImage = url?.match(/\.(jpg|jpeg|png|webp)/i);
  const isPdf = url?.match(/\.(pdf)/i) || url?.includes('/api/contracts/');

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
      <div className="p-6 flex items-center justify-between bg-white/50 border-b border-gray-100">
        <span className="text-xs font-black text-dark uppercase tracking-widest">{title}</span>
        {url && (
          <a 
            href={url} 
            target="_blank" 
            className="inline-flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ouvrir Plein Écran</span>
          </a>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center p-8 bg-gray-100/30">
        {url ? (
          isImage ? (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img src={url} alt={title} className="max-w-full max-h-full rounded-2xl shadow-xl transition-transform group-hover:scale-[1.02] cursor-zoom-in" />
            </div>
          ) : isPdf ? (
            <div className="flex flex-col items-center space-y-4">
               <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary">
                <FileText className="w-12 h-12" />
              </div>
               <p className="text-sm font-bold text-dark">Document PDF</p>
               <a 
                href={url} 
                target="_blank" 
                className="bg-dark text-white text-[10px] font-black px-6 py-3 rounded-xl shadow-lg shadow-black/10 tracking-widest"
              >
                CONSULTER LE PDF
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <FileStack className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm">Format de fichier inconnu</p>
            </div>
          )
        ) : (
          <div className="text-center text-orange-300 space-y-4">
             <AlertCircle className="w-12 h-12 mx-auto" />
             <p className="text-sm font-bold uppercase tracking-widest">Document Manquant</p>
          </div>
        )}
      </div>

      {url && (
        <div className="p-6 bg-white border-t border-gray-100">
          <a 
            href={url} 
            download 
            className="w-full bg-gray-100 hover:bg-dark hover:text-white text-dark font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest">TÉLÉCHARGER LE FICHIER</span>
          </a>
        </div>
      )}
    </div>
  );
};

const FileStack = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export default DocumentViewer;
