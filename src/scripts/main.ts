import { gsap, ScrollTrigger } from './globals';
import './pages/atlas';
import './contact';

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

initSkyParallax();
