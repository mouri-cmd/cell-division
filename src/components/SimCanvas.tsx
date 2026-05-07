import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSimStore } from '../store/simStore';
import { createScene, createCamera, createRenderer, createLights } from '../three/CellScene';
import { buildPlantCell, buildAnimalCell } from '../three/OrganelleMeshes';
import { ORGANELLE_MAP } from '../data/organelles';
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
    const w = canvas.offsetWidth || 600;
    const h = canvas.offsetHeight || 400;

    const scene = createScene();
    const camera = createCamera(w, h);
    const renderer = createRenderer(canvas);
    renderer.setSize(w, h);
    createLights(scene);

    // Plant cell — left
    const plantGroup = buildPlantCell();
    plantGroup.position.x = -2.8;
    scene.add(plantGroup);

    // Animal cell — right
    const animalGroup = buildAnimalCell();
    animalGroup.position.x = 2.8;
    scene.add(animalGroup);

    // Gentle idle rotation
    const orbitTl = gsap.timeline({ repeat: -1 });
    orbitTl.to(plantGroup.rotation, { y: Math.PI * 2, duration: 28, ease: 'none' });
    orbitTl.to(animalGroup.rotation, { y: -Math.PI * 2, duration: 28, ease: 'none' }, 0);

    // Intro
    gsap.from([plantGroup.position, animalGroup.position], {
      z: -4, opacity: 0, duration: 1.0, ease: 'power2.out', stagger: 0.1,
    });
    gsap.from(camera.position, { z: 16, duration: 1.2, ease: 'power2.out' });

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respond to cellView changes — show/hide cells and reposition camera
  useEffect(() => {
    const s = state.current;
    if (!s.plantGroup || !s.animalGroup || !s.camera) return;

    if (cellView === 'both') {
      s.plantGroup.visible = true;
      s.animalGroup.visible = true;
      gsap.to(s.plantGroup.position, { x: -2.8, duration: 0.5, ease: 'power2.out' });
      gsap.to(s.animalGroup.position, { x: 2.8, duration: 0.5, ease: 'power2.out' });
      gsap.to(s.camera.position, { x: 0, z: 9, duration: 0.5, ease: 'power2.out' });
    } else if (cellView === 'plant') {
      s.plantGroup.visible = true;
      s.animalGroup.visible = false;
      gsap.to(s.plantGroup.position, { x: 0, duration: 0.5, ease: 'power2.out' });
      gsap.to(s.camera.position, { x: 0, z: 8, duration: 0.5, ease: 'power2.out' });
    } else {
      s.plantGroup.visible = false;
      s.animalGroup.visible = true;
      gsap.to(s.animalGroup.position, { x: 0, duration: 0.5, ease: 'power2.out' });
      gsap.to(s.camera.position, { x: 0, z: 8, duration: 0.5, ease: 'power2.out' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellView]);

  // Organelle glow on selection
  useEffect(() => {
    const s = state.current;
    if (!s.plantGroup || !s.animalGroup) return;

    // Reset all glow
    [s.plantGroup, s.animalGroup].forEach((cell) => {
      cell.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const m = obj.material as THREE.MeshPhongMaterial;
          m.emissive = new THREE.Color(0x000000);
          m.emissiveIntensity = 0;
        }
      });
    });

    if (!selectedOrganelle) return;

    const org = ORGANELLE_MAP.get(selectedOrganelle);
    const glowHex = org?.glowColor ?? '#e8001d';

    [s.plantGroup, s.animalGroup].forEach((cell) => {
      cell.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.organelleId === selectedOrganelle) {
          const m = obj.material as THREE.MeshPhongMaterial;
          m.emissive = new THREE.Color(glowHex);
          m.emissiveIntensity = 0.7;
        }
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganelle]);

  // Raycasting
  const getHitOrganelle = useCallback((e: React.PointerEvent | React.MouseEvent): string | null => {
    const s = state.current;
    if (!s.camera || !s.scene) return null;
    const rect = canvasRef.current!.getBoundingClientRect();
    s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    s.raycaster.setFromCamera(s.mouse, s.camera);

    const meshes: THREE.Mesh[] = [];
    s.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.userData.organelleId) meshes.push(obj);
    });

    const hits = s.raycaster.intersectObjects(meshes, false);
    if (hits.length > 0) return hits[0].object.userData.organelleId as string;
    return null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const id = getHitOrganelle(e);
    setSelectedOrganelle(id === selectedOrganelle ? null : id);
  }, [getHitOrganelle, selectedOrganelle, setSelectedOrganelle]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const id = getHitOrganelle(e);
    setHoveredOrganelle(id);
    canvasRef.current!.style.cursor = id ? 'pointer' : 'grab';
  }, [getHitOrganelle, setHoveredOrganelle]);

  // Drag rotate
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  }, []);

  const onMouseDrag = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return handleMouseMove(e);
    const s = state.current;
    const dx = (e.clientX - dragRef.current.lastX) * 0.006;
    const dy = (e.clientY - dragRef.current.lastY) * 0.006;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    const targets = [s.plantGroup, s.animalGroup].filter(Boolean) as THREE.Group[];
    targets.forEach((g) => {
      if (!g.visible) return;
      g.rotation.y += dx;
      g.rotation.x = Math.max(-0.7, Math.min(0.7, g.rotation.x + dy));
    });
  }, [handleMouseMove]);

  const onMouseUp = useCallback(() => { dragRef.current.dragging = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sim-canvas"
      onPointerDown={handlePointerDown}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseDrag}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      aria-label="উদ্ভিদ ও প্রাণী কোষ সিমুলেটর"
      role="img"
    />
  );
}


