// Concept 8 · The Museum Walk (SCAMPER "Adapt" + "How might we make six
// articles feel like a complete visit?"). Articles hang in rooms; a floor
// plan and a set route lead from the entrance to the last exhibit.
(() => {
  "use strict";
  const { articles, concepts, esc, extra, glyph, register, articleView, aboutSection } = window.APO;
  const { ROOMS } = concepts;

  const inRoom = (room) => articles.filter((a) => extra(a).room === room.key);
  const walk = ROOMS.flatMap(inRoom);
  const roomOf = (a) => ROOMS.find((r) => r.key === extra(a).room);
  const totalMinutes = articles.reduce((sum, a) => sum + a.minutes, 0);

  function rail(current) {
    return `
      <nav class="mu-rail" aria-label="Rooms">
        <ol>
          ${ROOMS.map(
            (r) => `
              <li class="${r === current ? "is-here" : ""}">
                <a href="#/room/${esc(r.key)}" ${r === current ? 'aria-current="page"' : ""}>
                  <span class="mu-rail-dot" aria-hidden="true"></span>
                  <span>${esc(r.numeral)} · ${esc(r.name)}</span>
                </a>
              </li>`
          ).join("")}
        </ol>
      </nav>`;
  }

  function home() {
    return `
      <section class="mu" id="articles" aria-labelledby="mu-title">
        <header class="L-head">
          <p class="L-kicker">A museum of everyday biology</p>
          <h1 class="L-title" id="mu-title">Three rooms, six exhibits</h1>
        </header>
        <div class="mu-plan">
          ${ROOMS.map(
            (r) => `
              <a class="mu-room" href="#/room/${esc(r.key)}">
                <span class="mu-room-no">Room ${esc(r.numeral)}</span>
                <span class="mu-room-name">${esc(r.name)}</span>
                <ul class="mu-room-list">
                  ${inRoom(r)
                    .map((a) => `<li><span aria-hidden="true">✿</span> ${esc(a.common)}</li>`)
                    .join("")}
                </ul>
                <span class="mu-room-blurb">${esc(r.blurb)}</span>
              </a>`
          ).join("")}
          <div class="mu-entrance">
            <span class="mu-entrance-name">Entrance</span>
            <a class="mu-start" href="#/room/${esc(ROOMS[0].key)}">Start the walk →</a>
            <span class="mu-entrance-time">${totalMinutes} min in total</span>
          </div>
        </div>
      </section>
      ${aboutSection()}`;
  }

  function roomPage(r) {
    const i = ROOMS.indexOf(r);
    const next = ROOMS[i + 1];
    const prev = ROOMS[i - 1];
    return `
      <section class="mu-room-page" aria-labelledby="room-title">
        ${rail(r)}
        <header class="L-head">
          <p class="L-kicker">Room ${esc(r.numeral)}</p>
          <h1 class="L-title" id="room-title">${esc(r.name)}</h1>
          <p class="mu-wall">${esc(r.wall)}</p>
        </header>
        <ul class="mu-exhibits">
          ${inRoom(r)
            .map(
              (a) => `
                <li>
                  <a class="mu-exhibit" href="#/${esc(a.slug)}">
                    <span class="mu-exhibit-art">${glyph(a.slug, "glyph mu-glyph")}</span>
                    <span class="mu-exhibit-no">Exhibit ${walk.indexOf(a) + 1}</span>
                    <span class="mu-exhibit-name">${esc(a.title)}</span>
                    <span class="mu-exhibit-meta"><i>${esc(a.latin)}</i> · ${a.minutes} min</span>
                  </a>
                </li>`
            )
            .join("")}
        </ul>
        <nav class="mu-doors" aria-label="Other rooms">
          ${prev ? `<a href="#/room/${esc(prev.key)}">← Room ${esc(prev.numeral)}: ${esc(prev.name)}</a>` : `<a href="#/">← Entrance</a>`}
          ${next ? `<a href="#/room/${esc(next.key)}">Room ${esc(next.numeral)}: ${esc(next.name)} →</a>` : `<a href="#/">Back to the entrance →</a>`}
        </nav>
      </section>`;
  }

  function article(a) {
    const r = roomOf(a);
    const next = walk[walk.indexOf(a) + 1] || null;
    const bottom = next
      ? ""
      : `<p class="mu-end">That was the last exhibit. <a href="#/">Back to the entrance</a></p>`;
    return articleView(a, {
      top: rail(r),
      next,
      nextLabel: roomOf(next || a) === r ? "Next exhibit" : `Next room: ${next ? roomOf(next).name : ""}`,
      bottom,
      back: { href: `#/room/${r.key}`, label: `← Room ${r.numeral}: ${r.name}` },
    });
  }

  function route(parts) {
    if (parts[0] !== "room" || parts.length !== 2) return null;
    const r = ROOMS.find((x) => x.key === parts[1]);
    return r ? { html: roomPage(r), title: `Room ${r.numeral}: ${r.name} · Apothecary` } : null;
  }

  register({ id: "8", name: "Museum Walk", skill: "SCAMPER + How might we", home, article, route });
})();
