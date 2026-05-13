import { useEffect } from 'react';
import { X, Leaf, Bug } from 'lucide-react';
import { ORGANELLE_MAP } from '../data/organelles';
import { useSimStore } from '../store/simStore';
import { translations } from '../data/translations';

export default function OrganelleCard() {
  const { selectedOrganelle, setSelectedOrganelle, language } = useSimStore();
  const organelle = selectedOrganelle ? ORGANELLE_MAP.get(selectedOrganelle) : null;
  const t = translations[language];

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
            <div className="organelle-sheet__sticky-header">
              <div className="organelle-sheet__handle" />
            </div>
            <div className="organelle-sheet__content">

            <div className="organelle-sheet__header">
              <div className="organelle-sheet__title-group">
                <span
                  className="organelle-color-dot"
                  style={{ background: '#10b981' }}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="organelle-name bn">{language === 'bn' ? organelle.nameBn : organelle.nameEn}</h2>
                  {language === 'bn' && <span className="organelle-name-en">{organelle.nameEn}</span>}
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

            <div className="mb-4">
              <strong className="text-slate-800 text-sm font-black mb-2 block">{language === 'bn' ? 'বিবরণ:' : 'Description:'}</strong>
              <ul className="list-disc pl-5 text-slate-600 space-y-1.5 text-sm">
                {(language === 'bn' ? organelle.descriptionBn : organelle.descriptionEn).map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <strong className="text-slate-800 text-sm font-black mb-2 block">{language === 'bn' ? 'কাজ:' : 'Function:'}</strong>
              <ul className="list-disc pl-5 text-slate-600 space-y-1.5 text-sm">
                {(language === 'bn' ? organelle.functionBn : organelle.functionEn).map((fn, i) => (
                  <li key={i}>{fn}</li>
                ))}
              </ul>
            </div>

            <div className="organelle-present">
              <div className={`present-tag ${organelle.presentIn.includes('plant') ? 'present-tag--yes' : 'present-tag--no'}`}>
                <Leaf size={11} />
                {t.plantCell}
              </div>
              <div className={`present-tag ${organelle.presentIn.includes('animal') ? 'present-tag--yes' : 'present-tag--no'}`}>
                <Bug size={11} />
                {t.animalCell}
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
