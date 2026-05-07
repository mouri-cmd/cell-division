import * as THREE from 'three';

function emissiveMat(color: string, emissive: string, intensity = 0.25): THREE.MeshPhongMaterial {
  return new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    shininess: 60,
  });
}

// ── Plant Cell ────────────────────────────────────────────────────────────────

export function buildPlantCell(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'plant_cell';

  // Cell wall — upright rounded box (matching image)
  const wallGeo = new THREE.BoxGeometry(3.8, 5.2, 0.8);
  const wallMat = new THREE.MeshPhongMaterial({
    color: 0x4ade80, transparent: true, opacity: 0.15,
    side: THREE.DoubleSide,
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.name = 'cell_wall'; wall.userData.organelleId = 'cell_wall';
  root.add(wall);

  // Cell wall spikes (plasmodesmata hints)
  const spikeGeo = new THREE.ConeGeometry(0.12, 0.35, 4);
  const spikeMat = new THREE.MeshPhongMaterial({ color: 0x22c55e, transparent: true, opacity: 0.8 });
  const spikePositions = [
    [1.9, 1.5, 0], [1.9, 0, 0], [1.9, -1.5, 0],
    [-1.9, 1.5, 0], [-1.9, 0, 0], [-1.9, -1.5, 0],
    [1.0, 2.6, 0], [-1.0, 2.6, 0],
    [1.0, -2.6, 0], [-1.0, -2.6, 0],
  ];
  spikePositions.forEach(([x, y, z]) => {
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(x, y, z);
    // Rotate to point outward
    if (Math.abs(x) > 1.5) spike.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2;
    if (Math.abs(y) > 2) spike.rotation.z = y > 0 ? 0 : Math.PI;
    root.add(spike);
  });

  // Cell wall border frame (thicker corners)
  [
    { pos: [0, 2.6, 0], scale: [3.8, 0.15, 0.8] },
    { pos: [0, -2.6, 0], scale: [3.8, 0.15, 0.8] },
    { pos: [1.9, 0, 0], scale: [0.15, 5.2, 0.8] },
    { pos: [-1.9, 0, 0], scale: [0.15, 5.2, 0.8] },
  ].forEach(({ pos, scale }) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(...(scale as [number, number, number])),
      new THREE.MeshPhongMaterial({ color: 0x16a34a, transparent: true, opacity: 0.5 })
    );
    b.position.set(...(pos as [number, number, number]));
    b.name = 'cell_wall'; b.userData.organelleId = 'cell_wall';
    root.add(b);
  });

  // Cell membrane (inner box)
  const memGeo = new THREE.BoxGeometry(3.5, 4.8, 0.75);
  const memMat = new THREE.MeshPhongMaterial({
    color: 0x60a5fa, transparent: true, opacity: 0.08, side: THREE.DoubleSide,
  });
  const mem = new THREE.Mesh(memGeo, memMat);
  mem.name = 'cytoplasm'; mem.userData.organelleId = 'cytoplasm';
  root.add(mem);

  // Cytoplasm fill
  const cytoGeo = new THREE.BoxGeometry(3.4, 4.7, 0.7);
  const cytoMat = new THREE.MeshPhongMaterial({
    color: 0xfef9c3, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
  });
  const cyto = new THREE.Mesh(cytoGeo, cytoMat);
  cyto.name = 'cytoplasm'; cyto.userData.organelleId = 'cytoplasm';
  root.add(cyto);

  // Central vacuole — large, bean-shaped, left side
  const vacGeo = new THREE.SphereGeometry(1.2, 32, 24);
  const vacMat = new THREE.MeshPhongMaterial({
    color: 0xbae6fd, transparent: true, opacity: 0.45, shininess: 80,
  });
  const vac = new THREE.Mesh(vacGeo, vacMat);
  vac.position.set(-0.6, 0, 0.05);
  vac.scale.set(0.7, 1.8, 1); // Distort to be tall bean-like
  vac.name = 'vacuole'; vac.userData.organelleId = 'vacuole';
  root.add(vac);

  // Nucleus — right-center as in image
  const nucGroup = buildNucleus(0.5);
  nucGroup.position.set(0.8, 0, 0.1);
  root.add(nucGroup);

  // Chloroplasts — positioned around periphery (matching image)
  const chloroPositions: [number, number, number, number][] = [
    [-1.2, 1.8, 0, 0.4],
    [-1.2, -1.8, 0, -0.4],
    [0.8, 2.0, 0, -0.2],
    [0.8, -2.0, 0, 0.2],
    [1.4, 1.2, 0, 1.1],
    [1.4, -1.2, 0, 0.5],
  ];
  chloroPositions.forEach(([x, y, z, rz]) => {
    const cg = buildChloroplast();
    cg.position.set(x, y, z);
    cg.rotation.z = rz;
    root.add(cg);
  });

  // Mitochondria — scattered
  const mitoPositions: [number, number, number, number][] = [
    [-1.1, 0.8, 0.08, 0.6],
    [-1.1, -0.8, 0.08, -0.6],
    [0.3, 1.8, 0.08, 0.2],
    [0.3, -1.8, 0.08, -0.2],
  ];
  mitoPositions.forEach(([x, y, z, rz]) => {
    const mg = buildMitochondrion();
    mg.position.set(x, y, z);
    mg.rotation.z = rz;
    root.add(mg);
  });

  // ER wrapping nucleus
  const er = buildER();
  er.position.set(0.8, 0, 0.1);
  er.scale.set(1.2, 1.2, 1.2);
  root.add(er);

  // Golgi
  const golgi = buildGolgi();
  golgi.position.set(0.8, -1.0, 0.1);
  golgi.scale.set(0.7, 0.7, 0.7);
  root.add(golgi);

  // Lysosomes / Peroxisomes (small dots as in image)
  [[-1.4, 0.2, 0.08], [1.4, 0.2, 0.08], [0, 2.0, 0.08]].forEach(([x, y, z]) => {
    const p = buildPeroxisome();
    p.position.set(x, y, z);
    root.add(p);
  });

  return root;
}


// ── Animal Cell ───────────────────────────────────────────────────────────────

export function buildAnimalCell(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'animal_cell';

  // Outer membrane — irregular ellipsoid (no cell wall)
  const memGeo = new THREE.SphereGeometry(2.1, 40, 32);
  const memMat = new THREE.MeshPhongMaterial({
    color: 0x60a5fa, transparent: true, opacity: 0.12,
    side: THREE.DoubleSide, shininess: 80,
  });
  const mem = new THREE.Mesh(memGeo, memMat);
  mem.scale.set(1, 0.88, 1.2);
  mem.name = 'cytoplasm'; mem.userData.organelleId = 'cytoplasm';
  root.add(mem);

  // Cytoplasm inner fill
  const cytoGeo = new THREE.SphereGeometry(2.0, 32, 24);
  const cytoMat = new THREE.MeshPhongMaterial({
    color: 0xfef9c3, transparent: true, opacity: 0.04, side: THREE.FrontSide,
  });
  const cyto = new THREE.Mesh(cytoGeo, cytoMat);
  cyto.scale.set(1, 0.88, 1.15);
  cyto.name = 'cytoplasm'; cyto.userData.organelleId = 'cytoplasm';
  root.add(cyto);

  // Cell membrane border ring
  const ringGeo = new THREE.TorusGeometry(2.1, 0.05, 12, 64);
  const ringMat = new THREE.MeshPhongMaterial({
    color: 0x93c5fd, transparent: true, opacity: 0.45,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.scale.set(1, 0.88, 1.2);
  ring.name = 'cytoplasm'; ring.userData.organelleId = 'cytoplasm';
  root.add(ring);

  // Nucleus — center-left as in image, with nucleolus
  const nucGroup = buildNucleus(0.6);
  nucGroup.position.set(-0.2, 0.05, 0.1);
  root.add(nucGroup);

  // Mitochondria — scattered, many (as in image)
  const mitoPositions: [number, number, number, number][] = [
    [1.2, 0.6, 0.08, 0.3],
    [1.4, -0.2, 0.08, -0.5],
    [1.0, -0.9, 0.08, 0.8],
    [-1.2, 0.7, 0.08, -0.4],
    [-1.3, -0.5, 0.08, 0.2],
    [0.3, 1.1, 0.08, 1.0],
    [0.3, -1.1, 0.08, 0.1],
    [-0.5, -1.0, 0.08, -0.6],
  ];
  mitoPositions.forEach(([x, y, z, rz]) => {
    const mg = buildMitochondrion();
    mg.position.set(x, y, z);
    mg.rotation.z = rz;
    root.add(mg);
  });

  // ER near nucleus
  const er = buildER();
  er.position.set(0.35, -0.1, 0.1);
  er.scale.set(0.85, 0.85, 0.85);
  root.add(er);

  // Golgi
  const golgi = buildGolgi();
  golgi.position.set(-0.6, -0.5, 0.1);
  golgi.scale.set(0.85, 0.85, 0.85);
  root.add(golgi);

  // Ribosomes
  const animalRibosomes: [number, number, number][] = [
    [-1.4, 0.2, 0.1], [-0.3, 1.3, 0.1], [0.8, 1.2, 0.1],
    [1.3, 0.4, 0.1], [1.5, -0.5, 0.1], [0.5, -1.2, 0.1],
    [-0.8, -1.1, 0.1], [-1.3, -0.3, 0.1],
  ];
  animalRibosomes.forEach(([x, y, z]) => {
    const r = buildRibosome();
    r.position.set(x, y, z);
    root.add(r);
  });

  return root;
}

function buildRibosome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.06, 10, 8);
  const m = emissiveMat('#a855f7', '#6b21a8', 0.12);
  const mesh = new THREE.Mesh(geo, m);
  mesh.userData.organelleId = 'ribosome';
  mesh.name = 'ribosome';
  return mesh;
}

function buildER(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'er';
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.4, 0),
    new THREE.Vector3(0.2, 0.2, 0.05),
    new THREE.Vector3(-0.1, 0, 0),
    new THREE.Vector3(0.15, -0.2, 0.05),
    new THREE.Vector3(-0.05, -0.4, 0),
  ]);
  const geo = new THREE.TubeGeometry(curve, 20, 0.05, 6, false);
  const mat = emissiveMat('#fbbf24', '#b45309', 0.15);
  mat.transparent = true; mat.opacity = 0.92;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.organelleId = 'er';
  g.add(mesh);
  return g;
}

function buildGolgi(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'golgi';
  const colors = ['#fdba74', '#fb923c', '#f97316', '#ea580c'];
  colors.forEach((color, i) => {
    const geo = new THREE.TorusGeometry(0.18 - i * 0.025, 0.025, 6, 18);
    const mat = new THREE.MeshPhongMaterial({ color: new THREE.Color(color), shininess: 40 });
    const m = new THREE.Mesh(geo, mat);
    m.position.y = -i * 0.06;
    m.rotation.x = Math.PI / 2;
    m.userData.organelleId = 'golgi';
    m.name = 'golgi';
    g.add(m);
  });
  return g;
}

function buildPeroxisome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.09, 12, 10);
  const mat = emissiveMat('#f472b6', '#9d174d', 0.15);
  const m = new THREE.Mesh(geo, mat);
  m.userData.organelleId = 'peroxisome';
  m.name = 'peroxisome';
  return m;
}

// ── Shared organelle builders ─────────────────────────────────────────────────

function buildNucleus(radius: number): THREE.Group {
  const g = new THREE.Group();

  // Nuclear envelope
  const envGeo = new THREE.SphereGeometry(radius + 0.08, 28, 22);
  const envMat = new THREE.MeshPhongMaterial({
    color: 0x93c5fd, transparent: true, opacity: 0.22, side: THREE.DoubleSide,
  });
  const env = new THREE.Mesh(envGeo, envMat);
  env.name = 'nucleus'; env.userData.organelleId = 'nucleus';
  g.add(env);

  // Nucleus body
  const nGeo = new THREE.SphereGeometry(radius, 28, 22);
  const nMat = emissiveMat('#4a90d9', '#1e40af', 0.15);
  (nMat as THREE.MeshPhongMaterial).transparent = true;
  (nMat as THREE.MeshPhongMaterial).opacity = 0.85;
  const nucleus = new THREE.Mesh(nGeo, nMat);
  nucleus.name = 'nucleus'; nucleus.userData.organelleId = 'nucleus';
  g.add(nucleus);

  // Nucleolus (dark center dot)
  const nlGeo = new THREE.SphereGeometry(radius * 0.38, 16, 12);
  const nlMat = emissiveMat('#1e3a8a', '#1e3a8a', 0.3);
  (nlMat as THREE.MeshPhongMaterial).transparent = true;
  (nlMat as THREE.MeshPhongMaterial).opacity = 0.9;
  const nl = new THREE.Mesh(nlGeo, nlMat);
  nl.position.set(radius * 0.2, radius * 0.1, radius * 0.2);
  nl.name = 'nucleus'; nl.userData.organelleId = 'nucleus';
  g.add(nl);

  // Concentric ring detail (nuclear pores hint)
  const ringGeo = new THREE.TorusGeometry(radius * 0.75, 0.02, 6, 32);
  const ringMat = new THREE.MeshPhongMaterial({
    color: 0x93c5fd, transparent: true, opacity: 0.4,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 4;
  ring.name = 'nucleus'; ring.userData.organelleId = 'nucleus';
  g.add(ring);

  const ring2Geo = new THREE.TorusGeometry(radius * 0.55, 0.015, 6, 32);
  const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 6;
  ring2.name = 'nucleus'; ring2.userData.organelleId = 'nucleus';
  g.add(ring2);

  return g;
}

function buildChloroplast(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'chloroplast';

  // Outer shell
  const oGeo = new THREE.SphereGeometry(0.24, 16, 10);
  const oMat = emissiveMat('#4ade80', '#15803d', 0.2);
  (oMat as THREE.MeshPhongMaterial).transparent = true;
  (oMat as THREE.MeshPhongMaterial).opacity = 0.9;
  const outer = new THREE.Mesh(oGeo, oMat);
  outer.scale.set(1.6, 1, 0.75);
  outer.name = 'chloroplast'; outer.userData.organelleId = 'chloroplast';
  g.add(outer);

  // Inner grana stacks (3 discs)
  for (let i = 0; i < 3; i++) {
    const dGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10);
    const dMat = new THREE.MeshPhongMaterial({ color: 0x16a34a, shininess: 20 });
    const d = new THREE.Mesh(dGeo, dMat);
    d.position.set((i - 1) * 0.11, 0, 0);
    d.rotation.z = Math.PI / 2;
    d.name = 'chloroplast'; d.userData.organelleId = 'chloroplast';
    g.add(d);
  }

  return g;
}

export function buildMitochondrion(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'mitochondria';

  // Outer membrane
  const oGeo = new THREE.SphereGeometry(0.22, 16, 10);
  const oMat = emissiveMat('#fb923c', '#c2410c', 0.15);
  (oMat as THREE.MeshPhongMaterial).transparent = true;
  (oMat as THREE.MeshPhongMaterial).opacity = 0.92;
  const outer = new THREE.Mesh(oGeo, oMat);
  outer.scale.set(1.7, 1, 0.8);
  outer.name = 'mitochondria'; outer.userData.organelleId = 'mitochondria';
  g.add(outer);

  // Cristae lines (inner folds)
  for (let i = 0; i < 3; i++) {
    const cGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 6);
    const cMat = new THREE.MeshPhongMaterial({
      color: 0xfed7aa, transparent: true, opacity: 0.65,
    });
    const c = new THREE.Mesh(cGeo, cMat);
    c.position.set((i - 1) * 0.1, 0, 0);
    c.rotation.z = Math.PI / 2;
    c.name = 'mitochondria'; c.userData.organelleId = 'mitochondria';
    g.add(c);
  }

  return g;
}

// ── Glow highlight ────────────────────────────────────────────────────────────

export function setGroupGlow(group: THREE.Group, active: boolean, glowColor = '#e8001d'): void {
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const m = obj.material as THREE.MeshPhongMaterial;
    if (active) {
      m.emissive = new THREE.Color(glowColor);
      m.emissiveIntensity = 0.55;
    } else {
      m.emissive = new THREE.Color(0x000000);
      m.emissiveIntensity = 0;
    }
  });
}
