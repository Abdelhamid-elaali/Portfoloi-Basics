/**
 * nav.js — Navigation, Scroll Spy, Mobile Drawer & Tab Controls
 */

class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.mobileDrawer = document.getElementById('mobile-drawer');
    this.isOpen = false;
  }

  init() {
    this.initScrollHeader();
    this.initScrollSpy();
    this.initSmoothScroll();
    this.initMobileMenu();
    this.initExperienceTabs();
  }

  initScrollHeader() {
    if (!this.navbar) return;

    const onScroll = () => {
      const isScrolled = window.scrollY > 40;
      this.navbar.classList.toggle('is-scrolled', isScrolled);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  initScrollSpy() {
    if (!this.sections.length || !this.navLinks.length) return;

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              const isMatch = href === `#${id}`;
              link.classList.toggle('is-active', isMatch);
              if (isMatch) {
                link.setAttribute('aria-current', 'page');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    this.sections.forEach((sec) => spyObserver.observe(sec));
  }

  initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = this.navbar ? this.navbar.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });

        if (this.isOpen) {
          this.closeMobileMenu();
        }
      }
    });
  }

  initMobileMenu() {
    if (!this.mobileToggle || !this.mobileDrawer) return;

    this.mobileToggle.addEventListener('click', () => {
      if (this.isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    this.isOpen = true;
    this.mobileDrawer.classList.add('is-open');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.isOpen = false;
    this.mobileDrawer.classList.remove('is-open');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.experience-tab-btn');
    const views = document.querySelectorAll('.timeline-view');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetViewId = btn.getAttribute('data-tab-target');

        tabButtons.forEach((b) => b.classList.remove('is-active'));
        views.forEach((v) => v.classList.remove('is-active'));

        btn.classList.add('is-active');
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
          targetView.classList.add('is-active');
        }
      });
    });
  }
}

export const nav = new NavigationManager();
