// Applies the saved theme before first paint. A same-origin file (not inline)
// so the Content-Security-Policy allows it without a hash.
(function () {
  try {
    var mode = localStorage.getItem('mode') || 'system';
    var accent = localStorage.getItem('accent') || 'all';
    if (mode !== 'system') document.documentElement.setAttribute('data-mode', mode);
    if (accent !== 'all') document.documentElement.setAttribute('data-accent', accent);
    var details = localStorage.getItem('show-details');
    if (details === 'true') document.documentElement.setAttribute('data-details', 'open');
  } catch (e) {}
})();
