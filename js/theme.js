// Light and dark for every Rok site. Load it blocking in <head>, right
// after <meta name="theme-color">: it sets <html class="rk lt|dk js">
// before the first paint (a file, not inline, so a strict CSP allows it),
// then wires the header toggle (.ib.theme) and the footer switch
// ([data-theme-set="auto|light|dark"]).
//
// The choice is the `theme` cookie, else localStorage.theme, else the
// system setting. The cookie is set for the site's domain (.rok-lang.org
// on docs.rok-lang.org), so the sites under one domain share it.
(function () {
  var html = document.documentElement;
  var media = matchMedia("(prefers-color-scheme: dark)");
  var BG = { light: "#fbfbfc", dark: "#090a0d" };

  function stored() {
    var m = document.cookie.match(/(?:^|;\s*)theme=(light|dark)(?:;|$)/);
    if (m) return m[1];
    try {
      var t = localStorage.getItem("theme");
      return t === "light" || t === "dark" ? t : "auto";
    } catch (e) {
      return "auto";
    }
  }

  function isDark(t) { return t === "dark" || (t === "auto" && media.matches); }

  // The bar colour of the theme in use: the media-query pair would follow
  // the system, not the choice.
  function tint(bg) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = bg;
  }

  // ".example.org" for any host under it; none for localhost (and its
  // subdomains) or an IP.
  function domain() {
    var h = location.hostname;
    if (h.indexOf(".") < 0 || /(^|\.)localhost$/.test(h) || /^[\d.]+$/.test(h) || h.indexOf(":") >= 0) return "";
    return "; Domain=." + h.split(".").slice(-2).join(".");
  }

  function apply() {
    var t = stored();
    var dark = isDark(t);
    html.classList.toggle("dk", dark);
    html.classList.toggle("lt", !dark);
    tint(getComputedStyle(html).getPropertyValue("--bg").trim() || (dark ? BG.dark : BG.light));
    var ko = html.lang === "ko";
    var set = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < set.length; i++) set[i].setAttribute("aria-pressed", set[i].getAttribute("data-theme-set") === t ? "true" : "false");
    var tb = document.querySelectorAll(".ib.theme");
    for (var j = 0; j < tb.length; j++) {
      tb[j].setAttribute("aria-pressed", dark ? "true" : "false");
      tb[j].title = ko ? (dark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기") : (dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function choose(t) {
    try {
      if (t === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch (e) {}
    var tail = "; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    // A host-only cookie from before would shadow the shared one.
    document.cookie = "theme=" + tail + "; Max-Age=0";
    var d = domain();
    document.cookie = t === "auto" ? "theme=" + d + tail + "; Max-Age=0" : "theme=" + t + d + tail + "; Max-Age=31536000";
    apply();
  }

  function wire() {
    var set = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < set.length; i++) {
      (function (b) { b.addEventListener("click", function () { choose(b.getAttribute("data-theme-set")); }); })(set[i]);
    }
    var tb = document.querySelectorAll(".ib.theme");
    for (var j = 0; j < tb.length; j++) {
      tb[j].addEventListener("click", function () { choose(html.classList.contains("dk") ? "light" : "dark"); });
    }
    apply();
  }

  // Before the first paint: the stylesheets may not be in yet, so the
  // bar colour comes from the constants.
  try {
    var dark = isDark(stored());
    html.className = "rk " + (dark ? "dk" : "lt") + " js";
    tint(dark ? BG.dark : BG.light);
  } catch (e) {
    html.className = "rk lt js";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
  if (media.addEventListener) media.addEventListener("change", apply);
  else if (media.addListener) media.addListener(apply);
  // Back from another site of the domain, maybe with another theme.
  addEventListener("pageshow", apply);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) apply(); });
})();
