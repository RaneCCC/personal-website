(() => {
  const button = document.querySelector('.gallery-toggle');
  const photos = document.getElementById('home-gallery-photos');
  if (!button || !photos) return;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    photos.hidden = !expanded;
  });
})();
