// Concept 18 · The Family Tree (claude-brainstorm: analogy hunt; medicines
// have ancestry, like people). Every article traced back to the living
// thing it came from: plant, microbe or animal.
(() => {
  "use strict";
  const { articles, esc, glyph, register, articleView, aboutSection, bySlug } = window.APO;
  const NET = window.NET;
  const { TREE } = NET;
  const back = { href: "#/", label: "← The family tree" };

  // Flatten each organism's chain (the tree only ever branches at the top).
  const chainOf = (org) => {
    const out = [];
    let node = org.children?.[0];
    while (node) {
      out.push(node);
      node = node.children?.[0];
    }
    return out;
  };
  const lineage = (slug) => {
    for (const k of TREE) for (const org of k.children) {
      const chain = chainOf(org);
      if (chain.some((c) => c.key === slug)) return { kingdom: k, org, chain };
    }
    return null;
  };

  function nodeHtml(n) {
    const a = bySlug(n.key);
    if (a) {
      return `
        <a class="ft-node ft-article" href="#/${esc(a.slug)}">
          ${glyph(a.slug, "glyph ft-glyph")}
          <span class="ft-name">${esc(NET.nameOf(a.slug))}</span>
          ${n.year ? `<span class="ft-year">${esc(n.year)}</span>` : ""}
        </a>`;
    }
    return `<a class="ft-node" href="#/term/${esc(n.key)}" data-kind="${NET.kindOf(n.key)}"><span class="ft-name">${esc(NET.nameOf(n.key))}</span></a>`;
  }

  function home() {
    return `
      <section class="ft" id="articles" aria-labelledby="ft-title">
        <header class="L-head">
          <p class="L-kicker">Every remedy was once a living thing</p>
          <h1 class="L-title" id="ft-title">The family tree</h1>
          <p class="L-lede">Read down from each living thing to the medicine or food it became. Articles that share a branch are cousins.</p>
        </header>
        <div class="ft-kingdoms">
          ${TREE.map(
            (k) => `
              <section class="ft-kingdom" aria-labelledby="ft-${esc(k.name)}">
                <h2 class="ft-kingdom-name" id="ft-${esc(k.name)}">${esc(k.name)}</h2>
                <ul class="ft-orgs">
                  ${k.children
                    .map(
                      (org) => `
                        <li class="ft-org">
                          <p class="ft-org-name">${esc(org.name)}<i>${esc(org.latin)}</i>${org.note ? `<span>${esc(org.note)}</span>` : ""}</p>
                          <ol class="ft-chain">${chainOf(org).map((n) => `<li>${nodeHtml(n)}</li>`).join("")}</ol>
                        </li>`
                    )
                    .join("")}
                </ul>
              </section>`
          ).join("")}
        </div>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const l = lineage(a.slug);
    if (!l) return articleView(a, { back });
    const cousins = l.kingdom.children
      .flatMap(chainOf)
      .filter((n) => bySlug(n.key) && n.key !== a.slug)
      .map((n) => bySlug(n.key));
    const top = `
      <nav class="ft-crumbs" aria-label="Lineage">
        <p class="aside-title">Lineage</p>
        <ol>
          <li>${esc(l.kingdom.name)}</li>
          <li>${esc(l.org.name)} <i>${esc(l.org.latin)}</i></li>
          ${l.chain.map((n) => `<li>${n.key === a.slug ? `<b aria-current="page">${esc(NET.nameOf(n.key))}${n.year ? ` · ${esc(n.year)}` : ""}</b>` : NET.link(n.key)}</li>`).join("")}
        </ol>
        ${
          cousins.length
            ? `<p class="ft-cousins">Cousins from the same kingdom: ${cousins.map((c) => `<a href="#/${esc(c.slug)}">${esc(NET.nameOf(c.slug))}</a>`).join(", ")}</p>`
            : `<p class="ft-cousins">The only ${esc(l.kingdom.name.toLowerCase().replace(/s$/, ""))} in the collection so far.</p>`
        }
      </nav>`;
    return articleView(a, { back, top });
  }

  function route(parts) {
    return NET.route(parts, {
      back,
      extra: (key) => {
        const hits = articles.map((a) => lineage(a.slug)).filter((l) => l && l.chain.some((n) => n.key === key));
        return hits.length
          ? `<p class="ft-cousins">In the family tree: ${hits.map((l) => `${esc(l.org.name)} → ${l.chain.map((n) => (n.key === key ? `<b>${esc(NET.nameOf(n.key))}</b>` : esc(NET.nameOf(n.key)))).join(" → ")}`).join("<br />")}</p>`
          : "";
      },
    });
  }

  register({ id: "18", name: "Family Tree", skill: "claude-brainstorm (analogy)", home, article, route });
})();
