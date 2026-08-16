import * as THREE from "three";

// Green accretion disk — adapted from VoXelo "The Life of a Singularity"
// https://codepen.io/VoXelo/pen/VYKMNwE

const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050a07, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
  camera.position.set(52, 22, 52);

  const noiseChunk = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `;

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);
  coreGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(4, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x030806 })
  ));

  const auraMat = new THREE.ShaderMaterial({
    uniforms: { uIntensity: { value: 1.0 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
        gl_FragColor = vec4(vec3(0.50, 0.82, 0.28) * rim * uIntensity * 5.0, 1.0);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  coreGroup.add(new THREE.Mesh(new THREE.SphereGeometry(4.25, 64, 64), auraMat));

  const instanceCount = 4200;
  const streakGeo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
  streakGeo.rotateX(Math.PI / 2);

  const diskMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0.1 },
      uCompression: { value: 1.0 },
      uIntensity: { value: 1.0 },
      uOrbitScale: { value: 1.0 },
    },
    vertexShader: `
      ${noiseChunk}
      uniform float uTime;
      uniform float uMorph;
      uniform float uCompression;
      uniform float uIntensity;
      uniform float uOrbitScale;
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float rOriginal = length(instPos.xz);
        float r = rOriginal * uCompression;
        float initialAngle = atan(instPos.z, instPos.x);
        float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
        float currentAngle = initialAngle + (uTime * orbitalVelocity);
        vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
        float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
        morphedWorldPos.y += noise * uMorph * 4.0;
        vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
        vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
        float doppler = dot(orbitDir, viewDir);
        vec3 hot = vec3(0.86, 0.96, 0.62);
        vec3 warm = vec3(0.498, 0.675, 0.329);
        vec3 cool = vec3(0.22, 0.48, 0.40);
        vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
        color = mix(color, hot, smoothstep(10.0, 4.0, r));
        vColor = color * (1.3 + doppler * 0.7) * uIntensity;
        vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.8;
        float deltaAngle = currentAngle - initialAngle;
        float c = cos(deltaAngle);
        float s = sin(deltaAngle);
        mat3 rotY = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
        vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
        vec3 rotatedLocalPos = rotY * localPos;
        gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(vColor, vOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const instancedDisk = new THREE.InstancedMesh(streakGeo, diskMaterial, instanceCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < instanceCount; i++) {
    const r = 5 + Math.pow(Math.random(), 1.3) * 40;
    const angle = Math.random() * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * (8 / r), Math.sin(angle) * r);
    dummy.lookAt(dummy.position.x + Math.sin(angle), dummy.position.y, dummy.position.z - Math.cos(angle));
    dummy.updateMatrix();
    instancedDisk.setMatrixAt(i, dummy.matrix);
  }
  scene.add(instancedDisk);

  const states = [
    { morph: 0.1, compress: 1.0, intensity: 1.0, camY: 22, camDist: 78, orbit: 1.0 },
    { morph: 3.8, compress: 1.12, intensity: 1.35, camY: 36, camDist: 90, orbit: 1.7 },
    { morph: 0.7, compress: 0.42, intensity: 2.4, camY: 14, camDist: 58, orbit: 3.4 },
  ];
  let stateIdx = 0;
  const current = { ...states[0] };
  const target = { ...states[0] };

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
  let running = false;
  let angle = 0.85;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function applyState(from) {
    diskMaterial.uniforms.uMorph.value = from.morph;
    diskMaterial.uniforms.uCompression.value = from.compress;
    diskMaterial.uniforms.uIntensity.value = from.intensity;
    diskMaterial.uniforms.uOrbitScale.value = from.orbit;
    auraMat.uniforms.uIntensity.value = from.intensity;
  }

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    for (const key of Object.keys(target)) {
      current[key] = lerp(current[key], target[key], 1 - Math.pow(0.08, dt * 60));
    }
    applyState(current);

    diskMaterial.uniforms.uTime.value = time;
    instancedDisk.rotation.y += 0.00045;

    angle += 0.08 * dt;
    const dist = current.camDist;
    camera.position.x = Math.cos(angle) * dist + mouse.x * 4;
    camera.position.z = Math.sin(angle) * dist;
    camera.position.y = current.camY + mouse.y * -3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function start() {
    if (prefersReduced || running) return;
    running = true;
    animate();
  }

  function stop() {
    running = false;
  }

  function nextState() {
    stateIdx = (stateIdx + 1) % states.length;
    Object.assign(target, states[stateIdx]);
  }

  applyState(current);
  renderer.render(scene, camera);

  if (!prefersReduced) {
    if (typeof IntersectionObserver === "function") {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) start();
        else stop();
      }, { threshold: 0.05 });
      io.observe(canvas);
    } else {
      start();
    }
    setInterval(nextState, 9000);
  }
}
