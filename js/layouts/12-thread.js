// Concept 12 · Pull a Thread (Lateral Thinking. Po: "the site has no
// links at all", so readers make their own). Each article ends with up to
// three threads, each for a different reason. Every thread pulled adds a
// knot to your string, and the string is a link you can share.
(() => {
  "use strict";
  const { articles, esc, bySlug, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { TREE } = NET;
  const back = { href: "#/", label: "← Start a thread" };
  const KEY = "apothecary-thread";
  const PENDING = "apothecary-thread-pending";

  const session = {
    get(k) {
      try {
        return sessionStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        if (v === null) sessionStorage.removeItem(k);
        else sessionStorage.setItem(k, v);
      } catch {
        /* storage blocked: threads still work, the string just isn't kept */
      }
    },
  };
  const readTrail = () => (session.get(KEY) || "").split(",").filter((s) => bySlug(s));

  // Which kingdom an article's substance came from (Family Tree data).
  const kingdomOf = (slug) => {
    const walk = (n) => n.key === slug || (n.children || []).some(walk);
    return TREE.find((k) => k.children.some(walk))?.name;
  };

  const REASONS = [
    { kind: "named", label: "Named in it", pick: (r) => r.direct && "One article names the other" },
    { kind: "body", label: "Same part of you", pick: (r) => sharedOf(r, "body") },
    { kind: "molecule", label: "Same chemistry", pick: (r) => sharedOf(r, "molecule") },
    { kind: "health", label: "Same health question", pick: (r) => sharedOf(r, "condition") || sharedOf(r, "evidence") },
  ];
  function sharedOf(r, kind) {
    const k = r.shared.find((t) => NET.kindOf(t) === kind);
    return k && `Both talk about ${NET.nameOf(k).toLowerCase()}`;
  }

  // Up to three threads, each for a different reason and to a different article.
  function threads(slug) {
    const related = NET.relatedArticles(slug);
    const out = [];
    const used = new Set();
    for (const reason of REASONS) {
      for (const r of related) {
        if (used.has(r.a.slug)) continue;
        const why = reason.pick(r);
        if (why) {
          out.push({ to: r.a, label: reason.label, why });
          used.add(r.a.slug);
          break;
        }
      }
      if (out.length === 3) break;
    }
    if (out.length < 3) {
      const k = kingdomOf(slug);
      const cousin = articles.find((a) => a.slug !== slug && !used.has(a.slug) && kingdomOf(a.slug) === k);
      if (cousin) out.push({ to: cousin, label: "Same kingdom", why: `Both began as ${k.toLowerCase()}` });
    }
    return out;
  }

  // The reason two neighbouring knots are tied, for the string.
  function tie(from, to) {
    return threads(from).find((t) => t.to.slug === to)?.why || "Your own jump";
  }

  function stringHtml(trail, current) {
    if (!trail.length) return "";
    const share = `${location.origin}${location.pathname}${location.search}#/trail/${trail.join(",")}`;
    return `
      <div class="th-string" aria-label="Your thread so far">
        <ol>
          ${trail
            .map(
              (s, i) => `
                <li class="${s === current ? "is-here" : ""}">
                  ${i ? `<span class="th-tie">${esc(tie(trail[i - 1], s))}</span>` : ""}
                  <a href="#/${esc(s)}"><span class="th-knot" aria-hidden="true"></span>${esc(NET.nameOf(s))}</a>
                </li>`
            )
            .join("")}
          <li class="th-open" aria-hidden="true"><span class="th-knot"></span>?</li>
        </ol>
        ${trail.length > 1 ? `<p class="th-share">Share this thread: <a href="#/trail/${esc(trail.join(","))}">${esc(share)}</a></p>` : ""}
      </div>`;
  }

  function home() {
    const trail = readTrail();
    return `
      <section class="th" id="articles" aria-labelledby="th-title">
        <header class="L-head">
          <p class="L-kicker">Pick a loose end · every article offers three more</p>
          <h1 class="L-title" id="th-title">Pull a thread</h1>
          <p class="L-lede">Start anywhere. At the end of each article, pull one of three threads. Your path is saved as a string you can send to a friend.</p>
        </header>
        ${trail.length > 1 ? `<section class="th-last"><h2 class="aside-title">Your last thread</h2>${stringHtml(trail)}</section>` : ""}
        <ul class="th-starts">
          ${articles
            .map(
              (a) => `
                <li class="th-start L-card">
                  <a class="th-start-title" href="#/${esc(a.slug)}">${esc(a.title)}</a>
                  <ul class="th-preview">${threads(a.slug)
                    .map((t) => `<li><span class="th-kind">${esc(t.label)}</span> → ${esc(NET.nameOf(t.to.slug))}</li>`)
                    .join("")}</ul>
                </li>`
            )
            .join("")}
        </ul>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const list = threads(a.slug);
    const bottom = `
      <section class="th-end" aria-labelledby="th-end-title">
        <h2 class="th-end-title" id="th-end-title">Pull a thread</h2>
        <ul class="th-threads">
          ${list
            .map(
              (t) => `
                <li>
                  <a href="#/${esc(t.to.slug)}" data-thread="${esc(t.to.slug)}">
                    <span class="th-kind">⟿ ${esc(t.label)}</span>
                    <span class="th-to">${esc(t.to.title)}</span>
                    <span class="th-why">${esc(t.why)}</span>
                  </a>
                </li>`
            )
            .join("")}
        </ul>
        <div id="th-string-slot"></div>
      </section>`;
    return articleView(a, { back, bottom, next: null });
  }

  function trailPage(slugs) {
    return `
      <section class="th-trail" aria-labelledby="trail-title">
        <a class="back" href="#/">← Start a thread</a>
        <header class="L-head">
          <p class="L-kicker">A thread of ${slugs.length} articles</p>
          <h1 class="L-title" id="trail-title">Someone's thread</h1>
          <p class="L-lede">Follow it knot by knot, or pull a new thread at any point.</p>
        </header>
        <ol class="th-knots">
          ${slugs
            .map(
              (s, i) => `
                <li>
                  ${i ? `<p class="th-tie">${esc(tie(slugs[i - 1], s))}</p>` : ""}
                  <a class="th-knot-card L-card" href="#/${esc(s)}">
                    <span class="th-num">${i + 1}</span>
                    <span class="th-to">${esc(bySlug(s).title)}</span>
                    <span class="th-why">${esc(bySlug(s).dek)}</span>
                  </a>
                </li>`
            )
            .join("")}
        </ol>
      </section>`;
  }

  function route(parts) {
    if (parts[0] === "trail" && parts.length === 2) {
      const slugs = parts[1].split(",").filter((s) => bySlug(s)).slice(0, 30);
      return slugs.length ? { html: trailPage(slugs), title: "A shared thread · Apothecary" } : null;
    }
    return NET.route(parts, { back });
  }

  // Remember which thread was pulled, so the next article knows it was tied on.
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-thread]");
    if (t) session.set(PENDING, t.dataset.thread);
  });

  function mount(view) {
    const slot = view.querySelector("#th-string-slot");
    if (slot) {
      const slug = location.hash.replace(/^#\/?/, "").split("/")[0];
      let trail = readTrail();
      const pending = session.get(PENDING);
      session.set(PENDING, null);
      const at = trail.indexOf(slug);
      if (at >= 0) trail = trail.slice(0, at + 1); // going back along the string
      else if (pending === slug && trail.length) trail.push(slug);
      else trail = [slug];
      session.set(KEY, trail.join(","));
      slot.innerHTML = stringHtml(trail, slug);
    }
    // Opening a shared thread makes it yours.
    const trailMatch = location.hash.match(/^#\/trail\/(.+)$/);
    if (trailMatch) session.set(KEY, trailMatch[1].split(",").filter((s) => bySlug(s)).join(","));
  }

  register({ id: "12", name: "Pull a Thread", skill: "Lateral Thinking", home, article, route, mount });
})();
