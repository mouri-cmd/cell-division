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
import SimCanvas from './components/SimCanvas';
import { translations } from './data/translations';

type CellView = 'both' | 'plant' | 'animal';

export default function App() {
  const {
    cellView, setCellView,
    viewMode, setViewMode,
    selectedOrganelle, setSelectedOrganelle,
    language, setLanguage,
  } = useSimStore();

  const t = translations[language];

  const [showTip, setShowTip] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [simulationName, setSimulationName] = useState('cell-structure');

  useEffect(() => {
    // Show guide modal on every load
    const t = setTimeout(() => setShowHelp(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // View parameter (?view=plant|animal|both)
    const view = params.get('view');
    if (view === 'plant' || view === 'animal' || view === 'both') {
      setCellView(view as CellView);
    }

    // Organelle parameter (?organelle=nucleus)
    const organelle = params.get('organelle');
    if (organelle) {
      setSelectedOrganelle(organelle);
    }

    // Mode parameter (?mode=3d|textbook)
    const mode = params.get('mode');
    if (mode === '3d' || mode === 'textbook') {
      setViewMode(mode);
    }

    // Simulation Name parameter (?simulation_name=cell-structure)
    const simName = params.get('simulation_name');
    if (simName) {
      setSimulationName(simName);
    }
  }, [setCellView, setSelectedOrganelle, setViewMode]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (cellView) params.set('view', cellView);
    if (viewMode) params.set('mode', viewMode);
    
    if (selectedOrganelle) {
      params.set('organelle', selectedOrganelle);
    } else {
      params.delete('organelle');
    }

    if (simulationName !== 'cell-structure') {
      params.set('simulation_name', simulationName);
    }

    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [cellView, viewMode, selectedOrganelle, simulationName]);

  // Update document title
  useEffect(() => {
    document.title = language === 'bn' 
      ? 'কোষ গঠন ও বিভাজন সিমুলেটর' 
      : 'Cell Structure & Division Simulator';
  }, [language]);


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
          <div className="brand-divider"></div>
          <span className="sim-name-tag">{simulationName}</span>
        </div>

        <div className="sim-header__actions">

          {/* Cell selection */}
          <div className="view-toggle" role="group" aria-label={t.cellView} id="view-toggle-tour">
            <button
              className={`view-tab ${cellView === 'plant' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('plant')}
              aria-pressed={cellView === 'plant'}
            >
              <Leaf size={14} />
              <span className="bn">{t.plant}</span>
            </button>
            <button
              className={`view-tab ${cellView === 'animal' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('animal')}
              aria-pressed={cellView === 'animal'}
            >
              <Bug size={14} />
              <span className="bn">{t.animal}</span>
            </button>
            <button
              className={`view-tab view-tab--both ${cellView === 'both' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('both')}
              aria-pressed={cellView === 'both'}
            >
              <Layers size={14} />
              <span className="bn">{t.both}</span>
            </button>
          </div>

          <button
            className="legend-btn"
            onClick={() => setShowLegend(!showLegend)}
            aria-label={t.organelleList}
            aria-expanded={showLegend}
            id="legend-btn-tour"
          >
            <span className="bn">{t.list}</span>
          </button>

          <button
            className="tutorial-btn"
            onClick={() => setShowTour(true)}
            aria-label={t.tutorial}
          >
            <PlayCircle size={14} className="text-emerald-400" />
            <span className="bn">{t.tutorial}</span>
          </button>

          <button
            className="help-circle-btn"
            onClick={() => setShowHelp(true)}
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </button>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${language === 'bn' ? 'active' : ''}`}
              onClick={() => setLanguage('bn')}
            >
              BN
            </button>
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Canvas / Diagram area */}
      <main className={`sim-main sim-main--${viewMode} ${selectedOrganelle ? 'sim-main--sheet-open' : ''}`} id="diagram-area-tour">
        {viewMode === 'textbook' ? (
          <div className={`textbook-grid textbook-grid--${cellView}`}>
            {(cellView === 'both' || cellView === 'plant') && (
              <TextbookDiagram cell="plant" />
            )}
            {(cellView === 'both' || cellView === 'animal') && (
              <TextbookDiagram cell="animal" />
            )}
          </div>
        ) : (
          <SimCanvas />
        )}

        {/* First-use tip */}
        {showTip && (
          <div className="first-tip bn">
            <Info size={14} />
            {t.tip}
            <button onClick={() => setShowTip(false)} aria-label={t.close}>
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
      <FeedbackCTA simulationName={simulationName} language={language} />
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
  const { language } = useSimStore();
  const t = translations[language];

  const visible = ORGANELLES.filter((o) => {
    if (cellView === 'plant') return o.presentIn.includes('plant');
    if (cellView === 'animal') return o.presentIn.includes('animal');
    return true;
  });

  return (
    <div className="legend-panel" role="listbox" aria-label={t.organelleList}>
      <div className="legend-panel__header">
        <span className="bn legend-panel__title">{t.organelleList}</span>
        <button onClick={onClose} className="close-btn" aria-label={t.close}>
          <X size={15} />
        </button>
      </div>
      <ul className="legend-list">
        {visible.map((o) => (
          <li key={o.id}>
            <button
              className="legend-item"
              onClick={() => onSelect(o.id)}
              aria-label={language === 'bn' ? o.nameBn : o.nameEn}
            >
              <span className="legend-dot" style={{ background: o.color }} aria-hidden="true" />
              <span className="bn legend-item__name">{language === 'bn' ? o.nameBn : o.nameEn}</span>
              {language === 'bn' && <span className="legend-item__en">{o.nameEn}</span>}
              <div className="legend-item__tags">
                {o.presentIn.includes('plant') && <span className="tag-plant">{t.plant}</span>}
                {o.presentIn.includes('animal') && <span className="tag-animal">{t.animal}</span>}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
