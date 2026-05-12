import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSimStore } from '../store/simStore';
import { createScene, createCamera, createRenderer, createLights } from '../three/CellScene';
import { buildPlantCell, buildAnimalCell } from '../three/OrganelleMeshes';
import TextbookLabels from './TextbookLabels';

interface SceneState {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  plantGroup?: THREE.Group;
  animalGroup?: THREE.Group;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  frameId?: number;
  orbitTl?: gsap.core.Timeline;
}

export default function SimCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<SceneState>({
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
  });

  const { cellView, selectedOrganelle, setSelectedOrganelle, setHoveredOrganelle } = useSimStore();

  // Init
  useEffect(() => {
    const canvas = canvasRef.current!;
    const w = canvas.offsetWidth || 800;
    const h = canvas.offsetHeight || 600;

    const scene = createScene();
    scene.background = new THREE.Color('#f8fafc'); // Soft off-white
    
    const camera = createCamera(w, h);
    camera.position.z = 10; // Slightly further back
    const renderer = createRenderer(canvas);
    renderer.setSize(w, h);
    createLights(scene);

    // Plant cell
    const plantGroup = buildPlantCell();
    plantGroup.position.x = -2.8;
    scene.add(plantGroup);

    // Animal cell
    const animalGroup = buildAnimalCell();
    animalGroup.position.x = 2.8;
    scene.add(animalGroup);

    // Gentle idle rotation
    const orbitTl = gsap.timeline({ repeat: -1 });
    orbitTl.to(plantGroup.rotation, { y: Math.PI * 2, duration: 25, ease: 'none' });
    orbitTl.to(animalGroup.rotation, { y: -Math.PI * 2, duration: 25, ease: 'none' }, 0);

    state.current = { renderer, scene, camera, plantGroup, animalGroup, ...state.current, orbitTl };

    function animate() {
      state.current.frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w2 = canvas.offsetWidth;
      const h2 = canvas.offsetHeight;
      renderer.setSize(w2, h2);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(state.current.frameId!);
      orbitTl.kill();
      renderer.dispose();
    };
  }, []);

  // Respond to cellView changes
  useEffect(() => {
    const s = state.current;
    if (!s.plantGroup || !s.animalGroup || !s.camera) return;

    if (cellView === 'both') {
      s.plantGroup.visible = true;
      s.animalGroup.visible = true;
      gsap.to(s.plantGroup.position, { x: -2.8, duration: 0.8, ease: 'power3.out' });
      gsap.to(s.animalGroup.position, { x: 2.8, duration: 0.8, ease: 'power3.out' });
      gsap.to(s.camera.position, { x: 0, z: 9, duration: 1.0, ease: 'power3.out' });
    } else if (cellView === 'plant') {
      s.plantGroup.visible = true;
      s.animalGroup.visible = false;
      gsap.to(s.plantGroup.position, { x: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(s.camera.position, { x: 0, z: 8, duration: 1.0, ease: 'power3.out' });
    } else {
      s.plantGroup.visible = false;
      s.animalGroup.visible = true;
      gsap.to(s.animalGroup.position, { x: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(s.camera.position, { x: 0, z: 8, duration: 1.0, ease: 'power3.out' });
    }
  }, [cellView]);

  // Handle Rotation
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
    canvasRef.current!.style.cursor = 'grabbing';
  }, []);

  const onMouseDrag = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return;
    const s = state.current;
    const dx = (e.clientX - dragRef.current.lastX) * 0.008;
    const dy = (e.clientY - dragRef.current.lastY) * 0.008;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    const targets = [s.plantGroup, s.animalGroup].filter(Boolean) as THREE.Group[];
    targets.forEach((g) => {
      if (!g.visible) return;
      g.rotation.y += dx;
      g.rotation.x = Math.max(-0.5, Math.min(0.5, g.rotation.x + dy));
    });
  }, []);

  const onMouseUp = useCallback(() => { 
    dragRef.current.dragging = false; 
    canvasRef.current!.style.cursor = 'grab';
  }, []);

  return (
    <div className="relative w-full h-full bg-white flex flex-col items-center">
      <div className="flex-1 w-full relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-grab"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseDrag}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
        
        {state.current.camera && state.current.scene && (
          <TextbookLabels 
            camera={state.current.camera} 
            scene={state.current.scene} 
            cellView={cellView} 
          />
        )}
      </div>

      {/* Dynamic Title based on view */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          {cellView === 'plant' ? 'উদ্ভিদ কোষ' : cellView === 'animal' ? 'প্রাণী কোষ' : 'উদ্ভিদ ও প্রাণী কোষ'}
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
          Interactive 360° 3D Models
        </p>
      </div>
    </div>
  );
}
