# Jingkun Jiang — Academic website

[Visit the website](https://raneccc.github.io/personal-website/)

Home, Research, Personal Statement, and CV form the top navigation. Research is an overview of about 1,000 words, with a left contents sidebar and independent detail pages. It keeps the contribution, representative figures, and qualified results; complete model equations and the long-time grain video are in the relevant detail pages. The main distributed-FFT section shows the overview followed by the state-exchange diagram and distributed-computing paragraph, with the CPU FFT practice below; the sp-DBA detail uses complete Figure 1. `research/spdba/` covers the framework and PFC/RCD/DBP equations. Existing FFT, distributed FFT, grain-analysis, PF, APFC, and XPFC pages retain their own topics. The threshold page is intentionally empty. Older `research/notes/` hash links redirect to these pages.

Home shows About me, research interests, and forty-two independent photos in thirty-nine display items across ten themed galleries. About me and Research interests use centered reading columns with left-aligned prose; personal photos appear in the outdoors and travel groups. Each desktop row pairs a theme title with three to five display items with complete photographs. Below 900 px, the photos scroll horizontally without an automatic carousel. The previous conceptual illustration and longer Beyond research text remain inside inert templates and are hidden. The manuscript-history entry is also temporarily hidden; its separate archive is retained. Personal Statement uses the author’s four-paragraph text and remains marked noindex while it is being refined.

## Editing and publishing

Edit the relevant `index.html`; shared typography and layout are in `assets/site.css`. Section IDs and links in `research/index.html` work with `assets/research-nav.js` to highlight the overview’s current section. Each detail page links back to the overview.

The red header uses white navigation text and a current-page underline. Research and the header share `--site-width: clamp(1168px, 90vw, 1480px)`. Above 999 px, the left/right insets are 48/88 px, so the research body grows from 824 px at a 1280 px viewport to 1136 px on large displays. Home’s gallery shares the maximum site width while its introduction, Personal Statement, and CV retain their reading widths. Narrow screens use a single column.

All public images and videos are in `pictures/`. Replace a file under its stable name, then update its HTML source, full-size link, dimensions, alt text, and caption if any of those change. Keep scientific plots’ complete proportions, axes, and legends. On desktop, the overview’s figure/text rows use CSS subgrid to align text with the image body while the caption occupies a separate row. Keep the direct `figure` and `.summary-prose` children when editing these rows. Captions are centered and unlinked; publication records below the prose contain the paper links.

Gallery exports use stable category names, such as `pictures/home/animals_01.jpg`, `travel_01.jpg`, and `graduation_01.jpg`. Entries are grouped under `.home-theme-row` in `index.html`. To replace a photograph, overwrite its file and update its full-size link, dimensions, alt text, and source query version. Keep the row’s `--photo-count` equal to its number of display items. Desktop pictures are at most 160 px high, with 14 px above and below each row; below 900 px, 180×150 px frames scroll horizontally. Images retain their complete proportions. Only the approved graduation, travel, and fireworks collages were split at their panel boundaries. Photographs load lazily, link to complete exports, and leave their originals private. Category labels contain only titles and Graduation is the final row. Do not renumber existing files or reuse archived filenames.

Drawing & painting has seven photographs but four display items. Its first four postcard files, `painting_01.jpg`–`painting_04.jpg`, occupy one 2×2 CSS montage, 160×160 px on desktop and 150×150 px on mobile, with 4 px gaps. Each card retains its own image file, alt text, and full-size link. To change one card, replace that file and update its corresponding anchor and image; no combined JPEG is needed. The owner’s local gallery configuration records the montage members, individual photo count, and display count separately. The row therefore uses `--photo-count:4`.

The coconut-water bouquet uses the same title and alt text, “An ‘impact factor’ bouquet of if coconut water.”

Complete equations use self-contained LaTeX SVG paths in `pictures/equations/`, without a runtime rendering library. Their TeX is retained in each SVG description and the HTML image’s `data-tex` attribute. The owner’s local `design/equations/equations.json` and `render.py` regenerate the assets with TeX Live and synchronize dimensions and descriptions. Edit the TeX source instead of glyph paths, and keep mathematically equivalent narrow variants. The overview keeps only short inline MathML labels. The APFC detail uses a complete single-line Fourier evolution on desktop, with ordinary-size parentheses and an equivalent narrow version on mobile. Model equations and explanations remain on their detail pages; the SI’s hexagonal XPFC correlation kernel is distinguished from the separate projected-FCC development image.

The Solidification & phase separation section distinguishes dendritic growth and reactive Model B. The overview pairs a smaller Model B video on the left with vertically aligned explanatory prose on the right; narrow screens stack them. The clip shows concentration Z above and Fourier-coefficient update magnitudes |ΔẐ| below. Its complete four-panel recording and SI-based equations are on `research/pf/#model-b`; two independent recordings are in a closed supplementary section. These are development examples, not paired accuracy or speed benchmarks. The XPFC overview image occupies its own row; APFC retains a side-by-side figure and paragraph.

Model B videos use stable names `pictures/research/model_b_{evolution,full,real,fourier}.mp4` and matching `_poster.jpg` files. When replacing them, update the video poster, source, dimensions, caption, and query version together. Preserve `controls preload="none" playsinline` with no autoplay or loop. The overview clip retains 21 original frames at 5 fps (4.2 seconds); its maximum displayed width is 300 px. Native controls support seeking and fullscreen. The original media and reproducible export tools remain in the owner’s local workspace.

The CV PDF is in `assets/cv/Jingkun_Jiang_CV.pdf`; its fallback is `pictures/cv/preview.png`. The PDF matches the latest owner-supplied file without content edits. Refresh both resources’ query versions together when replacing them. The local PDF.js reader supports text selection, zoom, fit width, and download. Preserve its worker, fonts, and licenses.

No build step is required. For a basic local preview, run `python3 -m http.server 63541 --bind 127.0.0.1` here and open `http://127.0.0.1:63541/`. For video seeking, use a server with HTTP byte-range support; the owner’s workspace launcher provides one. Videos keep native controls and preload only when played.

GitHub Pages publishes the `main` branch’s root folder. Check desktop and mobile layouts, the contents sidebar, image and detail links, model equations, and the CV reader before publishing:

```sh
git add .
git commit -m "Update website content"
git push origin main
```

Confirm the Pages deployment succeeds, then inspect the live pages. Research ownership and speedup conditions must be preserved. DBA is prior work by Zhang and Xia. RCD’s 28.1× is a combined optimization of the update stage; DBP’s 8.4× is an overall result for controlled Gaussian wave packets. Local adaptive updates do not remove global FFT redistribution. The PF topic also includes an exploratory reactive Model B implementation using pseudo-spectral methods and Fourier-space block activation; its development views do not establish a paired speedup or accuracy result.

Private notes, source data, original presentations and photographs, correspondence, and research code are not part of this repository. Montserrat, Latin Modern Math, and PDF.js retain their licenses in `assets/fonts/` and `assets/vendor/`. Research figures are attributed to the [sp-DBA preprint](https://arxiv.org/abs/2609.03922) and [Zhang and Xia’s DBA paper](https://doi.org/10.1038/s43588-025-00780-2); the PF examples come from my earlier solver work.

The retained Home banner is an AI-generated conceptual illustration, not simulation data. It remains hidden inside `template#home-hero-hidden`; the personal text remains in `template#beyond-research-hidden`. Remove an enclosing template only after deciding to restore that content. Holding a block means retaining its existing values rather than zeroing them.
