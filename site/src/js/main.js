/* ============================================
   PITON LLC — Main JavaScript
   Scroll Reveals, Animated Counters, Mobile Nav
   ============================================ */

(function () {
  'use strict';

  // =========================================
  // 1. ANIMATED COUNTERS
  // =========================================
  function animateCounter(element, target, duration) {
    const isFloat = String(target).includes('.');
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (isFloat) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isFloat ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // =========================================
  // 2. SCROLL REVEAL (Intersection Observer)
  // =========================================
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');

    if (!revealElements.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counters inside this element
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach((counter) => {
              if (!counter.dataset.animated) {
                const target = parseFloat(counter.dataset.count);
                animateCounter(counter, target, 2000);
                counter.dataset.animated = 'true';
              }
            });

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // =========================================
  // 3. NAVBAR SCROLL EFFECT
  // =========================================
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // =========================================
  // 4. MOBILE NAVIGATION
  // =========================================
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    const links = menu.querySelectorAll('.mobile-menu__link');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================
  // 5. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // =========================================
  // 6. CURRENT YEAR IN FOOTER
  // =========================================
  function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // =========================================
  // 7. QUOTE MODAL
  // =========================================
  function initQuoteModal() {
    // Inject modal HTML into every page
    const modalHTML = `
    <div class="quote-modal-overlay" id="quoteModalOverlay" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle">
      <div class="quote-modal" id="quoteModal">

        <!-- Form View -->
        <div id="quoteFormView">
          <div class="quote-modal__header">
            <div class="quote-modal__header-content">
              <div class="quote-modal__eyebrow">Request for Quote</div>
              <h2 class="quote-modal__title" id="quoteModalTitle">Get a Technical Quote</h2>
            </div>
            <button class="quote-modal__close" id="quoteModalClose" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="quote-modal__body">
            <form id="quoteForm">
              <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
              <input type="hidden" name="subject" value="PITON — New Quote Request" />
              <input type="hidden" name="from_name" value="PITON Website" />
              <input type="checkbox" name="botcheck" style="display:none" />

              <div class="qf-row">
                <div class="qf-group">
                  <label class="qf-label" for="qf-name">Full Name <span>*</span></label>
                  <input class="qf-input" type="text" id="qf-name" name="name" placeholder="Ivan Petrov" required />
                </div>
                <div class="qf-group">
                  <label class="qf-label" for="qf-company">Company <span>*</span></label>
                  <input class="qf-input" type="text" id="qf-company" name="company" placeholder="Your company name" required />
                </div>
              </div>

              <div class="qf-row">
                <div class="qf-group">
                  <label class="qf-label" for="qf-email">Email <span>*</span></label>
                  <input class="qf-input" type="email" id="qf-email" name="email" placeholder="i.petrov@company.ru" required />
                </div>
                <div class="qf-group">
                  <label class="qf-label" for="qf-phone">Phone</label>
                  <input class="qf-input" type="tel" id="qf-phone" name="phone" placeholder="+7 (___) ___-__-__" />
                </div>
              </div>

              <div class="qf-group">
                <label class="qf-label" for="qf-product">Product Interest <span>*</span></label>
                <select class="qf-select" id="qf-product" name="product" required>
                  <option value="" disabled selected>Select a product line</option>
                  <option value="VG Series — Cooling Tower Fans">VG Series — Cooling Tower Fans</option>
                  <option value="RK Series — Fan Impellers">RK Series — Fan Impellers</option>
                  <option value="D Series — Composite Diffusers">D Series — Composite Diffusers</option>
                  <option value="AVO Series — Air-Cooling Fans">AVO Series — Air-Cooling Fans</option>
                  <option value="Electric Motors (ВАСО / АСВО / ВАСВ)">Electric Motors (ВАСО / АСВО / ВАСВ)</option>
                  <option value="Complete Fan System Assembly">Complete Fan System Assembly</option>
                  <option value="Replacement Parts & Service">Replacement Parts & Service</option>
                  <option value="Other / Custom Requirement">Other / Custom Requirement</option>
                </select>
              </div>

              <div class="qf-row">
                <div class="qf-group">
                  <label class="qf-label" for="qf-model">Specific Model</label>
                  <input class="qf-input" type="text" id="qf-model" name="model" placeholder="e.g., VG-70SK, RK-50-6K" />
                </div>
                <div class="qf-group">
                  <label class="qf-label" for="qf-quantity">Quantity</label>
                  <input class="qf-input" type="text" id="qf-quantity" name="quantity" placeholder="e.g., 4 units" />
                </div>
              </div>

              <div class="qf-group">
                <label class="qf-label" for="qf-details">Project Details</label>
                <textarea class="qf-textarea" id="qf-details" name="details" placeholder="Describe your requirements: cooling tower type, existing equipment, site conditions..."></textarea>
              </div>

              <div class="quote-modal__footer">
                <button type="submit" class="quote-modal__submit" id="quoteSubmitBtn">
                  Submit Request
                </button>
                <span class="quote-modal__response-info">
                  Our engineering team responds<br />within 24 hours.
                </span>
              </div>
            </form>
          </div>
        </div>

        <!-- Success View -->
        <div class="quote-modal__success" id="quoteSuccessView">
          <div class="quote-modal__header" style="border: none;">
            <div></div>
            <button class="quote-modal__close" id="quoteModalCloseSuccess" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="quote-modal__success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 class="quote-modal__success-title">Request Received</h3>
          <p class="quote-modal__success-text">
            Thank you for your inquiry. Our engineering team will review your requirements and respond with specifications and pricing.
          </p>
          <div class="quote-modal__success-steps">
            <div class="quote-modal__step">
              <div class="quote-modal__step-number">1</div>
              <div class="quote-modal__step-text">Confirmation sent to your email</div>
            </div>
            <div class="quote-modal__step">
              <div class="quote-modal__step-number">2</div>
              <div class="quote-modal__step-text">Engineering review within 24 hours</div>
            </div>
            <div class="quote-modal__step">
              <div class="quote-modal__step-number">3</div>
              <div class="quote-modal__step-text">Technical specification & pricing delivered</div>
            </div>
          </div>
        </div>

      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('quoteModalOverlay');
    const formView = document.getElementById('quoteFormView');
    const successView = document.getElementById('quoteSuccessView');
    const form = document.getElementById('quoteForm');
    const submitBtn = document.getElementById('quoteSubmitBtn');

    if (!overlay) return;

    // Open modal — intercept ALL "Request Quote" links/buttons
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('a, button');
      if (!trigger) return;

      const text = trigger.textContent.trim().toLowerCase();
      const href = trigger.getAttribute('href');

      // Match "Request Quote" buttons/links (navbar CTA, sidebar CTA, etc.)
      const isQuoteTrigger =
        text.includes('request quote') ||
        text.includes('request a quote') ||
        text.includes('request technical documents');

      // Also match links pointing to contact.html from CTA buttons
      const isContactCTA =
        href === '/contact.html' &&
        (trigger.classList.contains('btn') || trigger.classList.contains('navbar__cta'));

      if (isQuoteTrigger || isContactCTA) {
        e.preventDefault();
        openModal();
      }
    });

    // Close handlers
    document.getElementById('quoteModalClose')?.addEventListener('click', closeModal);
    document.getElementById('quoteModalCloseSuccess')?.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });

    function openModal() {
      // Reset to form view
      formView.style.display = '';
      successView.classList.remove('active');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus first input after animation
      setTimeout(() => {
        document.getElementById('qf-name')?.focus();
      }, 400);
    }

    function closeModal() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // Show success view
          formView.style.display = 'none';
          successView.classList.add('active');
        } else {
          // Fallback: open mailto with form data
          fallbackMailto(formData);
          formView.style.display = 'none';
          successView.classList.add('active');
        }
      } catch (err) {
        // Network error — fallback to mailto
        fallbackMailto(formData);
        formView.style.display = 'none';
        successView.classList.add('active');
      }
    });

    function fallbackMailto(formData) {
      const name = formData.get('name') || '';
      const company = formData.get('company') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const product = formData.get('product') || '';
      const model = formData.get('model') || '';
      const quantity = formData.get('quantity') || '';
      const details = formData.get('details') || '';

      const subject = encodeURIComponent(`Quote Request — ${company}`);
      const body = encodeURIComponent(
        `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\n\nProduct: ${product}\nModel: ${model}\nQuantity: ${quantity}\n\nDetails:\n${details}`
      );

      window.open(`mailto:pitonltd@mail.ru?subject=${subject}&body=${body}`, '_blank');
    }
  }

  // =========================================
  // 8. CONTACT INFO MODAL
  // =========================================
  function initContactModal() {
    // Inject contact info modal HTML
    const contactHTML = `
    <div class="quote-modal-overlay" id="contactModalOverlay" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
      <div class="quote-modal" style="max-width: 520px;">
        <div class="quote-modal__header">
          <div class="quote-modal__header-content">
            <div class="quote-modal__eyebrow">Contact Information</div>
            <h2 class="quote-modal__title" id="contactModalTitle">Get in Touch</h2>
          </div>
          <button class="quote-modal__close" id="contactModalClose" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="contact-modal__body">
          <!-- Phone -->
          <div class="contact-modal__item">
            <div class="contact-modal__item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div class="contact-modal__item-content">
              <div class="contact-modal__item-label">Phone</div>
              <div class="contact-modal__item-value">
                <a href="tel:+74956616793">+7 (495) 661-67-93</a>
              </div>
              <div class="contact-modal__item-sub">Mon–Fri: 9:00–18:00 (MSK)</div>
            </div>
          </div>

          <!-- Email -->
          <div class="contact-modal__item">
            <div class="contact-modal__item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div class="contact-modal__item-content">
              <div class="contact-modal__item-label">Email</div>
              <div class="contact-modal__item-value">
                <a href="mailto:pitonltd@mail.ru">pitonltd@mail.ru</a>
              </div>
              <div class="contact-modal__item-sub">We respond within 24 hours</div>
            </div>
          </div>

          <!-- Address -->
          <div class="contact-modal__item">
            <div class="contact-modal__item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="contact-modal__item-content">
              <div class="contact-modal__item-label">Office Address</div>
              <div class="contact-modal__item-value">
                RF, 111395, Moscow<br />ul. Yunosti, d.5, str.3
              </div>
              <div class="contact-modal__item-sub">Metro: Perovo / Novogireevo</div>
            </div>
          </div>

          <!-- Hours -->
          <div class="contact-modal__item">
            <div class="contact-modal__item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="contact-modal__item-content">
              <div class="contact-modal__item-label">Working Hours</div>
              <div class="contact-modal__item-value">Mon–Fri: 9:00 – 18:00</div>
              <div class="contact-modal__item-sub">Moscow Standard Time (MSK, UTC+3)</div>
            </div>
          </div>

          <div class="contact-modal__divider"></div>

          <!-- CTA to quote form -->
          <div class="contact-modal__cta">
            <p class="contact-modal__cta-text">Need a technical quote? Use our RFQ form:</p>
            <button class="quote-modal__submit" id="contactToQuoteBtn" style="width: 100%;">Request a Quote</button>
          </div>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', contactHTML);

    const overlay = document.getElementById('contactModalOverlay');
    if (!overlay) return;

    // Inject "Contact" button into navbar (before CTA)
    const navbarCta = document.querySelector('.navbar__cta');
    if (navbarCta) {
      const contactBtn = document.createElement('button');
      contactBtn.className = 'navbar__contact-btn';
      contactBtn.id = 'navContactBtn';
      contactBtn.textContent = 'Contact';
      contactBtn.setAttribute('aria-label', 'View contact information');
      navbarCta.parentNode.insertBefore(contactBtn, navbarCta);
    }

    // Also add to mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      const lastLink = mobileMenu.querySelector('.mobile-menu__link:last-of-type');
      if (lastLink) {
        const mobileContactBtn = document.createElement('button');
        mobileContactBtn.className = 'btn btn--outline mobile-contact-trigger';
        mobileContactBtn.textContent = 'Contact Info';
        mobileContactBtn.style.cssText = 'margin-top:8px; width:100%; background:transparent; border:1px solid rgba(255,255,255,0.3); color:white; cursor:pointer;';
        lastLink.insertAdjacentElement('afterend', mobileContactBtn);
        mobileContactBtn.addEventListener('click', () => {
          // Close mobile menu first
          mobileMenu.classList.remove('active');
          document.getElementById('navToggle')?.classList.remove('active');
          document.body.style.overflow = '';
          openContactModal();
        });
      }
    }

    // Open handlers
    document.getElementById('navContactBtn')?.addEventListener('click', openContactModal);

    // Close handlers
    document.getElementById('contactModalClose')?.addEventListener('click', closeContactModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeContactModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeContactModal();
      }
    });

    // "Request a Quote" button inside contact modal — switches to quote modal
    document.getElementById('contactToQuoteBtn')?.addEventListener('click', () => {
      closeContactModal();
      setTimeout(() => {
        document.getElementById('quoteModalOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
        const formView = document.getElementById('quoteFormView');
        const successView = document.getElementById('quoteSuccessView');
        const form = document.getElementById('quoteForm');
        if (formView) formView.style.display = '';
        if (successView) successView.classList.remove('active');
        if (form) form.reset();
        setTimeout(() => document.getElementById('qf-name')?.focus(), 400);
      }, 200);
    });

    function openContactModal() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeContactModal() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // =========================================
  // INITIALIZE
  // =========================================
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    setCurrentYear();
    initQuoteModal();
    initContactModal();
  });

})();
