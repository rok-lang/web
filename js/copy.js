// Copy buttons of the Rok sites: a button with data-copy puts that text
// on the clipboard, one with data-copy-from="<selector>" copies that
// element's text as it is at click time. The button says "Copied" for a
// moment (Korean pages: 복사됨), or how to copy by hand where the
// clipboard is refused; a live region announces it. Load it with `defer`.
//
// It also gives the sites window.rokResize(el, change): run change(), then
// ease el's width and height from what they were to what they are now
// (rok.css motion), unless the reader asked for reduced motion.
(function () {
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");
  function resize(el, change) {
    var w0 = el.offsetWidth, h0 = el.offsetHeight;
    change();
    var w1 = el.offsetWidth, h1 = el.offsetHeight;
    if ((w0 === w1 && h0 === h1) || !el.animate || (still && still.matches)) return;
    var from = {}, to = {};
    if (w0 !== w1) { from.width = w0 + "px"; to.width = w1 + "px"; }
    if (h0 !== h1) { from.height = h0 + "px"; to.height = h1 + "px"; }
    el.animate([from, to], { duration: 180, easing: "cubic-bezier(.2,0,0,1)" });
  }
  window.rokResize = resize;

  var ko = document.documentElement.lang === "ko";
  function press() {
    var k = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘C" : "Ctrl+C";
    return ko ? k + "를 누르세요" : "Press " + k;
  }
  var live;
  function say(msg) {
    if (!live) {
      live = document.createElement("span");
      live.className = "sr-only";
      live.setAttribute("aria-live", "polite");
      document.body.appendChild(live);
    }
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 50);
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("button[data-copy], button[data-copy-from]");
    if (!b) return;
    var src = b.dataset.copyFrom ? document.querySelector(b.dataset.copyFrom) : null;
    var text = src ? src.innerText : b.dataset.copy;
    var label = b.dataset.label || b.textContent;
    b.dataset.label = label;
    var done = function (msg) {
      resize(b, function () { b.textContent = msg; });
      say(msg);
      b.classList.add("done");
      setTimeout(function () { resize(b, function () { b.textContent = label; }); b.classList.remove("done"); }, 1600);
    };
    if (!navigator.clipboard) { done(press()); return; }
    navigator.clipboard.writeText(text).then(function () { done(ko ? "복사됨" : "Copied"); }, function () { done(press()); });
  });
})();
