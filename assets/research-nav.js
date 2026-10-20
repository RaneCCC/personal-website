const contents = document.querySelector('.research-toc');

if (contents) {
  const entries = [...contents.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);
  let pending = false;

  function highlightCurrentSection() {
    pending = false;
    const header = document.querySelector('.site-header');
    const readingLine = (header?.getBoundingClientRect().bottom || 0) + 50;
    let current = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top <= readingLine) current = entry;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = entries.at(-1);
    }
    for (const entry of entries) {
      if (entry === current) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
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
  scheduleHighlight();
}
