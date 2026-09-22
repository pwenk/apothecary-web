// Shared engine for the network layouts (11–23): reads NETWORK and the
// articles, finds every mention, and offers the pieces every network view
// needs (term pages, links, a force-directed graph).
(() => {
  "use strict";
  const { articles, esc, extra, bySlug } = window.APO;
  const { KINDS, TERMS, RELATIONS, RELATION_TYPES, EXTRA_NAMES } = window.NETWORK;

  const termMap = new Map(TERMS.map((t) => [t.key, t]));
  const isArticle = (key) => !!bySlug(key);
  const term = (key) => termMap.get(key);
  const nameOf = (key) => term(key)?.name || EXTRA_NAMES[key]?.name || bySlug(key)?.title || key;
  const hrefOf = (key) => (isArticle(key) ? `#/${key}` : term(key) ? `#/term/${key}` : EXTRA_NAMES[key]?.href || "#/");
  const kindOf = (key) => term(key)?.kind || (isArticle(key) ? "article" : "molecule");
  const defOf = (key) => (isArticle(key) ? bySlug(key).dek : term(key)?.def || "");
  const link = (key, label = nameOf(key)) => `<a href="${esc(hrefOf(key))}">${esc(label)}</a>`;

  // "001·2" style reference to one section, as in a book index.
  const code = (slug, n) => `${String(extra(bySlug(slug)).no).padStart(3, "0")}·${n + 1}`;
  const sectionHref = (slug, n) => `#/${slug}/sec-${n}`;
  const sectionName = (slug, n) => bySlug(slug).sections[n].h;
  const sectionLink = (slug, n, label) =>
    `<a href="${esc(sectionHref(slug, n))}">${esc(label || `${nameOf(slug)}, “${sectionName(slug, n)}”`)}</a>`;

  // ---------- finding mentions ----------

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Whole words only; a hyphen or apostrophe continues a word ("COX-1", "Peat's").
  const wordRe = (words) =>
    new RegExp(`(?<![\\w-])(${[...words].sort((a, b) => b.length - a.length).map(escRe).join("|")})(?![\\w-])`, "gi");
  const patterns = TERMS.map((t) => ({ key: t.key, re: wordRe(t.words) }));

  function sentenceAround(text, index) {
    const dot = text.lastIndexOf(". ", index);
    const endDot = text.indexOf(". ", index);
    return text.slice(dot === -1 ? 0 : dot + 2, endDot === -1 ? text.length : endDot + 1).trim();
  }

  // mentions: one entry per (term, article, section), with the sentence.
  const mentions = [];
  for (const a of articles) {
    a.sections.forEach((sec, n) => {
      const texts = [sec.h, ...sec.p];
      for (const { key, re } of patterns) {
        if (key === a.slug) continue;
        for (const text of texts) {
          re.lastIndex = 0;
          const m = re.exec(text);
          if (m) {
            mentions.push({ term: key, slug: a.slug, section: n, sentence: text === sec.h ? sec.p[0].split(". ")[0] + "." : sentenceAround(text, m.index) });
            break;
          }
        }
      }
    });
  }
  const mentionsOf = (key) => mentions.filter((m) => m.term === key);
  const termsIn = (slug) => {
    const map = new Map();
    for (const m of mentions) if (m.slug === slug) map.set(m.term, [...(map.get(m.term) || []), m.section]);
    return map;
  };
  const relationsOf = (key) => RELATIONS.filter((r) => r.a === key || r.b === key);
  const other = (r, key) => (r.a === key ? r.b : r.a);

  // Every node that shows up somewhere: articles plus terms with a mention
  // or a relation.
  const usedKeys = new Set([
    ...articles.map((a) => a.slug),
    ...mentions.map((m) => m.term),
    ...RELATIONS.flatMap((r) => [r.a, r.b]),
  ]);

  // Undirected edges with a weight, for graphs and "related" lists.
  function edges() {
    const map = new Map();
    const add = (a, b, w, type) => {
      if (a === b) return;
      const id = a < b ? `${a}|${b}` : `${b}|${a}`;
      const e = map.get(id) || { a, b, w: 0, types: new Set() };
      e.w += w;
      e.types.add(type);
      map.set(id, e);
    };
    for (const m of mentions) add(m.slug, m.term, 1, isArticle(m.term) ? "article" : "mention");
    for (const r of RELATIONS) add(r.a, r.b, 2, r.type);
    return [...map.values()];
  }
  const allEdges = edges();
  const neighbours = (key) => allEdges.filter((e) => e.a === key || e.b === key).map((e) => ({ key: e.a === key ? e.b : e.a, w: e.w, types: e.types }));

  // Other articles that share terms with this one, strongest first, with the
  // shared terms as the reason.
  function relatedArticles(slug) {
    const mine = termsIn(slug);
    return articles
      .filter((a) => a.slug !== slug)
      .map((a) => {
        const theirs = termsIn(a.slug);
        const shared = [...mine.keys()].filter((k) => theirs.has(k) && !isArticle(k));
        const direct = mine.has(a.slug) || theirs.has(slug) || RELATIONS.some((r) => (r.a === slug && r.b === a.slug) || (r.b === slug && r.a === a.slug));
        return { a, shared, direct, score: shared.length + (direct ? 3 : 0) };
      })
      .filter((x) => x.score > 0)
      .sort((p, q) => q.score - p.score);
  }

  // ---------- glossary marking ----------
  // Wraps the first mention of each term in an article in a link with a
  // small definition card. `used` is shared across the whole article.
  function markTerms(text, used, slug, { only } = {}) {
    const hits = [];
    for (const { key, re } of patterns) {
      if (key === slug || used.has(key) || (only && !only.has(key))) continue;
      re.lastIndex = 0;
      const m = re.exec(text);
      if (m) hits.push({ key, start: m.index, end: m.index + m[0].length });
    }
    hits.sort((p, q) => p.start - q.start || q.end - p.end);
    let html = "";
    let pos = 0;
    for (const h of hits) {
      if (h.start < pos || used.has(h.key)) continue;
      used.add(h.key);
      html += esc(text.slice(pos, h.start));
      html += `<a class="gl-term" href="${esc(hrefOf(h.key))}" data-kind="${kindOf(h.key)}">${esc(text.slice(h.start, h.end))}<span class="gl-tip" role="tooltip"><b>${esc(nameOf(h.key))}</b> ${esc(defOf(h.key))}</span></a>`;
      pos = h.end;
    }
    return html + esc(text.slice(pos));
  }

  // ---------- term page (shared by every network layout) ----------

  function kindChip(key) {
    return `<span class="net-kind" data-kind="${kindOf(key)}">${esc(KINDS[kindOf(key)].one)}</span>`;
  }

  function termPage(key, { back = { href: "#/", label: "← Back" }, extraHtml = "" } = {}) {
    const t = term(key);
    const list = mentionsOf(key);
    const rels = relationsOf(key);
    const near = neighbours(key)
      .filter((n) => !isArticle(n.key))
      .sort((p, q) => q.w - p.w)
      .slice(0, 8);
    const bySlugGroup = articles
      .map((a) => ({ a, items: list.filter((m) => m.slug === a.slug) }))
      .filter((g) => g.items.length);
    return `
      <article class="term-page">
        <a class="back" href="${esc(back.href)}">${esc(back.label)}</a>
        <header class="L-head">
          ${kindChip(key)}
          <h1 class="L-title">${esc(t.name)}</h1>
          <p class="L-lede">${esc(t.def || "")}</p>
          <p class="term-ghost">No article of its own yet. Everything below comes from the articles that mention it.</p>
        </header>
        ${extraHtml}
        <section class="term-block" aria-labelledby="term-mentions">
          <h2 class="aside-title" id="term-mentions">Mentioned in ${bySlugGroup.length} ${bySlugGroup.length === 1 ? "article" : "articles"}</h2>
          ${
            bySlugGroup.length
              ? `<ul class="term-mentions">${bySlugGroup
                  .map(
                    (g) => `
                      <li>
                        <p class="term-article">${link(g.a.slug)}</p>
                        ${g.items
                          .map(
                            (m) => `<blockquote><p>${esc(m.sentence)}</p><footer>${sectionLink(m.slug, m.section, `§${m.section + 1} ${sectionName(m.slug, m.section)}`)}</footer></blockquote>`
                          )
                          .join("")}
                      </li>`
                  )
                  .join("")}</ul>`
              : `<p class="term-empty">No article mentions it by name yet.</p>`
          }
        </section>
        ${
          rels.length
            ? `<section class="term-block" aria-labelledby="term-rels">
                 <h2 class="aside-title" id="term-rels">Connections</h2>
                 <ul class="term-rels">${rels
                   .map(
                     (r) => `<li><span class="rel-mark" data-type="${r.type}" aria-hidden="true">${RELATION_TYPES[r.type].mark}</span>
                       <span><b>${esc(RELATION_TYPES[r.type].name)}</b> ${link(other(r, key))}. ${esc(r.note)} ${sectionLink(r.at[0], r.at[1], "Source")}</span></li>`
                   )
                   .join("")}</ul>
               </section>`
            : ""
        }
        ${
          near.length
            ? `<section class="term-block" aria-labelledby="term-near">
                 <h2 class="aside-title" id="term-near">Often mentioned alongside</h2>
                 <ul class="net-chips">${near.map((n) => `<li>${link(n.key)}</li>`).join("")}</ul>
               </section>`
            : ""
        }
      </article>`;
  }

  // Layouts call this first in their own route() so #/term/<key> works
  // everywhere in the network family.
  function route(parts, { back, extra: more } = {}) {
    if (parts[0] !== "term" || parts.length !== 2 || !term(parts[1]) || isArticle(parts[1])) return null;
    const key = parts[1];
    return { html: termPage(key, { back, extraHtml: more ? more(key) : "" }), title: `${nameOf(key)} · Apothecary` };
  }

  // ---------- force-directed graph ----------
  // A small hand-written simulation (no library): nodes push each other
  // apart, edges pull like springs, and a weak pull keeps everything
  // centred. Good for the hundred or so nodes this site has.
  function createSim(nodes, links, { spread = 1 } = {}) {
    const byKey = new Map(nodes.map((n) => [n.key, n]));
    const L = links.map((l) => ({ ...l, s: byKey.get(l.a), t: byKey.get(l.b) })).filter((l) => l.s && l.t);
    nodes.forEach((n, i) => {
      if (n.x == null) {
        // Seeded spiral start so the layout is the same on every visit.
        const angle = i * 2.399963;
        const r = 18 * Math.sqrt(i + 1) * spread;
        n.x = Math.cos(angle) * r;
        n.y = Math.sin(angle) * r;
      }
      n.vx = 0;
      n.vy = 0;
    });
    let alpha = 1;
    function tick() {
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          let dx = q.x - p.x;
          let dy = q.y - p.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) {
            dx = (i % 7) - 3 || 1;
            dy = (j % 5) - 2 || 1;
            d2 = dx * dx + dy * dy;
          }
          if (d2 > 640000) continue;
          // Charge falls off with distance (like d3's many-body force);
          // heavy article nodes push harder so they spread out.
          const d = Math.max(Math.sqrt(d2), 12);
          const f = (60 * spread * alpha * p.mass * q.mass) / d;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          p.vx -= fx / p.mass;
          p.vy -= fy / p.mass;
          q.vx += fx / q.mass;
          q.vy += fy / q.mass;
        }
      }
      for (const l of L) {
        const dx = l.t.x - l.s.x;
        const dy = l.t.y - l.s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const k = ((d - l.len * spread) / d) * 0.1 * alpha * Math.min(1 + l.w * 0.15, 1.6);
        l.s.vx += dx * k;
        l.s.vy += dy * k;
        l.t.vx -= dx * k;
        l.t.vy -= dy * k;
      }
      for (const n of nodes) {
        n.vx -= n.x * 0.012 * alpha;
        n.vy -= n.y * 0.012 * alpha;
        if (n.fixed) {
          n.vx = n.vy = 0;
          continue;
        }
        n.vx *= 0.55;
        n.vy *= 0.55;
        n.x += n.vx;
        n.y += n.vy;
      }
      alpha = Math.max(alpha * 0.975, 0);
      return alpha;
    }
    return {
      tick,
      get alpha() {
        return alpha;
      },
      heat(a = 0.3) {
        alpha = Math.max(alpha, a);
      },
      settle(steps = 300) {
        for (let i = 0; i < steps && alpha > 0.002; i++) tick();
      },
      links: L,
    };
  }

  // Nodes and links for a graph of `keys` (default: everything).
  function graphData(keys = usedKeys) {
    const set = new Set(keys);
    const nodes = [...set].map((key) => {
      const degree = neighbours(key).filter((n) => set.has(n.key)).length;
      const art = isArticle(key);
      return { key, name: art ? nameOf(key).split(",")[0] : nameOf(key), kind: kindOf(key), article: art, degree, mass: art ? 4 : 1 + degree * 0.1, r: art ? 11 : 3.5 + Math.min(degree, 6) * 0.7 };
    });
    const links = allEdges
      .filter((e) => set.has(e.a) && set.has(e.b))
      .map((e) => ({ a: e.a, b: e.b, w: e.w, types: e.types, len: isArticle(e.a) && isArticle(e.b) ? 150 : 70 }));
    return { nodes, links };
  }

  // A static, pre-settled SVG graph (used for local graphs in articles and
  // on term pages). Centre node is highlighted.
  function staticGraph(centre, { depth = 1, size = 260, label = "Local graph" } = {}) {
    const keys = new Set([centre]);
    let frontier = [centre];
    for (let d = 0; d < depth; d++) {
      const next = [];
      for (const k of frontier) for (const n of neighbours(k)) if (!keys.has(n.key)) (keys.add(n.key), next.push(n.key));
      frontier = next;
    }
    const { nodes, links } = graphData(keys);
    const c = nodes.find((n) => n.key === centre);
    c.x = 0;
    c.y = 0;
    c.fixed = true;
    const sim = createSim(nodes, links, { spread: 0.8 });
    sim.settle(260);
    const pad = 30;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const ext = Math.max(...xs.map(Math.abs), ...ys.map(Math.abs), 60) + pad;
    const nameShort = (n) => (n.name.length > 16 ? `${n.name.slice(0, 15)}…` : n.name);
    return `
      <figure class="net-local">
        <svg viewBox="${-ext} ${-ext} ${ext * 2} ${ext * 2}" width="${size}" height="${size}" role="img" aria-label="${esc(label)}: ${esc(nameOf(centre))} and ${nodes.length - 1} connected things">
          ${sim.links.map((l) => `<line class="gl-edge" x1="${l.s.x.toFixed(1)}" y1="${l.s.y.toFixed(1)}" x2="${l.t.x.toFixed(1)}" y2="${l.t.y.toFixed(1)}"/>`).join("")}
          ${nodes
            .map(
              (n) => `
                <a href="${esc(hrefOf(n.key))}" class="gl-node ${n.key === centre ? "is-centre" : ""}" data-kind="${n.kind}" ${n.key === centre ? 'tabindex="-1"' : ""}>
                  <title>${esc(nameOf(n.key))}</title>
                  <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.key === centre ? 9 : n.article ? 7 : 4}"/>
                  ${n.article || n.key === centre ? `<text x="${n.x.toFixed(1)}" y="${(n.y + (n.key === centre ? 22 : 18)).toFixed(1)}">${esc(nameShort(n))}</text>` : ""}
                </a>`
            )
            .join("")}
        </svg>
        <figcaption>${esc(label)} · hover a dot for its name</figcaption>
      </figure>`;
  }

  window.NET = {
    ...window.NETWORK,
    termMap,
    term,
    isArticle,
    nameOf,
    hrefOf,
    kindOf,
    defOf,
    link,
    code,
    sectionHref,
    sectionName,
    sectionLink,
    mentions,
    mentionsOf,
    termsIn,
    relationsOf,
    other,
    usedKeys,
    allEdges,
    neighbours,
    relatedArticles,
    markTerms,
    kindChip,
    termPage,
    route,
    createSim,
    graphData,
    staticGraph,
  };
})();
