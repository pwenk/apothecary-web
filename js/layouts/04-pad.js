// Concept 4 · The Prescription Pad (Creative Director: SIT task
// unification + bisociation of pharmacy and recipe card).
// Every article is one pad with the same five boxes. The box tabs do a
// second job as navigation: "next pad" opens the same box on the next one.
(() => {
  "use strict";
  const { articles, concepts, esc, extra, glyph, bySlug, register, aboutSection } = window.APO;
  const { LEVELS } = concepts;

  const BOXES = [
    { key: "what", name: "What it is", lenses: ["history", "use"] },
    { key: "does", name: "What it does", lenses: ["how"] },
    { key: "evidence", name: "Evidence", lenses: [] },
    { key: "watch", name: "Watch out", lenses: ["risk", "debate"] },
    { key: "sources", name: "Sources", lenses: [] },
  ];
  const boxKeys = new Set(BOXES.map((b) => b.key));

  const no = (a) => String(extra(a).no).padStart(3, "0");

  function sectionsFor(a, box) {
    const lenses = extra(a).lenses;
    const idx = [...new Set(box.lenses.flatMap((l) => lenses[l] || []))].sort((p, q) => p - q);
    return idx.map((n) => a.sections[n]);
  }

  function boxBody(a, box) {
    if (box.key === "evidence") {
      return `
        <ul class="pad-evidence">
          ${extra(a)
            .facts.map(
              (f) => `
                <li><span class="lvl-mark" aria-hidden="true">${LEVELS[f.level].mark}</span>
                  <span>${esc(f.text)} <em class="lvl">${esc(LEVELS[f.level].label)}</em></span></li>`
            )
            .join("")}
        </ul>`;
    }
    if (box.key === "sources") {
      return `<ol class="pad-sources">${a.refs.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>`;
    }
    const secs = sectionsFor(a, box);
    if (!secs.length) return `<p class="pad-empty">Nothing to note here yet.</p>`;
    return secs.map((s) => `<h3>${esc(s.h)}</h3>${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("");
  }

  function pad(a, focusBox) {
    const i = articles.indexOf(a);
    const prev = articles[i - 1];
    const next = articles[i + 1];
    const boxLink = (x, label) =>
      x ? `<a href="#/${esc(x.slug)}${focusBox ? `/${focusBox}` : ""}">${label}</a>` : `<span aria-hidden="true"></span>`;
    return `
      <article class="pad-page">
        <a class="back" href="#/">← All pads</a>
        <div class="pad-sheet">
          <header class="pad-head">
            <p class="pad-rx" aria-hidden="true">℞</p>
            <div>
              <h1 class="pad-title">${esc(a.title)}</h1>
              <p class="pad-sub"><i>${esc(a.latin)}</i> · ${esc(a.common)}</p>
            </div>
            <p class="pad-no">No. ${no(a)}<br />${a.minutes} min · ${esc(a.formula)}</p>
          </header>
          <nav class="pad-tabs" aria-label="Boxes on this pad">
            ${BOXES.map(
              (b) =>
                `<a href="#/${esc(a.slug)}/${b.key}" class="${b.key === "watch" ? "is-watch" : ""}" ${
                  b.key === focusBox ? 'aria-current="true"' : ""
                }>${b.key === "watch" ? "⚠ " : ""}${esc(b.name)}</a>`
            ).join("")}
          </nav>
          ${BOXES.map(
            (b) => `
              <section class="pad-box pad-box-${b.key}" id="box-${b.key}" tabindex="-1" aria-labelledby="box-h-${b.key}">
                <h2 id="box-h-${b.key}">${b.key === "watch" ? "⚠ " : ""}${esc(b.name)}</h2>
                ${boxBody(a, b)}
              </section>`
          ).join("")}
          <footer class="pad-foot">
            ${boxLink(prev, `← ${prev ? esc(prev.title) : ""}`)}
            ${boxLink(next, `${next ? esc(next.title) : ""} →`)}
          </footer>
        </div>
        <p class="pad-note">${focusBox ? "The arrows keep you on the same box of the next pad." : "Pick a box above; the arrows then keep you on that box from pad to pad."}</p>
      </article>`;
  }

  function home() {
    return `
      <section class="pads" id="articles" aria-labelledby="pads-title">
        <header class="L-head">
          <p class="L-kicker">Same five boxes, every time</p>
          <h1 class="L-title" id="pads-title">The prescription pad</h1>
          <p class="L-lede">What it is, what it does, how sure we are, what to watch out for, and where it comes from. Pick a pad.</p>
        </header>
        <ul class="pad-fan">
          ${articles
            .map(
              (a) => `
                <li>
                  <a class="pad-card" href="#/${esc(a.slug)}">
                    <span class="pad-card-rx" aria-hidden="true">℞</span>
                    <span class="pad-card-name">${esc(a.title)}</span>
                    <span class="pad-card-latin">${esc(a.latin)}</span>
                    ${glyph(a.slug, "glyph pad-card-glyph")}
                    <span class="pad-card-meta">No. ${no(a)} · ${a.minutes} min</span>
                  </a>
                </li>`
            )
            .join("")}
        </ul>
        <p class="map-hint">Swipe or scroll the fan sideways to see every pad.</p>
      </section>
      ${aboutSection()}`;
  }

  function route(parts) {
    const a = bySlug(parts[0]);
    if (!a || parts.length !== 2 || !boxKeys.has(parts[1])) return null;
    return { html: pad(a, parts[1]), title: `${a.title} · Apothecary`, focus: `box-${parts[1]}` };
  }

  register({
    id: "4",
    name: "Prescription Pad",
    skill: "Creative Director",
    home,
    article: (a) => pad(a, null),
    route,
  });
})();
