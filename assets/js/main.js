/* ═══════════════════════════════════════════════════════════════
   SOLE HARMONY — Main JavaScript
   Nav, Theme, RTL, Animations, Validation, Carousel, Countdown
   ═══════════════════════════════════════════════════════════════ */

;(function () {
  'use strict';

  /* ── DOM References ──────────────────────────────────────── */
  const html = document.documentElement;
  const body = document.body;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleDrawer = document.getElementById('themeToggleDrawer');
  const rtlToggle = document.getElementById('rtlToggle');
  const rtlToggleDrawer = document.getElementById('rtlToggleDrawer');

  /* ── Theme Management ────────────────────────────────────── */
  function getPreferredTheme() {
    const stored = localStorage.getItem('sh-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('sh-theme', theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  setTheme(getPreferredTheme());

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  /* ── RTL Management ──────────────────────────────────────── */
  function getPreferredDir() {
    return localStorage.getItem('sh-dir') || 'ltr';
  }

  function setDir(dir) {
    html.setAttribute('dir', dir);
    if (dir === 'rtl') {
      body.classList.add('rtl');
    } else {
      body.classList.remove('rtl');
    }
    localStorage.setItem('sh-dir', dir);
  }

  function toggleDir() {
    const current = html.getAttribute('dir') || 'ltr';
    setDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  setDir(getPreferredDir());

  document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
    btn.addEventListener('click', toggleDir);
  });

  /* ── Navbar Scroll Effect ────────────────────────────────── */
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile Drawer ───────────────────────────────────────── */
  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    body.style.overflow = 'hidden';
    if (hamburger) {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    body.style.overflow = '';
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  function toggleDrawer() {
    if (!mobileDrawer) return;
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (hamburger) hamburger.addEventListener('click', toggleDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  // Close drawer on link click
  document.querySelectorAll('.drawer-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Scroll Reveal Animation ─────────────────────────────── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();

  /* ── Hero Parallax ───────────────────────────────────────── */
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg[data-parallax]');
    if (!heroBg) return;

    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.35;
      heroBg.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  initParallax();

  /* ── Typing Effect ───────────────────────────────────────── */
  function initTypingEffect() {
    const typingEl = document.querySelector('[data-typing]');
    if (!typingEl) return;

    const texts = typingEl.getAttribute('data-typing').split('|');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 2000;

    function type() {
      const current = texts[textIndex];

      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        delay = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }

    type();
  }

  initTypingEffect();

  /* ── Testimonial Carousel ────────────────────────────────── */
  function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track || !dots.length) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });

    // Auto-advance
    let autoPlay = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 6000);

    track.closest('.carousel-wrapper').addEventListener('mouseenter', function () {
      clearInterval(autoPlay);
    });

    track.closest('.carousel-wrapper').addEventListener('mouseleave', function () {
      autoPlay = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 6000);
    });
  }

  initCarousel();

  /* ── Tabs ─────────────────────────────────────────────────── */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });

        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  initTabs();

  /* ── Pressure Point Map (Interactive) ────────────────────── */
  function initPressureMap() {
    const points = document.querySelectorAll('.pressure-point');
    const pills = document.querySelectorAll('.point-pill');
    const infoPanels = document.querySelectorAll('.pressure-info');
    if (!points.length && !pills.length) return;

    function activateZone(targetId) {
      if (!targetId) return;

      // Synchronize map hotspots
      points.forEach(function (p) {
        const isMatch = p.getAttribute('data-target') === targetId;
        p.classList.toggle('active', isMatch);
        p.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
      });

      // Synchronize navigation pills
      pills.forEach(function (pill) {
        const isMatch = pill.getAttribute('data-target') === targetId;
        pill.classList.toggle('active', isMatch);
        pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Switch active panel
      infoPanels.forEach(function (info) {
        const isMatch = info.id === targetId;
        info.classList.toggle('active', isMatch);
      });
    }

    // Map point listeners
    points.forEach(function (point) {
      point.addEventListener('click', function () {
        activateZone(point.getAttribute('data-target'));
      });

      point.addEventListener('mouseenter', function () {
        activateZone(point.getAttribute('data-target'));
      });
    });

    // Pill tab listeners
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        activateZone(pill.getAttribute('data-target'));
      });
    });

    // Default: activate first point or pill
    const initialTarget = points[0]?.getAttribute('data-target') || pills[0]?.getAttribute('data-target');
    if (initialTarget) {
      activateZone(initialTarget);
    }
  }

  initPressureMap();

  /* ── Countdown Timer ─────────────────────────────────────── */
  function initCountdown() {
    const countdownEl = document.querySelector('[data-countdown]');
    if (!countdownEl) return;

    const targetDate = new Date(countdownEl.getAttribute('data-countdown')).getTime();
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMins');
    const secsEl = document.getElementById('countSecs');

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minsEl) minsEl.textContent = '0';
        if (secsEl) secsEl.textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minsEl) minsEl.textContent = mins;
      if (secsEl) secsEl.textContent = secs;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  initCountdown();

  /* ── Form Validation ─────────────────────────────────────── */
  function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate]');
    if (!forms.length) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, message) {
      input.classList.add('error');
      input.classList.remove('success');
      const errorEl = input.closest('.form-group').querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    }

    function showSuccess(input) {
      input.classList.remove('error');
      input.classList.add('success');
      const errorEl = input.closest('.form-group').querySelector('.form-error');
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }

    function validateField(input) {
      const type = input.getAttribute('data-type');
      const value = input.value.trim();

      if (input.hasAttribute('required') && !value) {
        showError(input, 'This field is required');
        return false;
      }

      if (type === 'email' && value && !emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }

      if (type === 'password' && value && value.length < 8) {
        showError(input, 'Password must be at least 8 characters');
        return false;
      }

      if (type === 'confirm-password') {
        const passwordInput = input.closest('form').querySelector('[data-type="password"]');
        if (passwordInput && value !== passwordInput.value) {
          showError(input, 'Passwords do not match');
          return false;
        }
      }

      if (value) {
        showSuccess(input);
      }
      return true;
    }

    forms.forEach(function (form) {
      const inputs = form.querySelectorAll('.form-input, .form-textarea');

      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          validateField(input);
        });

        input.addEventListener('input', function () {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(function (input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        // Checkbox validation (terms)
        const termsCheckbox = form.querySelector('[data-type="terms"]');
        if (termsCheckbox && !termsCheckbox.checked) {
          isValid = false;
          const errorEl = termsCheckbox.closest('.form-group').querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = 'You must accept the Terms & Conditions';
            errorEl.classList.add('visible');
          }
        } else if (termsCheckbox) {
          const errorEl = termsCheckbox.closest('.form-group').querySelector('.form-error');
          if (errorEl) errorEl.classList.remove('visible');
        }

        if (isValid) {
          const successMsg = form.querySelector('.form-success-msg');
          if (successMsg) {
            successMsg.classList.add('visible');
            form.reset();
            inputs.forEach(function (inp) {
              inp.classList.remove('success');
              inp.classList.remove('error');
            });
            setTimeout(function () {
              successMsg.classList.remove('visible');
            }, 4000);
          }
        }
      });
    });
  }

  initFormValidation();

  /* ── Password Toggle ─────────────────────────────────────── */
  function initPasswordToggle() {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        const input = toggle.closest('.password-wrapper').querySelector('input');
        if (input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
        } else {
          input.type = 'password';
          toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        }
      });
    });
  }

  initPasswordToggle();

  /* ── Coming Soon Email Form ──────────────────────────────── */
  function initComingSoonForm() {
    const form = document.getElementById('comingSoonForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailInput && emailRegex.test(emailInput.value.trim())) {
        const successMsg = form.querySelector('.form-success-msg');
        if (successMsg) {
          successMsg.classList.add('visible');
          emailInput.value = '';
          setTimeout(function () {
            successMsg.classList.remove('visible');
          }, 4000);
        }
      }
    });
  }

  initComingSoonForm();

  /* ── Back to Top Button ──────────────────────────────────── */
  function initBackToTop() {
    let backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'backToTop';
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.setAttribute('aria-label', 'Back to top');
      backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
      document.body.appendChild(backToTopBtn);
    }

    function toggleBackToTop() {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  initBackToTop();

  /* ── Lucide Icons Init ───────────────────────────────────── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

})();
