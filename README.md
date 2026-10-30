# Rok web kit

What rok-lang.org, docs.rok-lang.org, rokstones.io and playground.rok-lang.org share: design tokens and components, the theme and search scripts, the marks and icons, and the server and page code of the three Rok servers.

- `css/rok.css`: tokens (plain light and dark blocks, so a theme is a class), type steps, font fallbacks, components, theme controls, footer
- `docs/tokens.md`: how the tokens work, every token's role, values and contrast, the type scale, the theme contract and the rules
- `js/theme.js`: light and dark, loaded blocking in `<head>`: the class before the first paint, then the header toggle and the footer switch
- `js/keys.js`: `/`, Ctrl+K and Cmd+K focus the search field
- `js/copy.js`: Copy buttons (`button[data-copy]`, `chrome::copy_button`)
- `assets/`: the Rok and rokstones marks (SVG, and 512px PNG on white, black and transparent), each site's `favicon.ico` and `apple-touch-icon.png`, the Rok profile picture
- `rok/`: the `web` Rok library the three servers build with: `http` (HTTP/1.1, forms, cookies, static files), `url` (canonical addresses and their 301s), `kit` (the files above, built into the program), `chrome` (theme controls, social links, the bar of sites, the footer and its shared bottom row, the Copy button, the 404 body, the `<head>` lines for fonts and icons), `apidoc` (the scanner behind the API pages: `pub` items, docs, signatures, members and their source lines)
- `tools/content`: `rok-content`, which bundles the docs, www and spec repositories for the rok-lang.org server
- `fonts/`: font sources and licences

## How the sites use it

Each site repository has this one as a git submodule at `web/`, pinned to a commit, and depends on the library by path:

```rokon
deps: {
    "web": Dep::path("web/rok"),
},
```

`web::kit` builds the published files into the program, so a generator writes them into its output and a server answers with them, at the names pages already use: `/rok.css`, `/theme.js`, `/keys.js`, `/copy.js`, `/rok.svg`, and `/logo.svg`, `/favicon.ico`, `/apple-touch-icon.png` from the site's mark (`kit::Mark::Rok` or `kit::Mark::Rokstones`). Deploys need nothing from `web/` at run time; rokstones.io's Open Graph templates read `web/css/rok.css` and the mark from the checkout.

Clone a site with its submodule, and bump the kit by moving the submodule:

```sh
git clone --recurse-submodules https://github.com/rok-lang/rok-lang.org.git
git submodule update --init          # in a clone made without it
git submodule update --remote web    # take this repository's main
git commit -am "chore: bump the web kit"
```

```sh
cd rok && rok test                   # the library's tests
```

## Rules

- One type scale; tracking is set by size and never overridden.
- Light and dark are designed separately; terminals and output follow the theme.
- A site never keeps a copy of a file from here: it publishes the kit's.
- No deploy or infrastructure details here: those live in the private infra repository.
