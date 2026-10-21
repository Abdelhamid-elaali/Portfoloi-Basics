/**
 * animations.js — High-performance Vanilla Animation & Interaction Engine
 * Handles: Scroll reveals, animated counters, 3D card tilt, cursor effects,
 * hero typewriter, magnetic buttons, and scroll progress.
 */

class AnimationEngine {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.typewriterTimer = null;
    this.typewriterIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.currentRoles = [];
  }

  init() {
    if (this.isReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    this.initScrollReveals();
    this.initCounters();
    this.initCardSpotlight();
    this.initCardTilt();
    this.initMagneticButtons();
    this.initCustomCursor();
    this.initScrollProgress();
    this.initTypewriter();

    // Listen to language changes to update typewriter roles
    window.addEventListener('languagechange', () => {
      this.initTypewriter();
    });
  }

  /* ------------------------------------------------------------------------
     1. Scroll Reveals (IntersectionObserver)
     ------------------------------------------------------------------------ */
  initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     2. Animated Stat Counters
     ------------------------------------------------------------------------ */
  initCounters() {
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
            this.animateCounter(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  animateCounter(element, target, duration = 1600) {
    let startTimestamp = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (target - startValue) + startValue);
      element.textContent = current;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    };

    window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     3. Spotlight Glow Following Cursor on Glass Cards
     ------------------------------------------------------------------------ */
  initCardSpotlight() {
    const cards = document.querySelectorAll('.card-glass');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. 3D Tilt Effect on Project Cards
     ------------------------------------------------------------------------ */
  initCardTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateX = ((mouseY - height / 2) / height) * -10;
        const rotateY = ((mouseX - width / 2) / width) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Magnetic Buttons
     ------------------------------------------------------------------------ */
  initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-magnetic');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Custom Cursor (Desktop Only)
     ------------------------------------------------------------------------ */
  initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      window.requestAnimationFrame(animateFollower);
    };
    window.requestAnimationFrame(animateFollower);

    // Hover state over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, .card-glass, .contact-card-interactive, .lang-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Scroll Progress Bar
     ------------------------------------------------------------------------ */
  initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------------------------------------
     8. Hero Typewriter Effect
     ------------------------------------------------------------------------ */
  initTypewriter() {
    const el = document.getElementById('hero-typewriter');
    if (!el) return;

    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
    }

    // Determine current language roles from DOM attributes or defaults
    const isEn = document.documentElement.lang === 'en';
    this.currentRoles = isEn
      ? [
          'Laravel & PHP Specialist',
          'React & Next.js Craftsman',
          'RESTful API Architect',
          'AI Automation & Systems Advocate',
        ]
      : [
          'Laravel & PHP Expert',
          'React & Next.js Specialist',
          'Architecte APIs REST',
          'Passionné Automatisation & IA',
        ];

    this.typewriterIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.tickTypewriter(el);
  }

  tickTypewriter(element) {
    const currentWord = this.currentRoles[this.typewriterIndex] || '';

    if (this.isDeleting) {
      this.charIndex--;
      element.textContent = currentWord.substring(0, this.charIndex);
    } else {
      this.charIndex++;
      element.textContent = currentWord.substring(0, this.charIndex);
    }

    let delta = this.isDeleting ? 40 : 85;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      delta = 2200; // Pause at end of word
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.typewriterIndex = (this.typewriterIndex + 1) % this.currentRoles.length;
      delta = 400; // Pause before next word
    }

    this.typewriterTimer = setTimeout(() => {
      this.tickTypewriter(element);
    }, delta);
  }
}

export const animations = new AnimationEngine();
