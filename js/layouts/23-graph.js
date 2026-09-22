// Concept 23 · The Web (an Obsidian-style graph as the home page).
// Every article and every word articles share is a dot; lines join a dot to
// the articles that mention it. Hover to light up a neighbourhood, drag to
// rearrange, scroll or pinch to zoom, click to open.
(() => {
  "use strict";
  const { articles, esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { KINDS } = NET;

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const back = { href: "#/", label: "← The web" };

  // One simulation for the whole visit, so the web keeps its shape when
  // the reader comes back to it.
  let data = null;
  let sim = null;
  function ensureSim() {
    if (data) return;
    data = NET.graphData();
    sim = NET.createSim(data.nodes, data.links);
  }

  // Remembered between renders.
  const state = { zoom: 1, panX: 0, panY: 0, hidden: new Set(), query: "" };

  function home() {
    const counts = Object.keys(KINDS).map((k) => ({ k, n: [...NET.usedKeys].filter((key) => NET.kindOf(key) === k).length }));
    return `
      <section class="gw" id="articles" aria-labelledby="gw-title">
        <header class="L-head gw-head">
          <p class="L-kicker">${articles.length} articles · ${NET.usedKeys.size - articles.length} shared words · every line is a mention</p>
          <h1 class="L-title" id="gw-title">The web</h1>
          <p class="L-lede">Big dots are articles. Small dots are things they talk about. Nobody drew these lines by hand: they appear wherever two articles use the same word.</p>
        </header>
        <div class="gw-tools">
          <label class="gw-search">
            <span class="visually-hidden">Find a dot</span>
            <input type="search" id="gw-q" placeholder="Find: sleep, sugar, blood…" autocomplete="off" value="${esc(state.query)}" />
          </label>
          <div class="gw-filters" role="group" aria-label="Show or hide kinds of dots">
            ${counts
              .filter((c) => c.n)
              .map(
                (c) => `<button type="button" class="gw-filter" data-kind="${c.k}" aria-pressed="${!state.hidden.has(c.k)}"><span class="gw-swatch" aria-hidden="true"></span>${esc(KINDS[c.k].name)} <span class="gw-count">${c.n}</span></button>`
              )
              .join("")}
          </div>
          <div class="gw-zoom" role="group" aria-label="Zoom">
            <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
            <button type="button" data-zoom="out" aria-label="Zoom out">−</button>
            <button type="button" data-zoom="reset">Reset</button>
          </div>
        </div>
        <div class="gw-stage-wrap">
          <svg class="gw-stage" id="gw-stage" role="group" aria-label="Graph of articles and the words they share. The list below has the same content.">
            <g class="gw-world"><g class="gw-edges"></g><g class="gw-nodes"></g></g>
          </svg>
          <aside class="gw-panel" id="gw-panel" aria-live="polite">
            <p class="gw-panel-hint">Hover or tap a dot to see what it connects to.</p>
          </aside>
        </div>
        <p class="map-hint">Drag dots to untangle them · drag the background to move · scroll or pinch to zoom</p>
        <details class="gw-list">
          <summary>Browse the web as a list</summary>
          <div class="gw-list-cols">
            ${Object.entries(KINDS)
              .map(([k, kind]) => {
                const keys = [...NET.usedKeys].filter((key) => NET.kindOf(key) === k).sort((p, q) => NET.nameOf(p).localeCompare(NET.nameOf(q)));
                return keys.length
                  ? `<section><h2 class="aside-title">${esc(kind.name)}</h2><ul class="aside-links">${keys
                      .map((key) => `<li>${NET.link(key)} <span class="gw-deg">${NET.neighbours(key).length}</span></li>`)
                      .join("")}</ul></section>`
                  : "";
              })
              .join("")}
          </div>
        </details>
      </section>
      ${aboutSection()}`;
  }

  // ---------- live graph ----------

  function mountGraph(view) {
    const svg = view.querySelector("#gw-stage");
    if (!svg) return;
    ensureSim();
    const world = svg.querySelector(".gw-world");
    const gEdges = svg.querySelector(".gw-edges");
    const gNodes = svg.querySelector(".gw-nodes");
    const panel = view.querySelector("#gw-panel");
    const byKey = new Map(data.nodes.map((n) => [n.key, n]));
    const NS = "http://www.w3.org/2000/svg";

    const edgeEls = sim.links.map((l) => {
      const line = document.createElementNS(NS, "line");
      line.setAttribute("class", `gw-edge ${[...l.types].some((t) => t !== "mention" && t !== "article") ? "is-typed" : ""}`);
      gEdges.appendChild(line);
      return { l, line };
    });
    const nodeEls = data.nodes.map((n) => {
      const a = document.createElementNS(NS, "a");
      a.setAttribute("href", NET.hrefOf(n.key));
      a.setAttribute("class", `gw-node ${n.article ? "is-article" : ""}`);
      a.setAttribute("data-kind", n.kind);
      a.setAttribute("data-key", n.key);
      a.setAttribute("aria-label", `${NET.nameOf(n.key)}, ${n.degree} connections`);
      if (!n.article) a.setAttribute("tabindex", "-1"); // keyboard users get the list below
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", n.r);
      const t = document.createElementNS(NS, "text");
      t.textContent = n.name;
      t.setAttribute("dy", n.r + 13);
      a.append(c, t);
      gNodes.appendChild(a);
      return { n, a };
    });

    // ----- view transform -----
    let W = 0;
    let H = 0;
    function size() {
      const r = svg.getBoundingClientRect();
      W = r.width;
      H = r.height;
      svg.setAttribute("viewBox", `${-W / 2} ${-H / 2} ${W} ${H}`);
    }
    function applyTransform() {
      world.setAttribute("transform", `translate(${state.panX} ${state.panY}) scale(${state.zoom})`);
      svg.classList.toggle("is-zoomed", state.zoom > 1.35);
      svg.style.setProperty("--z", state.zoom.toFixed(3));
    }
    const toWorld = (clientX, clientY) => {
      const r = svg.getBoundingClientRect();
      return { x: (clientX - r.left - W / 2 - state.panX) / state.zoom, y: (clientY - r.top - H / 2 - state.panY) / state.zoom };
    };
    function zoomAt(factor, cx = 0, cy = 0) {
      const z = Math.min(4, Math.max(0.35, state.zoom * factor));
      const k = z / state.zoom;
      state.panX = cx - (cx - state.panX) * k;
      state.panY = cy - (cy - state.panY) * k;
      state.zoom = z;
      applyTransform();
    }
    // Fit everything on first view.
    function fit() {
      const xs = data.nodes.map((n) => n.x);
      const ys = data.nodes.map((n) => n.y);
      const w = Math.max(...xs) - Math.min(...xs) + 120;
      const h = Math.max(...ys) - Math.min(...ys) + 120;
      state.zoom = Math.min(W / w, H / h, 1.1);
      state.panX = -((Math.max(...xs) + Math.min(...xs)) / 2) * state.zoom;
      state.panY = -((Math.max(...ys) + Math.min(...ys)) / 2) * state.zoom;
      applyTransform();
    }

    function draw() {
      for (const { l, line } of edgeEls) {
        line.setAttribute("x1", l.s.x.toFixed(1));
        line.setAttribute("y1", l.s.y.toFixed(1));
        line.setAttribute("x2", l.t.x.toFixed(1));
        line.setAttribute("y2", l.t.y.toFixed(1));
      }
      for (const { n, a } of nodeEls) a.setAttribute("transform", `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`);
    }

    let frame = 0;
    function loop() {
      if (!svg.isConnected) return;
      sim.tick();
      draw();
      frame = sim.alpha > 0.004 ? requestAnimationFrame(loop) : 0;
    }
    const kick = (a = 0.25) => {
      sim.heat(a);
      if (reduceMotion()) {
        sim.settle(200);
        draw();
      } else if (!frame) frame = requestAnimationFrame(loop);
    };

    // ----- highlight -----
    function light(key) {
      svg.classList.toggle("has-focus", !!key);
      const near = key ? new Set([key, ...NET.neighbours(key).map((n) => n.key)]) : null;
      for (const { n, a } of nodeEls) a.classList.toggle("is-lit", !!near && near.has(n.key));
      for (const { l, line } of edgeEls) line.classList.toggle("is-lit", !!key && (l.a === key || l.b === key));
      if (key) showPanel(key);
    }
    function showPanel(key) {
      const near = NET.neighbours(key).sort((p, q) => Number(NET.isArticle(q.key)) - Number(NET.isArticle(p.key)) || q.w - p.w);
      panel.innerHTML = `
        ${NET.kindChip(key)}
        <h2 class="gw-panel-name">${esc(NET.nameOf(key))}</h2>
        <p class="gw-panel-def">${esc(NET.defOf(key))}</p>
        <a class="gw-open" href="${esc(NET.hrefOf(key))}">${NET.isArticle(key) ? "Read the article" : "Open this word"} →</a>
        <h3 class="aside-title">${near.length} connections</h3>
        <ul class="net-chips">${near.slice(0, 14).map((n) => `<li>${NET.link(n.key)}</li>`).join("")}</ul>`;
    }

    function applyFilters() {
      const q = state.query.trim().toLowerCase();
      const hit = (n) => q && (n.name.toLowerCase().includes(q) || NET.defOf(n.key).toLowerCase().includes(q));
      for (const { n, a } of nodeEls) {
        a.classList.toggle("is-hidden", state.hidden.has(n.kind));
        a.classList.toggle("is-match", !!hit(n));
      }
      for (const { l, line } of edgeEls) line.classList.toggle("is-hidden", state.hidden.has(l.s.kind) || state.hidden.has(l.t.kind));
      svg.classList.toggle("has-query", !!q);
    }

    // ----- pointer: drag nodes, pan background, pinch zoom -----
    const pointers = new Map();
    let drag = null; // { node, moved, startX, startY, pointerType }
    let pan = null;
    let pinch = null;
    let tappedKey = null;

    svg.addEventListener("pointerdown", (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      svg.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        const [p, q] = [...pointers.values()];
        pinch = { d: Math.hypot(p.x - q.x, p.y - q.y) };
        drag = pan = null;
        return;
      }
      const el = e.target.closest(".gw-node");
      if (el) {
        const node = byKey.get(el.dataset.key);
        drag = { node, moved: false, startX: e.clientX, startY: e.clientY, pointerType: e.pointerType };
        node.fixed = true;
      } else {
        pan = { x: e.clientX, y: e.clientY, px: state.panX, py: state.panY, moved: false };
      }
    });
    svg.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) {
        const [p, q] = [...pointers.values()];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        const r = svg.getBoundingClientRect();
        zoomAt(d / pinch.d, (p.x + q.x) / 2 - r.left - W / 2, (p.y + q.y) / 2 - r.top - H / 2);
        pinch.d = d;
        return;
      }
      if (drag) {
        if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4) drag.moved = true;
        if (drag.moved) {
          const w = toWorld(e.clientX, e.clientY);
          drag.node.x = w.x;
          drag.node.y = w.y;
          kick(0.2);
          draw();
        }
      } else if (pan) {
        if (Math.hypot(e.clientX - pan.x, e.clientY - pan.y) > 3) pan.moved = true;
        state.panX = pan.px + e.clientX - pan.x;
        state.panY = pan.py + e.clientY - pan.y;
        applyTransform();
      }
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag) {
        drag.node.fixed = false;
        if (!drag.moved) {
          // Mouse: a click opens. Touch: the first tap shows the panel, the second opens.
          const key = drag.node.key;
          if (drag.pointerType === "mouse" || tappedKey === key) location.hash = NET.hrefOf(key);
          else {
            tappedKey = key;
            light(key);
          }
        }
        drag = null;
      }
      if (pan && !pan.moved && e.type === "pointerup") {
        tappedKey = null;
        light(null);
      }
      pan = null;
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    // Links inside the SVG are handled above so a drag never opens a page.
    svg.addEventListener("click", (e) => {
      if (e.target.closest(".gw-node") && e.detail !== 0) e.preventDefault();
    });
    svg.addEventListener("pointerover", (e) => {
      const el = e.target.closest(".gw-node");
      if (el && e.pointerType === "mouse" && !drag) light(el.dataset.key);
    });
    svg.addEventListener("pointerout", (e) => {
      if (e.pointerType !== "mouse" || drag) return;
      const from = e.target.closest(".gw-node");
      const to = e.relatedTarget?.closest?.(".gw-node");
      if (from && !to) light(null);
    });
    svg.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse" && !drag) light(null);
    });
    svg.addEventListener("focusin", (e) => {
      const el = e.target.closest(".gw-node");
      if (el) light(el.dataset.key);
    });
    svg.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const r = svg.getBoundingClientRect();
        zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left - W / 2, e.clientY - r.top - H / 2);
      },
      { passive: false }
    );

    // ----- tools -----
    view.querySelectorAll("[data-zoom]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.zoom === "reset") fit();
        else zoomAt(b.dataset.zoom === "in" ? 1.3 : 1 / 1.3);
      })
    );
    view.querySelectorAll(".gw-filter").forEach((b) =>
      b.addEventListener("click", () => {
        const k = b.dataset.kind;
        if (state.hidden.has(k)) state.hidden.delete(k);
        else state.hidden.add(k);
        b.setAttribute("aria-pressed", String(!state.hidden.has(k)));
        applyFilters();
      })
    );
    const input = view.querySelector("#gw-q");
    input.addEventListener("input", () => {
      state.query = input.value;
      applyFilters();
    });

    size();
    const firstVisit = sim.alpha === 1;
    if (firstVisit && reduceMotion()) sim.settle(320);
    if (firstVisit) sim.settle(reduceMotion() ? 0 : 140); // start mostly untangled, finish live
    draw();
    if (firstVisit || state.zoom === 1) fit();
    else applyTransform();
    applyFilters();
    if (!reduceMotion() && sim.alpha > 0.004) frame = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      if (!svg.isConnected) return ro.disconnect();
      size();
      applyTransform();
    });
    ro.observe(svg);
  }

  // ---------- article: local graph + backlinks ----------

  function article(a) {
    const terms = NET.termsIn(a.slug);
    const backlinks = NET.mentions.filter((m) => m.term === a.slug);
    const outgoing = [...terms.keys()].filter((k) => !NET.isArticle(k));
    const aside = `
      <h2 class="aside-title">Local graph</h2>
      ${NET.staticGraph(a.slug, { label: "Local graph" })}
      <a class="aside-back" href="#/">← The whole web</a>`;
    const bottom = `
      <section class="gw-links" aria-labelledby="gw-back-title">
        <h2 class="aside-title" id="gw-back-title">Linked mentions · ${backlinks.length}</h2>
        ${
          backlinks.length
            ? `<ul class="gw-backlinks">${backlinks
                .map(
                  (m) => `<li><p class="term-article">${NET.link(m.slug)}</p><blockquote><p>${esc(m.sentence)}</p><footer>${NET.sectionLink(m.slug, m.section, `§${m.section + 1} ${NET.sectionName(m.slug, m.section)}`)}</footer></blockquote></li>`
                )
                .join("")}</ul>`
            : `<p class="term-empty">No other article names this one yet.</p>`
        }
        <h2 class="aside-title">Outgoing · ${outgoing.length} words this article shares</h2>
        <ul class="net-chips">${outgoing.map((k) => `<li>${NET.link(k)}</li>`).join("")}</ul>
      </section>`;
    return articleView(a, { aside, bottom, back });
  }

  function route(parts) {
    return NET.route(parts, { back, extra: (key) => `<div class="term-graph">${NET.staticGraph(key, { label: "Neighbours", size: 320 })}</div>` });
  }

  function mount(view) {
    mountGraph(view);
  }

  register({ id: "23", name: "The Web (graph home)", skill: "Obsidian graph view", home, article, route, mount });
})();
