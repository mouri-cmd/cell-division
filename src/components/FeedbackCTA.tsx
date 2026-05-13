import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface FeedbackCTAProps {
  simulationName?: string;
}

declare global {
  interface Window {
    Tally: any;
  }
}

export default function FeedbackCTA({ simulationName = 'cell-structure' }: FeedbackCTAProps) {
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
      aria-label="তোমার মতামত জানাও"
    >
      <MessageSquare size={20} />
      <span className="bn feedback-cta__text">তোমার মতামত জানাও</span>
    </button>
  );
}
