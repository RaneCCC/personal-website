const contents = document.querySelector('.research-toc');

if (contents) {
  const directory = contents.closest('.research-directory');
  if (directory) {
    const desktopLayout = window.matchMedia('(min-width: 1000px)');
    // Keep the fixed desktop index visible; narrow screens start with Contents closed.
    const setDirectoryLayout = () => { directory.open = desktopLayout.matches; };
    desktopLayout.addEventListener('change', setDirectoryLayout);
    setDirectoryLayout();
  }

  const entries = [...contents.querySelectorAll('.toc-group-label[href^="#"], .toc-links > a[href^="#"], .toc-applications > a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)), group: link.closest('.toc-group') }))
    .filter(({ section }) => section);
  let pending = false;
  let currentEntry = null;
  let currentGroup = null;

  function highlightCurrentSection() {
    pending = false;
    const header = document.querySelector('.site-header');
    const readingLine = (header?.getBoundingClientRect().bottom || 0) + Math.min(140, window.innerHeight * 0.2);
    let current = entries[0];
    // Entries follow the document order, including nested applications.
    for (const entry of entries) {
      const top = entry.section.getBoundingClientRect().top;
      if (top <= readingLine) current = entry;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = entries.at(-1);
    }
    // Avoid repeating DOM writes during scroll frames within the same section.
    if (current === currentEntry) return;
    currentEntry?.link.removeAttribute('aria-current');
    current?.link.setAttribute('aria-current', 'location');
    currentEntry = current;
    if (currentGroup !== current?.group) {
      currentGroup?.classList.remove('is-current-group');
      currentGroup = current?.group || null;
      currentGroup?.classList.add('is-current-group');
    }
  }

  function scheduleHighlight() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(highlightCurrentSection);
  }

  window.addEventListener('scroll', scheduleHighlight, { passive: true });
  window.addEventListener('resize', scheduleHighlight);
  window.addEventListener('hashchange', scheduleHighlight);
  window.addEventListener('load', scheduleHighlight);
  directory?.addEventListener('toggle', scheduleHighlight);
  scheduleHighlight();
}
