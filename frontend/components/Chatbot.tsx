'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, MessageSquare, Bot, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Bonjour ! Je suis l\'assistant R+ TELECOM. Comment puis-je vous aider aujourd\'hui ?', 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickReplies = [
    "Quelle offre pour Netflix ?",
    "Prix Fibre 200 Mbps ?",
    "Offre Fondation ?",
    "Contacter un agent"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (text === "Contacter un agent") {
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "Vous pouvez nous joindre directement :",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMsg]);
      }, 500);
      return;
    }

    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { 
        message: text, 
        history: messages 
      });
      
      const botMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: response.data.reply || "Je ne suis pas sûr de comprendre, mais je peux vous mettre en relation avec un conseiller.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 2).toString(),
          text: "Désolé, j'ai une petite erreur de connexion au serveur IA. Assurez-vous que le backend Express est lancé.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white shadow-red-500/40"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-[60] w-[350px] h-[550px] bg-white rounded-3xl shadow-3xl border border-gray-100 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">Assistant R+</h3>
                  <p className="text-[10px] text-white/70 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-red-500/10' 
                    : 'bg-white text-dark shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                    {msg.text === "Vous pouvez nous joindre directement :" && (
                      <div className="mt-3 space-y-2">
                        <a href="mailto:yahyahajar592@gmail.com" className="flex items-center p-2 bg-gray-50 rounded-lg text-primary hover:bg-gray-100 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span className="font-bold">yahyahajar592@gmail.com</span>
                        </a>
                        <div className="flex items-center p-2 bg-gray-50 rounded-lg text-primary">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="font-bold">+212 666 38 76 94</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
              {/* Quick Replies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-all active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
