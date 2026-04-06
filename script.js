/* ============================================================
   MAXIMILIEN MOREAU — Portfolio JS
   - Language switcher (FR / EN)
   - Navbar scroll effect
   - Active nav link on scroll
   - Scroll reveal animations
   - Contact form handling
   - Project card keyboard access
   ============================================================ */

/* ============================================================
   DARK MODE
   ============================================================ */
const THEME_KEY = 'mm_theme';

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-lightbulb' : 'fa-solid fa-moon';
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) { /* ignore */ }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  let theme = 'light';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  } catch (e) { /* ignore */ }
  setTheme(theme);
}

/* ============================================================
   LANGUAGE SWITCHER
   ============================================================ */
const LANG_KEY = 'mm_lang';

function setLang(lang) {
  // Toggle all [data-lang] elements
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.hidden = (el.dataset.lang !== lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update active button states
  const btnFr = document.getElementById('btnFr');
  const btnEn = document.getElementById('btnEn');
  if (btnFr && btnEn) {
    btnFr.classList.toggle('active', lang === 'fr');
    btnEn.classList.toggle('active', lang === 'en');
  }

  // Update page title
  const titles = {
    fr: 'Maximilien Moreau — Marketing, Web & IA',
    en: 'Maximilien Moreau — Marketing, Web & AI'
  };
  document.title = titles[lang] || titles.fr;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descs = {
      fr: 'Portfolio de Maximilien Moreau — Expert en marketing digital, développement web et intelligence artificielle.',
      en: 'Portfolio of Maximilien Moreau — Digital marketing, web development and artificial intelligence expert.'
    };
    metaDesc.setAttribute('content', descs[lang] || descs.fr);
  }

  // Persist preference
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) { /* ignore */ }
}

function initLang() {
  let lang = 'fr';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'fr' || stored === 'en') {
      lang = stored;
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.userLanguage || '';
      if (browserLang.toLowerCase().startsWith('en')) {
        lang = 'en';
      }
    }
  } catch (e) { /* ignore */ }

  setLang(lang);
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

function addRevealClasses() {
  // Add reveal classes to section headings and content blocks
  const selectors = [
    '#apropos .col-lg-4',
    '#apropos .col-lg-8',
    '#expertises .text-center',
    '#projets .text-center',
    '#approche .text-center',
    '#ia .col-lg-5',
    '#ia .col-lg-7',
    '#parcours .text-center',
    '#blog .d-flex',
    '#contact .text-center',
  ];

  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el && !el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  // Stagger rows of cards
  const staggerContainers = [
    '#expertises .row',
    '#projets .row',
    '#approche .row',
    '#ia .row',
    '#blog .row',
  ];

  staggerContainers.forEach(sel => {
    const el = document.querySelector(sel);
    if (el && !el.classList.contains('reveal-stagger')) {
      el.classList.add('reveal-stagger');
    }
  });
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile nav if open
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
        if (bsCollapse) bsCollapse.hide();
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   PROJECT CARDS — KEYBOARD ACCESSIBILITY
   ============================================================ */
function initProjectCards() {
  document.querySelectorAll('.project-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const msgDiv = document.getElementById('formMsg');
  if (!form || !msgDiv) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]');
    const email   = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showFormMsg('error', 'Veuillez remplir tous les champs requis. / Please fill in all required fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showFormMsg('error', 'Adresse email invalide. / Invalid email address.');
      return;
    }

    // Simulate sending (replace with actual backend/service)
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Envoi en cours...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      form.reset();
      showFormMsg('success',
        document.documentElement.lang === 'en'
          ? 'Message sent! I\'ll get back to you soon.'
          : 'Message envoyé ! Je vous répondrai rapidement.'
      );
    }, 1500);
  });

  function showFormMsg(type, text) {
    msgDiv.className = type;
    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 6000);
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initNavbarScroll();
  initActiveNav();
  addRevealClasses();
  initScrollReveal();
  initSmoothScroll();
  initProjectCards();
  initContactForm();
});
