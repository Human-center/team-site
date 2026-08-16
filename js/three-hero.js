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

  const palette = [
    [0.498, 0.675, 0.329],
    [0.267, 0.624, 0.686],
    [0.314, 0.471, 0.404],
    [0.847, 0.863, 0.796],
  ];
  const hex = [0x7fac54, 0x449faf, 0x507867, 0xd8dccb];
  const COUNT = 820;

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    const c = palette[i % palette.length];
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.048,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const group = new THREE.Group();
  const blobs = [];
  for (let i = 0; i < 4; i++) {
    const blobMat = new THREE.MeshStandardMaterial({
      color: hex[i],
      transparent: true,
      opacity: 0.14,
      roughness: 0.55,
      metalness: 0.08,
    });
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05 + i * 0.08, 1), blobMat);
    blob.position.set((i - 1.5) * 2.4, (i % 2 === 0 ? 0.8 : -0.9), -2.2);
    blob.userData.speed = 0.18 + i * 0.08;
    group.add(blob);
    blobs.push(blob);
  }
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xf4f4ea, 0.95));
  const key = new THREE.DirectionalLight(0x7fac54, 0.55);
  key.position.set(-4, 3, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x449faf, 0.35);
  fill.position.set(5, -2, 4);
  scene.add(fill);

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

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    points.rotation.y = t * 0.018;
    points.rotation.x = Math.sin(t * 0.09) * 0.05;

    group.rotation.y += 0.0012;
    blobs.forEach((b, i) => {
      b.rotation.x += 0.0035 * b.userData.speed;
      b.rotation.z += 0.0025 * b.userData.speed;
      b.position.y += Math.sin(t * 0.35 + i * 1.7) * 0.002;
    });

    camera.position.x += (mouse.x * 0.55 - camera.position.x) * 0.045;
    camera.position.y += (-mouse.y * 0.35 - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
}
