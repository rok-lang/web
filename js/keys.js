// The search shortcut of the Rok sites: `/`, Ctrl+K or Cmd+K focuses the
// search field, the input that names them in aria-keyshortcuts. Load it
// with `defer` on pages with a search field.
document.addEventListener("keydown", function (ev) {
  var q = document.querySelector("input[aria-keyshortcuts]");
  if (!q) return;
  var key = ev.key || "";
  var typing = ev.target.closest && ev.target.closest("input, textarea, select, [contenteditable]");
  var slash = key === "/" && !typing && !ev.metaKey && !ev.ctrlKey && !ev.altKey;
  // ev.code too: with Caps Lock or a Korean IME the key is "K" or "ㅏ".
  var k = (ev.code === "KeyK" || key.toLowerCase() === "k") && (ev.metaKey || ev.ctrlKey) && !ev.altKey && !ev.shiftKey;
  if (!slash && !k) return;
  ev.preventDefault();
  // A search box that opens on click (the docs' narrow header) opens first.
  var box = q.closest(".search");
  if (box) box.click();
  q.focus();
  q.select();
});
