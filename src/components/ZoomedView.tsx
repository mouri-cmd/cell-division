import { useSimStore } from '../store/simStore';
import { plantLabels, animalLabels } from './TextbookDiagram';
import { ORGANELLE_MAP } from '../data/organelles';
import plantCellImg from '../assets/plant_cell.png';
import animalCellImg from '../assets/animal_cell.png';
import { ZoomIn } from 'lucide-react';

export default function ZoomedView() {
  const { selectedOrganelle, cellView } = useSimStore();

  if (!selectedOrganelle) return null;

  const organelle = ORGANELLE_MAP.get(selectedOrganelle);
  if (!organelle) return null;

  // Determine which cell image and labels to use
  let isPlant = false;
  let targetLabel = null;

  if (cellView === 'plant' || (cellView === 'both' && organelle.presentIn.includes('plant'))) {
    targetLabel = plantLabels.find(l => l.id === selectedOrganelle);
    if (targetLabel) isPlant = true;
  }
  
  if (!targetLabel && (cellView === 'animal' || cellView === 'both')) {
    targetLabel = animalLabels.find(l => l.id === selectedOrganelle);
    if (targetLabel) isPlant = false;
  }

  if (!targetLabel) return null;

  const imgSrc = isPlant ? plantCellImg : animalCellImg;
  
  // The original image is rendered in an 800x600 container.
  // Coordinates are relative to this 800x600 box.
  const xPercent = (targetLabel.x / 800) * 100;
  const yPercent = (targetLabel.y / 600) * 100;

  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-full h-full animate-fadeIn" style={{ animation: 'fadeInCenter 0.4s ease' }}>
      <div className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full border-[6px] border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.2)] overflow-hidden bg-white flex items-center justify-center">
        <div 
          className="absolute w-full h-full"
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: '350%', // Zoom level
            backgroundPosition: `${xPercent}% ${yPercent}%`,
            backgroundRepeat: 'no-repeat',
            transition: 'background-position 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] rounded-full pointer-events-none" />
        <div className="absolute top-6 right-6 bg-white/90 p-2.5 rounded-full shadow-lg text-emerald-600 backdrop-blur-sm">
          <ZoomIn size={24} />
        </div>
      </div>
      <div className="mt-8 text-center bg-white px-8 py-3 rounded-full shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 bn">{organelle.nameBn}</h3>
        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Magnified View</p>
      </div>
    </div>
  );
}
