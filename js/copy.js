// Copy buttons of the Rok sites: a button with data-copy puts that text
// on the clipboard, one with data-copy-from="<selector>" copies that
// element's text as it is at click time. The button says "Copied" for a
// moment (Korean pages: 복사됨), or how to copy by hand where the
// clipboard is refused; a live region announces it. Load it with `defer`.
(function () {
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
      b.textContent = msg;
      say(msg);
      b.classList.add("done");
      setTimeout(function () { b.textContent = label; b.classList.remove("done"); }, 1600);
    };
    if (!navigator.clipboard) { done(press()); return; }
    navigator.clipboard.writeText(text).then(function () { done(ko ? "복사됨" : "Copied"); }, function () { done(press()); });
  });
})();
