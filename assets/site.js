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
