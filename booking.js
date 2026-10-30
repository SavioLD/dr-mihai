/* ============================================================
   Praxis Dr. Mihai – Online-Terminbuchung
   ----------------------------------------------------------------
   Alle Buchungs-Trigger leiten direkt zur Dampsoft-Online-Buchung
   weiter (neuer Tab).
   ----------------------------------------------------------------
   Aktive Trigger:
     · Buttons mit [data-dm-booking-open]
     · Buttons mit [data-dm-booking-manage]
     · Service-Karten (.service-card) → automatischer "Termin anfragen"-Link
     · URL-Hash #termin / #buchen
     · window.DMBooking.open() für externe Aufrufe
============================================================ */
(function () {
  "use strict";

  var BOOKING_URL = "https://drmihaimsc.termin.dampsoft.net";

  function go() {
    window.open(BOOKING_URL, "_blank", "noopener");
  }

  function enhanceServiceCards() {
    var cards = document.querySelectorAll(".service-card");
    Array.prototype.forEach.call(cards, function (card) {
      if (card.querySelector(".service-card__book")) return;
      var link = document.createElement("a");
      link.className = "service-card__book";
      link.href = BOOKING_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = "Termin anfragen" +
        ' <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      card.appendChild(link);
    });
  }

  function init() {
    enhanceServiceCards();

    document.addEventListener("click", function (e) {
      // Die Service-Karten-Links (.service-card__book) haben kein data-Attribut
      // und werden hier nicht erfasst – sie öffnen als echter Link von selbst.
      var t = e.target.closest("[data-dm-booking-open],[data-dm-booking-manage],[data-dm-service-handoff]");
      if (!t) return;
      e.preventDefault();
      go();
    });

    function openFromHash() {
      var raw = (location.hash || "").toLowerCase().replace(/^#/, "");
      if (/^(termin|buchen)(?:[=\/].*)?$/.test(raw)) go();
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  }

  window.DMBooking = { open: go };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
