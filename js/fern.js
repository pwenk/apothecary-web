// Style 2 hero: a Barnsley fern, grown point by point like light
// exposing a cyanotype. Four simple equations, picked at random,
// build the whole frond (Michael Barnsley, "Fractals Everywhere", 1988).
(() => {
  "use strict";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TOTAL = 90000;
  const PER_FRAME = 2400;
  let job = 0;

  function step(x, y) {
    const r = Math.random();
    if (r < 0.01) return [0, 0.16 * y];
    if (r < 0.86) return [0.85 * x + 0.04 * y, -0.04 * x + 0.85 * y + 1.6];
    if (r < 0.93) return [0.2 * x - 0.26 * y, 0.23 * x + 0.22 * y + 1.6];
    return [-0.15 * x + 0.28 * y, 0.26 * x + 0.24 * y + 0.44];
  }

  function grow(canvas) {
    const id = ++job;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(241, 245, 251, 0.55)";

    // The fern spans x ≈ -2.2…2.7 and y ≈ 0…10; fit it with a small margin.
    const pad = rect.height * 0.05;
    const scale = (rect.height - pad * 2) / 10;
    const ox = rect.width / 2 - 0.24 * scale;
    const oy = rect.height - pad;
    // Lean the frond slightly, like a leaf laid down by hand.
    const lean = -0.18;
    const cos = Math.cos(lean);
    const sin = Math.sin(lean);

    let x = 0;
    let y = 0;
    let drawn = 0;

    function batch(n) {
      for (let i = 0; i < n; i++) {
        [x, y] = step(x, y);
        const px = x * cos - (y - 5) * sin;
        const py = x * sin + (y - 5) * cos + 5;
        ctx.fillRect(ox + px * scale, oy - py * scale, 0.9, 0.9);
      }
      drawn += n;
    }

    if (motion.matches) {
      batch(TOTAL);
      return;
    }

    (function frame() {
      if (id !== job || !canvas.isConnected) return;
      batch(PER_FRAME);
      if (drawn < TOTAL) requestAnimationFrame(frame);
    })();
  }

  function mount() {
    const canvas = document.querySelector("#view canvas.fern");
    if (canvas) grow(canvas);
    else job++;
  }

  let resizeTimer = 0;
  window.addEventListener("viewrender", mount);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(mount, 200);
  });
})();
