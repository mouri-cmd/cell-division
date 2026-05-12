import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  targetId?: string;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'স্বাগতম!',
    description: 'উদ্ভিদ ও প্রাণী কোষের তুলনা সিমুলেটরে আপনাকে স্বাগতম। এই টিউটোরিয়ালটি আপনাকে সিমুলেটরটি ব্যবহার করতে সাহায্য করবে।',
    position: 'center',
  },
  {
    title: 'কোষ নির্বাচন করুন',
    description: 'উদ্ভিদ এবং প্রাণী কোষের মধ্যে পরিবর্তন করতে এই মেনুটি ব্যবহার করুন।',
    targetId: 'view-toggle-tour',
    position: 'bottom',
  },
  {
    title: 'অর্গানেল তালিকা',
    description: 'সকল অর্গানেলের বিস্তারিত তালিকা দেখতে এখানে ক্লিক করুন।',
    targetId: 'legend-btn-tour',
    position: 'bottom',
  },
  {
    title: 'কোষের অংশ দেখুন',
    description: 'ছবির বিভিন্ন অংশে ক্লিক করে অর্গানেল সম্পর্কে জানুন।',
    targetId: 'diagram-area-tour',
    position: 'center',
  },
  {
    title: 'শুরু করি!',
    description: 'এখন আপনি নিজেই সিমুলেটরটি এক্সপ্লোর করতে পারেন।',
    position: 'center',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidedTour({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (!step.targetId) {
      setTargetRect(null);
      return;
    }

    const update = () => {
      const el = document.getElementById(step.targetId!);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    update();
    const t = setTimeout(update, 100);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      clearTimeout(t);
    };
  }, [step.targetId, currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate Card Position
  const getCardStyle = (): React.CSSProperties => {
    const isMobile = windowWidth < 1024; // Increased threshold for better tablet/small laptop support

    if (isMobile) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        width: 'auto',
        maxWidth: '450px',
        margin: '0 auto',
        transform: 'none',
        zIndex: 100,
      };
    }

    if (!targetRect || step.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '360px',
        zIndex: 100,
      };
    }

    const padding = 20;
    const cardWidth = 360;
    const style: React.CSSProperties = {
      position: 'fixed',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      width: `${cardWidth}px`,
      zIndex: 100,
    };

    // Horizontal centering relative to target
    let left = targetRect.left + targetRect.width / 2;
    // Keep within viewport horizontally
    const minLeft = cardWidth / 2 + 20;
    const maxLeft = window.innerWidth - cardWidth / 2 - 20;
    left = Math.max(minLeft, Math.min(maxLeft, left));
    style.left = `${left}px`;
    style.transform = 'translateX(-50%)';

    if (step.position === 'bottom') {
      let top = targetRect.bottom + padding;
      // If bottom positioning goes off-screen, flip to top or use center
      if (top + 200 > window.innerHeight) {
        style.bottom = `${window.innerHeight - targetRect.top + padding}px`;
      } else {
        style.top = `${top}px`;
      }
    } else if (step.position === 'top') {
      let bottom = window.innerHeight - targetRect.top + padding;
      // If top positioning goes off-screen, flip to bottom
      if (window.innerHeight - bottom - 200 < 0) {
        style.top = `${targetRect.bottom + padding}px`;
      } else {
        style.bottom = `${bottom}px`;
      }
    }

    return style;
  };

  return (
    <div className="fixed inset-0 z-[120] pointer-events-none">
      {/* Spotlight Backdrop */}
      <TourSpotlight rect={targetRect} onClose={onClose} />

      {/* Tour Card */}
      <div 
        className="fixed z-[130] pointer-events-auto"
        style={getCardStyle()}
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100 w-full h-full relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 z-10"
        >
          <X size={18} />
        </button>
        
        <div className="p-7 md:p-8">
          <div className="inline-block bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-4">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-2 bn">{step.title}</h3>
          <p className="text-slate-600 leading-relaxed mb-8 bn text-sm">{step.description}</p>

          <div className="flex items-center justify-between gap-4">
             {currentStep > 0 ? (
               <button 
                 onClick={handlePrev}
                 className="p-3 text-slate-300 hover:text-slate-600 transition-colors"
               >
                 <ChevronLeft size={24} />
               </button>
             ) : <div className="w-12" />}

            <button 
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 bn text-base"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'শুরু করি' : 'পরবর্তী'} 
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function TourSpotlight({ rect, onClose }: { rect: DOMRect | null, onClose: () => void }) {
  if (!rect) {
    return (
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto animate-fadeIn" 
        onClick={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-auto overflow-hidden" onClick={onClose}>
      <div 
        className="absolute transition-all duration-500 rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]"
        style={{
          left: rect.left - 10,
          top: rect.top - 10,
          width: rect.width + 20,
          height: rect.height + 20,
        }}
      />
    </div>
  );
}
