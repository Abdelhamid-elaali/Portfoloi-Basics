/**
 * form.js — Contact Form Validation, Static Host Submission & Clipboard Toast
 */

// Configurable endpoint: Web3Forms, Formspree, or local fallback
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // Replace with personal key if using Web3Forms

class ContactManager {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.statusEl = document.getElementById('form-status');
    this.submitBtn = document.getElementById('form-submit-btn');
    this.toastContainer = document.getElementById('toast-container');
  }

  init() {
    this.initForm();
    this.initCopyCards();
  }

  showToast(message, isError = false) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isError ? '#ef4444' : '#10b981'}" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    // Force layout reflow for animation
    void toast.offsetWidth;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  initCopyCards() {
    const copyCards = document.querySelectorAll('[data-copy-value]');
    copyCards.forEach((card) => {
      card.addEventListener('click', async () => {
        const value = card.getAttribute('data-copy-value');
        if (!value) return;

        const isEn = document.documentElement.lang === 'en';
        const successMsg = isEn ? 'Copied to clipboard!' : 'Copié dans le presse-papier !';
        const failMsg = isEn ? 'Failed to copy' : 'Échec de la copie';

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            // Fallback for non-https or older environments
            const textArea = document.createElement('textarea');
            textArea.value = value;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
          }
          this.showToast(`${value} — ${successMsg}`);
        } catch {
          this.showToast(failMsg, true);
        }
      });
    });
  }

  initForm() {
    if (!this.form) return;

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isEn = document.documentElement.lang === 'en';
      const nameInput = this.form.querySelector('#contact-name');
      const emailInput = this.form.querySelector('#contact-email');
      const msgInput = this.form.querySelector('#contact-message');
      const honeypot = this.form.querySelector('#contact-hp');

      // Honeypot bot protection
      if (honeypot && honeypot.value.trim() !== '') {
        // Silently fake success to bots
        this.setFormStatus(
          isEn ? 'Thank you! Your message has been sent.' : 'Merci ! Votre message a bien été envoyé.',
          'success'
        );
        this.form.reset();
        return;
      }

      // Basic client-side validation
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const msgVal = msgInput ? msgInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!nameVal || !emailVal || !emailRegex.test(emailVal) || !msgVal) {
        this.setFormStatus(
          isEn ? 'Please fill in all required fields with a valid email.' : 'Veuillez remplir tous les champs avec une adresse email valide.',
          'error'
        );
        return;
      }

      // Set loading state
      const origBtnText = this.submitBtn ? this.submitBtn.innerHTML : '';
      if (this.submitBtn) {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `
          <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <span>${isEn ? 'Sending...' : 'Envoi en cours...'}</span>
        `;
      }

      try {
        // If placeholder access key, offer direct fallback
        if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
          // Open mailto fallback smoothly
          const subject = encodeURIComponent(`Portfolio Inquiry from ${nameVal}`);
          const body = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${msgVal}`);
          window.location.href = `mailto:abdelhamidelaali@gmail.com?subject=${subject}&body=${body}`;

          this.setFormStatus(
            isEn
              ? 'Opening your email client... You can also email directly at abdelhamidelaali@gmail.com'
              : "Ouverture de votre client email... Vous pouvez aussi écrire à abdelhamidelaali@gmail.com",
            'success'
          );
          this.form.reset();
        } else {
          const formData = new FormData(this.form);
          formData.append('access_key', WEB3FORMS_ACCESS_KEY);

          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });

          if (res.ok) {
            this.setFormStatus(
              isEn ? 'Thank you! Your message has been sent.' : 'Merci ! Votre message a bien été envoyé.',
              'success'
            );
            this.form.reset();
          } else {
            throw new Error('Submission failed');
          }
        }
      } catch {
        this.setFormStatus(
          isEn
            ? 'Submission error. Please email directly at abdelhamidelaali@gmail.com'
            : "Erreur lors de l'envoi. Veuillez écrire directement à abdelhamidelaali@gmail.com",
          'error'
        );
      } finally {
        if (this.submitBtn) {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = origBtnText;
        }
      }
    });
  }

  setFormStatus(msg, type) {
    if (!this.statusEl) return;
    this.statusEl.textContent = msg;
    this.statusEl.style.display = 'block';
    this.statusEl.style.color = type === 'error' ? 'var(--status-error)' : 'var(--status-success)';
    this.statusEl.style.fontSize = 'var(--text-sm)';
    this.statusEl.style.marginTop = 'var(--space-sm)';
    this.statusEl.style.fontWeight = '500';
  }
}

export const contact = new ContactManager();
