'use strict';



// element toggle function
const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    if (modalImg) {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    }
    if (modalTitle) modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    if (modalText) modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Map navigation links to page names (fixed order: about, resume, portfolio, contact)
const pageNames = ["about", "resume", "portfolio", "contact"];

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  // Store the page target in a closure
  const targetPage = pageNames[i];

  navigationLinks[i].addEventListener("click", function () {
    // Update pages
    for (let j = 0; j < pages.length; j++) {
      if (targetPage === pages[j].dataset.page) {
        pages[j].classList.add("active");
      } else {
        pages[j].classList.remove("active");
      }
    }

    // Update navigation links
    for (let j = 0; j < navigationLinks.length; j++) {
      if (j === i) {
        navigationLinks[j].classList.add("active");
      } else {
        navigationLinks[j].classList.remove("active");
      }
    }

    window.scrollTo(0, 0);
  });
}

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

// Toggle project modal
const toggleProjectModal = function () {
  if (projectModalContainer) projectModalContainer.classList.toggle("active");
  if (projectOverlay) projectOverlay.classList.toggle("active");
}

// Add click event to all project items
projectItems.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();

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

    toggleProjectModal();
  });
});

// Close modal events
if (projectModalCloseBtn) projectModalCloseBtn.addEventListener("click", toggleProjectModal);
if (projectOverlay) projectOverlay.addEventListener("click", toggleProjectModal);

// Close modal on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && projectModalContainer && projectModalContainer.classList.contains("active")) {
    toggleProjectModal();
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
// TYPING ANIMATION FOR TITLE
// ============================================

const typingElement = document.querySelector(".title");
if (typingElement) {
  const originalText = typingElement.textContent;
  typingElement.classList.add("typing-text");
}



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
    "about_p1": "🎮 Game promoter & web developer yang berbasis di Jakarta. Saya memiliki pengalaman sekitar 2 tahun di bidang gaming marketing dan sedang aktif mengembangkan skill di web development.",
    "about_p2": "Saya memiliki pengalaman di PT Indofun sebagai Game Promoter, dimana saya belajar banyak tentang strategi marketing digital dan community management. Selain gaming, saya juga tertarik dengan network engineering dan mobile device repair.",

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
    "about_p1": "🎮 Game promoter & web developer based in Jakarta. I have approximately 2 years of experience in gaming marketing and am actively developing skills in web development.",
    "about_p2": "I have experience at PT Indofun as a Game Promoter, where I learned a lot about digital marketing strategies and community management. Besides gaming, I'm also interested in network engineering and mobile device repair.",

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
    if (btn.dataset.lang === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
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