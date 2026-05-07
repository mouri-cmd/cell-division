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

          const x = (pos.x * 0.5 + 0.5) * rect.width;
          const y = (-(pos.y * 0.5) + 0.5) * rect.height;

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
    <div className="textbook-labels-layer" ref={containerRef}>
      {labels.map((label) => {
        if (!label.visible) return null;
        const active = selectedOrganelle === label.id;

        return (
          <div
            key={label.id}
            className={`textbook-label ${active ? 'textbook-label--active' : ''}`}
            style={{
              left: `${label.x}px`,
              top: `${label.y}px`,
              '--label-color': label.color,
            } as React.CSSProperties}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrganelle(active ? null : label.id);
            }}
            onMouseEnter={() => setHoveredOrganelle(label.id)}
            onMouseLeave={() => setHoveredOrganelle(null)}
          >
            <div className="label-line-connector" />
            <div className="label-content">
              <div className="label-bn">{label.nameBn}</div>
              <div className="label-en">{label.nameEn}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

