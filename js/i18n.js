/**
 * i18n.js — Multi-Language Translation System (FR / EN)
 * Self-contained, robust, extensible for additional languages.
 */

const SUPPORTED_LANGS = ['fr', 'en'];
const DEFAULT_LANG = 'fr';
const CACHE = new Map();

class I18nManager {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
  }

  detectLanguage() {
    // 1. URL search param (?lang=)
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang')?.toLowerCase();
    if (paramLang && SUPPORTED_LANGS.includes(paramLang)) {
      return paramLang;
    }

    // 2. Local storage
    try {
      const storedLang = localStorage.getItem('site_lang')?.toLowerCase();
      if (storedLang && SUPPORTED_LANGS.includes(storedLang)) {
        return storedLang;
      }
    } catch {
      // Storage unavailable or disabled
    }

    // 3. Browser navigator language
    const navLang = navigator.language?.split('-')[0]?.toLowerCase();
    if (navLang && SUPPORTED_LANGS.includes(navLang)) {
      return navLang;
    }

    // 4. Fallback default
    return DEFAULT_LANG;
  }

  async loadTranslations(lang) {
    if (CACHE.has(lang)) {
      return CACHE.get(lang);
    }

    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      CACHE.set(lang, data);
      return data;
    } catch (err) {
      if (lang !== DEFAULT_LANG) {
        return this.loadTranslations(DEFAULT_LANG);
      }
      return {};
    }
  }

  preloadOtherLanguages() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        SUPPORTED_LANGS.forEach((lang) => {
          if (lang !== this.currentLang && !CACHE.has(lang)) {
            this.loadTranslations(lang);
          }
        });
      });
    }
  }

  async setLanguage(newLang) {
    if (!SUPPORTED_LANGS.includes(newLang)) return;

    document.body.classList.add('i18n-transitioning');
    this.currentLang = newLang;
    this.translations = await this.loadTranslations(newLang);

    try {
      localStorage.setItem('site_lang', newLang);
    } catch {
      // Ignore
    }

    // Update URL parameter without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());

    this.applyTranslations();
    this.updateLanguageSwitchers();
    this.updateMetaTags();

    setTimeout(() => {
      document.body.classList.remove('i18n-transitioning');
    }, 180);

    // Dispatch global custom event for dynamic components (projects, typewriter, etc.)
    window.dispatchEvent(
      new CustomEvent('languagechange', {
        detail: { lang: newLang, t: (k, p) => this.t(k, p) },
      })
    );
  }

  getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  }

  t(key, params = {}) {
    let text = this.getNestedValue(this.translations, key);

    // Fallback to default language if missing
    if (text === undefined && this.currentLang !== DEFAULT_LANG) {
      const defaultTrans = CACHE.get(DEFAULT_LANG);
      if (defaultTrans) {
        text = this.getNestedValue(defaultTrans, key);
      }
    }

    if (text === undefined) {
      return key;
    }

    if (typeof text === 'string' && Object.keys(params).length > 0) {
      return text.replace(/{(\w+)}/g, (_, match) => {
        return params[match] !== undefined ? params[match] : `{${match}}`;
      });
    }

    return text;
  }

  applyTranslations() {
    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (typeof val === 'string') {
        el.textContent = val;
      }
    });

    // 2. HTML elements (trusted local JSON only)
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = this.t(key);
      if (typeof val === 'string') {
        el.innerHTML = val;
      }
    });

    // 3. Attributes (e.g. placeholder:form.name;aria-label:nav.menu)
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const attrDefs = el.getAttribute('data-i18n-attr').split(';');
      attrDefs.forEach((def) => {
        const [attr, key] = def.split(':').map((s) => s.trim());
        if (attr && key) {
          const val = this.t(key);
          if (typeof val === 'string') {
            el.setAttribute(attr, val);
          }
        }
      });
    });

    // 4. Update CV download link
    const cvButtons = document.querySelectorAll('.cv-download-link');
    const cvPath = this.t('nav.cvFile');
    const cvName = this.t('nav.cvFileName');
    cvButtons.forEach((btn) => {
      btn.setAttribute('href', cvPath);
      btn.setAttribute('download', cvName);
    });
  }

  updateMetaTags() {
    document.documentElement.lang = this.currentLang;

    const title = this.t('meta.title');
    if (title && typeof title === 'string') {
      document.title = title;
    }

    const desc = this.t('meta.description');
    if (desc && typeof desc === 'string') {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', desc);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', desc);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', desc);
    }
  }

  updateLanguageSwitchers() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = btnLang === this.currentLang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  init() {
    this.loadTranslations(this.currentLang).then((data) => {
      this.translations = data;
      this.applyTranslations();
      this.updateLanguageSwitchers();
      this.updateMetaTags();
      this.preloadOtherLanguages();

      window.dispatchEvent(
        new CustomEvent('languagechange', {
          detail: { lang: this.currentLang, t: (k, p) => this.t(k, p) },
        })
      );
    });

    // Attach click listeners to language switchers
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && targetLang !== this.currentLang) {
          this.setLanguage(targetLang);
        }
      }
    });
  }
}

export const i18n = new I18nManager();
