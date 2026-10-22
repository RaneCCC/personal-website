# Jingkun Jiang — Academic website

[Visit the website](https://raneccc.github.io/personal-website/)

Three main pages: Home, Research, and CV. Research has a left contents sidebar on desktop, detailed research notes, and a separate sp-DBA submission-history archive. The CV uses a local PDF.js reader with text selection, zoom, and PDF download. The earlier Personal Statement page remains at its old address, outside navigation and marked noindex.

## Editing and publishing

Edit the page's `index.html`; shared typography and layout are in `assets/site.css`. Research section links and IDs are maintained in `research/index.html`; `assets/research-nav.js` highlights the current section. Development notes are in `research/notes/index.html`; archived manuscript events are in `research/submission-history/index.html`. No build step is required.

For a local preview, run `python3 -m http.server 63541 --bind 127.0.0.1` from this repository and open `http://127.0.0.1:63541/`.

For video seeking, use a static server with HTTP byte-range support. The local workspace's `preview.command` starts such a server; the basic Python command above is sufficient for reviewing text and images.

The Research overview presents the work briefly, with a grain-analysis figure and a separate circular grain-boundary video. APFC and XPFC share one contents entry; PF uses the same dendritic-growth title in the contents and body. `research/notes/` holds solver development, Cooley–Tukey and distributed FFT practice, and the detailed grain-statistics workflow. Two FFT figure slots are reserved for later illustrations; handwritten working notes remain available below them. The threshold section intentionally contains only its title.

GitHub Pages publishes the `main` branch's root folder. After reviewing a change:

```sh
git add .
git commit -m "Update website content"
git push origin main
```

Montserrat and PDF.js retain their licenses in `assets/fonts/` and `assets/vendor/`. Research figures are attributed to the [sp-DBA preprint](https://arxiv.org/abs/2609.03922) and [Zhang and Xia's DBA paper](https://doi.org/10.1038/s43588-025-00780-2); the phase-field example comes from my earlier solver work.

The white Home banner is an AI-generated conceptual illustration of frequency-block updates, not simulation data or a numerical Fourier transform. Holding a block means retaining its existing values. Research figures retain their original proportions and legends. The grain-boundary clip uses H.264 for browser compatibility, with its original duration and frame rate, and loads only when played.
