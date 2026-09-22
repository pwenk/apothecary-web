// Concept 17 · The Abstraction Ladder (Creative Thinking for Research:
// abstraction laddering). Climb up from an article to the wider groups it
// belongs to, where its relatives live, or down into its own chemistry.
(() => {
  "use strict";
  const { articles, esc, bySlug, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { RUNGS, LADDER } = NET;
  const back = { href: "#/", label: "← The ladder" };

  const rung = (key) => RUNGS.find((r) => r.key === key);
  const childrenOf = (key) => RUNGS.filter((r) => r.parent === key);
  // Everything under a rung, all the way down.
  const membersOf = (key) => {
    const r = rung(key);
    const own = r.members || [];
    return [...new Set([...own, ...childrenOf(key).flatMap((c) => membersOf(c.key))])];
  };

  function tree(key, depth = 0) {
    const r = rung(key);
    const kids = childrenOf(key);
    const own = r.members || [];
    return `
      <li class="ld-node depth-${depth}">
        <a class="ld-rung" href="#/rung/${esc(key)}"><span>${esc(r.name)}</span><span class="gl-count">${membersOf(key).length}</span></a>
        ${
          kids.length || own.length
            ? `<ul>
                 ${kids.map((c) => tree(c.key, depth + 1)).join("")}
                 ${own.map((s) => `<li class="ld-leaf"><a href="#/${esc(s)}">${esc(bySlug(s).title)}</a></li>`).join("")}
               </ul>`
            : ""
        }
      </li>`;
  }

  function home() {
    return `
      <section class="ld" id="articles" aria-labelledby="ld-title">
        <header class="L-head">
          <p class="L-kicker">Up is wider, down is deeper</p>
          <h1 class="L-title" id="ld-title">The ladder</h1>
          <p class="L-lede">Every article sits on a ladder. Climb up and you reach groups where its relatives live. Climb down and you reach the chemistry inside it.</p>
        </header>
        <ul class="ld-tree">${tree("everything")}</ul>
      </section>
      ${aboutSection()}`;
  }

  function ladder(slug) {
    const l = LADDER[slug];
    if (!l) return "";
    const up = [...l.up].reverse();
    return `
      <nav class="ld-ladder" aria-label="Abstraction ladder">
        <p class="aside-title">Climb up · wider</p>
        <ol class="ld-steps">
          ${up
            .map((k) => {
              const n = membersOf(k).length;
              return `<li class="is-up"><a href="#/rung/${esc(k)}">${esc(rung(k).name)}</a><span class="gl-count">${n} article${n === 1 ? "" : "s"}</span></li>`;
            })
            .join("")}
          <li class="is-here" aria-current="page"><b>${esc(NET.nameOf(slug))}</b></li>
          ${l.down.map((k) => `<li class="is-down">${NET.link(k)}<span class="gl-count">${esc(NET.defOf(k))}</span></li>`).join("")}
        </ol>
        <p class="aside-title">Climb down · deeper</p>
      </nav>`;
  }

  function rungPage(r) {
    const parent = r.parent && rung(r.parent);
    const kids = childrenOf(r.key);
    const members = membersOf(r.key);
    const siblings = r.parent ? childrenOf(r.parent).filter((x) => x !== r) : [];
    return `
      <section class="ld-page" aria-labelledby="rung-title">
        <a class="back" href="#/">← The ladder</a>
        ${parent ? `<p class="ld-up">↑ <a href="#/rung/${esc(parent.key)}">${esc(parent.name)}</a></p>` : ""}
        <header class="L-head">
          <p class="L-kicker">A rung on the ladder · ${members.length} article${members.length === 1 ? "" : "s"}</p>
          <h1 class="L-title" id="rung-title">${esc(r.name)}</h1>
          <p class="L-lede">${esc(r.blurb)}</p>
        </header>
        ${kids.length ? `<h2 class="aside-title">↓ Narrower</h2><ul class="net-chips">${kids.map((k) => `<li><a href="#/rung/${esc(k.key)}">${esc(k.name)}</a></li>`).join("")}</ul>` : ""}
        <h2 class="aside-title">On this rung</h2>
        <ul class="ld-members">${members
          .map((s) => {
            const a = bySlug(s);
            return `<li class="L-card"><a href="#/${esc(s)}">${esc(a.title)}</a><p>${esc(a.dek)}</p></li>`;
          })
          .join("")}</ul>
        ${siblings.length ? `<h2 class="aside-title">↔ Next to it</h2><ul class="net-chips">${siblings.map((k) => `<li><a href="#/rung/${esc(k.key)}">${esc(k.name)}</a></li>`).join("")}</ul>` : ""}
      </section>`;
  }

  function article(a) {
    return articleView(a, { back, aside: ladder(a.slug) });
  }

  function route(parts) {
    if (parts[0] === "rung" && parts.length === 2) {
      const r = rung(parts[1]);
      return r ? { html: rungPage(r), title: `${r.name} · Apothecary` } : null;
    }
    return NET.route(parts, {
      back,
      extra: (key) => {
        const above = articles.filter((a) => LADDER[a.slug]?.down.includes(key));
        return above.length ? `<p class="ld-up">↑ One rung below ${above.map((a) => `<a href="#/${esc(a.slug)}">${esc(NET.nameOf(a.slug))}</a>`).join(", ")}</p>` : "";
      },
    });
  }

  register({ id: "17", name: "Abstraction Ladder", skill: "Creative Thinking for Research", home, article, route });
})();
