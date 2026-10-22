# Jingkun Jiang — Academic website

[Visit the website](https://raneccc.github.io/personal-website/)

Four navigation entries: Home, Research, Personal Statement, and CV. Personal Statement currently contains its heading only and is marked noindex. Research has a compact overview with a left contents sidebar and independent detail pages for FFT kernels, distributed FFTs, PF, APFC, XPFC, grain analysis, and thresholds. The threshold page is intentionally empty. A separate archive records dated sp-DBA manuscript events. Home currently shows About me and research interests; its illustration and Beyond research text are retained inside inert templates and are temporarily hidden.

## Editing and publishing

Edit the relevant `index.html`; shared typography and layout are in `assets/site.css`. Section links and IDs are maintained in `research/index.html`; `assets/research-nav.js` highlights the overview's current section. Detail pages each cover one topic and link back to the overview. `research/notes/` redirects older hash links to these pages.

All public images and videos are in `pictures/`, including `home/`, `research/`, `cv/`, and `equations/`. Replace an existing figure under its stable name, preserving capitalization such as `spDBA_main.png`. If dimensions, format, or meaning change, update the HTML's source, full-size link, width, height, alt text, and caption; video replacements also need a poster and fallback link. Keep research figures' original proportions and legends. The sp-DBA overview uses panel a in `research/spDBA_main.png` and the smaller panel b in `research/spDBA_workflow.png`; panel c is omitted. Captions are centered, unlinked explanations of the fields and relevant comparison conditions. Linked publication records sit beneath the DBA and sp-DBA text instead. The four sp-DBA advantages use numbered headings; application areas and distributed update results have separate full-width paragraphs. The CV PDF remains in `assets/cv/` and matches the owner-supplied latest CV without content edits; its preview is `pictures/cv/preview.png`.

Six model groups use LaTeX typesetting exported as self-contained SVG paths in `pictures/equations/`, with no runtime math library or font download. The source TeX is retained in each SVG description and the image's `data-tex` attribute. The author's local `design/equations/equations.json` and `render.py` regenerate the assets with TeX Live's `latex` and `dvisvgm` and synchronize image dimensions and descriptions. Edit the TeX and regenerate rather than editing glyph paths. Keep mathematically equivalent narrow variants and their `<picture>` sources. PFC background is distinguished from the XPFC example; DBP is one expanded forward nonlinear Schrödinger equation, and XPFC/PF equations are stacked. XPFC pairs a nonlocal free energy with Fourier-space evolution. Short explanations define the main variables.

No build step is required. For text and image preview, run `python3 -m http.server 63541 --bind 127.0.0.1` here and open `http://127.0.0.1:63541/`. For video seeking, use a server with HTTP byte-range support; the author's local workspace launcher provides one.

GitHub Pages publishes the `main` branch's root folder. After checking desktop and mobile layouts, links, images, and the CV reader:

```sh
git add .
git commit -m "Update website content"
git push origin main
```

Confirm that the Pages deployment succeeds and review the live pages. Private notes, source data, research code, original presentations, and correspondence are not part of this repository.

Montserrat, Latin Modern Math, and PDF.js retain their licenses in `assets/fonts/` and `assets/vendor/`. Research figures are attributed to the [sp-DBA preprint](https://arxiv.org/abs/2609.03922) and [Zhang and Xia's DBA paper](https://doi.org/10.1038/s43588-025-00780-2). The PF example comes from my earlier solver work.

The retained Home banner is an AI-generated conceptual illustration, not simulation data or a numerical Fourier transform. It is currently hidden in `index.html` inside `template#home-hero-hidden`; personal text is inside `template#beyond-research-hidden`. To restore either, remove only its enclosing template tags and keep the contents, after deciding it should be visible. Holding a block means retaining its existing values. The grain-boundary video uses browser-compatible H.264 with its original duration and frame rate; it loads only when played. The CV uses a local PDF.js reader with text selection, zoom, and PDF download.
