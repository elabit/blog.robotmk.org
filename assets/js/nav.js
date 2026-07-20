export function init() {
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.getElementById('nav-overlay');

  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
    overlay.setAttribute('aria-hidden', String(isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close overlay on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  // Close overlay on overlay link click
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // --- Desktop dropdown: click + keyboard. CSS handles hover on its own. ---
  document.querySelectorAll('.nav__dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      // Only one dropdown open at a time.
      document.querySelectorAll('.nav__dropdown-toggle').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
      });
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Click outside closes any open dropdown.
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav__dropdown-toggle[aria-expanded="true"]').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
    });
  });

  // Escape closes the dropdown and returns focus to its toggle.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.nav__dropdown-toggle[aria-expanded="true"]');
    if (open) {
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    }
  });

  // --- Mobile accordion: independent of the desktop dropdown. ---
  document.querySelectorAll('.nav__overlay-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}
