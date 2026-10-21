/**
 * projects.js — Data-driven Project Rendering, Filtering & Lightbox Modal
 */

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.currentFilter = 'all';
    this.container = document.getElementById('projects-container');
    this.filterButtons = document.querySelectorAll('.project-filter-pill');
    this.modalBackdrop = document.getElementById('project-modal');
    this.modalContent = document.getElementById('project-modal-body');
    this.activeTriggerBtn = null;
  }

  async init() {
    try {
      const res = await fetch('./data/projects.json');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      this.projects = await res.json();
      this.render();
      this.initFilters();
      this.initModalListeners();

      // Listen to language change to re-render texts
      window.addEventListener('languagechange', () => {
        this.render();
      });
    } catch {
      if (this.container) {
        this.container.innerHTML = `
          <div class="card-glass" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p>Projets temporairement indisponibles en prévisualisation directe.</p>
          </div>
        `;
      }
    }
  }

  getCurrentLang() {
    return document.documentElement.lang || 'fr';
  }

  render() {
    if (!this.container) return;

    const lang = this.getCurrentLang();
    const filtered = this.projects.filter((p) => {
      if (this.currentFilter === 'all') return true;
      return p.category === this.currentFilter;
    });

    const isEn = lang === 'en';
    const viewDetailsText = isEn ? 'Architecture & Details' : 'Détails & Architecture';
    const viewCodeText = isEn ? 'Code' : 'Code';
    const viewDemoText = isEn ? 'Live' : 'Démo';

    this.container.innerHTML = filtered
      .map((proj, idx) => {
        const title = proj.title[lang] || proj.title['fr'];
        const subtitle = proj.subtitle[lang] || proj.subtitle['fr'];
        const metric = proj.metrics[lang] || proj.metrics['fr'];
        const tagsHtml = proj.tags.map((t) => `<span class="project-tag">${t}</span>`).join('');

        return `
        <article class="card-glass project-card" data-tilt data-reveal="up" data-delay="${(idx + 1) * 100}">
          <div class="project-thumbnail">
            <img src="${proj.image}" alt="${title} preview" width="600" height="340" loading="lazy">
            <div class="project-thumbnail-overlay"></div>
            <div class="project-metric-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span>${metric}</span>
            </div>
          </div>
          <div class="project-body">
            <span class="project-category">${proj.category.toUpperCase()} · ${proj.year}</span>
            <h3 class="project-title">${title}</h3>
            <p class="project-subtitle">${subtitle}</p>
            <div class="project-tags">${tagsHtml}</div>
            <div class="project-actions">
              <button type="button" class="btn btn-secondary btn-details" data-project-id="${proj.id}" style="padding: 0.55rem 1.1rem; font-size: var(--text-xs);">
                ${viewDetailsText}
              </button>
              ${
                proj.links.github && proj.links.github !== '#'
                  ? `<a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-icon" aria-label="Source code on GitHub">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>`
                  : ''
              }
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    // Rebind details buttons
    this.container.querySelectorAll('.btn-details').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.activeTriggerBtn = btn;
        const id = btn.getAttribute('data-project-id');
        this.openModal(id);
      });
    });

    // Re-bind mouse tilt listeners
    if (window.animations && window.animations.initCardTilt) {
      window.animations.initCardTilt();
    }
  }

  initFilters() {
    this.filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.currentFilter = btn.getAttribute('data-filter') || 'all';
        this.render();
      });
    });
  }

  openModal(projectId) {
    const proj = this.projects.find((p) => p.id === projectId);
    if (!proj || !this.modalBackdrop || !this.modalContent) return;

    const lang = this.getCurrentLang();
    const title = proj.title[lang] || proj.title['fr'];
    const subtitle = proj.subtitle[lang] || proj.subtitle['fr'];
    const desc = proj.longDescription ? proj.longDescription[lang] || proj.longDescription['fr'] : '';
    const metric = proj.metrics[lang] || proj.metrics['fr'];
    const tagsHtml = proj.tags.map((t) => `<span class="project-tag">${t}</span>`).join('');

    const isEn = lang === 'en';
    const closeLabel = isEn ? 'Close' : 'Fermer';

    this.modalContent.innerHTML = `
      <div style="margin-bottom: var(--space-lg);">
        <span class="badge badge-accent" style="margin-bottom: var(--space-xs);">${proj.category.toUpperCase()} · ${proj.year}</span>
        <h2 style="font-size: var(--text-2xl); margin-top: 0.5rem; margin-bottom: 0.25rem;">${title}</h2>
        <p style="color: var(--accent-secondary); font-weight: 500;">${subtitle}</p>
      </div>

      <div style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--space-lg); border: 1px solid var(--border-medium);">
        <img src="${proj.image}" alt="${title}" width="720" height="400" style="width: 100%; height: auto; object-fit: cover;">
      </div>

      <div style="margin-bottom: var(--space-lg);">
        <h4 style="font-size: var(--text-base); margin-bottom: var(--space-xs);">${isEn ? 'Architecture & Purpose' : 'Architecture & Objectifs'}</h4>
        <p style="font-size: var(--text-sm); line-height: 1.7; color: var(--text-secondary);">${desc}</p>
      </div>

      <div style="margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--bg-tertiary); border-radius: var(--radius-md); border-left: 3px solid var(--accent-secondary);">
        <strong style="color: var(--text-primary); font-size: var(--text-sm);">${isEn ? 'Measurable Impact:' : 'Impact Mesuré :'}</strong>
        <span style="color: var(--status-success); font-weight: 600; font-size: var(--text-sm); margin-left: 0.5rem;">${metric}</span>
      </div>

      <div style="margin-bottom: var(--space-xl);">
        <h4 style="font-size: var(--text-sm); margin-bottom: var(--space-xs);">${isEn ? 'Technologies:' : 'Technologies Clés :'}</h4>
        <div class="project-tags">${tagsHtml}</div>
      </div>

      <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
        ${
          proj.links.github && proj.links.github !== '#'
            ? `<a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: var(--text-xs); padding: 0.6rem 1.4rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>${isEn ? 'View Source Code' : 'Consulter le Code'}</span>
              </a>`
            : ''
        }
        <button type="button" class="btn btn-secondary modal-close-action" style="font-size: var(--text-xs); padding: 0.6rem 1.4rem;">
          ${closeLabel}
        </button>
      </div>
    `;

    this.modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    const closeBtn = this.modalBackdrop.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  closeModal() {
    if (!this.modalBackdrop) return;
    this.modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (this.activeTriggerBtn) {
      this.activeTriggerBtn.focus();
      this.activeTriggerBtn = null;
    }
  }

  initModalListeners() {
    if (!this.modalBackdrop) return;

    // Close on backdrop click
    this.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop || e.target.closest('.modal-close-btn') || e.target.closest('.modal-close-action')) {
        this.closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalBackdrop.classList.contains('is-open')) {
        this.closeModal();
      }
    });
  }
}

export const projects = new ProjectsManager();
