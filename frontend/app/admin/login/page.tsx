'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, Eye, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        toast.success('Connexion réussie !');
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -mr-40 -mt-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-4xl font-black text-primary italic tracking-tighter">R+</span>
            <span className="text-2xl font-bold text-white tracking-wide">TELECOM</span>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Espace Administrateur</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center space-x-3 text-red-600"
            >
              <div className="bg-red-100 p-1.5 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@rplusTelecom.ma"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-dark focus:border-primary/20 focus:bg-white transition-all outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-12 py-4 text-dark focus:border-primary/20 focus:bg-white transition-all outline-none font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-dark transition-colors"
                >
                  <Eye className={`w-5 h-5 ${showPassword ? 'text-primary' : ''}`} />
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>SE CONNECTER</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>


        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-white text-sm font-bold transition-colors"
          >
            &larr; Retour au site public
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
