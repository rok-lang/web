# Design tokens

`css/rok.css` is the single source of colour, type and component styles for rok-lang.org, docs.rok-lang.org, rokstones.io and playground.rok-lang.org. This document explains how the tokens work, what each one is for, and the rules a site must follow when it uses them.

## Theming model

Every page has one root element with the class `rk` and exactly one of `lt` (light) or `dk` (dark):

```html
<html class="rk lt">
```

`.rk` defines every colour token with its light value and sets `color-scheme: light`; `.rk.dk` redefines the same tokens with their dark values and sets `color-scheme: dark`. A theme is therefore one class, not a second stylesheet.

The tokens are plain hex values, not `light-dark()`. A browser without `light-dark()` (Safari and iOS before 17.5, so every in-app browser on those iOS versions, Samsung Internet before 27, Chrome before 123, Firefox before 120) treats such a custom property as invalid at computed time, which leaves the whole page without colours; a fallback declaration cannot help, because custom properties accept any value. Two blocks of plain values work everywhere.

Light and dark are two separately designed palettes, not an inversion of each other:

| Role | Light | Dark | Why |
|---|---|---|---|
| Primary button | ink on paper (`--btn` = `--ink`) | the pink of the mark | pink on white has too little contrast to carry white text |
| Accent `--acc` | deep rose, L 0.52 | pastel pink, L 0.83 | the mark colour itself is 1.75:1 on the light ground |
| Terminal `--term` | white | near black | output reads as part of the page in both themes |
| Neutrals | cool white, hue 286 | blue black, hue 270 | dark greys with a slight blue read as deeper and less muddy |

### Choosing the theme

`js/theme.js` does it for every site:

1. If the visitor chose a theme, the `theme` cookie holds `light` or `dark`. It is set for the site's domain (`Domain=.rok-lang.org` on any `*.rok-lang.org` host, from `location.hostname`; host-only on `localhost` and IP addresses), so rok-lang.org, the docs and the playground share it.
2. Else `localStorage.theme` holds `"light"` or `"dark"`.
3. Else it follows `prefers-color-scheme`.

Load it blocking in `<head>`, right after `<meta name="theme-color">`, so it sets `<html class="rk lt js">` or `rk dk js` and the bar colour before the first paint. It is a file, not an inline script, so a CSP without `'unsafe-inline'` allows it:

```html
<meta name="theme-color" content="#fbfbfc">
<script src="/theme.js"></script>
```

Once the page is parsed it wires two controls, whose markup `chrome.rok` writes:

- the header toggle, `<button class="ib theme" aria-label="Dark theme" aria-pressed="false">` with a moon and a sun icon. Its name stays "Dark theme"; `aria-pressed` says whether dark is on and the `title` names the action (`Switch to light theme`). A click flips to the other theme; when that is the system's own theme it stores System instead of the theme, so the two controls never disagree and the footer switch shows System again.
- the footer switch, `.seg` with three buttons `data-theme-set="auto"`, `"light"` and `"dark"` (System, Light, Dark), the current one `aria-pressed="true"`.

A choice writes the cookie and `localStorage.theme` (System deletes both) and swaps `lt` / `dk`; `<meta name="theme-color">` follows the resolved `--bg`. The page follows the system setting while on System, and re-reads the choice when it is shown again (another site of the domain may have changed it). Nothing else changes: every colour follows from the class. Without scripts the class stays `rk lt` and both controls are hidden (`html.rk:not(.js)`).

## Colour

Colours are designed in OKLCH, `oklch(L C h)` with lightness `L` from 0 to 1, chroma `C`, and hue `h` in degrees, and shipped as their sRGB hex rendering. Lightness in OKLCH is perceptual, so two tokens with the same `L` look equally light whatever their hue, which is what lets the pink, sky, green and amber of the syntax sit at the same visual weight. Neutrals carry a chroma of 0.002 to 0.015 so they are faintly cool, never flat grey.

### Roles

| Token | Use it for | Never use it for |
|---|---|---|
| `--bg` | the page ground | cards on the page (use `--panel`) |
| `--bg-2` | sidebars, the footer, hover rows, the active nav item | text |
| `--panel` | inputs, popovers, raised panels on `--bg` | the page ground |
| `--code` | code blocks and inline code | prose |
| `--term` / `--term-ink` | terminal transcripts and program output | code you can edit |
| `--ink` | body text and headings | |
| `--ink-2` | secondary text: leads, descriptions, inactive nav | long body text |
| `--ink-3` | meta: dates, labels, counts, captions | anything a reader must read to proceed |
| `--line` | hairlines between regions, table rules | control borders |
| `--line-2` | decorative borders of controls whose text or icon names them (buttons, `.ib`, `.kbd`, `.chip`), separators inside the brand | form field edges (use `--field-line`) |
| `--field-line` | the edge of a form field: `.search`, inputs, selects, textareas, and the pressed state of `.seg`; 3:1 or more on every ground (WCAG 1.4.11) | hairlines and decoration |
| `--acc` | the active state: current page, selected tab, highlighted line | links, decoration |
| `--acc-bg` | ground behind an active sidebar item and help callouts | headings or labels (no tinted pills behind text) |
| `--link` | links, and types in prose | buttons |
| `--btn` / `--btn-ink` | the one primary action on a screen | secondary actions (use `.btn-2`) |
| `--note-bg` / `--note-line` / `--note-ink` | note callouts and "Added in" markers | general emphasis |
| `--mark` | the Rok and rokstones marks | text or focus rings (1.75:1 on the light ground) |
| `--focus` | the focus ring: deep rose on light, the mark pink on dark | anything else |

### Values

Each cell is the OKLCH design value and the hex that `rok.css` ships.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `oklch(0.988 0.002 286)` #fbfbfc | `oklch(0.145 0.006 270)` #090a0d |
| `--bg-2` | `oklch(0.965 0.003 286)` #f3f3f5 | `oklch(0.175 0.007 270)` #0f1014 |
| `--panel` | `#ffffff` #ffffff | `oklch(0.195 0.008 270)` #131519 |
| `--code` | `oklch(0.972 0.003 286)` #f5f5f8 | `oklch(0.17 0.007 270)` #0e0f13 |
| `--term` | `#ffffff` #ffffff | `oklch(0.11 0.005 270)` #040406 |
| `--ink` | `oklch(0.2 0.01 275)` #15161b | `oklch(0.95 0.005 275)` #edeef2 |
| `--ink-2` | `oklch(0.44 0.015 275)` #50525b | `oklch(0.74 0.012 275)` #a8aab3 |
| `--ink-3` | `oklch(0.53 0.015 275)` #696b75 | `oklch(0.6 0.012 275)` #7e8088 |
| `--line` | `oklch(0.92 0.004 286)` #e4e4e7 | `oklch(0.25 0.008 270)` #202126 |
| `--line-2` | `oklch(0.86 0.006 286)` #d0d0d5 | `oklch(0.32 0.01 270)` #313338 |
| `--field-line` | `oklch(0.62 0.012 286)` #85858d | `oklch(0.52 0.012 270)` #666970 |
| `--acc` | `oklch(0.52 0.19 357)` #b6226a | `oklch(0.83 0.1 350)` #f9add0 |
| `--acc-bg` | `oklch(0.96 0.025 350)` #ffebf4 | `oklch(0.24 0.045 350)` #2f1622 |
| `--link` | `oklch(0.5 0.13 240)` #006aa5 | `oklch(0.83 0.1 225)` #7ad5f8 |
| `--btn` | `oklch(0.2 0.01 275)` #15161b | `oklch(0.83 0.1 350)` #f9add0 |
| `--btn-ink` | `#ffffff` #ffffff | `oklch(0.22 0.06 350)` #2e0d1e |
| `--note-bg` | `oklch(0.97 0.02 230)` #e8f8ff | `oklch(0.2 0.03 235)` #071822 |
| `--note-line` | `oklch(0.88 0.05 230)` #b7def3 | `oklch(0.32 0.05 235)` #163749 |
| `--note-ink` | `oklch(0.45 0.12 240)` #005b90 | `oklch(0.83 0.1 225)` #7ad5f8 |
| `--k` | `oklch(0.52 0.19 357)` #b6226a | `oklch(0.83 0.1 350)` #f9add0 |
| `--t` | `oklch(0.5 0.13 240)` #006aa5 | `oklch(0.83 0.1 225)` #7ad5f8 |
| `--s` | `oklch(0.5 0.12 140)` #3a732c | `oklch(0.83 0.13 135)` #a2da83 |
| `--n` | `oklch(0.54 0.13 65)` #a15b00 | `oklch(0.84 0.12 80)` #f4c26a |
| `--c` | `oklch(0.54 0.012 275)` #6c6e76 | `oklch(0.6 0.012 275)` #7e8088 |
| `--cli-sky` | `oklch(0.5 0.13 240)` #006aa5 | `#38bdf8` #38bdf8 |
| `--cli-red` | `#c42b2b` #c42b2b | `#ff6b6b` #ff6b6b |
| `--cli-amber` | `#a16207` #a16207 | `#e0b057` #e0b057 |

`--mark` is `#f9a8d4` in both themes. It is never themed: the marks look the same everywhere.

### Contrast

Every text token meets WCAG 2.x AA (4.5:1) on every surface it is used on, in both themes. Ratios are computed from the sRGB rendering with the WCAG relative luminance formula:

| Text | On | Light | Dark |
|---|---|---|---|
| `--ink` | `--bg` | 17.50 | 17.10 |
| `--ink-2` | `--bg` | 7.52 | 8.57 |
| `--ink-3` | `--bg` | 5.11 | 5.01 |
| `--ink-3` | `--bg-2` | 4.78 | 4.80 |
| `--ink-2` | `--bg-2` | 7.03 | 8.22 |
| `--link` | `--bg` | 5.62 | 12.01 |
| `--acc` | `--bg` | 5.92 | 11.23 |
| `--acc` | `--acc-bg` | 5.40 | 9.48 |
| `--btn-ink` | `--btn` | 18.11 | 10.00 |
| `--note-ink` | `--note-bg` | 6.63 | 10.95 |
| `--k` | `--code` | 5.65 | 10.85 |
| `--t` | `--code` | 5.36 | 11.60 |
| `--s` | `--code` | 5.27 | 11.77 |
| `--n` | `--code` | 4.82 | 11.59 |
| `--c` | `--code` | 4.67 | 4.84 |
| `--cli-sky` | `--term` | 5.81 | 9.55 |
| `--cli-red` | `--term` | 5.63 | 7.37 |
| `--cli-amber` | `--term` | 4.92 | 10.25 |
| `--ink-3` | `--term` | 5.29 | 5.18 |

Non-text contrast (WCAG 1.4.11) asks 3:1 of the edge that identifies a form field. `--line-2` is a hairline (1.39 to 1.57:1) and cannot carry that, so fields use `--field-line`:

| Edge | On | Light | Dark |
|---|---|---|---|
| `--field-line` | `--bg` | 3.54 | 3.60 |
| `--field-line` | `--bg-2` | 3.30 | 3.46 |
| `--field-line` | `--panel` | 3.66 | 3.32 |
| `--field-line` | `--code` | 3.36 | 3.48 |
| `--focus` | `--bg` | 5.92 | 10.9 |

When a token changes, recompute these tables. A text value below 4.5:1, or a field edge below 3:1, on a surface it is used on is a bug.

### Mixed colours

`color-mix(in oklch, ...)` derives a colour from existing tokens instead of adding a new one. It sits inside `@supports (color: color-mix(in oklch, red, blue))`, because a `var()` inside an unsupported `color-mix()` fails at computed time too; without it the highlighted line falls back to `--acc-bg` and the help callout border to `--acc`:

- highlighted code line: `--acc` at 10% over the code ground, with a 2px `--acc` rule on the left
- help callout border: `--acc` at 35% into `--line`

## Syntax and terminal colours

Code highlighting uses five tokens, matching the classes the `rok-syntax` stone emits:

| Class | Token | Tokens it covers |
|---|---|---|
| `.k` | `--k` | keywords (`fn`, `let`, `match`, `try`) |
| `.t` | `--t` | types (`i32`, `str`, `List`) |
| `.s` | `--s` | strings and f-strings |
| `.n` | `--n` | numbers |
| `.c` | `--c` | comments |

`--k` equals `--acc` and `--t` equals `--link`, so code and prose share one palette.

Terminal transcripts (`.term`) reproduce rokc's own colours. On a dark terminal they are rokc's bright values; on the white light-mode terminal each one is darkened to pass contrast:

| Class | Token | rokc meaning |
|---|---|---|
| `.v`, `.g` | `--cli-sky` | status verbs (`Compiling`, `Finished`), the `-->` and `|` gutter |
| `.e` | `--cli-red` | `error[E...]` |
| `.w` | `--cli-amber` | `warning[E...]` |
| `.h` | `--acc` | `help:` |
| `.p`, `.d` | `--ink-3` | the `$` prompt, dimmed text |

## Type

### Families

| Variable | Stack | Features |
|---|---|---|
| `--sans` | Geist, Geist Fallback, Geist Fallback Roboto, system-ui | `ss01`, `cv11` |
| `--mono` | Geist Mono, Geist Mono Fallback, Geist Mono Fallback Consolas, ui-monospace | `zero` (slashed zero), `ss01` |

The Fallback families are local fonts (Arial or Helvetica, Roboto, Menlo, Consolas; Liberation on Linux) with `size-adjust` and ascent / descent overrides measured against Geist, so text keeps its line breaks when the webfonts swap in. They cover Latin only; other scripts fall through to the system's fonts.

Korean text (`:lang(ko)` or `.ko`) switches to Pretendard first, with a line height of 1.75 and tracking of -0.005em: Hangul needs more leading than Latin and looks loose at Geist's tracking. Under `:lang(ko)` both stacks also gain Pretendard Variable after Geist, so `var(--sans)` and `var(--mono)` render Hangul in it. Code inside Korean text (`pre`, `code`, `kbd`, `.mono` and everything in `pre` / `code`) keeps the mono face, no tracking and its own line height: 22px in code blocks, 21px in terminals. Pretendard is for Korean only: a Hangul word in an English page needs `lang="ko"` on its element to get it.

### Webfonts

The kit hosts the fonts itself; no page asks Google Fonts or jsDelivr for anything. The files live in `assets/fonts/` here (`web/assets/fonts` in a site, `kit::FONTS_DIR`) and are published under `fonts/` beside `rok.css`. They are not built into the program like `kit::files()`: 3 MB of `include_bytes!` makes rokc crawl. The public names:

| Public path | What | Source |
|---|---|---|
| `fonts/Geist-Variable.woff2` | Geist, weights 100 to 900 | npm `geist` 1.8.2, OFL-1.1 |
| `fonts/GeistMono-Variable.woff2` | Geist Mono, weights 100 to 900 | npm `geist` 1.8.2, OFL-1.1 |
| `fonts/pretendard.css` | 92 `@font-face` rules for `Pretendard Variable`, each with its `unicode-range` | npm `pretendard` 1.3.9, OFL-1.1, the dynamic subset |
| `fonts/pretendard/PretendardVariable.subset.N.woff2` | the 92 slices; a browser fetches only those its text needs | same |
| `fonts/LICENSE-Geist.txt`, `fonts/LICENSE-Pretendard.txt` | the licences | |

Every face is `font-display: swap`. `rok.css` declares the two Geist faces with `url("fonts/...")`, which resolves against the stylesheet, so the fonts go wherever `rok.css` goes. `pretendard.css` is a separate stylesheet (47 KB of ranges, too much for every English page). `chrome::fonts_in(root, ko)` writes the `<head>` lines: a `<link rel="preload" ... crossorigin>` for each Geist file and, when `ko`, the Pretendard stylesheet; pass the same `root` as `rok.css`, so a preload and the stylesheet's request are one URL. `chrome::fonts()` is `fonts_in("/", true)`.

A site serves them like this:

- a generator calls `kit::copy_fonts(kit::FONTS_DIR, out + "/fonts")` beside writing `kit::files()`: it copies the tree (not the README), makes the directories and returns the names written, for a link check;
- a server that answers from memory (the playground) serves `/fonts/<rest>` from `http::static_file(kit::FONTS_DIR, "/" + rest)`, or its deploy copies the directory next to the binary and points there; `Content-Type` from `http::content_type` (`font/woff2`, `text/css`);
- fonts never change under one name within a kit version; serve them with `http::REVALIDATE` and an `http::etag`, or for a year if the site's caching allows;
- the CSP needs `font-src 'self'` and `style-src 'self'` only.

Until a site publishes `fonts/`, Geist falls back to the metric-matched local faces above.

Weights are 400, 500 and 600 only. There is no bold 700.

### Scale

Each step fixes size, line height and tracking together. Tracking is tied to the size and is never set on its own: larger sizes get tighter tracking so headings hold together, body sizes stay at 0.

| Class | Size / line | Tracking | Weight | Use |
|---|---|---|---|---|
| `.t-display` | 64 / 68 | -0.032em | 600 | the home page headline only |
| `.t-h1` | 44 / 52 | -0.025em | 600 | page titles |
| `.t-h2` | 30 / 38 | -0.018em | 600 | sections |
| `.t-h3` | 20 / 28 | -0.01em | 600 | subsections, sidebar headings |
| `.t-lead` | 19 / 30 | 0 | 400 | the paragraph under a title, in `--ink-2` |
| `.t-body` | 16 / 26 | 0 | 400 | prose |
| `.t-ui` | 14 / 20 | 0 | 400, 500 | controls, navigation, tables |
| `.t-small` | 13 / 18 | 0 | 400 | meta, in `--ink-3` |
| `.t-label` | 13 / 18 | 0 | 600 | group labels, in `--ink-2` |
| `.t-eyebrow` | 11 / 16 mono caps | +0.06em | 400 | tiny meta over a figure; nowhere else |

Headings use `text-wrap: balance` and paragraphs `text-wrap: pretty`, so a heading never ends on a single word and a paragraph avoids a one-word last line.

Code is 14 / 22 in blocks and 0.88em inline, on every site; terminals are 13 / 21. A terminal never wraps rokc's lines: `.term` is `white-space: pre` and scrolls sideways, so a diagnostic keeps its columns on a phone.

Do not invent sizes between the steps. If a design seems to need one, it needs a different step.

## Shape

| Radius | Used by |
|---|---|
| 4px | inline code, `.kbd`, `.chip` |
| 6px | buttons, code blocks, callouts, sidebar and nav items |
| 8px | inputs (`.search`), icon buttons (`.ib`) |
| 10px to 12px | popovers and grouped panels |

Borders are 1px: `--line` between regions, `--line-2` on buttons and other controls named by their text, `--field-line` on form fields. The only shadows are on popovers and tooltips, which float above the page. Spacing follows a 4px grid. The header is 60px high and page content sits in `.frame`, at most 1160px wide.

## Components

| Class | What it is |
|---|---|
| `.hdr`, `.brand`, `.nav`, `.search`, `.kbd`, `.ib` | the shared header: mark and site name, section nav, search field with its shortcut, icon button. The active nav link is `.nav a[aria-current]` (or `.on`): `--ink`, weight 500, on `--bg-2` |
| `.nav.sites` | the Rok sites as header links (`chrome::header_sites`), styled like any nav |
| `.btn`, `.btn-2`, `.btn-sm` | primary, secondary and small buttons |
| `.copy` | the Copy button (`chrome::copy_button`, `js/copy.js`): quiet, says "Copied" for a moment |
| `.chip`, `.chip-acc`, `.chip-new` | square-cornered metadata tags (a version, "latest", "Added in"); never decoration |
| `.tabs`, `.tabs .on`, `.tabs .ct` | underlined tabs with an optional count |
| `.cb`, `.cb-h`, `.pre`, `.ln`, `.ln.hl` | code block, its file name bar, the code, a line, a highlighted line |
| `.term`, `.term-bar` | terminal transcript or program output; the bar over it names the working directory (`~/hello`), so a white terminal stands apart from a light page |
| `.callout`, `.callout.help` | note and help callouts, labelled with rokc's own words (`note`, `help`, `warning`) |
| `.side`, `.side .no`, `.toc`, `.prose` | docs shell: chapter sidebar with numbers, on-this-page list, article column |
| `.kv`, `.tbl` | key / value list and data table |
| `.ta-l`, `.ta-c`, `.ta-r` | an aligned table cell from Markdown; `chrome::align_classes` turns the renderer's `style="text-align:.."` into these, since the CSP refuses style attributes |
| `.api-item`, `pre.sig`, `.members`, `.m-h`, `.mod`, `.nm`, `a.src`, `.since`, `.impls`, `.nw` | API pages (`apidoc`): an item, its signature, members with the name in `--ink` 500 and the modifiers (`pub const fn`) in `--ink-3`, a Source link per declaration |
| `.lost`, `.lost-links` | the 404 body every site shares (`chrome::not_found`): title, one sentence, links |
| `.ic` | inline code |
| `.copy` + `js/copy.js` | copy buttons: `data-copy="<text>"`, or `data-copy-from="<selector>"` to copy an element's text at click time; the result is announced through a live region |
| `.social` | brand icon links (GitHub, X, Bluesky, Mastodon), each with an `aria-label` |
| `.ib.theme`, `.seg` | the header theme toggle (moon in light, sun in dark) and the footer System / Light / Dark switch |
| `.foot`, `.foot .cols`, `.foot .about`, `.foot .col`, `.foot .bar` | the footer: brand, tagline, link columns, then the bar every site shares when it passes `release` to `chrome::footer`: the Rok sites (the current one `aria-current`), `rok <release>`, MIT OR Apache-2.0, Made by DaminStudio, the social links, the theme switch; two columns below 900px |
| `.skip`, `.sr-only` | the skip link, shown on keyboard focus; text for screen readers only |

## Motion

A box or a label that changes size after the page has loaded eases from the old size to the new one; nothing moves on first paint, and with `prefers-reduced-motion: reduce` everything snaps. Keep a size fixed where that is possible (two variants stacked in one grid cell, a `min-width`); animate only where it is not.

| Token | Value | Use |
|---|---|---|
| `--dur` | 200ms | opening, growing |
| `--dur-out` | 150ms | closing, fading out |
| `--ease` | `cubic-bezier(.2, 0, 0, 1)` | every size change: fast start, slow stop |

| Hook | What it does |
|---|---|
| `details.grow` | the body slides open and shut (`::details-content`; the height eases where `interpolate-size` is supported, elsewhere it snaps) |
| `.reveal` / `.reveal.open` | a one-row grid whose only child grows from 0 to its height (`grid-template-rows: 0fr` to `1fr`, every browser); put the child's padding on its own child, and make the closed child `inert` |
| `.appear` | fades and drops in 4px when `hidden` is removed, out when it is set (`@starting-style`, `display` with `allow-discrete`) |
| `rokResize(el, change)` | `js/copy.js`: runs `change`, then eases `el`'s width and height to the result (180ms), from mid-flight if it is still moving, clipping overflow meanwhile; copy buttons use it for "Copied" |


- No `light-dark()`, and no other colour function outside an `@supports` guard: the sites must keep their colours on iOS 16, Samsung Internet 25 and Android WebViews that lag behind.
- Use a token for every colour. A literal colour in a site stylesheet is a bug, with two exceptions: `--mark` in the logo files, and the rokstones stone glyphs, whose hue is derived from the stone's name (`oklch(0.7 0.11 h)` light, `oklch(0.78 0.09 h)` dark) so every stone keeps its own colour.
- Every text colour passes 4.5:1 on its surface in both themes (see the contrast table).
- No gradients, no glow, no tinted pills behind headings or labels, no caps mono labels outside `.t-eyebrow`.
- The marks are always `#f9a8d4`, on any ground, with no box behind them.
- Focus is a 2px `--focus` outline with a 2px offset on every focusable element; it is 5.9:1 on the light ground and 10.9:1 on the dark one, above the 3:1 WCAG asks of focus indicators.
- One type scale for every site; a site never overrides tracking or line height of a step.
- Inputs, selects and textareas are 16px below 768px: iOS Safari zooms the page into any smaller field on focus.
- A form field's edge is `--field-line`, never `--line-2` or `--line`: it must reach 3:1 on its ground.
- Theme: the header button flips light and dark (back to the system's theme it picks System), the footer offers System, Light and Dark, both driven by `js/theme.js` (see Choosing the theme). A site never carries its own copy.
- Print: paper is always light (the `.rk.dk` block sits in `@media not print`), the footer, the skip link, Copy buttons and the theme controls are hidden, and every outside link (`http...`) in `<main>` prints its address after it. A site hides its own header, sidebars and heading anchors.
- The footer's Security link is `chrome::SECURITY`, https://github.com/rok-lang/rok/security/policy, on every site: one policy for the toolchain, the stones and the sites.
- Search: `/`, Ctrl+K and Cmd+K focus the search field (`js/keys.js`, by key code, so Caps Lock and a Korean IME do not stop it); the field lists them in `aria-keyshortcuts`.

## Changing a token

1. Pick the OKLCH value, convert it to hex, and change the token in both the `.rk` and the `.rk.dk` block of `css/rok.css`.
2. Recompute the values and contrast tables above and fix any pair below 4.5:1.
3. Update the Tokens board on the design canvas so the reference matches.
4. Push it to main here. Each site pins this repository as its `web/` submodule, so the change reaches a site when it bumps the submodule (`git submodule update --remote web`, then commit).

## Caching

`http` has the helpers a server needs for fingerprinted assets and revalidated pages; they are optional, and a site that does its own keeps working:

| Helper | What it gives |
|---|---|
| `http::version(data)` | the fingerprint, 10 hex digits of SHA-256 (`data` is bytes or text) |
| `http::versioned(url, data)` | `url?v=<fingerprint>`, for `href` and `src` in pages: `http::versioned("/rok.css", kit::ROK_CSS)` |
| `http::is_current(query, data)` | whether the request's query names the current fingerprint |
| `http::IMMUTABLE` | `Cache-Control: public, max-age=31536000, immutable`, for a file asked for by its current `?v=` |
| `http::REVALIDATE` | `Cache-Control: no-cache`, for pages and for a stale or missing `?v=` |
| `http::etag(data)` | a strong ETag, 16 hex digits of SHA-256, quoted |
| `http::not_modified(r, tag)` | whether a GET or HEAD holds `tag` (`If-None-Match`, weak comparison, `*`) |

`http::send` answers 304 without a body or `Content-Length`. A file answer then reads:

```rok
let tag = http::etag(data);
let cc = if http::is_current(r.query, data) { http::IMMUTABLE } else { http::REVALIDATE };
if http::not_modified(r, tag) { try http::send(s, 304, [cc, f"ETag: {tag}"], "", r.method == "HEAD"); return; }
try http::send(s, 200, [f"Content-Type: {http::content_type(name)}", cc, f"ETag: {tag}"], data, r.method == "HEAD");
```

## Security headers and speculation

Every page carries a Content-Security-Policy without `'unsafe-inline'`: no `<script>` or `<style>` in a page and no `style=""` attribute. Styles set from script (`el.style`, WAAPI) are not affected. Each site keeps its own policy and ends it with `http::REPORT_TO`:

| Helper | What it gives |
|---|---|
| `http::REPORT_TO` | `; report-uri /_csp; report-to csp`, appended to the CSP |
| `http::REPORTING` | the `Reporting-Endpoints` header naming `/_csp`, sent beside the CSP |
| `http::REPORT_PATH` | `/_csp`: answer a POST there with 204 and log `http::csp_report(r.body)` when it is some |
| `http::SPECULATION` | the `Speculation-Rules` header, sent with every page |
| `http::SPECULATION_PATH`, `http::SPECULATION_RULES`, `http::SPECULATION_TYPE` | where the rules are served, the rules (prefetch a same-site link on hover or focus; never `/api/`, `/_`, sign-in or account paths), their `Content-Type` |
