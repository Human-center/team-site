const canvas = document.getElementById("network-canvas");
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // HCSREL coastal-forest palette
  const PALETTE = [
    { fill: "rgba(127, 172, 84, 0.95)", glow: "rgba(127, 172, 84, 0.28)", line: "127, 172, 84" },
    { fill: "rgba(68, 159, 175, 0.95)", glow: "rgba(68, 159, 175, 0.28)", line: "68, 159, 175" },
    { fill: "rgba(80, 120, 103, 0.95)", glow: "rgba(80, 120, 103, 0.22)", line: "80, 120, 103" },
  ];

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let particles = [];
  let raf = 0;
  let running = false;
  const mouse = { x: 0, y: 0, active: false };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    // Bitmap size must match CSS size × DPR or the drawing looks blurry (MDN).
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const count = Math.min(72, Math.max(28, Math.floor((w * h) / 11000)));
    particles = Array.from({ length: count }, (_, i) => {
      const swatch = PALETTE[i % PALETTE.length];
      const hub = i < Math.ceil(count * 0.12);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: hub ? Math.random() * 2.4 + 3.2 : Math.random() * 1.6 + 1.1,
        hub,
        swatch,
        magnet: 0.35 + Math.random() * 0.9,
      };
    });
  }

  function drawSoftDot(p) {
    const glowR = p.r * (p.hub ? 6 : 4.2);
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
    grad.addColorStop(0, p.swatch.fill);
    grad.addColorStop(0.28, p.swatch.glow);
    grad.addColorStop(1, "rgba(244, 244, 234, 0)");
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = p.swatch.fill;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Soft wash so the network sits in the cream field
    const wash = ctx.createRadialGradient(w * 0.55, h * 0.4, 20, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
    wash.addColorStop(0, "rgba(233, 236, 223, 0.35)");
    wash.addColorStop(1, "rgba(244, 244, 234, 0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);

    const linkDist = Math.min(128, Math.max(72, w * 0.2));
    const linkDist2 = linkDist * linkDist;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= linkDist2) continue;
        const t = 1 - Math.sqrt(d2) / linkDist;
        ctx.strokeStyle = "rgba(" + a.swatch.line + ", " + (0.08 + t * 0.42) + ")";
        ctx.lineWidth = a.hub || b.hub ? 1.35 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (mouse.active) {
      const halo = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
      halo.addColorStop(0, "rgba(68, 159, 175, 0.14)");
      halo.addColorStop(1, "rgba(68, 159, 175, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of particles) drawSoftDot(p);
  }

  function step() {
    const attractR = 150;
    const attractR2 = attractR * attractR;

    for (const p of particles) {
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < attractR2 && d2 > 4) {
          const d = Math.sqrt(d2);
          const force = (1 - d / attractR) * 0.055 * p.magnet;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      p.vx *= 0.992;
      p.vy *= 0.992;
      const speed = Math.hypot(p.vx, p.vy);
      const max = 0.85;
      if (speed > max) {
        p.vx = (p.vx / speed) * max;
        p.vy = (p.vy / speed) * max;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < p.r) {
        p.x = p.r;
        p.vx *= -1;
      } else if (p.x > w - p.r) {
        p.x = w - p.r;
        p.vx *= -1;
      }
      if (p.y < p.r) {
        p.y = p.r;
        p.vy *= -1;
      } else if (p.y > h - p.r) {
        p.y = h - p.r;
        p.vy *= -1;
      }
    }
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (prefersReduced || running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  resize();
  window.addEventListener("resize", resize);

  if (prefersReduced) {
    draw();
  } else if (typeof IntersectionObserver === "function") {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) start();
        else stop();
      },
      { threshold: 0.08 }
    );
    io.observe(canvas);
  } else {
    start();
  }
}
