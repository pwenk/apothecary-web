// Style 3 hero: living cells drifting under a darkfield microscope.
// Light comes from the side, so each cell shows as a glowing rim on black.
// Runs only while the lens is on screen and the reader allows motion.
(() => {
  "use strict";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let canvas = null;
  let ctx = null;
  let size = 0;
  let cells = [];
  let frame = 0;
  let visible = true;

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else cancelAnimationFrame(frame);
  });

  function seed() {
    const count = 16;
    cells = Array.from({ length: count }, (_, i) => {
      const rod = i % 4 === 0; // every fourth is a rod-shaped bacterium
      return {
        x: Math.random() * size,
        y: Math.random() * size,
        r: rod ? size * (0.018 + Math.random() * 0.012) : size * (0.035 + Math.random() * 0.06),
        rod,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.002,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.25,
      };
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const next = rect.width;
    canvas.width = Math.round(next * dpr);
    canvas.height = Math.round(next * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (Math.abs(next - size) > 1 || !cells.length) {
      size = next;
      seed();
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, size, size);
    ctx.globalCompositeOperation = "lighter";
    for (const c of cells) {
      c.x += c.vx;
      c.y += c.vy;
      c.angle += c.spin;
      const m = c.r * 2;
      if (c.x < -m) c.x = size + m;
      if (c.x > size + m) c.x = -m;
      if (c.y < -m) c.y = size + m;
      if (c.y > size + m) c.y = -m;

      const breathe = 1 + Math.sin(t / 1800 + c.phase) * 0.06;
      const color = c.warm ? "217, 195, 114" : "143, 227, 210";

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.shadowColor = `rgba(${color}, 0.9)`;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(${color}, 0.75)`;
      ctx.fillStyle = `rgba(${color}, 0.05)`;
      ctx.beginPath();
      if (c.rod) {
        const len = c.r * 3.2 * breathe;
        ctx.roundRect(-len / 2, -c.r / 2, len, c.r, c.r / 2);
      } else {
        ctx.ellipse(0, 0, c.r * breathe, c.r * 0.86 * breathe, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();

      if (!c.rod) {
        // nucleus and a few granules
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(c.r * 0.25, -c.r * 0.1, c.r * 0.24, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color}, 0.45)`;
        ctx.stroke();
        ctx.fillStyle = `rgba(${color}, 0.6)`;
        for (let g = 0; g < 3; g++) {
          const a = c.phase + g * 2.1;
          ctx.fillRect(Math.cos(a) * c.r * 0.55, Math.sin(a) * c.r * 0.5, 1.4, 1.4);
        }
      }
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function loop(t) {
    if (!canvas || !canvas.isConnected) return;
    draw(t);
    frame = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(frame);
    if (!canvas || !canvas.isConnected || document.hidden) return;
    if (motion.matches) draw(0);
    else if (visible) frame = requestAnimationFrame(loop);
  }

  function mount() {
    cancelAnimationFrame(frame);
    observer.disconnect();
    canvas = document.querySelector("#view canvas.cells");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    visible = true;
    observer.observe(canvas);
    start();
  }

  let resizeTimer = 0;
  window.addEventListener("viewrender", mount);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (canvas && canvas.isConnected) {
        resize();
        start();
      }
    }, 200);
  });
  motion.addEventListener("change", start);
  document.addEventListener("visibilitychange", start);
})();
