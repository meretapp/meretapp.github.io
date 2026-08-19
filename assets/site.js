/* Meret landing site, one small progressive enhancement for the waitlist forms.
   No external requests. With JavaScript off, each form still works as a plain mailto form.

   The waitlist address is hello@meretapp.com, the friendly, generic inbox. To collect
   signups without opening the visitor's mail client, point each form's `action` at your
   own form endpoint (a hosted form service or a serverless handler) and remove this
   handler. Formal contact (privacy, security, terms) uses support@meretapp.com. */
(function () {
  "use strict";

  var forms = document.querySelectorAll("form.cta");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var email = form.querySelector('input[type="email"]');
      if (!email || !email.checkValidity()) {
        return; // let the browser show its native validation message
      }

      event.preventDefault();

      // Open the visitor's mail client with the address prefilled, then confirm inline.
      var address = "hello@meretapp.com";
      var subject = encodeURIComponent("Meret waitlist");
      var body = encodeURIComponent("Please add me to the Meret waitlist: " + email.value);
      window.location.href = "mailto:" + address + "?subject=" + subject + "&body=" + body;

      var done = form.querySelector(".form-done");
      if (done) done.classList.add("show");
      email.value = "";
      email.blur();
    });
  });
})();

/* The hero recording preview: the mm:ss timer ticks up once a second so the phone reads
   as an active recording alongside the scrolling waveform, and the big Pause control
   works like the app. Clicking it freezes the timer and the waveform, mutes the status
   to "Paused", and turns the button into Resume; clicking again resumes.

   With JavaScript off the timer shows its static value and the phone stays recording.
   The timer does not auto-run for visitors who prefer reduced motion, but Pause/Resume
   still works if they choose to use it. */
(function () {
  "use strict";

  var timerEl = document.querySelector(".rec-timer");
  if (!timerEl) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var screen = document.querySelector(".stage .screen");
  var button = document.querySelector(".rcwrap.center .rc.big");
  var buttonLabel = document.querySelector(".rcwrap.center span");
  var statusEl = document.querySelector(".rec-status");

  var PAUSE_ICON = '<svg viewBox="0 0 24 24"><rect x="7" y="5" width="3.6" height="14" rx="1.3" fill="currentColor"/><rect x="13.4" y="5" width="3.6" height="14" rx="1.3" fill="currentColor"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

  var parts = timerEl.textContent.trim().split(":");
  var seconds = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  var interval = null;
  var paused = false;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function render() { timerEl.textContent = pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60); }
  function start() { if (!interval && !reduce) interval = setInterval(function () { seconds += 1; render(); }, 1000); }
  function stop() { if (interval) { clearInterval(interval); interval = null; } }

  function setPaused(next) {
    paused = next;
    if (screen) screen.classList.toggle("is-paused", paused);
    if (statusEl) statusEl.textContent = paused ? "Paused" : "Capturing";
    if (button) button.innerHTML = paused ? PLAY_ICON : PAUSE_ICON;
    if (buttonLabel) buttonLabel.textContent = paused ? "Resume" : "Pause";
    if (paused) stop(); else start();
  }

  start();

  if (button) {
    button.addEventListener("click", function () { setPaused(!paused); });
  }
})();

/* A gentle scroll-linked tilt on the hero phone: as the device moves through the
   viewport it rocks a few degrees in 3D, so the page feels alive without distraction.
   The transform is written to CSS variables that .device consumes, updated on a single
   requestAnimationFrame per scroll. Skipped entirely for reduced-motion visitors. */
(function () {
  "use strict";

  var device = document.querySelector(".stage .device");
  if (!device) return;

  // Build the phone's thickness: a stack of rounded slabs behind the front face, each a
  // little further back in Z and a little darker, so the side reads as a solid rounded
  // edge when the device tilts. Invisible head-on because the front face covers it.
  (function buildDepth() {
    var LAYERS = 22, STEP = 2.0;         // total thickness ~44px, so the side is clearly visible
    // front of the edge is a light brushed-metal tone that catches the light, fading to
    // near-black at the back, so the side reads as a real machined phone edge
    var front = [120, 112, 134], back = [12, 11, 16];
    var frag = document.createDocumentFragment();
    for (var k = 1; k <= LAYERS; k++) {
      var t = k / LAYERS;
      var slab = document.createElement("div");
      slab.className = "device-slab";
      slab.style.transform = "translateZ(-" + (k * STEP).toFixed(2) + "px)";
      slab.style.background = "rgb(" +
        Math.round(front[0] + (back[0] - front[0]) * t) + "," +
        Math.round(front[1] + (back[1] - front[1]) * t) + "," +
        Math.round(front[2] + (back[2] - front[2]) * t) + ")";
      frag.appendChild(slab);
    }
    device.insertBefore(frag, device.firstChild);
  })();

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var BASE_Y = -9;   // resting sideways angle, so the metal edge is visible even at rest
  var SWING_Y = 15;  // degrees the sideways tilt swings across the scroll range
  var MAX_X = 5;     // degrees of front/back tilt
  var MAX_SHIFT = 14; // px of vertical parallax
  var ticking = false;

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function update() {
    ticking = false;
    var rect = device.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top > vh) return; // off-screen, nothing to do

    // progress: +1 when the phone sits low in the viewport, -1 when high, 0 at center.
    // The 0.55 factor makes the tilt reach its full range within the normal scroll of
    // the hero, so the movement is easy to feel rather than only tipping at the edges.
    var center = rect.top + rect.height / 2;
    var progress = clamp((center - vh / 2) / (vh * 0.55), -1, 1);

    device.style.setProperty("--tiltY", (BASE_Y + progress * SWING_Y).toFixed(2) + "deg");
    device.style.setProperty("--tiltX", (progress * -MAX_X).toFixed(2) + "deg");
    device.style.setProperty("--phoneY", (progress * MAX_SHIFT).toFixed(1) + "px");
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
