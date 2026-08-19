/* Meret landing site, one small progressive enhancement for the waitlist forms.
   No external requests. With JavaScript off, each form still works as a plain mailto form.

   NOTE: hello@meretapp.com is a placeholder. To collect signups without opening the
   visitor's mail client, point each form's `action` at your own form endpoint (for
   example a hosted form service or a serverless handler) and remove this handler. */
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
