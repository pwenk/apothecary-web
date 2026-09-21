// Concept 10 · Six Lenses (Six Thinking Hats + perspective shifts)
// Every article is cut into the same six lenses. Read one article through
// every lens, or one lens across every article. Empty cells show the gaps.
(() => {
  "use strict";
  const { articles, concepts, esc, extra, register, articleView, aboutSection } = window.APO;
  const { LENSES, LEVELS } = concepts;

  const lensByKey = (key) => LENSES.find((l) => l.key === key);
  const sectionsFor = (a, lens) => (extra(a).lenses[lens.key] || []).map((n) => ({ n, s: a.sections[n] }));
  const hasLens = (a, lens) => (lens.key === "evidence" ? extra(a).facts.length > 0 : sectionsFor(a, lens).length > 0);

  function facts(a) {
    return `
      <ul class="lens-facts">
        ${extra(a)
          .facts.map(
            (f) => `
              <li><span class="lvl-mark" aria-hidden="true">${LEVELS[f.level].mark}</span>
                <span>${esc(f.text)} <em class="lvl">${esc(LEVELS[f.level].label)}</em></span></li>`
          )
          .join("")}
      </ul>`;
  }

  function cell(a, lens) {
    if (!hasLens(a, lens)) return `<td class="lens-gap"><span aria-hidden="true">·</span><span class="visually-hidden">Nothing yet</span></td>`;
    if (lens.key === "evidence") {
      const marks = extra(a)
        .facts.map((f) => LEVELS[f.level].mark)
        .join("");
      return `<td><a href="#/lens/evidence/${esc(a.slug)}" aria-label="Evidence for ${esc(a.title)}">${marks}</a></td>`;
    }
    return `<td>${sectionsFor(a, lens)
      .map(({ n, s }) => `<a href="#/${esc(a.slug)}/sec-${n}">${esc(s.h)}</a>`)
      .join("")}</td>`;
  }

  function home() {
    return `
      <section class="lenses" id="articles" aria-labelledby="lenses-title">
        <header class="L-head">
          <p class="L-kicker">Read across for an article, down for a lens</p>
          <h1 class="L-title" id="lenses-title">Six ways to look</h1>
        </header>
        <div class="lens-grid-wrap">
          <table class="lens-grid">
            <caption class="visually-hidden">Articles by lens. Empty cells are topics not yet written.</caption>
            <thead>
              <tr>
                <td></td>
                ${LENSES.map((l) => `<th scope="col"><a href="#/lens/${l.key}">${esc(l.name)}</a></th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${articles
                .map(
                  (a) => `
                    <tr>
                      <th scope="row"><a href="#/${esc(a.slug)}">${esc(a.title)}</a></th>
                      ${LENSES.map((l) => cell(a, l)).join("")}
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <p class="lens-legend">
          <span>· nothing written yet</span>
          ${Object.values(LEVELS)
            .map((v) => `<span><b aria-hidden="true">${v.mark}</b> ${esc(v.label)}</span>`)
            .join("")}
        </p>
        <div class="lens-mobile">
          <h2 class="aside-title">Browse by lens</h2>
          <ul class="lens-chips">${LENSES.map((l) => `<li><a href="#/lens/${l.key}">${esc(l.name)}</a></li>`).join("")}</ul>
          <h2 class="aside-title">Browse by article</h2>
          <ul class="aside-links">${articles.map((a) => `<li><a href="#/${esc(a.slug)}">${esc(a.title)}</a></li>`).join("")}</ul>
        </div>
      </section>
      ${aboutSection()}`;
  }

  function lensPage(lens) {
    return `
      <section class="lens-page" aria-labelledby="lens-title">
        <a class="back" href="#/">← The grid</a>
        <nav class="lens-tabs" aria-label="Lenses">
          ${LENSES.map(
            (l) => `<a href="#/lens/${l.key}" ${l === lens ? 'aria-current="page"' : ""}>${esc(l.name)}</a>`
          ).join("")}
        </nav>
        <header class="L-head">
          <p class="L-kicker">Lens</p>
          <h1 class="L-title" id="lens-title">${esc(lens.name)}</h1>
          <p class="L-lede">${esc(lens.blurb)}, across every article.</p>
        </header>
        ${articles
          .map((a) => {
            const body = !hasLens(a, lens)
              ? `<p class="lens-empty">Nothing yet. A gap worth writing.</p>`
              : lens.key === "evidence"
                ? facts(a)
                : sectionsFor(a, lens)
                    .map(({ n, s }) => `<h3><a href="#/${esc(a.slug)}/sec-${n}">${esc(s.h)}</a></h3>${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}`)
                    .join("");
            return `
              <article class="lens-entry" id="lens-${esc(a.slug)}" tabindex="-1">
                <h2 class="lens-entry-name"><a href="#/${esc(a.slug)}">${esc(a.title)}</a></h2>
                ${body}
              </article>`;
          })
          .join("")}
      </section>`;
  }

  // The article, reordered lens by lens.
  function article(a) {
    const body = LENSES.filter((l) => hasLens(a, l))
      .map((l) => {
        const inner =
          l.key === "evidence"
            ? `<section class="lens-part" id="lens-evidence" tabindex="-1"><h2>How sure are we?</h2>${facts(a)}</section>`
            : sectionsFor(a, l)
                .map(
                  ({ n, s }) => `
                    <section id="sec-${n}" tabindex="-1" class="lens-part">
                      <h2>${esc(s.h)}</h2>
                      ${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}
                    </section>`
                )
                .join("");
        return `<div class="lens-block"><p class="lens-tag"><a href="#/lens/${l.key}">${esc(l.name)}</a></p>${inner}</div>`;
      })
      .join("");
    const missing = LENSES.filter((l) => !hasLens(a, l));
    const bottom = missing.length
      ? `<p class="lens-missing">Not written yet for this article: ${missing.map((l) => esc(l.name)).join(", ")}.</p>`
      : "";
    return articleView(a, { body, bottom, back: { href: "#/", label: "← The grid" } });
  }

  function route(parts) {
    // #/lens/<key> or #/lens/<key>/<slug> (opened at one article)
    if (parts[0] !== "lens" || parts.length < 2 || parts.length > 3) return null;
    const lens = lensByKey(parts[1]);
    const at = parts[2] && articles.some((a) => a.slug === parts[2]) ? `lens-${parts[2]}` : undefined;
    if (!lens || (parts[2] && !at)) return null;
    return { html: lensPage(lens), title: `${lens.name} · Apothecary`, focus: at };
  }

  register({ id: "10", name: "Six Lenses", skill: "Six Thinking Hats", home, article, route });
})();
