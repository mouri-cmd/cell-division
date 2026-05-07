import { useSimStore } from '../store/simStore';
import { ORGANELLE_MAP } from '../data/organelles';

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

// ── ANIMAL CELL (Living Model) ────────────────────────────────────────────────

function AnimalDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {
  const animalLabels = [
    { id: 'nucleus', x: 300, y: 300, lx: 100, ly: 100, anchor: 'end' },
    { id: 'mitochondria', x: 400, y: 150, lx: 100, ly: 250, anchor: 'end' },
    { id: 'er', x: 320, y: 420, lx: 100, ly: 450, anchor: 'end' },
    { id: 'cytoplasm', x: 200, y: 200, lx: 700, ly: 100, anchor: 'start' },
    { id: 'golgi', x: 180, y: 350, lx: 700, ly: 280, anchor: 'start' },
    { id: 'lysosome', x: 480, y: 300, lx: 700, ly: 450, anchor: 'start' }
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h2 className="diagram-title text-4xl font-black text-slate-800 tracking-tight">প্রাণী কোষ</h2>
        <p className="diagram-subtitle text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Animal Cell (Living Model)</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
           <div className="animate-breathe w-full h-full flex items-center justify-center">
             <img src="/assets/animal_cell_3d.png" alt="3D Animal Cell" className="h-[90%] object-contain scale-125 brightness-[1.02]" />
           </div>
        </div>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div 
            className="absolute w-32 h-32 rounded-full blur-3xl bg-purple-500/20 mix-blend-screen animate-pulse pointer-events-none"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />

          {animalLabels.map((l) => (
            <HotspotLabel 
              key={l.id} 
              id={l.id} 
              x={l.x + 100} y={l.y} 
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

// ── PLANT CELL (Living Model) ─────────────────────────────────────────────────

function PlantDiagram({ highlight, handleEnter, handleLeave, handleClick }: InnerProps) {
  const plantLabels = [
    { id: 'cell_wall', x: 300, y: 60, lx: 100, ly: 80, anchor: 'end' },
    { id: 'chloroplast', x: 180, y: 300, lx: 100, ly: 250, anchor: 'end' },
    { id: 'golgi', x: 220, y: 480, lx: 100, ly: 450, anchor: 'end' },
    { id: 'nucleus', x: 300, y: 220, lx: 700, ly: 100, anchor: 'start' },
    { id: 'vacuole', x: 450, y: 350, lx: 700, ly: 280, anchor: 'start' },
    { id: 'er', x: 380, y: 150, lx: 700, ly: 450, anchor: 'start' },
    { id: 'mitochondria', x: 320, y: 350, lx: 700, ly: 550, anchor: 'start' }
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h2 className="diagram-title text-4xl font-black text-emerald-900 tracking-tight">উদ্ভিদ কোষ</h2>
        <p className="diagram-subtitle text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs">Plant Cell (Living Model)</p>
      </div>

      <div className="relative w-full max-w-[850px] aspect-[800/600] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
          <div className="animate-breathe w-full h-full flex items-center justify-center">
            <img src="/assets/plant_cell_3d.png" alt="3D Plant Cell" className="h-[90%] object-contain scale-110 brightness-[1.02]" />
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div 
            className="absolute w-32 h-32 rounded-full blur-3xl bg-orange-500/20 mix-blend-screen animate-pulse pointer-events-none"
            style={{ left: '50%', top: '35%', transform: 'translate(-50%, -50%)' }}
          />

          {plantLabels.map((l) => (
            <HotspotLabel 
              key={l.id} 
              id={l.id} 
              x={l.x + 100} y={l.y} 
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

// ── HOTSPOT LABEL (With Energy Flow) ──────────────────────────────────────────

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
          stroke={active ? '#22c55e' : 'rgba(0,0,0,0.1)'} 
          strokeWidth={active ? 2 : 1}
          strokeDasharray={active ? 'none' : '4 2'}
          className="transition-all duration-700"
        />
        {active && (
          <circle r="3" fill="#22c55e">
            <animateMotion 
              path={`M ${hotspotLeft} ${hotspotTop} L ${left} ${top}`}
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>

      <div 
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
        style={{ left: hotspotLeft, top: hotspotTop }}
        onClick={() => onClick(id)}
      >
        <div className={`w-full h-full rounded-full border-2 transition-all duration-300 ${active ? 'bg-[#22c55e] border-white scale-150 rotate-[360deg]' : 'bg-transparent border-[#22c55e] opacity-60 group-hover:opacity-100 group-hover:scale-110'}`} />
        <div className={`absolute inset-0 rounded-full bg-[#22c55e] animate-ping opacity-30 ${active ? 'block' : 'hidden'}`} />
      </div>

      <div 
        className={`absolute pointer-events-auto cursor-pointer transition-all duration-700 ${anchor === 'end' ? '-translate-x-full pr-6' : 'pl-6'}`}
        style={{ left, top, transform: `translate(${anchor === 'end' ? '-100%' : '0%'}, -50%) ${active ? 'scale(1.05)' : 'scale(1)'}` }}
        onClick={() => onClick(id)}
      >
        <div className={`
          flex flex-col items-center text-center p-2.5 rounded-xl backdrop-blur-md border transition-all duration-500 min-w-[100px] whitespace-nowrap
          ${active 
            ? 'bg-slate-800 text-white border-[#22c55e] shadow-[0_20px_50px_rgba(34,197,94,0.4)]' 
            : 'bg-slate-900/90 text-white border-white/10 hover:border-white/30'
          }
        `}>
          <div className="flex flex-col items-center gap-1 mb-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-[#22c55e]/50'}`} />
            <span className="text-sm font-black text-white bn leading-none">{org.nameBn}</span>
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${active ? 'text-[#22c55e]' : 'text-slate-400'}`}>
            {org.nameEn}
          </span>
        </div>
      </div>
    </div>
  );
}
