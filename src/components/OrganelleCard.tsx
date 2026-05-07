import { useEffect } from 'react';
import { X, Leaf, Bug } from 'lucide-react';
import { ORGANELLE_MAP } from '../data/organelles';
import { useSimStore } from '../store/simStore';

const importanceLabel: Record<string, string> = {
  high: 'উচ্চ গুরুত্ব',
  medium: 'মধ্যম গুরুত্ব',
  low: 'স্বল্প গুরুত্ব',
};

const importanceStyle: Record<string, string> = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

export default function OrganelleCard() {
  const { selectedOrganelle, setSelectedOrganelle } = useSimStore();
  const organelle = selectedOrganelle ? ORGANELLE_MAP.get(selectedOrganelle) : null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrganelle(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSelectedOrganelle]);

  return (
    <>
      {organelle && (
        <div
          className="canvas-overlay-bg"
          onClick={() => setSelectedOrganelle(null)}
          aria-hidden="true"
        />
      )}
      <div
        className={`organelle-sheet ${organelle ? 'organelle-sheet--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={organelle ? `${organelle.nameBn} তথ্য` : ''}
      >
        {organelle && (
          <div className="organelle-sheet__inner">
            <div className="organelle-sheet__handle" />

            <div className="organelle-sheet__header">
              <div className="organelle-sheet__title-group">
                <span
                  className="organelle-color-dot"
                  style={{ background: organelle.color }}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="organelle-name bn">{organelle.nameBn}</h2>
                  <span className="organelle-name-en">{organelle.nameEn}</span>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedOrganelle(null)}
                aria-label="বন্ধ করুন"
              >
                <X size={16} />
              </button>
            </div>

            <p className="organelle-function bn">{organelle.functionBn}</p>

            <div className="organelle-sheet__chips">
              <span className={`badge ${importanceStyle[organelle.importance]}`}>
                {importanceLabel[organelle.importance]}
              </span>
              {organelle.examTip && (
                <span className="exam-chip">{organelle.examTip}</span>
              )}
            </div>

            <div className="organelle-present">
              <div className={`present-tag ${organelle.presentInPlant ? 'present-tag--yes' : 'present-tag--no'}`}>
                <Leaf size={11} />
                উদ্ভিদ কোষ
              </div>
              <div className={`present-tag ${organelle.presentInAnimal ? 'present-tag--yes' : 'present-tag--no'}`}>
                <Bug size={11} />
                প্রাণী কোষ
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
