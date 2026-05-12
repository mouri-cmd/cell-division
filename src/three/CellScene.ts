import * as THREE from 'three';

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0B1117');
  return scene;
}

export function createCamera(width: number, height: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);
  return camera;
}

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true, // Allow for transparent backgrounds if needed
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.4;
  return renderer;
}

export function createLights(scene: THREE.Scene): void {
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // Top Key Light
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(5, 8, 10);
  scene.add(key);

  // Cool Fill Light
  const fill = new THREE.PointLight(0x00a2ff, 1.2, 20);
  fill.position.set(-8, 2, 5);
  scene.add(fill);

  // Warm Rim Light
  const rim = new THREE.PointLight(0xff5500, 1.5, 15);
  rim.position.set(4, -5, 4);
  scene.add(rim);

  // Soft Purple Glow
  const glow = new THREE.PointLight(0x9333ea, 0.8, 10);
  glow.position.set(0, 0, -2);
  scene.add(glow);
}
