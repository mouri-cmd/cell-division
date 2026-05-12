import * as THREE from 'three';

// ── AI-Standard Advanced Materials ───────────────────────────────────────────

function pbrMat(color: string, emissive: string, intensity = 0.4): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    sheen: 0.5,
    sheenRoughness: 0.2,
    sheenColor: new THREE.Color(0xffffff),
  });
}

function organicGlass(color: number, opacity: number): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    transparent: true,
    opacity: opacity,
    metalness: 0.05,
    roughness: 0.05,
    transmission: 0.7,
    thickness: 1.5,
    ior: 1.52,
    reflectivity: 0.5,
  });
}

// ── Plant Cell (AI Standard) ──────────────────────────────────────────────────

export function buildPlantCell(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'plant_cell';

  // AI-Style Hexagonal Cell Wall
  const wallGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.0, 6);
  const wallMat = pbrMat('#064e3b', '#064e3b', 0.1);
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.rotation.x = Math.PI / 2;
  wall.userData.organelleId = 'cell_wall';
  root.add(wall);

  // Inner Glossy Membrane
  const memGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.9, 6);
  const memMat = organicGlass(0x4ade80, 0.2);
  const mem = new THREE.Mesh(memGeo, memMat);
  mem.rotation.x = Math.PI / 2;
  mem.userData.organelleId = 'cytoplasm';
  root.add(mem);

  // Central Vacuole (Liquid Look)
  const vacGeo = new THREE.SphereGeometry(1.2, 48, 48);
  const vacMat = organicGlass(0x0ea5e9, 0.6);
  const vac = new THREE.Mesh(vacGeo, vacMat);
  vac.position.set(-0.5, 0.3, 0.1);
  vac.scale.set(0.7, 1.7, 1);
  vac.userData.organelleId = 'vacuole';
  root.add(vac);

  // AI-Glow Nucleus
  const nucGroup = buildNucleus(0.55, '#ea580c', '#fbbf24');
  nucGroup.position.set(0.8, -0.2, 0.2);
  root.add(nucGroup);

  // Chloroplasts (with inner detail)
  const chloroPos: [number, number, number, number][] = [
    [-1.2, 1.3, 0.1, 0.4], [-1.2, -1.2, 0.1, -0.4], [0.4, 1.7, 0.1, -0.2],
    [0.4, -1.7, 0.1, 0.2], [1.4, 0.7, 0.1, 1.1], [1.4, -0.7, 0.1, 0.5],
  ];
  chloroPos.forEach(([x, y, z, rz]) => {
    const cg = buildChloroplast();
    cg.position.set(x, y, z);
    cg.rotation.z = rz;
    root.add(cg);
  });

  return root;
}

// ── Animal Cell (AI Standard) ─────────────────────────────────────────────────

export function buildAnimalCell(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'animal_cell';

  // Ultra-Glossy Biological Membrane
  const memGeo = new THREE.SphereGeometry(2.2, 80, 80);
  const memMat = organicGlass(0x93c5fd, 0.18);
  const mem = new THREE.Mesh(memGeo, memMat);
  mem.scale.set(1, 0.85, 1.25);
  mem.userData.organelleId = 'cytoplasm';
  root.add(mem);

  // Cytoplasm Fill (Subtle Refraction)
  const cytoGeo = new THREE.SphereGeometry(2.1, 48, 48);
  const cytoMat = new THREE.MeshStandardMaterial({
    color: 0xfef9c3, transparent: true, opacity: 0.12, emissive: 0xfef9c3, emissiveIntensity: 0.05
  });
  const cyto = new THREE.Mesh(cytoGeo, cytoMat);
  cyto.scale.set(1, 0.85, 1.2);
  cyto.userData.organelleId = 'cytoplasm';
  root.add(cyto);

  // AI-Glow Purple Nucleus
  const nucGroup = buildNucleus(0.65, '#9333ea', '#e879f9');
  nucGroup.position.set(-0.2, 0.1, 0.15);
  root.add(nucGroup);

  // High-Detail Mitochondria
  const mitoPos: [number, number, number, number][] = [
    [1.2, 0.6, 0.1, 0.3], [1.4, -0.4, 0.1, -0.5], [0.8, -1.1, 0.1, 0.8],
    [-1.3, 0.7, 0.1, -0.4], [-1.2, -0.6, 0.1, 0.2], [0.3, 1.2, 0.1, 1.0],
  ];
  mitoPos.forEach(([x, y, z, rz]) => {
    const mg = buildMitochondrion();
    mg.position.set(x, y, z);
    mg.rotation.z = rz;
    root.add(mg);
  });

  return root;
}

// ── AI-Grade Organelle Builders ──────────────────────────────────────────────

function buildNucleus(radius: number, color: string, glow: string): THREE.Group {
  const g = new THREE.Group();

  // Dense Core
  const nGeo = new THREE.SphereGeometry(radius, 64, 64);
  const nMat = pbrMat(color, glow, 0.8);
  const nucleus = new THREE.Mesh(nGeo, nMat);
  nucleus.userData.organelleId = 'nucleus';
  g.add(nucleus);

  // Multiple Atmospheric Glow Shells (AI Effect)
  for (let i = 1; i <= 4; i++) {
    const sGeo = new THREE.SphereGeometry(radius + (i * 0.08), 32, 32);
    const sMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(glow),
      transparent: true,
      opacity: 0.18 / i,
      side: THREE.BackSide,
    });
    const shell = new THREE.Mesh(sGeo, sMat);
    g.add(shell);
  }

  // Internal Point Light
  const light = new THREE.PointLight(glow, 1.0, 3);
  g.add(light);

  // Nucleolus (Black Pearl)
  const nlGeo = new THREE.SphereGeometry(radius * 0.38, 32, 32);
  const nlMat = new THREE.MeshPhysicalMaterial({ color: 0x1e3a8a, roughness: 0.05, metalness: 0.5 });
  const nl = new THREE.Mesh(nlGeo, nlMat);
  nl.position.set(radius * 0.25, radius * 0.25, radius * 0.25);
  nl.userData.organelleId = 'nucleus';
  g.add(nl);

  return g;
}

function buildChloroplast(): THREE.Group {
  const g = new THREE.Group();
  const oGeo = new THREE.SphereGeometry(0.24, 32, 24);
  const oMat = pbrMat('#22c55e', '#15803d', 0.25);
  const outer = new THREE.Mesh(oGeo, oMat);
  outer.scale.set(1.6, 1, 0.7);
  outer.userData.organelleId = 'chloroplast';
  g.add(outer);

  // Detailed inner granum stacks
  for (let i = 0; i < 5; i++) {
    const dGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    const dMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.3 });
    const d = new THREE.Mesh(dGeo, dMat);
    d.position.set((i - 2) * 0.1, 0, 0);
    d.rotation.z = Math.PI / 2;
    d.userData.organelleId = 'chloroplast';
    g.add(d);
  }
  return g;
}

export function buildMitochondrion(): THREE.Group {
  const g = new THREE.Group();
  const oGeo = new THREE.SphereGeometry(0.22, 32, 24);
  const oMat = pbrMat('#ef4444', '#991b1b', 0.3);
  const outer = new THREE.Mesh(oGeo, oMat);
  outer.scale.set(1.8, 1, 0.8);
  outer.userData.organelleId = 'mitochondria';
  g.add(outer);

  // Realistic Inner Cristae (Torus segments)
  for (let i = 0; i < 6; i++) {
    const cGeo = new THREE.TorusGeometry(0.12, 0.02, 12, 24, Math.PI);
    const cMat = new THREE.MeshStandardMaterial({ color: 0xfecaca, opacity: 0.6, transparent: true });
    const c = new THREE.Mesh(cGeo, cMat);
    c.position.set((i - 2.5) * 0.08, 0, 0);
    c.rotation.y = Math.PI / 2;
    c.userData.organelleId = 'mitochondria';
    g.add(c);
  }
  return g;
}
