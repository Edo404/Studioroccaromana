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

  /* ---------- Intro a schermo intero (Artisti / Intrattenimento) ----------
     L'animazione è tutta in CSS; qui basta poterla chiudere con un clic o Esc
     e toglierla dal layout a fine corsa. */
  var intro = document.querySelector(".intro");
  if (intro) {
    var endIntro = function () { intro.classList.add("is-done"); };
    intro.addEventListener("click", endIntro);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") endIntro(); });
    setTimeout(endIntro, 1600);
  }

  /* ---------- Header compatto allo scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header && "IntersectionObserver" in window) {
    // sentinella in cima alla pagina: quando esce dalla vista l'header diventa pieno
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none";
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      root.classList.toggle("scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Griglia: l'ultima riga (da 4) si ingrandisce verso l'alto ---------- */
  document.querySelectorAll(".cards").forEach(function (list) {
    var items = list.querySelectorAll(".card");
    var rows = Math.ceil(items.length / 4);
    if (rows < 2) return;
    for (var i = (rows - 1) * 4; i < items.length; i++) items[i].classList.add("is-last-row");
  });

  /* ---------- Home: il disco si gira sul Lato A / Lato B ----------
     Passando (o cliccando) su una copertina il vinile fa un mezzo giro e cambia
     colore: Artisti = viola, Intrattenimento = rosso. Il colore cambia a metà
     giro, quando il disco è di taglio. Il clic aspetta la fine del giro. */
  var hero = document.querySelector(".hero[data-side]");
  var flipEl = hero && hero.querySelector(".vinyl-flip");
  if (flipEl) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var flipping = false, pendingSide = null, pendingGo = null;
    var setSide = function (side, done) {
      if (flipping) { pendingSide = side; pendingGo = done || pendingGo; return; }
      if (hero.getAttribute("data-side") === side) { if (done) done(true); return; }
      if (reduceMotion) { hero.setAttribute("data-side", side); if (done) done(false); return; }
      flipping = true;
      flipEl.classList.remove("is-flipping");
      void flipEl.offsetWidth;                       // riavvia l'animazione
      flipEl.classList.add("is-flipping");
      setTimeout(function () { hero.setAttribute("data-side", side); }, 350);
      setTimeout(function () {
        flipEl.classList.remove("is-flipping");
        flipping = false;
        if (done) done(false);
        if (pendingSide) { var s = pendingSide, g = pendingGo; pendingSide = pendingGo = null; setSide(s, g); }
      }, 700);
    };
    Array.prototype.forEach.call(hero.querySelectorAll(".side[data-side]"), function (a) {
      var side = a.getAttribute("data-side");
      a.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") setSide(side); });
      a.addEventListener("focus", function () { setSide(side); });
      a.addEventListener("click", function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        var href = a.href;
        setSide(side, function (already) { setTimeout(function () { location.href = href; }, already ? 280 : 120); });
      });
    });
    window.addEventListener("pageshow", function () { flipEl.classList.remove("is-flipping"); flipping = false; });
  }

  /* ---------- Fila artisti in home: scorre da sola ed è trascinabile ----------
     Si lavora sullo scroll orizzontale nativo (dito e trackpad funzionano da soli);
     il mouse si trascina con i pointer events. L'elenco è duplicato (copia
     aria-hidden) e la posizione viene riportata di mezza lunghezza, quindi il
     giro non ha stacchi. Dopo un gesto l'autoscorrimento riparte da solo.
     Con "riduci animazioni" non parte: resta una fila scorrevole a mano. */
  var crate = document.querySelector(".crate-list");
  if (crate && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    Array.prototype.slice.call(crate.children).forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      var a = copy.querySelector("a");
      if (a) a.setAttribute("tabindex", "-1");
      crate.appendChild(copy);
    });
    crate.classList.add("is-auto");
    crate.addEventListener("dragstart", function (e) { e.preventDefault(); });

    var SPEED = 65;                 // px al secondo
    var half = 0, pos = 0, last = 0, busyUntil = 0, hovering = false, down = false, moved = 0, lastX = 0, inView = true;

    var measure = function () {
      var n = crate.children.length / 2;
      half = crate.children[n].offsetLeft - crate.children[0].offsetLeft;
    };
    var normalize = function () {   // tiene lo scroll dentro una finestra larga "half": il contenuto è periodico
      var max = crate.scrollWidth - crate.clientWidth;
      var lo = Math.max(0, (max - half) / 2);
      if (half <= 0 || max < half) return;
      var sl = crate.scrollLeft;
      if (sl < lo) { crate.scrollLeft = sl + half; pos = crate.scrollLeft; }
      else if (sl >= lo + half) { crate.scrollLeft = sl - half; pos = crate.scrollLeft; }
    };
    var start = function () {
      measure();
      // parte dalla prima foto: la seconda serie coincide con la prima
      pos = crate.scrollLeft = crate.children[crate.children.length / 2].offsetLeft - parseFloat(getComputedStyle(crate).paddingLeft || 0);
      normalize();
    };

    var busy = function (ms) { busyUntil = performance.now() + (ms || 1500); };

    crate.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
    crate.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hovering = false; });
    crate.addEventListener("focusin", function () { hovering = true; });
    crate.addEventListener("focusout", function () { hovering = false; });
    crate.addEventListener("scroll", normalize, { passive: true });   // vale anche per dito, tastiera e focus
    crate.addEventListener("wheel", function () { busy(); }, { passive: true });
    crate.addEventListener("touchstart", function () { busy(3000); }, { passive: true });
    crate.addEventListener("touchend", function () { busy(); }, { passive: true });

    // trascinamento col mouse: il mouse viene "catturato" solo dopo 6 px di
    // movimento, altrimenti il clic non arriverebbe più al link sotto il cursore
    var dragging = false, pid = null, startX = 0;
    crate.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; dragging = false; moved = 0; lastX = startX = e.clientX; pid = e.pointerId;
    });
    crate.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      if (!dragging) {
        if (moved <= 5) return;
        dragging = true;
        try { crate.setPointerCapture(pid); } catch (err) { /* ignora */ }
        crate.classList.add("is-dragging");
        dx = e.clientX - startX;     // recupera il tratto fatto prima della soglia
      }
      crate.scrollLeft -= dx;
      pos = crate.scrollLeft;
      normalize();
      busy();
    });
    var up = function () {
      if (!down) return;
      down = false;
      if (dragging) {
        dragging = false;
        try { crate.releasePointerCapture(pid); } catch (err) { /* ignora */ }
        crate.classList.remove("is-dragging");
      }
      busy();
    };
    crate.addEventListener("pointerup", up);
    crate.addEventListener("pointercancel", up);
    // dopo un trascinamento non si deve aprire il link sotto il mouse
    crate.addEventListener("click", function (e) {
      if (moved > 5) { e.preventDefault(); e.stopPropagation(); moved = 0; }
    }, true);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }).observe(crate);
    }

    var tick = function (now) {
      var dt = Math.min(now - last, 50);
      last = now;
      if (inView && half > 0) {
        var cur = crate.scrollLeft;
        if (Math.abs(cur - pos) > 1.5) {          // qualcuno ha scrollato (dito, inerzia, tastiera)
          pos = cur;
          busy(1200);
        }
        if (!down && !hovering && now > busyUntil) {
          pos += SPEED * dt / 1000;
          crate.scrollLeft = pos;
          normalize();
        }
      }
      requestAnimationFrame(tick);
    };

    var go = function () {
      start();
      last = performance.now();
      requestAnimationFrame(tick);
    };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go);
    window.addEventListener("resize", function () { measure(); });
  }

  /* ---------- Animazioni in ingresso allo scroll ---------- */
  var targets = document.querySelectorAll(".card, .roster, .reveal");
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
