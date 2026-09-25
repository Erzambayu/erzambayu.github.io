'use strict';

/* ==================================================
   ERZAM BAYU — PORTFOLIO  (rebuilt 2026)
   Sections:
   1.  Theme toggle
   2.  Loader
   3.  Back-to-top
   4.  Sidebar toggle
   5.  Page navigation (tabs)
   6.  Portfolio filter
   7.  Project modal
   8.  Contact form
   9.  Skill bar animation
   10. Scroll reveal
   11. i18n (data-i18n driven)
   ================================================== */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ===== 1. THEME TOGGLE ===== */

const themeToggle = $('#theme-toggle');

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) { /* quota */ }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f4f6' : '#0a0a0b');
};

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
});

// sync initial aria state
setTheme(document.documentElement.getAttribute('data-theme') || 'dark');


/* ===== 2. LOADER ===== */

const loader = $('#loader');

window.addEventListener('load', () => {
  // small delay to let fonts/icons settle
  setTimeout(() => loader?.classList.add('hidden'), 200);
});


/* ===== 3. BACK TO TOP ===== */

const backToTop = $('#back-to-top');

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== 4. SIDEBAR TOGGLE ===== */

const sidebar     = $('[data-sidebar]');
const sidebarBtn  = $('[data-sidebar-btn]');
const sidebarContacts = sidebar?.querySelector('.sidebar__contacts');

const syncSidebarAccessibility = () => {
  const isDesktop = window.matchMedia('(min-width: 1250px)').matches;
  sidebarContacts?.setAttribute('aria-hidden', isDesktop || sidebar?.classList.contains('active') ? 'false' : 'true');
};

sidebarBtn?.addEventListener('click', () => {
  const expanded = !sidebar?.classList.contains('active');
  sidebar?.classList.toggle('active', expanded);
  syncSidebarAccessibility();
  sidebarBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
});
syncSidebarAccessibility();
window.addEventListener('resize', syncSidebarAccessibility, { passive: true });


/* ===== 5. PAGE NAVIGATION ===== */

const navLinks = $$('[data-nav-link]');
const pages    = $$('article[data-page]');
const validPages = pages.map(p => p.dataset.page);

let isTransitioning = false;

const activatePage = (pageName) => {
  if (!validPages.includes(pageName) || isTransitioning) return;

  const current = pages.find(p => p.classList.contains('active'));
  const next    = pages.find(p => p.dataset.page === pageName);
  if (!next || current === next) return;

  // update nav immediately
  navLinks.forEach(link => {
    const isActive = link.dataset.page === pageName;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (current) {
    // sequential: fade out old → swap → fade in new
    isTransitioning = true;
    current.classList.add('is-leaving');
    setTimeout(() => {
      current.classList.remove('active', 'is-leaving');
      next.classList.add('active');
      window.scrollTo(0, 0);
      isTransitioning = false;
    }, 180);
  } else {
    next.classList.add('active');
    window.scrollTo(0, 0);
  }
};

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const page = link.dataset.page;
    activatePage(page);
    sidebar?.classList.remove('active');
    syncSidebarAccessibility();
    sidebarBtn?.setAttribute('aria-expanded', 'false');
    try { localStorage.setItem('activePage', page); } catch (e) { /* quota */ }
    history.replaceState(null, '', '#' + page);
  });
});

// restore on load: URL hash > localStorage > default (about)
const restorePage = () => {
  const hash = location.hash.slice(1);
  if (hash && validPages.includes(hash)) {
    activatePage(hash);
  } else {
    const saved = (() => { try { return localStorage.getItem('activePage'); } catch (e) { return null; } })();
    activatePage(saved && validPages.includes(saved) ? saved : 'about');
  }
};

restorePage();

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (hash && validPages.includes(hash)) activatePage(hash);
});


/* ===== 6. PORTFOLIO FILTER ===== */

const filterBtns   = $$('[data-filter-btn]');
const selectBtn    = $('[data-select]');
const selectItems  = $$('[data-select-item]');
const selectValue = $('[data-select-value]');
const projectItems = $$('[data-filter-item]');

const filterProjects = (value) => {
  projectItems.forEach(item => {
    const match = value === 'all' || item.dataset.category === value;
    item.classList.toggle('active', match);
    item.setAttribute('aria-hidden', match ? 'false' : 'true');
  });
};

// desktop filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.filter;
    filterProjects(value);
    filterBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (selectValue) selectValue.textContent = btn.textContent;
  });
});

// mobile select
selectBtn?.addEventListener('click', () => {
  const list = selectBtn.nextElementSibling;
  const isOpen = list?.classList.contains('show');
  list?.classList.toggle('show');
  selectBtn.classList.toggle('active');
  selectBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
});

selectItems.forEach(item => {
  item.addEventListener('click', () => {
    const value = item.dataset.filter;
    selectValue.textContent = item.textContent;
    const list = selectBtn.nextElementSibling;
    list?.classList.remove('show');
    selectBtn.classList.remove('active');
    selectBtn.setAttribute('aria-expanded', 'false');
    filterProjects(value);

    // sync desktop buttons
    filterBtns.forEach(b => {
      const isActive = b.dataset.filter === value;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  });
});

filterProjects('all');

// close select on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.projects__select')) {
    const list = selectBtn?.nextElementSibling;
    list?.classList.remove('show');
    selectBtn?.classList.remove('active');
    selectBtn?.setAttribute('aria-expanded', 'false');
  }
});


/* ===== 7. PROJECT MODAL ===== */

const modalContainer = $('[data-modal]');
const modalOverlay   = $('[data-modal-overlay]');
const modalClose     = $('[data-modal-close]');
const modalImg       = $('[data-modal-img]');
const modalTitle     = $('[data-modal-title]');
const modalCategory  = $('[data-modal-category]');
const modalDesc      = $('[data-modal-desc]');
const modalTech      = $('[data-modal-tech]');
const modalActions   = $('[data-modal-actions]');

let lastFocus = null;

const openModal = () => {
  modalContainer?.classList.add('active');
  modalContainer?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modalClose?.focus(), 50);
};

const closeModal = () => {
  modalContainer?.classList.remove('active');
  modalContainer?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) {
    lastFocus.focus();
    lastFocus = null;
  }
};

// event delegation for project items
$$('[data-project-item]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    lastFocus = item;

    const img = item.querySelector('img');
    if (modalImg && img) {
      modalImg.src = img.currentSrc || img.src;
      modalImg.alt = img.alt;
    }
    modalTitle.textContent = item.dataset.title || '';
    modalCategory.textContent = item.dataset.category || '';
    modalDesc.textContent = item.dataset.description || '';

    // tech badges
    const tech = item.dataset.tech || '';
    modalTech.replaceChildren(...tech
      .split(',')
      .filter(Boolean)
      .map(t => {
        const badge = document.createElement('span');
        badge.className = 'tech-badge';
        badge.textContent = t.trim();
        return badge;
      }));

    // action buttons
    const live = item.dataset.live;
    const repo = item.dataset.github;
    modalActions.replaceChildren();

    if (live) {
      modalActions.append(createModalLink(live, 'primary', 'open-outline', 'modal.live'));
    }
    if (repo) {
      modalActions.append(createModalLink(repo, 'secondary', 'logo-github', 'modal.code'));
    }
    if (!live && !repo) {
      const privateBadge = document.createElement('span');
      privateBadge.className = 'tech-badge';
      privateBadge.dataset.i18n = 'modal.private';
      modalActions.append(privateBadge);
    }

    // re-apply current language to newly injected nodes
    applyLanguage(currentLang);

    openModal();
  });

  function createModalLink(url, variant, iconName, translationKey) {
    const link = document.createElement('a');
    link.href = url;
    link.className = variant;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const icon = document.createElement('ion-icon');
    icon.name = iconName;
    const label = document.createElement('span');
    label.dataset.i18n = translationKey;
    link.append(icon, label);
    return link;
  }
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

// ESC + focus trap
document.addEventListener('keydown', (e) => {
  if (!modalContainer?.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', modalContainer);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});


/* ===== 8. CONTACT FORM ===== */

const form        = $('[data-form]');
const formInputs  = $$('[data-form-input]');
const formBtn     = $('[data-form-btn]');
const formFeedback = $('[data-form-feedback]');

const checkFormValidity = () => {
  if (!form || !formBtn) return;
  formBtn.disabled = !form.checkValidity();
};

formInputs.forEach(input => {
  input.addEventListener('input', checkFormValidity);
});

form?.addEventListener('submit', async (e) => {
  if (!form.checkValidity()) return;
  e.preventDefault();

  const btnSpan = formBtn.querySelector('span');
  const originalText = btnSpan.textContent;

  formBtn.disabled = true;
  btnSpan.textContent = currentLang === 'id' ? 'Mengirim…' : 'Sending…';
  formFeedback.textContent = '';
  formFeedback.className = 'form__feedback';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      form.reset();
      formFeedback.className = 'form__feedback success';
      formFeedback.textContent = currentLang === 'id'
        ? 'Pesan terkirim. Terima kasih!'
        : 'Message sent. Thank you!';
    } else {
      throw new Error('Bad response');
    }
  } catch {
    formFeedback.className = 'form__feedback error';
    formFeedback.textContent = currentLang === 'id'
      ? 'Gagal mengirim. Coba lagi atau email langsung ke erzambayu@gmail.com.'
      : 'Failed to send. Try again or email erzambayu@gmail.com directly.';
  } finally {
    btnSpan.textContent = originalText;
    checkFormValidity();
  }
});


/* ===== 9. SKILL BAR ANIMATION ===== */

const skillBars = $$('.skill__fill[data-width]');

const observeWhenVisible = (targets, callback, options) => {
  if (!('IntersectionObserver' in window)) {
    targets.forEach(target => callback(target));
    return null;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) callback(entry.target, currentObserver);
    });
  }, options);
  targets.forEach(target => observer.observe(target));
  return observer;
};

const skillObserver = observeWhenVisible(skillBars, (bar, observer) => {
  const width = Math.min(100, Math.max(0, Number(bar.dataset.width) || 0));
  bar.style.width = width + '%';
  observer?.unobserve(bar);
}, { threshold: 0.3 });

/* ===== 10. SCROLL REVEAL (directional + staggered) ===== */

// apply directional reveal classes per element type
const revealTargets = $$('.service-card, .timeline__item, .skill, .project, .tech__item');

revealTargets.forEach(el => {
  if (el.classList.contains('timeline__item') || el.classList.contains('tech__item')) {
    el.classList.add('reveal-left');
  } else if (el.classList.contains('service-card')) {
    el.classList.add('reveal-right');
  } else {
    el.classList.add('reveal');
  }
});

// apply staggered delays within each group (cycle 1–6)
['.service-card', '.timeline__item', '.skill', '.project', '.tech__item'].forEach(sel => {
  $$(sel).forEach((el, i) => el.classList.add('stagger-' + ((i % 6) + 1)));
});

const revealObserver = observeWhenVisible(
  $$('.reveal, .reveal-left, .reveal-right'),
  (element, observer) => {
    element.classList.add('visible');
    observer?.unobserve(element);
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);


/* ===== 10a. TYPING ANIMATION ===== */

const typingEl = $('.sidebar__role');
let typingTimer = null;

function typeText(el, text, speed) {
  if (typingTimer) clearTimeout(typingTimer);
  el.textContent = '';
  el.classList.add('is-typing');
  let i = 0;
  (function step() {
    if (i < text.length) {
      el.textContent = text.slice(0, ++i);
      typingTimer = setTimeout(step, speed);
    }
  })();
}

if (typingEl) {
  const roleText = typingEl.textContent;
  // start after loader fades + slight delay
  setTimeout(() => typeText(typingEl, roleText, 45), 600);
}


/* ===== 11. i18n (data-i18n driven) ===== */

const translations = {
  id: {
    'nav.about': 'Tentang',
    'nav.resume': 'Resume',
    'nav.portfolio': 'Portofolio',
    'nav.contact': 'Kontak',

    'about.title': 'Tentang Saya',
    'about.p1': 'Game promoter & web developer yang berbasis di Jakarta. Saya punya pengalaman sekitar 2 tahun di bidang gaming marketing dan aktif mengembangkan skill di web development, networking, dan mobile device repair.',
    'about.p2': 'Saat ini saya di PT Indofun Digital Technology sebagai Game Promoter — banyak belajar strategi marketing digital dan community management. Sebelumnya sempat jadi IT Technician di PT IASA Multi Integrator (Cisco/Mikrotik) dan Apple UP Certified Mobile Technician.',

    'services.title': 'Yang Saya Kerjakan',
    'services.marketing': 'Game Marketing',
    'services.marketing_desc': 'Strategi pemasaran digital untuk game dengan fokus user acquisition dan community engagement.',
    'services.webdev': 'Web Development',
    'services.webdev_desc': 'Full-stack development dengan Python, Flask, JavaScript untuk aplikasi web modern.',
    'services.network': 'Network Engineering',
    'services.network_desc': 'Konfigurasi Cisco & Mikrotik, network security, dan system administration.',
    'services.repair': 'Mobile Repair',
    'services.repair_desc': 'Apple UP Certified technician untuk repair iPhone dan perangkat mobile lainnya.',

    'tech.title': 'Teknologi yang Saya Gunakan',

    'resume.title': 'Resume',
    'resume.education': 'Pendidikan',
    'resume.experience': 'Pengalaman',
    'resume.tech_skills': 'Kemampuan Teknis',
    'resume.soft_skills': 'Kemampuan Non-Teknis',

    'portfolio.title': 'Portofolio',
    'portfolio.select': 'Pilih kategori',

    'contact.title': 'Kontak',
    'contact.form_title': 'Form Kontak',
    'contact.fullname': 'Nama Lengkap',
    'contact.email': 'Alamat Email',
    'contact.message': 'Pesan Anda',
    'contact.send': 'Kirim Pesan',

    'email': 'Email',
    'location': 'Lokasi',
    'download_cv': 'Unduh CV',
    'show_contacts': 'Tampilkan Kontak',

    'modal.tech': 'Tech Stack',
    'modal.live': 'Demo Live',
    'modal.code': 'Lihat Kode',
    'modal.private': 'Proyek Privat',
  },

  en: {
    'nav.about': 'About',
    'nav.resume': 'Resume',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',

    'about.title': 'About Me',
    'about.p1': 'Game promoter & web developer based in Jakarta. I have around 2 years of experience in gaming marketing and am actively developing skills in web development, networking, and mobile device repair.',
    'about.p2': 'Currently at PT Indofun Digital Technology as a Game Promoter — learning digital marketing strategies and community management. Previously an IT Technician at PT IASA Multi Integrator (Cisco/Mikrotik) and an Apple UP Certified Mobile Technician.',

    'services.title': "What I'm Doing",
    'services.marketing': 'Game Marketing',
    'services.marketing_desc': 'Digital marketing strategies for games focusing on user acquisition and community engagement.',
    'services.webdev': 'Web Development',
    'services.webdev_desc': 'Full-stack development with Python, Flask, JavaScript for modern web applications.',
    'services.network': 'Network Engineering',
    'services.network_desc': 'Cisco & Mikrotik configuration, network security, and system administration.',
    'services.repair': 'Mobile Repair',
    'services.repair_desc': 'Apple UP Certified technician for iPhone and other mobile device repairs.',

    'tech.title': 'Technologies I Use',

    'resume.title': 'Resume',
    'resume.education': 'Education',
    'resume.experience': 'Experience',
    'resume.tech_skills': 'Technical Skills',
    'resume.soft_skills': 'Non-Technical Skills',

    'portfolio.title': 'Portfolio',
    'portfolio.select': 'Select category',

    'contact.title': 'Contact',
    'contact.form_title': 'Contact Form',
    'contact.fullname': 'Full name',
    'contact.email': 'Email address',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',

    'email': 'Email',
    'location': 'Location',
    'download_cv': 'Download CV',
    'show_contacts': 'Show Contacts',

    'modal.tech': 'Tech Stack',
    'modal.live': 'Live Demo',
    'modal.code': 'View Code',
    'modal.private': 'Private Project',
  }
};

let currentLang = (() => {
  try { return localStorage.getItem('preferredLang') || 'id'; }
  catch (e) { return 'id'; }
})();

function applyLanguage(lang) {
  currentLang = lang;
  try { localStorage.setItem('preferredLang', lang); } catch (e) { /* quota */ }
  document.documentElement.lang = lang;

  const dict = translations[lang] || translations.id;

  // text content
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // placeholders
  $$('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  // language buttons
  $$('.lang__btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

// language toggle buttons
$$('.lang__btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// apply on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyLanguage(currentLang));
} else {
  applyLanguage(currentLang);
}
