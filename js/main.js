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
  var targets = document.querySelectorAll(".reveal, .roster");
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

  /* ---------- Banner cookie ---------- */
  var KEY = "cookieBannerDisplayed";
  var banner = document.querySelector(".cookie-banner");
  var storage = null;
  try { storage = window.localStorage; } catch (e) { /* storage bloccato */ }

  if (banner && !(storage && storage.getItem(KEY))) {
    banner.hidden = false;
    setTimeout(function () { banner.classList.add("is-visible"); }, 1200);
    banner.querySelector(".cookie-btn").addEventListener("click", function () {
      banner.classList.remove("is-visible");
      try { storage && storage.setItem(KEY, "true"); } catch (e) { /* ignora */ }
      setTimeout(function () { banner.hidden = true; }, 600);
    });
  }

  /* ---------- iubenda (link Privacy Policy), caricato dopo il load ---------- */
  if (document.querySelector(".iubenda-embed")) {
    window.addEventListener("load", function () {
      var s = document.createElement("script");
      s.src = "https://cdn.iubenda.com/iubenda.js";
      s.async = true;
      document.body.appendChild(s);
    });
  }
})();
