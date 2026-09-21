// Style 3 background: soft cells drifting as if under a microscope.
// Runs only while style 3 is active and the reader allows motion.
(() => {
  "use strict";

  const canvas = document.getElementById("ambient");
  const ctx = canvas.getContext("2d");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["217, 195, 114", "111, 143, 114", "154, 165, 156"];

  let cells = [];
  let frame = 0;
  let width = 0;
  let height = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(26, (width * height) / 60000));
    cells = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 18 + Math.random() * 64,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    for (const c of cells) {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x < -c.r) c.x = width + c.r;
      if (c.x > width + c.r) c.x = -c.r;
      if (c.y < -c.r) c.y = height + c.r;
      if (c.y > height + c.r) c.y = -c.r;

      const breathe = 1 + Math.sin(t / 2400 + c.phase) * 0.05;
      const r = c.r * breathe;

      // membrane
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.color}, 0.035)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${c.color}, 0.16)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // nucleus
      ctx.beginPath();
      ctx.arc(c.x + r * 0.22, c.y - r * 0.12, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.color}, 0.1)`;
      ctx.fill();
    }
  }

  function loop(t) {
    draw(t);
    frame = requestAnimationFrame(loop);
  }

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;
    const active = document.documentElement.dataset.style === "3";
    if (!active) return;
    if (!cells.length) resize();
    if (motion.matches) draw(0);
    else frame = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    if (document.documentElement.dataset.style !== "3") {
      cells = [];
      return;
    }
    resize();
    if (motion.matches) draw(0);
  });
  window.addEventListener("stylechange", update);
  motion.addEventListener("change", update);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else update();
  });
  update();
})();
