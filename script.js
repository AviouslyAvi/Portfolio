// ── Custom cursor ──
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  curX += (mouseX - curX) * 0.18;
  curY += (mouseY - curY) * 0.18;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

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

// ── Scroll-triggered fly-in reveals ──

// Assign direction + spring classes before observing
document.querySelectorAll('.reveal').forEach(el => {
  if (el.classList.contains('col-text'))   el.classList.add('from-left');
  if (el.classList.contains('col-traits')) el.classList.add('from-right');
  if (
    el.classList.contains('phil-card') ||
    el.classList.contains('service-card') ||
    el.classList.contains('collab-card') ||
    el.classList.contains('legacy-pillar')
  ) el.classList.add('spring');
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

// ── Staggered fly-in for grid children ──
document.querySelectorAll('.philosophy-grid, .services-grid, .collab-grid, .legacy-pillars, .col-traits').forEach(grid => {
  const children = Array.from(grid.children);
  const gridObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 130);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  gridObserver.observe(grid);
});

// ── Button click ripple ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
