/* thanks.html + 404.html: flip the status board, then the car pulls up at the door */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = "ABCDEFGHIJKLMNOPRSTUVWY";
  var el = document.querySelector("[data-flap-once]");
  if (el) {
    var word = el.getAttribute("data-flap-once"), n = +el.getAttribute("data-cells") || word.length;
    el.textContent = "";
    for (var i = 0; i < n; i++) {
      (function (i) {
        var c = document.createElement("span"), ch = word.charAt(i) || " ";
        c.className = "flap-c";
        el.appendChild(c);
        var done = function () { c.textContent = ch === " " ? " " : ch; c.classList.toggle("is-blank", ch === " "); c.classList.toggle("is-lit", ch !== " "); };
        if (reduced) return done();
        c.textContent = " "; c.classList.add("is-blank");
        var spins = 3 + Math.floor(Math.random() * 4);
        for (var s = 0; s <= spins; s++) (function (s) {
          setTimeout(function () {
            if (s === spins) done(); else { c.textContent = G.charAt(Math.floor(Math.random() * G.length)); c.classList.remove("is-blank"); }
            c.classList.remove("flip"); void c.offsetWidth; c.classList.add("flip");
          }, 300 + i * 45 + s * 75);
        })(s);
      })(i);
    }
  }
  var f = document.querySelector("[data-footer]");
  if (f) setTimeout(function () { f.classList.add("arrive"); }, reduced ? 0 : 400);
})();
