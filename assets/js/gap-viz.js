export function init() {
  const viz = document.querySelector('.gap-viz');
  if (!viz) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            viz.classList.add('gap-viz--animated');
          }, 200);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(viz);
}
