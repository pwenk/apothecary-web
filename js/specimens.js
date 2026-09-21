// One drawn specimen per article, as inner SVG markup for a 200 × 300 viewBox.
// Shapes use two classes so each style can colour them its own way:
//   .g-fill  solid parts (leaf blades, fruit, roots)
//   .g-line  veins, stems and outlines
(() => {
  "use strict";

  const r1 = (n) => Math.round(n * 10) / 10;

  // Three strands twisting around each other, like the collagen triple helix.
  function helix() {
    const strands = [0, 1, 2].map((k) => {
      const pts = [];
      for (let y = 24; y <= 276; y += 4) {
        pts.push(`${r1(100 + 42 * Math.sin(y / 26 + (k * 2 * Math.PI) / 3))} ${y}`);
      }
      return `<path class="g-line" d="M${pts.join(" L")}" />`;
    });
    const rungs = [];
    for (let y = 36; y <= 264; y += 19) {
      rungs.push(`<circle class="g-fill" cx="${r1(100 + 42 * Math.sin(y / 26))}" cy="${y}" r="3" />`);
    }
    return strands.join("") + rungs.join("");
  }

  // Segments of a halved orange.
  function orange() {
    const segs = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      segs.push(`M100 150 L${r1(100 + 66 * Math.cos(a))} ${r1(150 + 66 * Math.sin(a))}`);
    }
    return `
      <circle class="g-fill" cx="100" cy="150" r="80" />
      <circle class="g-line" cx="100" cy="150" r="80" />
      <circle class="g-line" cx="100" cy="150" r="68" />
      <path class="g-line" d="${segs.join(" ")}" />
      <circle class="g-line" cx="100" cy="150" r="6" />
      <path class="g-fill" d="M104 70 C120 40 150 34 168 42 C156 62 130 72 104 70 Z" />
      <path class="g-line" d="M104 70 C125 56 145 48 168 42 M100 70 V52" />`;
  }

  window.SPECIMENS = {
    aspirin: `
      <path class="g-line" d="M100 296 V250" />
      <path class="g-fill" d="M100 18 C128 90 130 196 100 262 C70 196 72 90 100 18 Z" />
      <path class="g-line" d="M100 18 C128 90 130 196 100 262 C70 196 72 90 100 18 Z" />
      <path class="g-line" d="M100 30 V258 M100 80 L118 64 M100 112 L121 94 M100 144 L122 126 M100 176 L120 160 M100 208 L114 194 M100 80 L82 64 M100 112 L79 94 M100 144 L78 126 M100 176 L80 160 M100 208 L86 194" />`,

    "ray-peat": `
      <path class="g-line" d="M88 16 V286 M112 16 V286 M88 34 H112 M88 54 H112 M88 74 H112 M88 94 H112 M88 234 H112 M88 254 H112 M88 274 H112" />
      <path class="g-fill" d="M100 168 C92 128 76 84 58 88 C34 94 36 190 64 222 C80 240 94 214 100 196 C106 214 120 240 136 222 C164 190 166 94 142 88 C124 84 108 128 100 168 Z" />
      <path class="g-line" d="M100 168 C92 128 76 84 58 88 C34 94 36 190 64 222 C80 240 94 214 100 196 C106 214 120 240 136 222 C164 190 166 94 142 88 C124 84 108 128 100 168 Z" />
      <path class="g-line" d="M60 120 C66 150 70 180 72 206 M140 120 C134 150 130 180 128 206" />`,

    doxycycline: `
      <path class="g-line" d="M100 292 C100 236 94 200 100 152 C105 112 97 72 100 22 M100 206 C80 186 62 178 46 152 M100 164 C120 146 140 136 156 110 M99 112 C86 96 76 80 70 56 M101 84 C114 66 124 50 128 30 M46 152 C40 138 34 128 28 118 M156 110 C162 98 168 92 174 84" />
      ${[
        [100, 22], [96, 34], [70, 56], [74, 68], [128, 30], [124, 42], [28, 118],
        [34, 128], [174, 84], [168, 94], [46, 152], [156, 110], [100, 292],
      ]
        .map(([x, y]) => `<circle class="g-fill" cx="${x}" cy="${y}" r="5" />`)
        .join("")}`,

    "orange-juice": orange(),

    gelatin: helix(),

    "carrot-salad": `
      <path class="g-line" d="M100 112 C95 80 80 52 66 22 M100 112 C100 78 100 48 100 14 M100 112 C105 80 120 52 134 24 M80 60 L68 58 M84 76 L72 78 M100 50 L90 44 M100 70 L110 64 M120 60 L132 58 M116 76 L128 78" />
      <path class="g-fill" d="M100 292 C92 242 80 172 78 122 C78 106 122 106 122 122 C120 172 108 242 100 292 Z" />
      <path class="g-line" d="M100 292 C92 242 80 172 78 122 C78 106 122 106 122 122 C120 172 108 242 100 292 Z" />
      <path class="g-line" d="M82 150 H92 M108 170 H118 M86 196 H94 M106 220 H113 M92 246 H98" />`,
  };
})();
