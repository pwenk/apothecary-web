// Concept 20 · The Body Map (first principles: two things are linked when
// they act on the same part of you). Tap a part of the body to see every
// article that mentions it, with the sentence that does.
(() => {
  "use strict";
  const { esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { BODY } = NET;
  const back = { href: "#/", label: "← The body map" };
  const EVERYWHERE = ["metabolism", "temperature", "hormones", "bacteria"];

  const OUTLINE =
    "M90 62 L90 76 C66 80 52 90 48 108 L34 196 L28 250 L40 253 L54 200 L62 150 L64 232 L66 300 L70 424 L94 424 L97 300 L100 262 L103 300 L106 424 L130 424 L134 300 L136 232 L138 150 L146 200 L160 253 L172 250 L166 196 L152 108 C148 90 134 80 110 76 L110 62 Z";

  const articlesTouching = (key) => [...new Set(NET.mentionsOf(key).map((m) => m.slug))];

  function figure({ selected = null, only = null, small = false } = {}) {
    return `
      <svg class="bm-figure ${small ? "is-small" : ""}" viewBox="0 0 200 440" role="img" aria-label="Outline of a human body with ${only ? only.length : BODY.length} marked parts">
        <circle class="bm-outline" cx="100" cy="36" r="25" />
        <path class="bm-outline" d="${OUTLINE}" />
        ${BODY.filter((p) => !only || only.includes(p.key))
          .map((p) => {
            const n = articlesTouching(p.key).length;
            const r = 6 + n * 1.6;
            return `
              <a class="bm-spot ${p.key === selected ? "is-selected" : ""}" href="#/body/${p.key}" aria-label="${esc(p.label)}, ${n} article${n === 1 ? "" : "s"}">
                <circle class="bm-halo" cx="${p.x}" cy="${p.y}" r="${r + 5}" />
                <circle class="bm-dot" cx="${p.x}" cy="${p.y}" r="${r}" />
                ${small ? "" : `<text x="${p.x + (p.x >= 100 ? r + 6 : -r - 6)}" y="${p.y + 4}" text-anchor="${p.x >= 100 ? "start" : "end"}">${esc(p.label)}</text>`}
              </a>`;
          })
          .join("")}
      </svg>`;
  }

  function partPanel(key) {
    const t = NET.term(key);
    const list = NET.mentionsOf(key);
    const rels = NET.relationsOf(key);
    return `
      <div class="bm-panel-inner">
        <p class="aside-title">Part of the body</p>
        <h2 class="bm-part-name">${esc(BODY.find((p) => p.key === key)?.label || t.name)}</h2>
        <p class="bm-part-def">${esc(t.def)}</p>
        <ul class="bm-hits">
          ${list
            .map(
              (m) => `
                <li>
                  <a class="bm-hit-title" href="${esc(NET.sectionHref(m.slug, m.section))}">${esc(NET.nameOf(m.slug))}</a>
                  <p>${esc(m.sentence)}</p>
                </li>`
            )
            .join("")}
          ${rels.map((r) => `<li class="bm-rel"><span class="rel-mark" data-type="${r.type}">${NET.RELATION_TYPES[r.type].mark}</span> ${esc(r.note)}</li>`).join("")}
        </ul>
        <a class="gw-open" href="#/term/${esc(key)}">Everything about ${esc(t.name.toLowerCase())} →</a>
      </div>`;
  }

  function overview() {
    return `
      <div class="bm-panel-inner">
        <p class="aside-title">Tap a part of the body</p>
        <ul class="bm-overview">
          ${BODY.map((p) => `<li><a href="#/body/${p.key}">${esc(p.label)}</a> <span class="gl-count">${articlesTouching(p.key).length}</span></li>`).join("")}
        </ul>
        <p class="aside-title">All over the body</p>
        <ul class="net-chips">${EVERYWHERE.map((k) => `<li>${NET.link(k)}</li>`).join("")}</ul>
      </div>`;
  }

  function page(selected) {
    return `
      <section class="bm" id="articles" aria-labelledby="bm-title">
        <header class="L-head">
          <p class="L-kicker">Bigger dots are mentioned in more articles</p>
          <h1 class="L-title" id="bm-title">Where it acts</h1>
        </header>
        <div class="bm-grid">
          <div class="bm-stage">${figure({ selected })}</div>
          <aside class="bm-panel L-card" aria-live="polite" id="bm-panel" tabindex="-1">${selected ? partPanel(selected) : overview()}</aside>
        </div>
      </section>
      ${selected ? "" : aboutSection()}`;
  }

  function article(a) {
    const parts = BODY.filter((p) => NET.mentionsOf(p.key).some((m) => m.slug === a.slug));
    if (!parts.length) return articleView(a, { back });
    const aside = `
      <h2 class="aside-title">Where it acts</h2>
      ${figure({ only: parts.map((p) => p.key), small: true })}
      <ul class="aside-links">${parts
        .map((p) => {
          const secs = NET.mentionsOf(p.key).filter((m) => m.slug === a.slug);
          return `<li><a href="#/body/${p.key}">${esc(p.label)}</a> · ${secs.map((m) => `<a href="#/${esc(a.slug)}/sec-${m.section}">§${m.section + 1}</a>`).join(" ")}</li>`;
        })
        .join("")}</ul>`;
    return articleView(a, { back, aside });
  }

  function route(parts) {
    if (parts[0] === "body" && parts.length === 2) {
      const p = BODY.find((b) => b.key === parts[1]);
      return p ? { html: page(p.key), title: `${p.label} · Apothecary`, focus: "bm-panel" } : null;
    }
    return NET.route(parts, { back });
  }

  register({ id: "20", name: "Body Map", skill: "First principles", home: () => page(null), article, route });
})();
