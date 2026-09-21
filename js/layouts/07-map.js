// Concept 7 · The Food ↔ Drug Map (Janusian thinking)
// "Orange juice is a food" and "orange juice is a drug" are both true; it is
// a question of dose. Every specimen is pinned on one landscape:
// left–right food → drug, bottom–top old → new.
(() => {
  "use strict";
  const { articles, esc, extra, glyph, register, articleView, aboutSection } = window.APO;

  const pct = (n) => `${(n * 100).toFixed(1)}%`;

  // Specimens on the right half open their card to the left so it stays on screen.
  function pin(a, { current = false, mini = false } = {}) {
    const { x, y } = extra(a).map;
    const side = x > 0.6 ? "left" : "right";
    const vert = y > 0.7 ? "below" : "above";
    if (mini) {
      return `<span class="mini-pin ${current ? "is-current" : ""}" style="left:${pct(x)};bottom:${pct(y)}" title="${esc(a.title)}"></span>`;
    }
    return `
      <a class="pin pin-${side} pin-${vert}" href="#/${esc(a.slug)}" style="left:${pct(x)};bottom:${pct(y)}">
        <span class="pin-art">${glyph(a.slug, "glyph pin-glyph")}</span>
        <span class="pin-name">${esc(a.common)}</span>
        <span class="pin-card">
          <strong>${esc(a.title)}</strong>
          <span>${esc(extra(a).glance)}</span>
          <em>${esc(a.figure.label)}: ${esc(a.figure.value)} · ${a.minutes} min</em>
        </span>
      </a>`;
  }

  function axes() {
    return `
      <span class="map-axis map-axis-x" aria-hidden="true"><span>Food</span><span>Supplement</span><span>Drug</span></span>
      <span class="map-axis map-axis-y" aria-hidden="true"><span>Used for ages</span><span>Recent</span></span>`;
  }

  function home() {
    const list = [...articles].sort((a, b) => extra(a).map.x - extra(b).map.x);
    return `
      <section class="map" id="articles" aria-labelledby="map-title">
        <header class="L-head">
          <p class="L-kicker">Every remedy on one landscape</p>
          <h1 class="L-title" id="map-title">From food to drug</h1>
          <p class="L-lede">Orange juice is a food. It is also a dose of sugar, potassium and vitamin C. Each specimen sits where it belongs between the kitchen and the pharmacy, and between the very old and the new.</p>
        </header>
        <div class="map-scroll">
          <div class="map-field">
            <span class="map-grid" aria-hidden="true"></span>
            ${axes()}
            ${articles.map((a) => pin(a)).join("")}
          </div>
        </div>
        <p class="map-hint">Point at a specimen to see what it is. On a phone, swipe the map sideways.</p>
        <h2 class="map-list-title">In order, from food to drug</h2>
        <ol class="map-list">
          ${list
            .map(
              (a) => `
                <li><a href="#/${esc(a.slug)}">
                  <span class="map-list-name">${esc(a.title)}</span>
                  <span class="map-list-meta">${esc(a.kind)} · ${a.minutes} min</span>
                </a></li>`
            )
            .join("")}
        </ol>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const here = extra(a).map;
    const nearest = articles
      .filter((b) => b !== a)
      .map((b) => ({ b, d: Math.hypot(extra(b).map.x - here.x, extra(b).map.y - here.y) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .map(({ b }) => b);
    const aside = `
      <div class="mini-map">
        <p class="aside-title">Where it sits</p>
        <div class="mini-field" role="img" aria-label="${esc(a.common)} on the food to drug map">
          <span class="map-grid" aria-hidden="true"></span>
          ${articles.map((b) => pin(b, { mini: true, current: b === a })).join("")}
        </div>
        <p class="mini-axis" aria-hidden="true"><span>Food</span><span>Drug</span></p>
        <p class="aside-title">Nearest on the map</p>
        <ul class="aside-links">${nearest.map((b) => `<li><a href="#/${esc(b.slug)}">${esc(b.title)}</a></li>`).join("")}</ul>
        <a class="aside-back" href="#/">← Whole map</a>
      </div>`;
    return articleView(a, { aside, back: { href: "#/", label: "← Back to the map" } });
  }

  register({ id: "7", name: "Food ↔ Drug Map", skill: "Janusian thinking", home, article });
})();
