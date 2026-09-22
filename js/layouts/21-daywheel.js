// Concept 21 · The Day Wheel (robertguss brainstorm: shift perspective to
// time of day). A 24-hour clock with noon at the top. The ring is shaded
// with the same sun maths that colours the Cyanotype style, so the wheel
// shows where the page's colours are in their day.
(() => {
  "use strict";
  const { esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { DAY, BEYOND } = NET;
  const back = { href: "#/", label: "← The day wheel" };

  const R = 170; // ring radius
  const angle = (min) => ((min / 1440) * 360 + 180) * (Math.PI / 180); // midnight at the bottom
  const pt = (min, r) => [Math.sin(angle(min)) * r, -Math.cos(angle(min)) * r];
  const hhmm = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(Math.round(min % 60)).padStart(2, "0")}`;
  const nowMin = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  };

  // Sun phase for every 10 minutes of today (day / dusk / night), plus
  // sunrise and sunset, from js/sun.js. Without it: a plain 6–18 day.
  function sunDay() {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const slices = [];
    let rise = null;
    let set = null;
    let prev = null;
    for (let m = 0; m < 1440; m += 10) {
      const t = new Date(base.getTime() + m * 60000);
      let phase = m >= 360 && m < 1080 ? "day" : "night";
      let alt = null;
      if (window.SUN?.warmthAt) {
        const w = window.SUN.warmthAt(t);
        phase = w.night >= 1 ? "night" : w.dusk > 0.5 ? "dusk" : "day";
        alt = window.SUN.altitudeAt(t);
        if (prev !== null && prev <= 0 && alt > 0) rise = m;
        if (prev !== null && prev > 0 && alt <= 0) set = m;
        prev = alt;
      }
      slices.push({ m, phase });
    }
    return { slices, rise, set };
  }

  function arc(from, to, r1, r2) {
    const [x1, y1] = pt(from, r2);
    const [x2, y2] = pt(to, r2);
    const [x3, y3] = pt(to, r1);
    const [x4, y4] = pt(from, r1);
    const large = to - from > 720 ? 1 : 0;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r2} ${r2} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r1} ${r1} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)}Z`;
  }

  function wheel(items, { small = false } = {}) {
    const sun = sunDay();
    const now = nowMin();
    const ticks = Array.from({ length: 24 }, (_, h) => {
      const [x1, y1] = pt(h * 60, R - 4);
      const [x2, y2] = pt(h * 60, R + (h % 6 ? 4 : 10));
      const [tx, ty] = pt(h * 60, R - 20);
      return `<line class="dw-tick" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>${
        h % 3 === 0 && !small ? `<text class="dw-hour" x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}">${String(h).padStart(2, "0")}</text>` : ""
      }`;
    }).join("");
    const ring = sun.slices.map((s) => `<path class="dw-slice is-${s.phase}" d="${arc(s.m, s.m + 10.5, R - 32, R)}"/>`).join("");
    const marks = items
      .map((it, i) => {
        const range = it.to ? `<path class="dw-range" d="${arc(it.from, it.to, R + 2, R + 14)}"/>` : "";
        // Ranges carry their label near the end so it clears point items inside them.
        const mid = it.to ? it.to - 40 : it.from;
        const [dx, dy] = pt(mid, R + 8);
        const [lx, ly] = pt(mid, R + 42);
        const right = lx >= 0;
        return `
          <a class="dw-item" href="${esc(NET.sectionHref(it.at[0], it.at[1]))}" data-i="${i}">
            <title>${esc(`${hhmm(it.from)}${it.to ? `–${hhmm(it.to)}` : ""} · ${it.label}: ${it.text}`)}</title>
            ${range}
            <circle class="dw-dot" cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${small ? 7 : 6}"/>
            ${small ? "" : `<line class="dw-leader" x1="${dx.toFixed(1)}" y1="${dy.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}"/>
            <text class="dw-label" x="${(lx + (right ? 4 : -4)).toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${right ? "start" : "end"}">${esc(it.label)}</text>`}
          </a>`;
      })
      .join("");
    const [nx, ny] = pt(now, R - 36);
    const phaseNow = sun.slices[Math.floor(now / 10)].phase;
    const until = (m) => {
      const d = (m - now + 1440) % 1440;
      return d < 60 ? `${d} min` : `${Math.floor(d / 60)} h ${String(d % 60).padStart(2, "0")} min`;
    };
    const centre =
      sun.set === null || sun.rise === null
        ? ""
        : phaseNow === "night"
          ? `Sunrise in ${until(sun.rise)}`
          : `Sunset in ${until(sun.set)}`;
    const pad = small ? 30 : 150;
    return `
      <svg class="dw-wheel ${small ? "is-small" : ""}" viewBox="${-R - pad} ${-R - (small ? 30 : 70)} ${(R + pad) * 2} ${(R + (small ? 30 : 70)) * 2}" role="img" aria-label="24-hour wheel with noon at the top. The list below has the same times.">
        ${ring}${ticks}
        <line class="dw-needle" x1="0" y1="0" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"/>
        <circle class="dw-hub" r="4"/>
        ${small ? "" : `<text class="dw-now" y="-18">Now ${hhmm(now)}</text><text class="dw-until" y="46">${esc(centre)}</text>`}
        ${marks}
      </svg>`;
  }

  function list(items) {
    return `
      <ol class="dw-list">
        ${items
          .map(
            (it) => `
              <li>
                <span class="dw-time">${hhmm(it.from)}${it.to ? `–${hhmm(it.to)}` : ""}</span>
                <span><b>${esc(it.label)}</b> ${esc(it.text)} ${NET.sectionLink(it.at[0], it.at[1], NET.nameOf(it.at[0]))}</span>
              </li>`
          )
          .join("")}
      </ol>`;
  }

  function home() {
    const items = [...DAY].sort((a, b) => a.from - b.from);
    return `
      <section class="dw" id="articles" aria-labelledby="dw-title">
        <header class="L-head">
          <p class="L-kicker">Noon at the top, midnight at the bottom · shaded by today's sun where you are</p>
          <h1 class="L-title" id="dw-title">The day wheel</h1>
        </header>
        <div class="dw-grid">
          <div class="dw-stage" id="dw-stage">${wheel(items)}</div>
          <div>
            <h2 class="aside-title">Through the day</h2>
            ${list(items)}
            <p class="dw-key"><span class="is-day"></span> daylight <span class="is-dusk"></span> golden hour <span class="is-night"></span> after sunset</p>
          </div>
        </div>
        <section class="dw-beyond" aria-labelledby="dw-beyond-title">
          <h2 class="aside-title" id="dw-beyond-title">Beyond the wheel: clocks shorter or longer than a day</h2>
          <ul>${BEYOND.map((b) => `<li><span class="dw-span">${esc(b.span)}</span><span>${esc(b.text)} ${NET.sectionLink(b.at[0], b.at[1], NET.nameOf(b.at[0]))}</span></li>`).join("")}</ul>
        </section>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const items = DAY.filter((d) => d.at[0] === a.slug);
    const beyond = BEYOND.filter((b) => b.at[0] === a.slug);
    if (!items.length && !beyond.length) return articleView(a, { back });
    const aside = `
      <h2 class="aside-title">When it matters</h2>
      ${items.length ? `${wheel(items, { small: true })}${list(items)}` : ""}
      ${beyond.length ? `<ul class="dw-mini">${beyond.map((b) => `<li><span class="dw-span">${esc(b.span)}</span> ${esc(b.text)}</li>`).join("")}</ul>` : ""}
      <a class="aside-back" href="#/">← The whole day</a>`;
    return articleView(a, { back, aside });
  }

  // Keep the needle and the "sunset in" line current while the page is open.
  function mount(view) {
    const stage = view.querySelector("#dw-stage");
    if (!stage) return;
    const items = [...DAY].sort((a, b) => a.from - b.from);
    const timer = setInterval(() => {
      if (!stage.isConnected) return clearInterval(timer);
      stage.innerHTML = wheel(items);
    }, 60000);
  }

  register({ id: "21", name: "Day Wheel", skill: "Brainstorm (perspective shift)", home, article, route: (parts) => NET.route(parts, { back }), mount });
})();
