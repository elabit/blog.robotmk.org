// Smoothly animate <details class="why-more"> open/close on the Why Robotmk
// page. Progressive enhancement over the native, no-JS-accessible <details>:
// if JS is off or the user prefers reduced motion, the native instant toggle
// stands and this module does nothing.

export function init() {
  const items = document.querySelectorAll('.why-more');
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const DURATION = 220;

  items.forEach((details) => {
    const summary = details.querySelector('.why-more__toggle');
    const panel = details.querySelector('.why-more__panel');
    if (!summary || !panel) return;

    let animating = false;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (animating) return;
      animating = true;

      if (details.open) {
        // Collapse: from current height to 0, then remove [open].
        const start = panel.scrollHeight;
        panel.style.height = start + 'px';
        panel.style.opacity = '1';
        requestAnimationFrame(() => {
          panel.style.transition = `height ${DURATION}ms ease, opacity ${DURATION - 40}ms ease`;
          panel.style.height = '0px';
          panel.style.opacity = '0';
        });
        const done = () => {
          details.open = false;
          resetPanel(panel);
          animating = false;
          panel.removeEventListener('transitionend', done);
        };
        panel.addEventListener('transitionend', done, { once: true });
      } else {
        // Expand: set [open] first so scrollHeight is measurable, then grow.
        details.open = true;
        const target = panel.scrollHeight;
        panel.style.height = '0px';
        panel.style.opacity = '0';
        requestAnimationFrame(() => {
          panel.style.transition = `height ${DURATION}ms ease, opacity ${DURATION - 40}ms ease`;
          panel.style.height = target + 'px';
          panel.style.opacity = '1';
        });
        const done = () => {
          resetPanel(panel);
          animating = false;
          panel.removeEventListener('transitionend', done);
        };
        panel.addEventListener('transitionend', done, { once: true });
      }
    });
  });

  function resetPanel(panel) {
    panel.style.transition = '';
    panel.style.height = '';
    panel.style.opacity = '';
  }
}
