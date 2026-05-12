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
    { id: 'nucleus', x: 400, y: 300, lx: 180, ly: 300, anchor: 'end' },
    { id: 'mitochondria', x: 420, y: 100, lx: 180, ly: 100, anchor: 'end' },
    { id: 'er', x: 400, y: 480, lx: 180, ly: 500, anchor: 'end' },
    { id: 'cytoplasm', x: 200, y: 200, lx: 620, ly: 100, anchor: 'start' },
    { id: 'golgi', x: 600, y: 280, lx: 620, ly: 280, anchor: 'start' },
    { id: 'lysosome', x: 200, y: 450, lx: 620, ly: 500, anchor: 'start' }
  ];

function AnimalDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {
  return (
    <div className="diagram-frame flex-col">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="diagram-title text-3xl md:text-5xl font-black text-slate-800 tracking-tight">প্রাণী কোষ</h2>
        <p className="diagram-subtitle text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Animal Cell Anatomy</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] px-4 md:px-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
           <div className="animate-breathe w-full h-full flex items-center justify-center">
             <img src={animalCellImg} alt="3D Animal Cell" className="w-[60%] md:w-full h-[60%] md:h-full object-contain brightness-[1.02]" />
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
    { id: 'cell_wall', x: 400, y: 40, lx: 180, ly: 100, anchor: 'end' },
    { id: 'chloroplast', x: 260, y: 160, lx: 180, ly: 300, anchor: 'end' },
    { id: 'golgi', x: 580, y: 180, lx: 200, ly: 500, anchor: 'end' },
    { id: 'nucleus', x: 355, y: 310, lx: 620, ly: 150, anchor: 'start' },
    { id: 'vacuole', x: 520, y: 360, lx: 620, ly: 350, anchor: 'start' },
    { id: 'er', x: 350, y: 480, lx: 620, ly: 480, anchor: 'start' },
    { id: 'mitochondria', x: 520, y: 530, lx: 620, ly: 550, anchor: 'start' }
  ];

function PlantDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {
  return (
    <div className="diagram-frame flex-col">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="diagram-title text-3xl md:text-5xl font-black text-emerald-900 tracking-tight">উদ্ভিদ কোষ</h2>
        <p className="diagram-subtitle text-[10px] md:text-xs text-emerald-600 font-bold uppercase tracking-[0.2em]">Plant Cell Anatomy</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] px-4 md:px-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
          <div className="animate-breathe w-full h-full flex items-center justify-center">
            <img src={plantCellImg} alt="3D Plant Cell" className="w-[60%] md:w-full h-[60%] md:h-full object-contain brightness-[1.05]" />
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
        className={`absolute pointer-events-auto cursor-pointer transition-all duration-500 flex flex-col ${anchor === 'end' ? 'items-end' : 'items-start'}`}
        style={{ 
          left: `${labelX / 8}%`, 
          top: `${labelY / 6}%`,
          transform: `translate(${anchor === 'end' ? '-100%' : '0%'}, -50%) ${active ? 'scale(1.05)' : 'scale(1)'}`,
          zIndex: active ? 20 : 10
        }}
        onClick={() => onClick(id)}
      >
        <div className={`flex flex-col leading-tight max-w-[90px] xs:max-w-[120px] md:max-w-[200px] bg-white shadow-md border border-slate-200 p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 ${active ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}>
          <span className={`text-[10px] xs:text-[12px] md:text-[15px] leading-tight font-black`} style={{ color: active ? activeColor : '#0f172a' }}>
            {org.nameBn}
          </span>
          <span className={`text-[8px] md:text-[11px] mt-0.5 font-bold text-slate-500`}>
            ({org.nameEn})
          </span>
        </div>
      </div>
    </div>
  );
}
