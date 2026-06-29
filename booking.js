/* ============================================================
   Praxis Dr. Mihai – Online-Buchung (Platzhalter)
   ----------------------------------------------------------------
   Die Online-Terminbuchung wird gerade vorbereitet. Bis dahin
   zeigen alle Buchungs-Trigger ein freundliches „Bald verfügbar"-
   Modal mit Telefon- und E-Mail-Kontakt.
   ----------------------------------------------------------------
   Aktive Trigger:
     · Buttons mit [data-dm-booking-open]
     · Buttons mit [data-dm-booking-manage]
     · Service-Karten (.service-card) → automatischer Button
     · URL-Hash #termin / #buchen
     · window.DMBooking.open() für externe Aufrufe
============================================================ */
(function () {
  "use strict";

  var overlay;

  function inject() {
    if (document.getElementById("dm-bk-overlay")) return;

    var style = document.createElement("style");
    style.textContent =
      "#dm-bk-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:clamp(8px,3vw,32px);z-index:9999;animation:dmBkFade .18s ease-out;}" +
      "#dm-bk-overlay.is-open{display:flex;}" +
      "#dm-bk-modal{background:#fff;width:min(520px,100%);border-radius:24px;box-shadow:0 30px 60px -20px rgba(15,23,42,.35);overflow:hidden;position:relative;animation:dmBkSlide .22s ease-out;}" +
      "#dm-bk-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid #e2e8f0;color:#475569;display:grid;place-items:center;cursor:pointer;z-index:2;transition:background .15s,color .15s,transform .15s;}" +
      "#dm-bk-close:hover{background:#f1f5f9;color:#0f172a;transform:rotate(90deg);}" +
      "#dm-bk-modal .dm-bk-soon{padding:48px 36px 36px;text-align:center;font-family:inherit;}" +
      "#dm-bk-modal .dm-bk-soon__ico{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;display:grid;place-items:center;margin:0 auto 18px;box-shadow:0 12px 30px -8px rgba(29,78,216,.55);animation:dmBkPulse 2.4s ease-in-out infinite;}" +
      "#dm-bk-modal .dm-bk-soon__pill{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1d4ed8;background:#dbeafe;padding:6px 12px;border-radius:999px;margin-bottom:14px;}" +
      "#dm-bk-modal .dm-bk-soon h2{font-family:'Fraunces',Georgia,serif;font-size:28px;line-height:1.15;color:#0f172a;margin:0 0 12px;}" +
      "#dm-bk-modal .dm-bk-soon p{color:#475569;font-size:15px;line-height:1.6;margin:0 0 14px;}" +
      "#dm-bk-modal .dm-bk-soon p:last-of-type{margin-bottom:24px;}" +
      "#dm-bk-modal .dm-bk-soon__actions{display:flex;gap:10px;flex-direction:column;}" +
      "#dm-bk-modal .dm-bk-soon__btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;transition:transform .12s,box-shadow .15s,background .15s;}" +
      "#dm-bk-modal .dm-bk-soon__btn--primary{background:#1d4ed8;color:#fff;box-shadow:0 8px 18px -4px rgba(29,78,216,.4);}" +
      "#dm-bk-modal .dm-bk-soon__btn--primary:hover{background:#1e40af;transform:translateY(-1px);}" +
      "#dm-bk-modal .dm-bk-soon__btn--ghost{background:#fff;color:#1d4ed8;border:1.5px solid #dbeafe;}" +
      "#dm-bk-modal .dm-bk-soon__btn--ghost:hover{background:#dbeafe;}" +
      "@keyframes dmBkFade{from{opacity:0}to{opacity:1}}" +
      "@keyframes dmBkSlide{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}" +
      "@keyframes dmBkPulse{0%,100%{box-shadow:0 12px 30px -8px rgba(29,78,216,.55)}50%{box-shadow:0 12px 40px -4px rgba(29,78,216,.75)}}" +
      "body.dm-bk-locked{overflow:hidden;}";
    document.head.appendChild(style);

    overlay = document.createElement("div");
    overlay.id = "dm-bk-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Online-Terminbuchung");
    overlay.innerHTML =
      '<div id="dm-bk-modal">' +
        '<button id="dm-bk-close" type="button" aria-label="Schließen">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
        '<div class="dm-bk-soon">' +
          '<div class="dm-bk-soon__ico" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>' +
          '</div>' +
          '<span class="dm-bk-soon__pill">Bald verfügbar</span>' +
          '<h2>Online-Terminbuchung kommt in Kürze</h2>' +
          '<p>Wir arbeiten gerade an unserem digitalen Buchungssystem – damit Sie Ihren Termin künftig in unter einer Minute selbst online vereinbaren können.</p>' +
          '<p>Bis dahin erreichen Sie uns gerne persönlich:</p>' +
          '<div class="dm-bk-soon__actions">' +
            '<a href="tel:+49740491166" class="dm-bk-soon__btn dm-bk-soon__btn--primary">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
              '07404 / 91166 anrufen' +
            '</a>' +
            '<a href="mailto:info@dr-mihai.de" class="dm-bk-soon__btn dm-bk-soon__btn--ghost">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
              'E-Mail schreiben' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove("is-open");
      document.body.classList.remove("dm-bk-locked");
    }
    overlay.querySelector("#dm-bk-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  }

  function open() {
    inject();
    overlay.classList.add("is-open");
    document.body.classList.add("dm-bk-locked");
  }

  function enhanceServiceCards() {
    var cards = document.querySelectorAll(".service-card");
    Array.prototype.forEach.call(cards, function (card) {
      if (card.querySelector(".service-card__book")) return;
      var link = document.createElement("button");
      link.type = "button";
      link.className = "service-card__book";
      link.innerHTML = 'Termin anfragen' +
        ' <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      link.setAttribute("data-dm-booking-open", "");
      card.appendChild(link);
    });
  }

  function init() {
    inject();
    enhanceServiceCards();

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-dm-booking-open],[data-dm-booking-manage],[data-dm-service-handoff],[data-dm-chat-open]");
      if (t) { e.preventDefault(); open(); }
    });

    function openFromHash() {
      var raw = (location.hash || "").toLowerCase().replace(/^#/, "");
      if (/^(termin|buchen)(?:[=\/].*)?$/.test(raw)) open();
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  }

  window.DMBooking = { open: open };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
