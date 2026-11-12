import { gsap, ScrollTrigger } from './globals';
import './pages/atlas';

function initIntro(): void {
  const chrome = gsap.utils.toArray<HTMLElement>('.hud-top, .hud-bottom, .progress-rail');

  if (chrome.length > 0) {
    gsap.from(chrome, {
      y: 14,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
    });
  }

  const coverItems = gsap.utils.toArray<HTMLElement>('.stop-cover .cover-copy > *, .stop-cover .cover-visual');

  if (coverItems.length > 0) {
    gsap.from(coverItems, {
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.07,
      delay: 0.08,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
    });
  }
}

function initSkyParallax(): void {
  const glows = gsap.utils.toArray<HTMLElement>('.sky-glow');

  glows.forEach((glow, index) => {
    gsap.to(glow, {
      yPercent: index === 0 ? 10 : -8,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 1.2,
      },
    });
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
}

initIntro();
initSkyParallax();
