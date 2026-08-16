import * as THREE from "three";

const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 7;

  const palette = [0x7fac54, 0x449faf, 0x507867, 0xd8dccb];
  const COUNT = 700;

  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    color: 0x507867,
    transparent: true,
    opacity: 0.85,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const group = new THREE.Group();
  const blobs = [];
  for (let i = 0; i < 3; i++) {
    const color = palette[i];
    const blobMat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      roughness: 0.6,
      metalness: 0.1,
    });
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), blobMat);
    blob.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -2);
    blob.userData.speed = 0.2 + Math.random() * 0.3;
    group.add(blob);
    blobs.push(blob);
  }
  scene.add(group);

  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let raf = 0;
  const clock = new THREE.Clock();

  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    points.rotation.y = t * 0.02;
    points.rotation.x = Math.sin(t * 0.1) * 0.06;

    group.rotation.y += 0.0015;
    blobs.forEach((b, i) => {
      b.rotation.x += 0.004 * b.userData.speed;
      b.rotation.z += 0.003 * b.userData.speed;
      b.position.y += Math.sin(t * 0.4 + i * 2) * 0.002;
    });

    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
}
