import React from 'react';
import { X, GraduationCap, Leaf, Bug, Play } from 'lucide-react';

import { useSimStore } from '../store/simStore';
import { translations } from '../data/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onSelectView: (view: 'plant' | 'animal') => void;
}

export default function HelpModal({ isOpen, onClose, onStartTour, onSelectView }: Props) {
  const { language } = useSimStore();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-bounceIn border border-slate-200">
        {/* Dark Header */}
        <div className="bg-[#0f172a] p-6 md:p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-red-500" size={24} />
            <h2 className="text-lg md:text-xl font-bold bn">{t.helpGuide}</h2>
          </div>
          <h1 className="text-xl md:text-2xl font-black bn">{t.welcome}</h1>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <p className="text-slate-600 leading-relaxed mb-6 md:mb-8 bn text-sm md:text-lg">
            {t.simDescription}
          </p>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <button 
              onClick={() => { onSelectView('plant'); onClose(); }}
              className="w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-emerald-50 border-2 border-emerald-100 hover:border-emerald-300 transition-all group text-left"
            >
              <div className="bg-emerald-500 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <Leaf size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base md:text-lg bn">{t.plantCell}</h4>
                <p className="text-emerald-600 text-xs md:text-sm bn font-bold">{t.viewPlantDetails}</p>
              </div>
            </button>

            <button 
              onClick={() => { onSelectView('animal'); onClose(); }}
              className="w-full flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-blue-50 border-2 border-blue-100 hover:border-blue-300 transition-all group text-left"
            >
              <div className="bg-blue-600 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Bug size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base md:text-lg bn">{t.animalCell}</h4>
                <p className="text-blue-600 text-xs md:text-sm bn font-bold">{t.viewAnimalDetails}</p>
              </div>
            </button>
          </div>

          <button 
            onClick={() => { onClose(); onStartTour(); }}
            className="w-full py-4 md:py-5 bg-[#0f172a] text-white rounded-xl md:rounded-[.5rem] font-black text-base md:text-lg hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 bn flex items-center justify-center gap-2"
          >
            {t.startSimulation}
          </button>
        </div>
      </div>
    </div>
  );
}
