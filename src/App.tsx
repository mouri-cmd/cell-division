import { useEffect, useState } from 'react';
import { BookOpen, Info, X, Leaf, Bug, Layers, Box, FileText } from 'lucide-react';
import './styles/tokens.css';
import './styles/sim.css';

import TextbookDiagram from './components/TextbookDiagram';
import OrganelleCard from './components/OrganelleCard';
import { useSimStore } from './store/simStore';
import { ORGANELLES, ORGANELLE_MAP } from './data/organelles';

type CellView = 'both' | 'plant' | 'animal';

export default function App() {
  const {
    cellView, setCellView,
    selectedOrganelle, setSelectedOrganelle,
  } = useSimStore();

  const [showTip, setShowTip] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(t);
  }, []);


  return (
    <div className="sim-root">
      {/* Header */}
      <header className="sim-header">
        <div className="sim-header__brand">
          <BookOpen size={18} className="brand-icon" />
          <div>
            <span className="brand-name bn">উদ্ভিদ ও প্রাণী কোষের তুলনা</span>
            <span className="brand-subtitle bn">ইন্টারেক্টিভ সিমুলেটর · Class 6–SSC</span>
          </div>
        </div>

        <div className="sim-header__actions">

          {/* Cell selection */}
          <div className="view-toggle" role="group" aria-label="কোষের দৃশ্য">
            <button
              className={`view-tab ${cellView === 'plant' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('plant')}
              aria-pressed={cellView === 'plant'}
            >
              <Leaf size={14} />
              <span className="bn">উদ্ভিদ</span>
            </button>
            <button
              className={`view-tab view-tab--both ${cellView === 'both' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('both')}
              aria-pressed={cellView === 'both'}
            >
              <Layers size={14} />
              <span className="bn">উভয়</span>
            </button>
            <button
              className={`view-tab ${cellView === 'animal' ? 'view-tab--active' : ''}`}
              onClick={() => setCellView('animal')}
              aria-pressed={cellView === 'animal'}
            >
              <Bug size={14} />
              <span className="bn">প্রাণী</span>
            </button>
          </div>

          <button
            className="legend-btn"
            onClick={() => setShowLegend(!showLegend)}
            aria-label="অর্গানেল তালিকা"
            aria-expanded={showLegend}
          >
            <span className="bn">তালিকা</span>
          </button>
        </div>
      </header>

      {/* Canvas / Diagram area */}
      <main className="sim-main sim-main--textbook">
            <div className={`textbook-grid textbook-grid--${cellView}`}>
              {(cellView === 'both' || cellView === 'plant') && (
                <div className="diagram-frame">
                  <TextbookDiagram cell="plant" />
                </div>
              )}
              {(cellView === 'both' || cellView === 'animal') && (
                <div className="diagram-frame">
                  <TextbookDiagram cell="animal" />
                </div>
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


