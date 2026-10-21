# Jingkun Jiang — Academic website

[Visit the website](https://raneccc.github.io/personal-website/)

Four main pages: Home, Research, Personal Statement, and CV. The Research page has a left contents sidebar on desktop and links to a separate sp-DBA submission-history archive. The CV uses a local PDF.js reader with text selection, zoom, and PDF download.

## Editing and publishing

Edit the page's `index.html`; shared typography and layout are in `assets/site.css`. Research section links and IDs are maintained in `research/index.html`; `assets/research-nav.js` highlights the current section. Development notes are in `research/notes/index.html`; archived manuscript events are in `research/submission-history/index.html`. No build step is required.

For a local preview, run `python3 -m http.server 63541 --bind 127.0.0.1` from this repository and open `http://127.0.0.1:63541/`.

GitHub Pages publishes the `main` branch's root folder. After reviewing a change:

```sh
git add .
git commit -m "Update website content"
git push origin main
```

Montserrat and PDF.js retain their licenses in `assets/fonts/` and `assets/vendor/`. Research figures are attributed to the [sp-DBA preprint](https://arxiv.org/abs/2609.03922) and [Zhang and Xia's DBA paper](https://doi.org/10.1038/s43588-025-00780-2); the phase-field example comes from my earlier solver work.
