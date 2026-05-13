import { useEffect, useState } from 'react';
import { BookOpen, Info, X, Leaf, Bug, Layers, Box, FileText } from 'lucide-react';
import './styles/tokens.css';
import './styles/sim.css';

import TextbookDiagram from './components/TextbookDiagram';
import OrganelleCard from './components/OrganelleCard';
import GuidedTour from './components/GuidedTour';
import HelpModal from './components/HelpModal';
import { useSimStore } from './store/simStore';
import { ORGANELLES } from './data/organelles';
import { PlayCircle, HelpCircle } from 'lucide-react';
import FeedbackCTA from './components/FeedbackCTA';

type CellView = 'both' | 'plant' | 'animal';

export default function App() {
  const {
    cellView, setCellView,
    selectedOrganelle, setSelectedOrganelle,
  } = useSimStore();

  const [showTip, setShowTip] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Show guide modal on every load
    const t = setTimeout(() => setShowHelp(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(t);
  }, []);


  return (
    <div className="sim-root">
      {/* Header */}
      <header className="sim-header">
        <div className="sim-header__brand">
          <img 
            src="https://cdn.10minuteschool.com/images/svg/Origin%20Labs%20Black.svg" 
            alt="Origin Labs Logo" 
            className="brand-logo"
            loading="lazy"
          />
        </div>

        <div className="sim-header__actions">

          {/* Cell selection */}
          <div className="view-toggle" role="group" aria-label="কোষের দৃশ্য" id="view-toggle-tour">
            <button
              className={`view-tab ${cellView === 'plant' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('plant')}
              aria-pressed={cellView === 'plant'}
            >
              <Leaf size={14} />
              <span className="bn">উদ্ভিদ</span>
            </button>
            <button
              className={`view-tab ${cellView === 'animal' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('animal')}
              aria-pressed={cellView === 'animal'}
            >
              <Bug size={14} />
              <span className="bn">প্রাণী</span>
            </button>
            <button
              className={`view-tab view-tab--both ${cellView === 'both' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('both')}
              aria-pressed={cellView === 'both'}
            >
              <Layers size={14} />
              <span className="bn">উভয়</span>
            </button>
          </div>

          <button
            className="legend-btn"
            onClick={() => setShowLegend(!showLegend)}
            aria-label="অর্গানেল তালিকা"
            aria-expanded={showLegend}
            id="legend-btn-tour"
          >
            <span className="bn">তালিকা</span>
          </button>

          <button
            className="tutorial-btn"
            onClick={() => setShowTour(true)}
            aria-label="টিউটোরিয়াল শুরু করুন"
          >
            <PlayCircle size={14} className="text-emerald-400" />
            <span className="bn">টিউটোরিয়াল</span>
          </button>

          <button
            className="help-circle-btn"
            onClick={() => setShowHelp(true)}
            aria-label="নির্দেশিকা দেখুন"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* Canvas / Diagram area */}
      <main className={`sim-main sim-main--textbook ${selectedOrganelle ? 'sim-main--sheet-open' : ''}`} id="diagram-area-tour">
            <div className={`textbook-grid textbook-grid--${cellView}`}>
              {(cellView === 'both' || cellView === 'plant') && (
                <TextbookDiagram cell="plant" />
              )}
              {(cellView === 'both' || cellView === 'animal') && (
                <TextbookDiagram cell="animal" />
              )}
          </div>

        {/* First-use tip */}
        {showTip && (
          <div className="first-tip bn">
            <Info size={14} />
            ছবির যেকোনো অংশে ক্লিক করো বিস্তারিত দেখতে
            <button onClick={() => setShowTip(false)} aria-label="বন্ধ করুন">
              <X size={12} />
            </button>
          </div>
        )}

        {showLegend && (
          <LegendPanel
            cellView={cellView}
            onSelect={(id) => { setSelectedOrganelle(id); setShowLegend(false); }}
            onClose={() => setShowLegend(false)}
          />
        )}
      </main>

      <OrganelleCard />
      <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
        onStartTour={() => setShowTour(true)}
        onSelectView={(view) => setCellView(view)}
      />
      <FeedbackCTA simulationName="cell-structure" />
    </div>
  );
}

function LegendPanel({
  cellView,
  onSelect,
  onClose,
}: {
  cellView: CellView;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const visible = ORGANELLES.filter((o) => {
    if (cellView === 'plant') return o.presentInPlant;
    if (cellView === 'animal') return o.presentInAnimal;
    return true;
  });

  return (
    <div className="legend-panel" role="listbox" aria-label="অর্গানেল তালিকা">
      <div className="legend-panel__header">
        <span className="bn legend-panel__title">অর্গানেল তালিকা</span>
        <button onClick={onClose} className="close-btn" aria-label="বন্ধ করুন">
          <X size={15} />
        </button>
      </div>
      <ul className="legend-list">
        {visible.map((o) => (
          <li key={o.id}>
            <button
              className="legend-item"
              onClick={() => onSelect(o.id)}
              aria-label={o.nameBn}
            >
              <span className="legend-dot" style={{ background: o.color }} aria-hidden="true" />
              <span className="bn legend-item__name">{o.nameBn}</span>
              <span className="legend-item__en">{o.nameEn}</span>
              <div className="legend-item__tags">
                {o.presentInPlant && <span className="tag-plant">উদ্ভিদ</span>}
                {o.presentInAnimal && <span className="tag-animal">প্রাণী</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
