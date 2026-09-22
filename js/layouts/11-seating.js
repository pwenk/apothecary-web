// Concept 11 · The Seating Plan (Drunk Claude: "what if but wrong" — the
// substances are dinner guests who gossip about each other). Who gets on,
// who must never sit together, and one old flame whose romance ended in 2022.
(() => {
  "use strict";
  const { esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { GUESTS, RELATIONS } = NET;
  const back = { href: "#/", label: "← The seating plan" };

  const SAY = {
    together: { name: "Gets on with", mark: "♥" },
    apart: { name: "Don't seat together", mark: "✗" },
    caution: { name: "Keep an eye on", mark: "⚠" },
    against: { name: "Doesn't get on with", mark: "↯" },
    replaced: { name: "Old flame", mark: "↻" },
  };
  const R = 250;
  const seat = (key) => {
    const i = GUESTS.indexOf(key);
    const t = (i / GUESTS.length) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(t) * R, Math.sin(t) * R];
  };
  const tableRels = RELATIONS.filter((r) => GUESTS.includes(r.a) && GUESTS.includes(r.b));
  const shortName = (k) => (k === "carrot-salad" ? "Carrot salad" : k === "heart-disease" ? "Heart-attack prevention" : NET.nameOf(k));

  function table(selected) {
    const chords = tableRels
      .map((r) => {
        const [x1, y1] = seat(r.a);
        const [x2, y2] = seat(r.b);
        const lit = selected && (r.a === selected || r.b === selected);
        return `<path class="st-chord is-${r.type} ${lit ? "is-lit" : ""}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${((x1 + x2) * 0.18).toFixed(1)} ${((y1 + y2) * 0.18).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
      })
      .join("");
    const guests = GUESTS.map((k) => {
      const [x, y] = seat(k);
      const right = x > 1;
      const centre = Math.abs(x) <= 1;
      const near = selected && tableRels.some((r) => (r.a === selected && r.b === k) || (r.b === selected && r.a === k));
      return `
        <a class="st-guest ${k === selected ? "is-selected" : ""} ${near ? "is-near" : ""} ${NET.isArticle(k) ? "is-article" : ""}" href="#/seat/${esc(k)}" data-kind="${NET.kindOf(k)}" aria-label="${esc(shortName(k))}">
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${NET.isArticle(k) ? 13 : 9}"/>
          <text x="${(x + (centre ? 0 : right ? 20 : -20)).toFixed(1)}" y="${(y + (centre ? (y < 0 ? -22 : 30) : 5)).toFixed(1)}" text-anchor="${centre ? "middle" : right ? "start" : "end"}">${esc(shortName(k))}</text>
        </a>`;
    }).join("");
    return `
      <svg class="st-table ${selected ? "has-focus" : ""}" viewBox="-460 -320 920 640" role="img" aria-label="A round dinner table with ${GUESTS.length} guests. The list beside it says who gets on with whom.">
        <circle class="st-top" r="150"/>
        <text class="st-top-label" y="-6">The table</text>
        <text class="st-top-sub" y="16">tap a guest</text>
        ${chords}${guests}
      </svg>`;
  }

  function relLine(r, from) {
    const o = NET.other(r, from);
    return `
      <li class="st-rel is-${r.type}">
        <span class="st-mark" aria-hidden="true">${SAY[r.type].mark}</span>
        <span><b>${esc(SAY[r.type].name)}</b> ${NET.link(o, shortName(o))}. ${esc(r.note)} ${NET.sectionLink(r.at[0], r.at[1], "Source")}</span>
      </li>`;
  }

  function panel(selected) {
    if (!selected) {
      const warnings = tableRels.filter((r) => r.type === "apart");
      return `
        <p class="aside-title">House rules</p>
        <ul class="st-legend">${Object.entries(SAY).map(([k, v]) => `<li class="is-${k}"><span class="st-swatch" aria-hidden="true"></span>${esc(v.name)}</li>`).join("")}</ul>
        <p class="aside-title">Never seat these together</p>
        <ul class="st-rels">${warnings
          .map((r) => `<li class="st-rel is-apart"><span class="st-mark" aria-hidden="true">✗</span><span>${NET.link(r.a, shortName(r.a))} and ${NET.link(r.b, shortName(r.b))}. ${esc(r.note)}</span></li>`)
          .join("")}</ul>
        <p class="st-note">The jokes are ours; every line comes from an article, with its source.</p>`;
    }
    const rels = tableRels.filter((r) => r.a === selected || r.b === selected);
    return `
      ${NET.kindChip(selected)}
      <h2 class="gw-panel-name">${esc(shortName(selected))}</h2>
      <ul class="st-rels">${rels.map((r) => relLine(r, selected)).join("")}</ul>
      <a class="gw-open" href="${esc(NET.hrefOf(selected))}">${NET.isArticle(selected) ? "Read the article" : "More about this guest"} →</a>
      <a class="aside-back" href="#/">Clear the table</a>`;
  }

  function page(selected) {
    return `
      <section class="st" id="articles" aria-labelledby="st-title">
        <header class="L-head">
          <p class="L-kicker">${GUESTS.length} guests · ${tableRels.length} relationships · every one from an article</p>
          <h1 class="L-title" id="st-title">The seating plan</h1>
          <p class="L-lede">Who gets on, who must never sit together, and one old flame. Tap a guest to hear the gossip.</p>
        </header>
        <div class="st-grid">
          <div class="st-stage">${table(selected)}</div>
          <aside class="st-panel L-card" id="st-panel" tabindex="-1" aria-live="polite">${panel(selected)}</aside>
        </div>
      </section>
      ${selected ? "" : aboutSection()}`;
  }

  function article(a) {
    const rels = NET.relationsOf(a.slug);
    if (!rels.length) return articleView(a, { back });
    const aside = `
      <h2 class="aside-title">At the table</h2>
      <ul class="st-rels">${rels.map((r) => relLine(r, a.slug)).join("")}</ul>
      <a class="aside-back" href="#/seat/${esc(a.slug)}">See where it sits →</a>`;
    return articleView(a, { back, aside });
  }

  function route(parts) {
    if (parts[0] === "seat" && parts.length === 2 && GUESTS.includes(parts[1])) {
      return { html: page(parts[1]), title: `${shortName(parts[1])} at the table · Apothecary`, focus: "st-panel" };
    }
    return NET.route(parts, { back });
  }

  register({ id: "11", name: "Seating Plan", skill: "Drunk Claude", home: () => page(null), article, route });
})();
