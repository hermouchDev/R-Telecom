'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, Globe, Disc, Video, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-1">
              <span className="text-3xl font-extrabold text-primary italic tracking-tighter">R+</span>
              <span className="text-xl font-bold text-white tracking-wide">TELECOM</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Le leader des télécommunications au Maroc, offrant des solutions internet et mobiles innovantes pour les particuliers et les fondations.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg">
                <Disc className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg">
                <Video className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Offres Internet</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/offres/fibre" className="hover:text-primary transition-colors">Internet Fibre</Link></li>
              <li><Link href="/offres/5g" className="hover:text-primary transition-colors">5G Box El Manzil</Link></li>
              <li><Link href="/offres/adsl" className="hover:text-primary transition-colors">Internet ADSL</Link></li>
              <li><Link href="/offres/mobile" className="hover:text-primary transition-colors">Forfaits Mobile</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Assistance</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/calculateur" className="hover:text-primary transition-colors">Calculateur de tarif</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Suivre ma commande</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Espace Client</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contactez-nous</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Boulevard Mohammed V, Casablanca, Maroc</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@rplusTelecom.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs text-center space-y-4 md:space-y-0">
          <p>&copy; 2026 R+ TELECOM. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white">Mentions Légales</Link>
            <Link href="#" className="hover:text-white">Politique de Confidentialité</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
