// The Cyanotype style follows the sun: Prussian blue while the sun is high,
// sunset orange through golden hour, and from sunset on amber on black with
// no blue light at all (like f.lux on a screen). Runs in <head> so the right
// colours paint first.
//
// No location is asked for. The browser's time zone gives a rough position:
// the standard UTC offset stands in for longitude, and which half of the year
// has daylight saving tells north from south. That is good to about half an
// hour, and the colours change gradually, so nobody notices the error.
// Without JavaScript the page keeps the plain daytime blue.
(function () {
  "use strict";

  var root = document.documentElement;
  var rad = Math.PI / 180;
  var clamp = function (x) {
    return Math.max(0, Math.min(1, x));
  };

  function guessPlace(now) {
    var year = now.getFullYear();
    var jan = new Date(year, 0, 1).getTimezoneOffset();
    var jul = new Date(year, 6, 1).getTimezoneOffset();
    var lon = (-Math.max(jan, jul) / 60) * 15;
    var lat = jan === jul ? 20 : jul < jan ? 48 : -35;
    return { lat: lat, lon: lon };
  }

  // Sun height above the horizon in degrees, and whether it is past noon.
  // Low-precision solar formulas (accurate to well under a degree).
  function sunAt(now, place) {
    var d = now.getTime() / 86400000 - 10957.5; // days since 1 Jan 2000, noon UTC
    var g = (357.529 + 0.98560028 * d) * rad;
    var q = 280.459 + 0.98564736 * d;
    var L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
    var e = (23.439 - 0.00000036 * d) * rad;
    var ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / rad;
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var gmst = 18.697374558 + 24.06570982441908 * d;
    var hour = ((((gmst * 15 + place.lon - ra) % 360) + 540) % 360) - 180; // −180…180, 0 at noon
    var lat = place.lat * rad;
    var alt = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(hour * rad)) / rad;
    return { alt: alt, afternoon: hour > 0 };
  }

  // Two dials, each 0 to 1: how far into golden hour, and how far into night.
  // Evenings turn orange slowly from mid-afternoon, and night is complete by
  // the moment the sun touches the horizon. Mornings stay dark until sunrise,
  // then cool back to blue quickly.
  function warmth(sun) {
    var night = clamp((3 - sun.alt) / 3);
    if (sun.afternoon) return { dusk: clamp((25 - sun.alt) / 22), night: night };
    return { dusk: clamp((10 - sun.alt) / 7), night: night };
  }

  var FIXED = { day: { dusk: 0, night: 0 }, dusk: { dusk: 1, night: 0 }, night: { dusk: 1, night: 1 } };
  var PHASES = [
    { key: "night", label: "Night print, no blue light", mark: "☾" },
    { key: "dusk", label: "Sunset print", mark: "◐" },
    { key: "day", label: "Daylight print", mark: "☀" },
  ];

  // ?sun=day|dusk|night previews one phase without waiting for the clock.
  var forced = null;
  try {
    forced = FIXED[new URLSearchParams(location.search).get("sun")] || null;
  } catch (err) {}

  var state = null;

  function themeColor(w) {
    // Matches the --bg mix in v2.css closely enough for the browser bar.
    var day = [21, 53, 106];
    var dusk = [156, 62, 14];
    var night = [20, 8, 0];
    var mix = function (a, b, t) {
      return a.map(function (v, i) {
        return Math.round(v + (b[i] - v) * t);
      });
    };
    var c = mix(mix(day, dusk, w.dusk), night, w.night);
    return "#" + c.map(function (v) { return v.toString(16).padStart(2, "0"); }).join("");
  }

  function update() {
    var now = new Date();
    var w = forced || warmth(sunAt(now, guessPlace(now)));
    // "night" (and the no-blue filter in v2.css) only once the palette is fully night.
    var phase = w.night >= 1 ? PHASES[0] : w.dusk > 0.5 ? PHASES[1] : PHASES[2];
    root.style.setProperty("--dusk", (w.dusk * 100).toFixed(1) + "%");
    root.style.setProperty("--night", (w.night * 100).toFixed(1) + "%");
    root.dataset.sun = phase.key;
    state = { phase: phase, themeColor: themeColor(w) };
    if (root.dataset.style === "2") {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", state.themeColor);
    }
    var mark = document.getElementById("sun-mark");
    if (mark) {
      mark.textContent = phase.mark;
      mark.parentNode.setAttribute("title", "Follows the sun · now: " + phase.label);
    }
  }

  update();
  setInterval(update, 60000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) update();
  });

  window.SUN = {
    update: update,
    // For the Day Wheel: sun height (degrees) and colour dials at any moment.
    altitudeAt: function (date) {
      return sunAt(date, guessPlace(date)).alt;
    },
    warmthAt: function (date) {
      return warmth(sunAt(date, guessPlace(date)));
    },
    get state() {
      return state;
    },
  };
})();
