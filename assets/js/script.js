'use strict';

// ============================================
// THEME TOGGLE (light/dark)
// ============================================

const themeToggleBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) { /* ignore quota */ }
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    themeToggleBtn.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
  }
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "light" ? "#f5f5f7" : "#1e1e1f");
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
  });
  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
}



// ============================================
// LOADING SCREEN
// ============================================

const loadingScreen = document.getElementById("loading-screen");

window.addEventListener("load", function () {
  setTimeout(function () {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  }, 500);
});



// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    if (backToTopBtn) backToTopBtn.classList.add("visible");
  } else {
    if (backToTopBtn) backToTopBtn.classList.remove("visible");
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}



// element toggle function
const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
    const expanded = sidebar && sidebar.classList.contains("active");
    sidebarBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
    const expanded = this.classList.contains("active");
    this.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) {
      elementToggleFunc(select);
      select.setAttribute("aria-expanded", "false");
    }
    filterFunc(selectedValue);
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formFeedback = document.querySelector("[data-form-feedback]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form && form.checkValidity()) {
      if (formBtn) formBtn.removeAttribute("disabled");
    } else {
      if (formBtn) formBtn.setAttribute("disabled", "");
    }
  });
}

// AJAX submit via Formspree so user stays on the page with inline feedback.
if (form) {
  form.addEventListener("submit", async function (e) {
    if (!form.checkValidity()) return;
    e.preventDefault();

    const originalLabel = formBtn ? formBtn.querySelector("span").textContent : "";
    if (formBtn) {
      formBtn.setAttribute("disabled", "");
      formBtn.querySelector("span").textContent = "Sending…";
    }
    if (formFeedback) {
      formFeedback.textContent = "";
      formFeedback.className = "form-feedback";
    }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        form.reset();
        if (formFeedback) {
          formFeedback.className = "form-feedback success";
          formFeedback.textContent = "Pesan terkirim. Terima kasih!";
        }
      } else {
        throw new Error("Bad response");
      }
    } catch (err) {
      if (formFeedback) {
        formFeedback.className = "form-feedback error";
        formFeedback.textContent = "Gagal mengirim. Coba lagi atau email langsung ke erzambayu@gmail.com.";
      }
    } finally {
      if (formBtn) {
        formBtn.querySelector("span").textContent = originalLabel || "Send Message";
        if (!form.checkValidity()) formBtn.setAttribute("disabled", "");
      }
    }
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Map navigation links to page names (fixed order: about, resume, portfolio, contact)
const pageNames = ["about", "resume", "portfolio", "contact"];

// Function to activate a page by name
function activatePage(pageName) {
  for (let j = 0; j < pages.length; j++) {
    if (pageName === pages[j].dataset.page) {
      pages[j].classList.add("active");
    } else {
      pages[j].classList.remove("active");
    }
  }

  const pageIndex = pageNames.indexOf(pageName);
  for (let j = 0; j < navigationLinks.length; j++) {
    if (j === pageIndex) {
      navigationLinks[j].classList.add("active");
      navigationLinks[j].setAttribute("aria-current", "page");
    } else {
      navigationLinks[j].classList.remove("active");
      navigationLinks[j].removeAttribute("aria-current");
    }
  }
}

// Restore last active page from localStorage or URL hash
function restoreActivePage() {
  // Check URL hash first (e.g., #resume)
  const hash = window.location.hash.replace("#", "");
  if (hash && pageNames.includes(hash)) {
    activatePage(hash);
    localStorage.setItem("activePage", hash);
    return;
  }

  // Otherwise check localStorage
  const savedPage = localStorage.getItem("activePage");
  if (savedPage && pageNames.includes(savedPage)) {
    activatePage(savedPage);
  }
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  // Store the page target in a closure
  const targetPage = pageNames[i];

  navigationLinks[i].addEventListener("click", function () {
    activatePage(targetPage);
    
    // Save to localStorage
    localStorage.setItem("activePage", targetPage);
    
    // Update URL hash without scrolling
    history.replaceState(null, null, "#" + targetPage);

    window.scrollTo(0, 0);
  });
}

// Restore page on load
restoreActivePage();

// Listen for hash changes (browser back/forward)
window.addEventListener("hashchange", function () {
  const hash = window.location.hash.replace("#", "");
  if (hash && pageNames.includes(hash)) {
    activatePage(hash);
    localStorage.setItem("activePage", hash);
  }
});

// Initialize skill progress bars from data-width attribute
const skillProgressBars = document.querySelectorAll(".skill-progress-fill[data-width]");
skillProgressBars.forEach(function (bar) {
  const width = bar.getAttribute("data-width");
  if (width) {
    bar.style.width = width + "%";
  }
});



// ============================================
// PROJECT MODAL FUNCTIONALITY
// ============================================

const projectItems = document.querySelectorAll("[data-project-item]");
const projectModalContainer = document.querySelector("[data-project-modal-container]");
const projectOverlay = document.querySelector("[data-project-overlay]");
const projectModalCloseBtn = document.querySelector("[data-project-modal-close]");
const projectModalImg = document.querySelector("[data-project-modal-img]");
const projectModalTitle = document.querySelector("[data-project-modal-title]");
const projectModalCategory = document.querySelector("[data-project-modal-category]");
const projectModalDescription = document.querySelector("[data-project-modal-description]");
const projectModalTech = document.querySelector("[data-project-modal-tech]");
const projectModalActions = document.querySelector("[data-project-modal-actions]");

// Track the element that opened the modal so we can restore focus on close.
let lastFocusedBeforeModal = null;

const openProjectModal = function () {
  if (projectModalContainer) {
    projectModalContainer.classList.add("active");
    projectModalContainer.setAttribute("aria-hidden", "false");
  }
  if (projectOverlay) projectOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  if (projectModalCloseBtn) {
    setTimeout(function () { projectModalCloseBtn.focus(); }, 50);
  }
};

const closeProjectModal = function () {
  if (projectModalContainer) {
    projectModalContainer.classList.remove("active");
    projectModalContainer.setAttribute("aria-hidden", "true");
  }
  if (projectOverlay) projectOverlay.classList.remove("active");
  document.body.style.overflow = "";
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
    lastFocusedBeforeModal.focus();
    lastFocusedBeforeModal = null;
  }
};

// Add click event to all project items
projectItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    lastFocusedBeforeModal = this;

    // Get project data from attributes
    const title = this.dataset.title;
    const category = this.dataset.category;
    const description = this.dataset.description;
    const tech = this.dataset.tech;
    const liveUrl = this.dataset.live;
    const githubUrl = this.dataset.github;
    const imgSrc = this.querySelector("img").src;
    const imgAlt = this.querySelector("img").alt;

    // Populate modal
    if (projectModalImg) {
      projectModalImg.src = imgSrc;
      projectModalImg.alt = imgAlt;
    }
    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalCategory) projectModalCategory.textContent = category;
    if (projectModalDescription) projectModalDescription.textContent = description;

    // Generate tech badges
    if (projectModalTech && tech) {
      projectModalTech.innerHTML = tech.split(",").map(function (t) {
        return '<span class="tech-badge">' + t.trim() + '</span>';
      }).join("");
    }

    // Generate action buttons
    if (projectModalActions) {
      let actionsHtml = "";
      if (liveUrl) {
        actionsHtml += '<a href="' + liveUrl + '" class="modal-action-btn" target="_blank" rel="noopener noreferrer">' +
          '<ion-icon name="open-outline"></ion-icon><span>Live Demo</span></a>';
      }
      if (githubUrl) {
        actionsHtml += '<a href="' + githubUrl + '" class="modal-action-btn secondary" target="_blank" rel="noopener noreferrer">' +
          '<ion-icon name="logo-github"></ion-icon><span>View Code</span></a>';
      }
      if (!liveUrl && !githubUrl) {
        actionsHtml = '<span class="tech-badge">Private Project</span>';
      }
      projectModalActions.innerHTML = actionsHtml;
    }

    openProjectModal();
  });
});

// Close modal events
if (projectModalCloseBtn) projectModalCloseBtn.addEventListener("click", closeProjectModal);
if (projectOverlay) projectOverlay.addEventListener("click", closeProjectModal);

// Close modal on ESC key + basic focus trap
document.addEventListener("keydown", function (e) {
  if (!projectModalContainer || !projectModalContainer.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeProjectModal();
    return;
  }

  if (e.key === "Tab") {
    const focusable = projectModalContainer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});



// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const revealElements = document.querySelectorAll(".service-item, .timeline-item, .skills-item, .project-item");

const revealOnScroll = function () {
  revealElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("revealed");
    }
  });
}

// Initial check
window.addEventListener("load", revealOnScroll);
window.addEventListener("scroll", revealOnScroll);



// ============================================
// SKILL PROGRESS BAR ANIMATION ON SCROLL
// ============================================

const skillSection = document.querySelector(".skill");
let skillAnimated = false;

const animateSkillBars = function () {
  if (skillSection && !skillAnimated) {
    const sectionTop = skillSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      skillProgressBars.forEach(function (bar, index) {
        const width = bar.getAttribute("data-width");
        bar.style.width = "0%";
        setTimeout(function () {
          bar.style.width = width + "%";
        }, index * 100);
      });
      skillAnimated = true;
    }
  }
}

window.addEventListener("scroll", animateSkillBars);
window.addEventListener("load", animateSkillBars);



// ============================================
// MULTI-LANGUAGE SUPPORT
// ============================================

const translations = {
  id: {
    // Navbar
    "About": "Tentang",
    "Resume": "Resume",
    "Portfolio": "Portofolio",
    "Contact": "Kontak",

    // About section
    "About me": "Tentang Saya",
    "What I'm Doing": "Yang Saya Kerjakan",
    "Technologies I Use": "Teknologi yang Saya Gunakan",

    // About text
    "about_p1": "Game promoter & web developer yang berbasis di Jakarta. Saya punya pengalaman sekitar 2 tahun di bidang gaming marketing dan aktif mengembangkan skill di web development, networking, dan mobile device repair.",
    "about_p2": "Saat ini saya di PT Indofun Digital Technology sebagai Game Promoter — banyak belajar strategi marketing digital dan community management. Sebelumnya sempat jadi IT Technician di PT IASA Multi Integrator (Cisco/Mikrotik) dan Apple UP Certified Mobile Technician.",

    // Services
    "Game Marketing": "Game Marketing",
    "game_marketing_desc": "Strategi pemasaran digital untuk game dengan fokus user acquisition dan community engagement.",
    "Web Development": "Web Development",
    "web_dev_desc": "Full-stack development dengan Python, Flask, JavaScript untuk aplikasi web modern.",
    "Network Engineering": "Network Engineering",
    "network_desc": "Konfigurasi Cisco & Mikrotik, network security, dan system administration.",
    "Mobile Repair": "Mobile Repair",
    "mobile_desc": "Apple UP Certified technician untuk repair iPhone dan perangkat mobile lainnya.",

    // Resume
    "Education": "Pendidikan",
    "Experience": "Pengalaman",
    "Technical Skills": "Kemampuan Teknis",
    "Non-Technical Skills": "Kemampuan Non-Teknis",

    // Contact
    "Contact Form": "Form Kontak",
    "Full name": "Nama Lengkap",
    "Email address": "Alamat Email",
    "Your Message": "Pesan Anda",
    "Send Message": "Kirim Pesan",

    // Download CV
    "Download CV": "Unduh CV",

    // Modal
    "Tech Stack": "Tech Stack",
    "Live Demo": "Demo Live",
    "View Code": "Lihat Kode",
    "Private Project": "Proyek Privat"
  },
  en: {
    // Navbar
    "About": "About",
    "Resume": "Resume",
    "Portfolio": "Portfolio",
    "Contact": "Contact",

    // About section
    "About me": "About me",
    "What I'm Doing": "What I'm Doing",
    "Technologies I Use": "Technologies I Use",

    // About text
    "about_p1": "Game promoter & web developer based in Jakarta. I have around 2 years of experience in gaming marketing and am actively developing skills in web development, networking, and mobile device repair.",
    "about_p2": "Currently at PT Indofun Digital Technology as a Game Promoter — learning digital marketing strategies and community management. Previously an IT Technician at PT IASA Multi Integrator (Cisco/Mikrotik) and an Apple UP Certified Mobile Technician.",

    // Services
    "Game Marketing": "Game Marketing",
    "game_marketing_desc": "Digital marketing strategies for games focusing on user acquisition and community engagement.",
    "Web Development": "Web Development",
    "web_dev_desc": "Full-stack development with Python, Flask, JavaScript for modern web applications.",
    "Network Engineering": "Network Engineering",
    "network_desc": "Cisco & Mikrotik configuration, network security, and system administration.",
    "Mobile Repair": "Mobile Repair",
    "mobile_desc": "Apple UP Certified technician for iPhone and other mobile device repairs.",

    // Resume
    "Education": "Education",
    "Experience": "Experience",
    "Technical Skills": "Technical Skills",
    "Non-Technical Skills": "Non-Technical Skills",

    // Contact
    "Contact Form": "Contact Form",
    "Full name": "Full name",
    "Email address": "Email address",
    "Your Message": "Your Message",
    "Send Message": "Send Message",

    // Download CV
    "Download CV": "Download CV",

    // Modal
    "Tech Stack": "Tech Stack",
    "Live Demo": "Live Demo",
    "View Code": "View Code",
    "Private Project": "Private Project"
  }
};

// Elements to translate
const translatableSelectors = {
  ".article-title": "textContent",
  ".navbar-link": "textContent",
  ".h3.service-title": "textContent",
  ".h3.clients-title": "textContent",
  ".h3.skills-title": "textContent",
  ".h3.form-title": "textContent",
  ".download-cv-btn span": "textContent",
  ".download-cv-fixed span": "textContent"
};

// Get language toggle buttons
const langButtons = document.querySelectorAll(".lang-toggle-btn");
let currentLang = localStorage.getItem("preferredLang") || "id";

// Apply saved language on load
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("preferredLang", lang);
  document.documentElement.lang = lang;

  // Update toggle buttons
  langButtons.forEach(function (btn) {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  // Translate about text
  const aboutTexts = document.querySelectorAll(".about-text p");
  if (aboutTexts.length >= 2) {
    aboutTexts[0].textContent = translations[lang]["about_p1"];
    aboutTexts[1].textContent = translations[lang]["about_p2"];
  }

  // Translate service descriptions
  const serviceItems = document.querySelectorAll(".service-item-text");
  const serviceKeys = ["game_marketing_desc", "web_dev_desc", "network_desc", "mobile_desc"];
  serviceItems.forEach(function (item, index) {
    if (serviceKeys[index]) {
      item.textContent = translations[lang][serviceKeys[index]];
    }
  });

  // Translate navbar
  const navLinks = document.querySelectorAll(".navbar-link");
  const navKeys = ["About", "Resume", "Portfolio", "Contact"];
  navLinks.forEach(function (link, index) {
    if (navKeys[index] && translations[lang][navKeys[index]]) {
      link.textContent = translations[lang][navKeys[index]];
    }
  });

  // Translate section titles
  const articleTitles = document.querySelectorAll(".article-title");
  const titleTexts = ["About me", "Resume", "Portfolio", "Contact"];
  articleTitles.forEach(function (title, index) {
    if (titleTexts[index] && translations[lang][titleTexts[index]]) {
      title.textContent = translations[lang][titleTexts[index]];
    }
  });

  // Translate Download CV buttons
  document.querySelectorAll(".download-cv-btn span, .download-cv-fixed span").forEach(function (span) {
    span.textContent = translations[lang]["Download CV"];
  });

  // Translate form
  const formTitle = document.querySelector(".form-title");
  if (formTitle) formTitle.textContent = translations[lang]["Contact Form"];

  const formInputs = document.querySelectorAll(".form-input");
  const placeholders = ["Full name", "Email address", "Your Message"];
  formInputs.forEach(function (input, index) {
    if (placeholders[index] && translations[lang][placeholders[index]]) {
      input.placeholder = translations[lang][placeholders[index]];
    }
  });

  const sendBtn = document.querySelector(".form-btn span");
  if (sendBtn) sendBtn.textContent = translations[lang]["Send Message"];

  // Translate h3 titles
  const serviceTitleEl = document.querySelector(".service-title");
  if (serviceTitleEl) serviceTitleEl.textContent = translations[lang]["What I'm Doing"];

  const clientsTitleEl = document.querySelector(".clients-title");
  if (clientsTitleEl) clientsTitleEl.textContent = translations[lang]["Technologies I Use"];

  // Skills titles
  document.querySelectorAll(".skills-title").forEach(function (el, index) {
    const keys = ["Technical Skills", "Non-Technical Skills"];
    if (keys[index]) el.textContent = translations[lang][keys[index]];
  });

  // Education/Experience titles
  const timelineTitles = document.querySelectorAll(".timeline .title-wrapper .h3");
  const timelineKeys = ["Education", "Experience"];
  timelineTitles.forEach(function (el, index) {
    if (timelineKeys[index]) el.textContent = translations[lang][timelineKeys[index]];
  });
}

// Add click events to language buttons
langButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const lang = this.dataset.lang;
    applyLanguage(lang);
  });
});

// Apply language immediately and on DOM ready
// This ensures text appears without needing refresh
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(currentLang);
  });
} else {
  // DOM already loaded, apply immediately
  applyLanguage(currentLang);
}