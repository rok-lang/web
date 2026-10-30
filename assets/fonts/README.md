# Fonts

Self-hosted webfonts, published by the sites under `fonts/` beside `rok.css` (`kit::copy_fonts`; see docs/tokens.md, Webfonts). All SIL Open Font License 1.1:

- `Geist-Variable.woff2`, `GeistMono-Variable.woff2`: npm `geist` 1.8.2 (https://github.com/vercel/geist-font), `LICENSE-Geist.txt`
- `pretendard.css`, `pretendard/PretendardVariable.subset.N.woff2`: npm `pretendard` 1.3.9 (https://github.com/orioncactus/pretendard), the variable dynamic subset, `LICENSE-Pretendard.txt`. `pretendard.css` is the package's `pretendardvariable-dynamic-subset.css`, minified, with the slices under `pretendard/` and `format("woff2")`; the ranges are unchanged.

To update, fetch the packages from registry.npmjs.org, copy the files over under the same names, regenerate `pretendard.css` from the package's stylesheet, and check each file is `Web Open Font Format (Version 2)`.
