const canvas = document.getElementById("network-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PALETTE = ["#7fac54", "#449faf", "#507867", "#d8dccb"];

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let particles = [];
  let raf = 0;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const count = Math.min(90, Math.floor((w * h) / 9000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.2 + 1.2,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = Math.min(140, w * 0.18);

    ctx.globalAlpha = 1;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.globalAlpha = 1 - dist / linkDist;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "#507867";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      const m = particles[i];
      const mdx = m.x - mouse.x;
      const mdy = m.y - mouse.y;
      const mdist = Math.hypot(mdx, mdy);
      if (mdist < 120) {
        ctx.globalAlpha = 1 - mdist / 120;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "#449faf";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function step() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }
  }

  function loop() {
    step();
    draw();
    if (!prefersReduced) {
      raf = requestAnimationFrame(loop);
    }
  }

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("pointerleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  window.addEventListener("resize", resize);
  if (prefersReduced) {
    draw();
  } else {
    loop();
  }
}
