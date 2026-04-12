'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface UploadFormProps {
  subscriptionId: string;
  isFondation: boolean;
  onComplete: (urls: { cin?: string; fondationCard?: string }) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ subscriptionId, isFondation, onComplete }) => {
  const [cinFile, setCinFile] = useState<File | null>(null);
  const [fondationFile, setFondationFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDropCin = useCallback((acceptedFiles: File[]) => {
    setCinFile(acceptedFiles[0]);
  }, []);

  const onDropFondation = useCallback((acceptedFiles: File[]) => {
    setFondationFile(acceptedFiles[0]);
  }, []);

  const { getRootProps: getCinProps, getInputProps: getCinInputProps, isDragActive: isCinActive } = useDropzone({
    onDrop: onDropCin,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const { getRootProps: getFondationProps, getInputProps: getFondationInputProps, isDragActive: isFondationActive } = useDropzone({
    onDrop: onDropFondation,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!cinFile) {
      toast.error('Veuillez télécharger votre CNI');
      return;
    }
    if (isFondation && !fondationFile) {
      toast.error('Veuillez télécharger votre carte fondation');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('cin', cinFile);
    if (fondationFile) formData.append('fondationCard', fondationFile);

    try {
      const response = await axios.post(`http://localhost:5000/api/uploads/${subscriptionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success('Documents téléchargés avec succès !');
        onComplete(response.data.urls);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderDropzone = (
    getRootProps: any, 
    getInputProps: any, 
    isActive: boolean, 
    file: File | null, 
    setFile: any,
    label: string
  ) => (
    <div className="space-y-3">
      <label className="text-sm font-black text-dark uppercase tracking-widest">{label}</label>
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isActive ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary/50 bg-gray-50/50'
        } ${file ? 'border-green-500 bg-green-50/10' : ''}`}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-dark truncate max-w-[200px]">{file.name}</p>
              <p className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 mb-4 group-hover:text-primary transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-dark">Glissez-déposez ou cliquez</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">JPG, PNG, PDF (max 5MB)</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-6">
        {renderDropzone(getCinProps, getCinInputProps, isCinActive, cinFile, setCinFile, "Carte Nationale (CNI)")}
        {isFondation && renderDropzone(getFondationProps, getFondationInputProps, isFondationActive, fondationFile, setFondationFile, "Carte Fondation")}
      </div>

      <div className="pt-8">
        {isUploading ? (
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-center text-sm font-bold text-primary animate-pulse">Téléchargement en cours... {progress}%</p>
          </div>
        ) : (
          <button
            onClick={handleUpload}
            className="w-full bg-dark text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all"
          >
            VALIDER ET TÉLÉCHARGER LES DOCUMENTS
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
