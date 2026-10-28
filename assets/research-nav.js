const contents = document.querySelector('.research-toc');

if (contents) {
  const entries = [...contents.querySelectorAll('.toc-links > a[href^="#"], .toc-applications > a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)), group: link.closest('.toc-group') }))
    .filter(({ section }) => section);
  const groups = [...contents.querySelectorAll('.toc-group')]
    .map((element) => {
      const link = element.querySelector('a.toc-group-label[href^="#"]');
      return {
        element,
        section: link && document.getElementById(link.hash.slice(1)),
        entries: entries.filter((entry) => entry.group === element),
      };
    })
    .filter(({ section, entries: groupEntries }) => section && groupEntries.length);
  let pending = false;
  let currentEntry = null;
  let currentGroup = null;

  function highlightCurrentSection() {
    pending = false;
    const header = document.querySelector('.site-header');
    const readingLine = (header?.getBoundingClientRect().bottom || 0) + 50;
    // A group anchor can precede its first topic heading; select that first topic
    // as soon as the group enters the reading area.
    let groupEntries = entries;
    for (const group of groups) {
      if (group.section.getBoundingClientRect().top <= readingLine) groupEntries = group.entries;
    }
    let current = groupEntries[0];
    let currentTop = -Infinity;
    for (const entry of groupEntries) {
      const top = entry.section.getBoundingClientRect().top;
      if (top > readingLine) continue;
      // Side-by-side topics share a row; keep the selected link highlighted.
      const sameRow = Math.abs(top - currentTop) < 2;
      if (!sameRow || entry.link.hash === window.location.hash) {
        current = entry;
        currentTop = top;
      }
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
  scheduleHighlight();
}
