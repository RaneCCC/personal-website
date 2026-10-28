import { AnnotationType, getDocument, GlobalWorkerOptions, TextLayer } from './vendor/pdfjs/pdf.min.mjs';

const viewer = document.querySelector('#pdf-viewer');
const scroll = document.querySelector('#pdf-scroll');
const pageFrame = document.querySelector('#pdf-page');
const canvas = document.querySelector('#cv-canvas');
const textContainer = document.querySelector('#cv-text-layer');
const linkContainer = document.querySelector('#cv-link-layer');
const preview = document.querySelector('#cv-preview');
const status = document.querySelector('#pdf-status');
const zoomOut = document.querySelector('#zoom-out');
const zoomIn = document.querySelector('#zoom-in');
const fitButton = document.querySelector('#fit-width');
const zoomValue = document.querySelector('#zoom-value');
const pageCount = document.querySelector('#page-count');

if (viewer && scroll && pageFrame && canvas && textContainer && linkContainer) {
  const MIN_SCALE = 0.4;
  const MAX_SCALE = 2;
  const ZOOM_STEP = 0.15;
  const controls = [zoomOut, zoomIn, fitButton].filter(Boolean);
  const clamp = (value) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  let pdf = null;
  let page = null;
  let textContentPromise = null;
  let annotationsPromise = null;
  let baseWidth = 1;
  let scale = 1;
  let renderedScale = 0;
  let fitMode = true;
  let ready = false;
  let failed = false;
  let renderTask = null;
  let textLayer = null;
  let revision = 0;
  let processing = false;
  let localAnchor = null;
  let resizeTimer = 0;
  let previousWidth = 0;

  for (const control of controls) control.disabled = true;
  canvas.hidden = true;
  viewer.setAttribute('aria-busy', 'true');
  if (status) status.textContent = 'Loading the CV. A static preview remains available below.';

  function refreshControls() {
    if (zoomValue) zoomValue.textContent = `${Math.round(scale * 100)}%`;
    if (zoomOut) zoomOut.disabled = !ready || failed || scale <= MIN_SCALE + 0.001;
    if (zoomIn) zoomIn.disabled = !ready || failed || scale >= MAX_SCALE - 0.001;
    if (fitButton) {
      fitButton.disabled = !ready || failed;
      fitButton.setAttribute('aria-pressed', String(fitMode));
    }
  }

  function fitScale() {
    const style = getComputedStyle(scroll);
    const horizontalPadding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    return clamp(Math.max(1, scroll.clientWidth - horizontalPadding - 2) / baseWidth);
  }

  function captureLocalAnchor() {
    if (!renderedScale) return null;
    return {
      x: (scroll.scrollLeft + scroll.clientWidth / 2) / renderedScale,
      y: (scroll.scrollTop + scroll.clientHeight / 2) / renderedScale
    };
  }

  function createLinkRegions(annotations, viewport) {
    const regions = document.createDocumentFragment();
    for (const annotation of annotations) {
      // PDF.js supplies a validated URL; never use its unsafeUrl fallback.
      if (annotation.annotationType !== AnnotationType.LINK || !annotation.url) continue;
      if (!Array.isArray(annotation.rect) || annotation.rect.length !== 4 || !annotation.rect.every(Number.isFinite)) continue;
      const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(annotation.rect);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      if (!width || !height) continue;
      const link = document.createElement('a');
      link.href = annotation.url;
      link.title = annotation.url;
      link.setAttribute('aria-label', annotation.url);
      link.style.left = `${Math.min(x1, x2)}px`;
      link.style.top = `${Math.min(y1, y2)}px`;
      link.style.width = `${width}px`;
      link.style.height = `${height}px`;
      regions.append(link);
    }
    return regions;
  }

  function showFallback() {
    failed = true;
    ready = false;
    renderTask?.cancel();
    textLayer?.cancel();
    canvas.hidden = true;
    if (preview) preview.hidden = false;
    textContainer.replaceChildren();
    linkContainer.replaceChildren();
    linkContainer.hidden = true;
    pageFrame.style.removeProperty('width');
    pageFrame.style.removeProperty('height');
    viewer.setAttribute('aria-busy', 'false');
    if (status) status.textContent = 'The interactive reader could not load. The static preview and PDF download remain available.';
    refreshControls();
  }

  // A single loop owns the canvas. New requests cancel obsolete work; they do
  // not start another canvas render until the previous promise has settled.
  function requestRender() {
    if (!page || failed) return;
    revision += 1;
    linkContainer.replaceChildren();
    linkContainer.hidden = true;
    renderTask?.cancel();
    textLayer?.cancel();
    if (!processing) void renderLatest();
  }

  async function renderLatest() {
    processing = true;
    let completedRevision = -1;
    while (completedRevision !== revision && !failed) {
      const currentRevision = revision;
      const currentScale = scale;
      viewer.setAttribute('aria-busy', 'true');
      try {
        const viewport = page.getViewport({ scale: currentScale });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        textContainer.replaceChildren();
        pageFrame.style.width = `${viewport.width}px`;
        pageFrame.style.height = `${viewport.height}px`;
        pageFrame.style.setProperty('--total-scale-factor', String(currentScale));
        pageFrame.style.setProperty('--scale-round-x', '1px');
        pageFrame.style.setProperty('--scale-round-y', '1px');
        canvas.width = Math.ceil(viewport.width * pixelRatio);
        canvas.height = Math.ceil(viewport.height * pixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas rendering is unavailable.');
        renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
          background: '#ffffff'
        });
        await renderTask.promise;
        renderTask = null;
        if (currentRevision !== revision) continue;

        let selectable = false;
        try {
          const content = await textContentPromise;
          if (currentRevision !== revision) continue;
          if (content) {
            textLayer = new TextLayer({ textContentSource: content, container: textContainer, viewport });
            await textLayer.render();
            selectable = true;
          }
        } catch (error) {
          if (currentRevision !== revision) continue;
          // Text selection is optional; a text-layer failure must not hide a
          // successfully rendered PDF page or trigger an endless retry.
          textContainer.replaceChildren();
        } finally {
          textLayer = null;
        }
        if (currentRevision !== revision) continue;

        let linksAvailable = false;
        try {
          const annotations = await annotationsPromise;
          if (currentRevision !== revision) continue;
          if (annotations) {
            linkContainer.replaceChildren(createLinkRegions(annotations, viewport));
            linksAvailable = true;
          }
        } catch (error) {
          // Link annotations are independent of the page and text rendering.
          linkContainer.replaceChildren();
        }
        if (currentRevision !== revision) continue;

        canvas.hidden = false;
        linkContainer.hidden = !linksAvailable;
        if (preview) preview.hidden = true;
        canvas.setAttribute('aria-label', `Curriculum vitae of Jingkun Jiang, page 1 of ${pdf.numPages}.`);
        if (pageCount) pageCount.textContent = `1 / ${pdf.numPages}`;
        renderedScale = currentScale;
        ready = true;
        if (localAnchor) {
          scroll.scrollLeft = localAnchor.x * currentScale - scroll.clientWidth / 2;
          scroll.scrollTop = localAnchor.y * currentScale - scroll.clientHeight / 2;
          localAnchor = null;
        }
        if (status) {
          status.textContent = selectable
            ? 'CV loaded. Use the controls to zoom; text can be selected.'
            : 'CV loaded. Text selection is unavailable; the PDF download remains available.';
          if (!linksAvailable) status.textContent += ' Embedded links are unavailable in this reader.';
        }
        viewer.setAttribute('aria-busy', 'false');
        refreshControls();
        completedRevision = currentRevision;
      } catch (error) {
        renderTask = null;
        if (currentRevision !== revision || error?.name === 'RenderingCancelledException') continue;
        showFallback();
      }
    }
    processing = false;
  }

  function changeZoom(delta) {
    if (!ready || failed) return;
    localAnchor = captureLocalAnchor();
    fitMode = false;
    scale = clamp(Math.round((scale + delta) * 1000) / 1000);
    refreshControls();
    requestRender();
  }

  zoomOut?.addEventListener('click', () => changeZoom(-ZOOM_STEP));
  zoomIn?.addEventListener('click', () => changeZoom(ZOOM_STEP));
  fitButton?.addEventListener('click', () => {
    if (!ready || failed) return;
    localAnchor = captureLocalAnchor();
    fitMode = true;
    scale = fitScale();
    refreshControls();
    requestRender();
  });

  function handleResize() {
    const width = scroll.clientWidth;
    if (width === previousWidth) return;
    previousWidth = width;
    window.clearTimeout(resizeTimer);
    if (!page || failed || !fitMode) return;
    resizeTimer = window.setTimeout(() => {
      if (!fitMode || failed) return;
      const nextScale = fitScale();
      if (Math.abs(nextScale - scale) < 0.002) return;
      localAnchor = captureLocalAnchor();
      scale = nextScale;
      refreshControls();
      requestRender();
    }, 120);
  }

  if ('ResizeObserver' in window) new ResizeObserver(handleResize).observe(scroll);
  else window.addEventListener('resize', handleResize, { passive: true });

  GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
  const loadingTask = getDocument({
    // Read and download the same version, including its cache key.
    url: document.querySelector('.download-link')?.href || new URL('./cv/Jingkun_Jiang_CV.pdf', import.meta.url).href,
    isEvalSupported: false
  });
  loadingTask.promise.then(async (document) => {
    pdf = document;
    page = await pdf.getPage(1);
    baseWidth = page.getViewport({ scale: 1 }).width;
    textContentPromise = page.getTextContent().catch(() => null);
    annotationsPromise = page.getAnnotations({ intent: 'display' }).catch(() => null);
    previousWidth = scroll.clientWidth;
    scale = fitScale();
    refreshControls();
    requestRender();
  }).catch(showFallback);
}
