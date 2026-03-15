// ── Smooth scroll for anchor links ──
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const id = a.getAttribute('href').slice(1);
  const el = id ? document.getElementById(id) : null;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile nav if open
  document.querySelector('.nav-links')?.classList.remove('open');
});

// ── Scroll-triggered reveal ──
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => observer.observe(el));

// ── Nav shrink on scroll ──
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

// ── Mobile menu toggle ──
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ── Staggered reveal for grid children ──
document.querySelectorAll('.philosophy-grid, .services-grid, .collab-grid, .legacy-pillars, .col-traits').forEach(grid => {
  const children = grid.children;
  const gridObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, i * 100);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  gridObserver.observe(grid);
});
