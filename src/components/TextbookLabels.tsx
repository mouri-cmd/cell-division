import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ORGANELLE_MAP } from '../data/organelles';
import { useSimStore } from '../store/simStore';

interface Props {
  camera: THREE.Camera;
  scene: THREE.Scene;
  cellView: string;
}

interface LabelData {
  id: string;
  nameBn: string;
  nameEn: string;
  x: number;
  y: number;
  visible: boolean;
  color: string;
}

export default function TextbookLabels({ camera, scene, cellView }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const { setSelectedOrganelle, selectedOrganelle, setHoveredOrganelle } = useSimStore();
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const updateLabels = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLabels: LabelData[] = [];
      const seen = new Set<string>();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.organelleId) {
          const id = obj.userData.organelleId;
          if (seen.has(id)) return;

          const isPlantObj = obj.name.includes('plant') || obj.parent?.name.includes('plant');
          const isAnimalObj = obj.name.includes('animal') || obj.parent?.name.includes('animal');
          
          if (cellView === 'plant' && !isPlantObj) return;
          if (cellView === 'animal' && !isAnimalObj) return;

          const org = ORGANELLE_MAP.get(id);
          if (!org) return;

          const pos = new THREE.Vector3();
          obj.getWorldPosition(pos);
          pos.project(camera);

          // Project to 2D screen coords
          const x = (pos.x * 0.5 + 0.5) * rect.width;
          const y = (-(pos.y * 0.5) + 0.5) * rect.height;

          // Only show labels for organelles facing the camera
          const visible = pos.z < 1;

          newLabels.push({
            id,
            nameBn: org.nameBn,
            nameEn: org.nameEn,
            x,
            y,
            visible,
            color: org.color,
          });
          seen.add(id);
        }
      });

      setLabels(newLabels);
      requestRef.current = requestAnimationFrame(updateLabels);
    };

    requestRef.current = requestAnimationFrame(updateLabels);
    return () => cancelAnimationFrame(requestRef.current);
  }, [camera, scene, cellView]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" ref={containerRef}>
      {labels.map((label) => {
        if (!label.visible) return null;
        const active = selectedOrganelle === label.id;

        // Position the label slightly away from the hotspot
        // For 3D mode, we'll use a fixed offset for now
        const isLeft = label.x < (containerRef.current?.offsetWidth || 0) / 2;

        return (
          <div
            key={label.id}
            className="absolute pointer-events-auto cursor-pointer transition-all duration-300"
            style={{
              left: `${label.x}px`,
              top: `${label.y}px`,
              transform: `translate(${isLeft ? '20px' : '-100% - 20px'}, -50%)`,
            } as React.CSSProperties}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrganelle(active ? null : label.id);
            }}
            onMouseEnter={() => setHoveredOrganelle(label.id)}
            onMouseLeave={() => setHoveredOrganelle(null)}
          >
            {/* The Label Box (Matching Heart Style) */}
            <div className={`
              flex flex-col items-center text-center p-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 min-w-[100px] whitespace-nowrap
              ${active 
                ? 'bg-slate-800 text-white border-[#22c55e] shadow-[0_10px_30px_rgba(34,197,94,0.3)] scale-105' 
                : 'bg-slate-900/90 text-white border-white/10 hover:border-white/30'
              }
            `}>
              <div className="flex flex-col items-center gap-1 mb-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#22c55e] animate-pulse' : 'bg-[#22c55e]/50'}`} />
                <span className="text-sm font-black text-white bn leading-none">{label.nameBn}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${active ? 'text-[#22c55e]' : 'text-slate-400'}`}>
                {label.nameEn}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
