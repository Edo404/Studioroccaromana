/* Studio Rocca Romana — script unico, senza dipendenze */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    var setOpen = function (open) {
      root.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!root.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-header")) setOpen(false);
    });
  }

  /* ---------- Header compatto allo scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Animazioni in ingresso allo scroll ---------- */
  var targets = document.querySelectorAll(".card, .roster");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Consenso cookie + Google Analytics ----------
     GA viene caricato SOLO dopo "Accetta". "Rifiuta" e la × hanno lo stesso
     peso; la scelta vale 6 mesi e si può cambiare da "Preferenze cookie". */
  var GA_ID = "G-EJW26R73HE";
  var KEY = "srr-consent";
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 mesi
  var banner = document.querySelector(".cookie-banner");

  function readConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && typeof c.analytics === "boolean" && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) { /* storage bloccato o valore non valido */ }
    return null;
  }

  function saveConsent(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }));
      localStorage.removeItem("cookieBannerDisplayed"); // chiave del vecchio banner
    } catch (e) { /* ignora */ }
  }

  function loadAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function removeAnalyticsCookies() {
    var host = location.hostname;
    var domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^_ga/.test(name)) {
        domains.forEach(function (d) {
          document.cookie = name + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  // un solo timer alla volta: riaprire il banner annulla una chiusura in corso e viceversa
  var bannerTimer = null;

  function showBanner(delay) {
    if (!banner) return;
    clearTimeout(bannerTimer);
    banner.hidden = false;
    bannerTimer = setTimeout(function () { banner.classList.add("is-visible"); }, delay || 30);
  }

  function hideBanner() {
    clearTimeout(bannerTimer);
    banner.classList.remove("is-visible");
    bannerTimer = setTimeout(function () { banner.hidden = true; }, 600);
  }

  var consent = readConsent();
  if (consent && consent.analytics) loadAnalytics();
  else if (!consent) showBanner(900);

  if (banner) {
    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var accepted = btn.getAttribute("data-consent") === "accept";
      var wasLoaded = !!window.gtag;
      saveConsent(accepted);
      hideBanner();
      if (accepted) {
        loadAnalytics();
      } else if (wasLoaded) {
        // consenso revocato: elimina i cookie GA e ricarica senza lo script
        removeAnalyticsCookies();
        location.reload();
      }
    });
  }

  document.querySelectorAll("[data-cookie-prefs]").forEach(function (b) {
    b.addEventListener("click", function () { showBanner(); });
  });
})();
