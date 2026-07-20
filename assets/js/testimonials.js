export function init() {
  const carousel = document.getElementById('testimonials-carousel');
  if (!carousel) return;

  const track    = carousel.querySelector('.testimonials__track');
  const slides   = Array.from(track.querySelectorAll('.testimonials__slide'));
  const dotsWrap = carousel.closest('.testimonials__container').querySelector('.testimonials__dots');
  const prevBtn  = carousel.closest('.testimonials__container').querySelector('.testimonials__btn--prev');
  const nextBtn  = carousel.closest('.testimonials__container').querySelector('.testimonials__btn--next');

  if (slides.length <= 1) {
    const nav = carousel.closest('.testimonials__container').querySelector('.testimonials__nav');
    if (nav) nav.hidden = true;
    return;
  }

  let current  = 0;
  let timer    = null;
  let dragOrigin = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.testimonials__dot').forEach((d, i) =>
      d.classList.toggle('testimonials__dot--active', i === current)
    );
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 8000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => resetTimer());

  // Drag / swipe
  function onDragStart(x) { dragOrigin = x; }
  function onDragEnd(x) {
    if (dragOrigin === null) return;
    const delta = x - dragOrigin;
    if (Math.abs(delta) > 60) { goTo(current + (delta < 0 ? 1 : -1)); resetTimer(); }
    dragOrigin = null;
  }

  track.addEventListener('mousedown',  e => onDragStart(e.clientX));
  track.addEventListener('mouseup',    e => onDragEnd(e.clientX));
  track.addEventListener('mouseleave', () => { dragOrigin = null; });
  track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX));

  goTo(0);
  resetTimer();
}
