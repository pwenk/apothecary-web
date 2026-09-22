// Concept 22 · The Argument Map (borghei brainstorm-ideas: "How might we
// show where experts disagree without taking sides?"). Claims are joined by
// supports, contradicts, casts doubt on, adds a condition to, or was
// replaced by. Each claim carries its certainty mark and its source.
(() => {
  "use strict";
  const { articles, concepts, esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { ARGUMENTS, ARG_TYPES } = NET;
  const { LEVELS } = concepts;
  const back = { href: "#/", label: "← Where people disagree" };

  // Facts from concepts-data.js, found by id, plus claims defined per group.
  const facts = new Map(articles.flatMap((a) => concepts.bySlug[a.slug].facts.map((f) => [f.id, { ...f, slug: a.slug }])));
  const claim = (group, id) => group.extra?.[id] || facts.get(id);

  function card(c) {
    const lvl = LEVELS[c.level];
    return `
      <a class="am-claim L-card ${c.old ? "is-old" : ""}" href="${esc(NET.sectionHref(c.slug, c.section))}" data-level="${c.level}">
        ${c.old ? `<span class="am-old">Old advice</span>` : ""}
        <span class="am-text">${esc(c.text)}</span>
        <span class="am-meta"><span class="lvl-mark" aria-hidden="true">${lvl.mark}</span> ${esc(lvl.label)} · ${esc(NET.nameOf(c.slug))} §${c.section + 1}</span>
      </a>`;
  }

  function group(g) {
    return `
      <section class="am-group" aria-labelledby="am-${ARGUMENTS.indexOf(g)}">
        <h2 class="am-title" id="am-${ARGUMENTS.indexOf(g)}">${esc(g.title)}</h2>
        <ol class="am-links">
          ${g.links
            .map(
              (l) => `
                <li class="am-link is-${l.type}">
                  ${card(claim(g, l.from))}
                  <span class="am-arrow"><span class="am-mark" aria-hidden="true">${ARG_TYPES[l.type].mark}</span>${esc(ARG_TYPES[l.type].name)}</span>
                  ${card(claim(g, l.to))}
                </li>`
            )
            .join("")}
        </ol>
        ${g.note ? `<p class="am-note">${esc(g.note)}</p>` : ""}
      </section>`;
  }

  const slugsOf = (g) => new Set(g.links.flatMap((l) => [claim(g, l.from).slug, claim(g, l.to).slug]));

  function home() {
    const all = ARGUMENTS.flatMap((g) => g.links.flatMap((l) => [claim(g, l.from), claim(g, l.to)]));
    const unique = [...new Set(all)];
    const counts = Object.keys(LEVELS).map((k) => ({ k, n: unique.filter((c) => c.level === k).length }));
    return `
      <section class="am" id="articles" aria-labelledby="am-page-title">
        <header class="L-head">
          <p class="L-kicker">${ARGUMENTS.length} debates · ${counts.map((c) => `${LEVELS[c.k].mark} ${c.n}`).join(" · ")}</p>
          <h1 class="L-title" id="am-page-title">Where people disagree</h1>
          <p class="L-lede">Each card is one claim with how sure we are. Arrows show how claims push on each other. We don't pick a winner; the marks do the talking.</p>
        </header>
        <ul class="am-legend">${Object.entries(ARG_TYPES).map(([k, t]) => `<li class="is-${k}"><span class="am-mark" aria-hidden="true">${t.mark}</span>${esc(t.name)}</li>`).join("")}</ul>
        ${ARGUMENTS.map(group).join("")}
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const mine = ARGUMENTS.filter((g) => slugsOf(g).has(a.slug));
    if (!mine.length) return articleView(a, { back });
    const bottom = `
      <section class="am-in-article" aria-labelledby="am-in-title">
        <h2 class="aside-title" id="am-in-title">Where people disagree about this</h2>
        ${mine.map(group).join("")}
      </section>`;
    return articleView(a, { back, bottom });
  }

  register({ id: "22", name: "Argument Map", skill: "How might we (borghei)", home, article, route: (parts) => NET.route(parts, { back }) });
})();
