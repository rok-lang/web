// Copy buttons of the Rok sites: a button with data-copy puts that text
// on the clipboard and says "Copied" for a moment (Korean pages: 복사됨),
// or how to copy by hand where the clipboard is refused. Load it with
// `defer`.
(function () {
  var ko = document.documentElement.lang === "ko";
  function press() {
    var k = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘C" : "Ctrl+C";
    return ko ? k + "를 누르세요" : "Press " + k;
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("button[data-copy]");
    if (!b) return;
    var label = b.dataset.label || b.textContent;
    b.dataset.label = label;
    var done = function (text) {
      b.textContent = text;
      b.classList.add("done");
      setTimeout(function () { b.textContent = label; b.classList.remove("done"); }, 1600);
    };
    if (!navigator.clipboard) { done(press()); return; }
    navigator.clipboard.writeText(b.dataset.copy).then(function () { done(ko ? "복사됨" : "Copied"); }, function () { done(press()); });
  });
})();
