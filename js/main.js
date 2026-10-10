(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  /* Sticky header state */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile navigation */
  if (toggle && navLinks) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navLinks.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) setOpen(false);
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* Contact form validation (client-side demo) */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const clearErrors = () => {
      form.querySelectorAll('.form-field').forEach((field) => {
        field.classList.remove('has-error');
      });
    };

    const showStatus = (type, message) => {
      if (!status) return;
      status.className = `form-status is-${type}`;
      status.textContent = message;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();

      let valid = true;

      if (!name) {
        form.querySelector('[data-field="name"]')?.classList.add('has-error');
        valid = false;
      }
      if (!email || !emailPattern.test(email)) {
        form.querySelector('[data-field="email"]')?.classList.add('has-error');
        valid = false;
      }
      if (!subject) {
        form.querySelector('[data-field="subject"]')?.classList.add('has-error');
        valid = false;
      }
      if (!message) {
        form.querySelector('[data-field="message"]')?.classList.add('has-error');
        valid = false;
      }

      if (!valid) {
        showStatus('error', 'Please fix the highlighted fields and try again.');
        return;
      }

      /* Demo-only: no backend — simulate success */
      showStatus(
        'success',
        'Thanks for reaching out! This demo form doesn’t send email yet — connect it to a backend or Formspree when you’re ready.'
      );
      form.reset();
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-field')?.classList.remove('has-error');
      });
    });
  }
})();
