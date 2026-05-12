import { useSimStore } from '../store/simStore';
import { ORGANELLE_MAP } from '../data/organelles';

// Importing images from the assets folder
import plantCellImg from '../assets/plant_cell.png';
import animalCellImg from '../assets/animal_cell.png';

interface Props {
  cell: 'animal' | 'plant';
}

export default function TextbookDiagram({ cell }: Props) {
  const { selectedOrganelle, setSelectedOrganelle, setHoveredOrganelle } = useSimStore();

  const highlight = (id: string) => selectedOrganelle === id;
  const handleEnter = (id: string) => setHoveredOrganelle(id);
  const handleLeave = () => setHoveredOrganelle(null);
  const handleClick = (id: string) => setSelectedOrganelle(selectedOrganelle === id ? null : id);

  if (cell === 'animal') return <AnimalDiagram {...{ highlight, handleEnter, handleLeave, handleClick }} />;
  return <PlantDiagram {...{ highlight, handleEnter, handleLeave, handleClick }} />;
}

interface InnerProps {
  highlight: (id: string) => boolean;
  handleEnter: (id: string) => void;
  handleLeave: () => void;
  handleClick: (id: string) => void;
}

const activeColor = '#10b981';

export const animalLabels = [
    { id: 'nucleus', x: 400, y: 300, lx: 120, ly: 300, anchor: 'end' },
    { id: 'mitochondria', x: 420, y: 100, lx: 140, ly: 100, anchor: 'end' },
    { id: 'er', x: 400, y: 480, lx: 140, ly: 500, anchor: 'end' },
    { id: 'cytoplasm', x: 200, y: 200, lx: 660, ly: 100, anchor: 'start' },
    { id: 'golgi', x: 600, y: 280, lx: 680, ly: 280, anchor: 'start' },
    { id: 'lysosome', x: 200, y: 450, lx: 660, ly: 500, anchor: 'start' }
  ];

function AnimalDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="diagram-title text-3xl md:text-5xl font-black text-slate-800 tracking-tight">প্রাণী কোষ</h2>
        <p className="diagram-subtitle text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Animal Cell Anatomy</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 px-6 md:px-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
           <div className="animate-breathe w-full h-full flex items-center justify-center">
             <img src={animalCellImg} alt="3D Animal Cell" className="w-full h-full object-contain brightness-[1.02]" />
           </div>
        </div>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {animalLabels.map((l) => (
            <HotspotLabel 
              key={l.id} 
              id={l.id} 
              x={l.x} y={l.y} 
              labelX={l.lx} labelY={l.ly} 
              anchor={l.anchor}
              active={highlight(l.id)}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const plantLabels = [
    { id: 'cell_wall', x: 400, y: 40, lx: 120, ly: 100, anchor: 'end' },
    { id: 'chloroplast', x: 260, y: 160, lx: 120, ly: 300, anchor: 'end' },
    { id: 'golgi', x: 580, y: 180, lx: 140, ly: 500, anchor: 'end' },
    { id: 'nucleus', x: 355, y: 310, lx: 680, ly: 150, anchor: 'start' },
    { id: 'vacuole', x: 520, y: 360, lx: 700, ly: 350, anchor: 'start' },
    { id: 'er', x: 350, y: 480, lx: 680, ly: 480, anchor: 'start' },
    { id: 'mitochondria', x: 520, y: 530, lx: 640, ly: 550, anchor: 'start' }
  ];

function PlantDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="diagram-title text-3xl md:text-5xl font-black text-emerald-900 tracking-tight">উদ্ভিদ কোষ</h2>
        <p className="diagram-subtitle text-[10px] md:text-xs text-emerald-600 font-bold uppercase tracking-[0.2em]">Plant Cell Anatomy</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 px-6 md:px-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
          <div className="animate-breathe w-full h-full flex items-center justify-center">
            <img src={plantCellImg} alt="3D Plant Cell" className="w-full h-full object-contain brightness-[1.05]" />
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {plantLabels.map((l) => (
            <HotspotLabel 
              key={l.id} 
              id={l.id} 
              x={l.x} y={l.y} 
              labelX={l.lx} labelY={l.ly} 
              anchor={l.anchor}
              active={highlight(l.id)}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HOTSPOT LABEL ─────────────────────────────────────────────────────────────

interface HotspotProps {
  id: string;
  x: number; y: number;
  labelX: number; labelY: number;
  anchor: string;
  active: boolean;
  onClick: (id: string) => void;
}

function HotspotLabel({ id, x, y, labelX, labelY, anchor, active, onClick }: HotspotProps) {
  const org = ORGANELLE_MAP.get(id);
  if (!org) return null;

  const left = `${(labelX / 800) * 100}%`;
  const top = `${(labelY / 600) * 100}%`;
  const hotspotLeft = `${(x / 800) * 100}%`;
  const hotspotTop = `${(y / 600) * 100}%`;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <line 
          x1={hotspotLeft} y1={hotspotTop} 
          x2={left} y2={top} 
          stroke={active ? activeColor : 'rgba(0,0,0,0.06)'} 
          strokeWidth={active ? 2 : 1}
          className="transition-all duration-700"
        />
        <circle 
          cx={left} cy={top} r="2.5" 
          fill={active ? activeColor : 'rgba(0,0,0,0.06)'} 
          className="transition-all duration-300"
        />
      </svg>

      <div 
        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
        style={{ left: hotspotLeft, top: hotspotTop }}
        onClick={() => onClick(id)}
      >
        <div className={`w-full h-full rounded-full border-2 transition-all duration-300 ${active ? 'bg-white border-4' : 'bg-transparent border-slate-300 opacity-40'}`} style={{ borderColor: active ? activeColor : 'rgba(0,0,0,0.1)' }} />
      </div>

      <div 
        className={`absolute pointer-events-auto cursor-pointer transition-all duration-500 flex flex-col ${anchor === 'end' ? 'items-end -translate-x-full pr-4' : 'items-start pl-4'}`}
        style={{ left, top, transform: `translate(${anchor === 'end' ? '-100%' : '0%'}, -50%) ${active ? 'scale(1.1)' : 'scale(1)'}` }}
        onClick={() => onClick(id)}
      >
        <div className="flex flex-col leading-tight">
          <span className={`text-[10px] md:text-[12px] transition-all duration-300 ${active ? 'font-black scale-105' : 'font-bold opacity-80'}`} style={{ color: active ? activeColor : '#334155' }}>
            {org.nameBn}
          </span>
          <span className={`text-[7px] md:text-[9px] transition-all duration-300 ${active ? 'font-black text-slate-700' : 'font-medium text-slate-400'}`}>
            ({org.nameEn})
          </span>
        </div>
        {active && (
           <div className="h-0.5 w-full mt-0.5 rounded-full" style={{ backgroundColor: activeColor }} />
        )}
      </div>
    </div>
  );
}
