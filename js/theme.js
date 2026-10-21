/**
 * theme.js — Dark / Light Mode Toggle System
 * Respects OS preferences, persists user override, smooth transition.
 */

class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
  }

  getInitialTheme() {
    try {
      const stored = localStorage.getItem('site_theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // Storage unavailable
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  applyTheme(theme) {
    this.theme = theme;
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem('site_theme', theme);
    } catch {
      // Ignore
    }

    this.updateToggleButtons();
  }

  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  updateToggleButtons() {
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      const isLight = this.theme === 'light';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      const iconDark = btn.querySelector('.theme-icon-dark');
      const iconLight = btn.querySelector('.theme-icon-light');
      if (iconDark && iconLight) {
        iconDark.style.display = isLight ? 'none' : 'block';
        iconLight.style.display = isLight ? 'block' : 'none';
      }
    });
  }

  init() {
    this.applyTheme(this.theme);

    // Watch OS preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('site_theme')) {
          this.applyTheme(e.matches ? 'light' : 'dark');
        }
      } catch {
        // Ignore
      }
    });

    // Delegate theme button clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle-btn');
      if (btn) {
        this.toggle();
      }
    });
  }
}

export const theme = new ThemeManager();
