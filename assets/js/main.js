/* Donkey Taxis — small vanilla enhancements.
   Header, menu, active nav, split-flap board, services explorer,
   form validation + sending state, footer car, mobile bar. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- year */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- hero load moment (runs once) */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("loaded"); });
  });
  var hp = $("[data-hero-photo]");
  if (hp) setTimeout(function () { hp.classList.add("done"); }, 1400);

  /* ---------- header shrink + mobile bar */
  var header = $("[data-header]");
  var mbar = $("[data-mbar]");
  var heroEl = $("#top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (mbar && heroEl) mbar.classList.toggle("show", y > heroEl.offsetHeight * 0.45);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu */
  var burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() {
    if (!burger) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    mnav.classList.remove("open");
  }
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mnav.classList.toggle("open", open);
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    document.addEventListener("click", function (e) {
      if (mnav.classList.contains("open") && !mnav.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ---------- active section in nav */
  var navLinks = $$("[data-nav]");
  if ("IntersectionObserver" in window && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- split-flap engine (the recurring device) */
  var GLYPHS = "ABCDEFGHIJKLMNOPRSTUVWY";
  function Flap(el, cells) {
    this.el = el;
    this.n = cells;
    this.cells = [];
    el.textContent = "";
    for (var i = 0; i < cells; i++) {
      var c = document.createElement("span");
      c.className = "flap-c is-blank";
      c.textContent = " ";
      el.appendChild(c);
      this.cells.push(c);
    }
  }
  Flap.prototype.set = function (word, opts) {
    opts = opts || {};
    var w = word.toUpperCase();
    var pad = Math.max(0, this.n - w.length);
    var text = w + new Array(pad + 1).join(" ");
    var self = this;
    this.cells.forEach(function (c, i) {
      var ch = text.charAt(i) || " ";
      var final = function () {
        c.textContent = ch === " " ? " " : ch;
        c.classList.toggle("is-blank", ch === " ");
        if (opts.lit) c.classList.toggle("is-lit", ch !== " "); else c.classList.remove("is-lit");
      };
      if (reduced || opts.instant) { final(); return; }
      var spins = 2 + Math.floor(Math.random() * 4);
      var t = i * 38;
      for (var s = 0; s < spins; s++) {
        (function (s) {
          setTimeout(function () {
            c.textContent = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
            c.classList.remove("is-blank");
            c.classList.remove("flip"); void c.offsetWidth; c.classList.add("flip");
          }, t + s * 70);
        })(s);
      }
      setTimeout(function () {
        final();
        c.classList.remove("flip"); void c.offsetWidth; c.classList.add("flip");
      }, t + spins * 70);
    });
  };

  // hero destination strip: flips in on load, then cycles while on screen
  var heroFlapEl = $("[data-flap]");
  if (heroFlapEl) {
    var words = heroFlapEl.dataset.words.split("|");
    var remarks = heroFlapEl.dataset.remarks.split("|");
    var remarkEl = $("[data-hero-remark]");
    var hf = new Flap(heroFlapEl, +heroFlapEl.dataset.cells || 11);
    var idx = 0, timer = null, visible = true;
    hf.set(words[0], { instant: true });
    if (!reduced) {
      hf.set("", { instant: true });
      setTimeout(function () { hf.set(words[0]); }, 650);
      var step = function () {
        if (!visible || document.hidden) return;
        idx = (idx + 1) % words.length;
        hf.set(words[idx]);
        if (remarkEl) {
          remarkEl.style.opacity = "0";
          setTimeout(function () { remarkEl.textContent = remarks[idx]; remarkEl.style.opacity = "1"; }, 380);
        }
      };
      if (remarkEl) remarkEl.style.transition = "opacity .25s ease";
      timer = setInterval(step, 3600);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(heroFlapEl);
      }
    }
  }

  // form header strip
  var formFlapEl = $("[data-form-flap]");
  var ff = null;
  if (formFlapEl) { ff = new Flap(formFlapEl, +formFlapEl.dataset.cells || 7); ff.set("READY", { instant: true }); }

  /* ---------- services explorer (tabs; on phones the panel opens under its row) */
  var explorer = $("[data-explorer]");
  if (explorer) {
    var tabs = $$("[data-tab]", explorer);
    var panels = $$("[data-panel]", explorer);
    var panelHome = $("[data-panels]", explorer);
    var mq = window.matchMedia("(min-width: 1024px)");
    function place(active) {
      var panel = $('[data-panel="' + active + '"]', explorer);
      var tab = $('[data-tab="' + active + '"]', explorer);
      if (mq.matches) { panels.forEach(function (p) { if (p.parentNode !== panelHome) panelHome.appendChild(p); p.classList.remove("m-panel"); }); }
      else if (panel && tab && tab.nextElementSibling !== panel) {
        tab.insertAdjacentElement("afterend", panel);
        panel.classList.add("m-panel");
      }
    }
    function select(key, focus) {
      tabs.forEach(function (t) {
        var on = t.dataset.tab === key;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p) { p.classList.toggle("hidden", p.dataset.panel !== key); });
      place(key);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.dataset.tab); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, j = null;
        if (k === "ArrowDown" || k === "ArrowRight") j = (i + 1) % tabs.length;
        if (k === "ArrowUp" || k === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        if (k === "Home") j = 0;
        if (k === "End") j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j].dataset.tab, true); }
      });
    });
    var current = function () { var a = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0]; return a ? a.dataset.tab : "airport"; };
    mq.addEventListener ? mq.addEventListener("change", function () { place(current()); }) : mq.addListener(function () { place(current()); });
    select("airport");

    // the board's journey names flip in once when it scrolls into view
    var boardWords = $$("[data-board-word]", explorer);
    if (!reduced && "IntersectionObserver" in window) {
      var bio = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return;
        bio.disconnect();
        boardWords.forEach(function (w, n) {
          var target = w.dataset.boardWord, len = target.length, k = 0;
          setTimeout(function () {
            var iv = setInterval(function () {
              k++;
              var out = "";
              for (var x = 0; x < len; x++) {
                var ch = target.charAt(x);
                out += (x < k || ch === " ") ? ch : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
              }
              w.textContent = out;
              if (k >= len) clearInterval(iv);
            }, 32);
          }, n * 140);
        });
      }, { threshold: 0.35 });
      bio.observe($("[data-board]", explorer));
    }
  }

  /* ---------- "book this" buttons preselect the journey */
  var select$ = $("#f-service");
  $$("[data-pick]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!select$) return;
      select$.value = b.dataset.pick;
      var f = select$.closest(".field"); if (f) { f.classList.remove("is-invalid"); }
    });
  });

  /* ---------- scroll-driven fallback for the ticket car */
  if (!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"))) root.classList.add("no-sda");

  /* ---------- footer: the car pulls up at the door */
  var footer = $("[data-footer]");
  if (footer && "IntersectionObserver" in window && !reduced) {
    var fio = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { footer.classList.add("arrive"); fio.disconnect(); }
    }, { threshold: 0.25 });
    fio.observe(footer);
  } else if (footer) footer.classList.add("arrive");

  /* ---------- form */
  var form = $("[data-form]");
  if (form) {
    var fields = $$(".field", form);
    var check = function (field) {
      var input = $("input, select, textarea", field);
      var ok = input.checkValidity() && String(input.value).trim() !== "";
      field.classList.toggle("is-invalid", !ok);
      field.classList.toggle("is-valid", ok && input.tagName === "INPUT");
      input.setAttribute("aria-invalid", String(!ok));
      return ok;
    };
    fields.forEach(function (field) {
      var input = $("input, select, textarea", field);
      var err = $(".err", field);
      if (err) { err.id = input.id + "-err"; input.setAttribute("aria-describedby", err.id); }
      input.addEventListener("blur", function () { if (input.value) check(field); });
      input.addEventListener("input", function () { if (field.classList.contains("is-invalid")) check(field); });
      input.addEventListener("change", function () { if (field.classList.contains("is-invalid")) check(field); });
    });
    form.addEventListener("submit", function (e) {
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) {
        e.preventDefault();
        $("input, select, textarea", bad[0]).focus();
        if (ff) ff.set("CHECK", { lit: true });
        return;
      }
      var btn = $("[data-submit]", form);
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      $("[data-submit-label]", form).textContent = "Sending";
      btn.insertAdjacentHTML("afterbegin", '<span class="spinner" aria-hidden="true"></span>');
      if (ff) ff.set("SENDING");
    });
  }

  /* ---------- light reveal for a few blocks only */
  var rises = $$(".rise");
  if (rises.length && "IntersectionObserver" in window && !reduced) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    rises.forEach(function (r) { rio.observe(r); });
  } else rises.forEach(function (r) { r.classList.add("in"); });
})();
