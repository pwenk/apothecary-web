// Concept 1 · The Medicine Cabinet (Drunk Claude, "hold my beer")
// "Everybody snoops in other people's bathroom cabinets. Let them."
// Shelves are categories; each bottle, box, carton or jar is an article.
(() => {
  "use strict";
  const { articles, concepts, esc, extra, register, articleView, aboutSection } = window.APO;

  // Containers drawn in a 80 × 120 box. The label band is left clear for text.
  const VESSELS = {
    bottle: `
      <rect class="v-cap" x="22" y="8" width="36" height="16" rx="3" />
      <path class="v-body" d="M18 28 h44 v84 a6 6 0 0 1 -6 6 h-32 a6 6 0 0 1 -6 -6 z" />`,
    box: `
      <path class="v-body" d="M10 20 h60 v96 h-60 z" />
      <path class="v-edge" d="M10 20 l8 -10 h60 l-8 10 M70 20 l8 -10 v96 l-8 10" />`,
    carton: `
      <path class="v-body" d="M14 36 l26 -22 l26 22 v80 h-52 z" />
      <path class="v-edge" d="M30 4 h20 v10 h-20 z M14 36 h52" />`,
    tin: `
      <ellipse class="v-cap" cx="40" cy="46" rx="30" ry="7" />
      <path class="v-body" d="M10 46 v62 a30 7 0 0 0 60 0 v-62" />`,
    jar: `
      <rect class="v-cap" x="16" y="18" width="48" height="12" rx="3" />
      <path class="v-body" d="M14 34 q-4 6 -4 14 v60 a8 8 0 0 0 8 8 h44 a8 8 0 0 0 8 -8 v-60 q0 -8 -4 -14 z" />`,
    notebook: `
      <rect class="v-body" x="12" y="14" width="56" height="102" rx="2" />
      <path class="v-edge" d="M20 14 v102 M12 30 h-4 M12 50 h-4 M12 70 h-4 M12 90 h-4" />`,
  };

  const SHORT = {
    aspirin: "Aspirin",
    "ray-peat": "R. Peat",
    doxycycline: "Doxy",
    "orange-juice": "O.J.",
    gelatin: "Gelatin",
    "carrot-salad": "Carrot",
  };

  function vessel(a, cls = "vessel") {
    const kind = extra(a).vessel;
    return `
      <span class="${cls} vessel-${kind}">
        <svg viewBox="0 0 80 120" aria-hidden="true" focusable="false">${VESSELS[kind]}</svg>
        <span class="vessel-label">${esc(SHORT[a.slug])}</span>
      </span>`;
  }

  function shelf(s) {
    const items = articles.filter((a) => extra(a).shelf === s.key);
    return `
      <section class="cab-shelf" aria-labelledby="shelf-${s.key}">
        <h2 class="cab-shelf-name" id="shelf-${s.key}">${esc(s.name)} <span>${esc(s.blurb)}</span></h2>
        <ul class="cab-items">
          ${items
            .map(
              (a) => `
                <li>
                  <a class="cab-item" href="#/${esc(a.slug)}">
                    ${vessel(a)}
                    <span class="cab-tag"><strong>${esc(a.title)}</strong><span>${a.minutes} min read</span></span>
                  </a>
                </li>`
            )
            .join("")}
        </ul>
      </section>`;
  }

  function home() {
    return `
      <section class="cab" id="articles" aria-labelledby="cab-title">
        <header class="L-head">
          <p class="L-kicker">Go on, have a look inside</p>
          <h1 class="L-title" id="cab-title">The medicine cabinet</h1>
        </header>
        <div class="cab-frame">
          <div class="cab-door" aria-hidden="true">
            <span class="cab-mirror"></span>
            <span class="cab-knob"></span>
          </div>
          <div class="cab-inside">
            <aside class="cab-note">
              <p>Nothing in here is medical advice.</p>
              <a href="#/about">Read the note →</a>
            </aside>
            ${concepts.SHELVES.map(shelf).join("")}
          </div>
        </div>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const x = extra(a);
    const shelfInfo = concepts.SHELVES.find((s) => s.key === x.shelf);
    const mates = articles.filter((b) => b !== a && extra(b).shelf === x.shelf);
    const risky = new Set(x.lenses.risk || []);
    const aside = `
      <div class="cab-aside">
        ${vessel(a, "vessel vessel-big")}
        <p class="aside-title">On the ${esc(shelfInfo.name.toLowerCase())} shelf</p>
        ${
          mates.length
            ? `<ul class="aside-links">${mates.map((b) => `<li><a href="#/${esc(b.slug)}">${esc(b.title)}</a></li>`).join("")}</ul>`
            : `<p class="cab-alone">Alone on this shelf, for now.</p>`
        }
        <a class="aside-back" href="#/">← Back to the cabinet</a>
      </div>`;
    return articleView(a, {
      aside,
      className: "cab-post",
      back: { href: "#/", label: "← Back to the cabinet" },
      sectionClass: (n) => (risky.has(n) ? "cab-warning" : ""),
    });
  }

  register({ id: "1", name: "Medicine Cabinet", skill: "Drunk Claude", home, article });
})();
