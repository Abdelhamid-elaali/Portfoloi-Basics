/**
 * main.js — Application Entrypoint
 * Bootstraps i18n, theme, animations, nav, projects, and contact modules.
 */

import { i18n } from './i18n.js';
import { theme } from './theme.js';
import { animations } from './animations.js';
import { nav } from './nav.js';
import { projects } from './projects.js';
import { contact } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize core state modules
  i18n.init();
  theme.init();

  // 2. Initialize UI & feature modules
  nav.init();
  projects.init();
  contact.init();
  animations.init();

  // 3. Preloader Dismissal
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = isReducedMotion ? 50 : 850;

    setTimeout(() => {
      preloader.classList.add('is-hidden');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, delay);
  }

  // 4. Back to top button handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // 5. Dynamic footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
