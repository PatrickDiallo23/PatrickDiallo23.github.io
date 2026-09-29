// Turns ```mermaid fences (left as plain <pre><code class="language-mermaid"> by Shiki's excludeLangs)
// into SVG. Mermaid is imported lazily so posts without diagrams ship none of it.
export {}; // makes this a module so top-level await type-checks

const blocks = [...document.querySelectorAll<HTMLElement>('pre > code.language-mermaid')];

if (blocks.length) {
  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
  });

  for (const [i, code] of blocks.entries()) {
    const pre = code.closest('pre');
    if (!pre) continue;
    try {
      const { svg } = await mermaid.render(`mmd-${i}`, code.textContent ?? '');
      const figure = document.createElement('figure');
      figure.className = 'diagram';
      figure.innerHTML = svg;
      pre.replaceWith(figure);
    } catch {
      // Invalid diagram: leave the source visible rather than a broken box.
    }
  }
}
