import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface FeedbackCTAProps {
  simulationName?: string;
  language?: 'bn' | 'en';
}

declare global {
  interface Window {
    Tally: any;
  }
}

import { translations } from '../data/translations';

export default function FeedbackCTA({ simulationName = 'cell-structure', language = 'bn' }: FeedbackCTAProps) {
  const t = translations[language];
  useEffect(() => {
    // If Tally is already loaded, re-scan the DOM for the new button
    if (typeof window.Tally !== 'undefined') {
      window.Tally.loadEmbeds();
    }
  }, []);

  return (
    <button
      className="feedback-cta"
      data-tally-open="RG87VJ"
      data-tally-layout="modal"
      data-tally-hidden-fields={`simulation_name=${simulationName}`}
      aria-label={t.feedback}
    >
      <MessageSquare size={20} />
      <span className="bn feedback-cta__text">{t.feedback}</span>
    </button>
  );
}
