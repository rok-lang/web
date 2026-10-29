# Rok web kit

The look shared by rok-lang.org, docs.rok-lang.org, rokstones.io and playground.rok-lang.org: design tokens, type scale, header, footer, code and terminal blocks, and the Rok mark.

- `css/rok.css`: tokens (one `light-dark()` pair each, so a theme is a class), type steps, components
- `assets/mark.svg`: the Rok mark, one colour; `assets/rokstones.svg`: the rokstones mark
- `fonts/`: font sources and licences

Apps pin a tagged release of this repository, so a design change ships to every site at once.

## Rules

- One type scale; tracking is set by size and never overridden.
- Light and dark are designed separately; terminals and output follow the theme.
- No deploy or infrastructure details here: those live in the private infra repository.
