/**
 * Multi-language Support System
 * Handles language switching and translation management
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'id'; // Default language
        this.translations = {};
        this.supportedLanguages = ['id', 'en'];
        
        this.init();
    }

    async init() {
        // Get saved language preference or use default
        this.currentLang = localStorage.getItem('portfolio-language') || 'id';
        
        // Load translations
        await this.loadTranslations();
        
        // Setup language toggle button
        this.setupLanguageToggle();
        
        // Apply translations to current page
        this.applyTranslations();
        
        // Setup typewriter with current language
        this.setupTypewriter();
        
        console.log('Language switcher initialized with language:', this.currentLang);
    }

    async loadTranslations() {
        try {
            // Since we're in Jekyll, translations are already loaded in the page
            // We'll extract them from the data attributes or create them directly
            this.translations = {
                id: {
                    nav: {
                        home: "Beranda",
                        about: "Tentang",
                        projects: "Portofolio", 
                        blog: "Blog",
                        connect: "Kontak"
                    },
                    hero: {
                        greeting: "Halo, saya",
                        status: "Siap untuk proyek baru",
                        description: "Game Promoter & Teknisi Jaringan/IT Support dengan pengalaman lebih dari 3 tahun dalam pemeliharaan hardware, troubleshooting sistem, dan manajemen infrastruktur jaringan. Saat ini sedang menempuh pendidikan S1 Sistem Informasi.",
                        cta_consult: "Konsultasi Sekarang",
                        cta_contact: "Hubungi Saya", 
                        cta_portfolio: "Lihat Portofolio",
                        scroll_text: "Scroll untuk Eksplor"
                    },
                    typewriter: [
                        "Game Promoter 🎮",
                        "Full-Stack Developer 💻", 
                        "Network Engineer 🌐",
                        "Security Researcher 🔒",
                        "IT Support Specialist 🛠️"
                    ],
                    about: {
                        title: "Tentang Saya",
                        description1: "Saya adalah seorang profesional di bidang teknologi informasi dengan pengalaman lebih dari 3 tahun dalam hardware troubleshooting, pemeliharaan server, dan manajemen infrastruktur jaringan. Saat ini sedang menempuh pendidikan S1 Sistem Informasi.",
                        description2: "Berdomisili di Bekasi/Jakarta dengan pengalaman bekerja di berbagai perusahaan teknologi, dari game promotion hingga technical support. Memiliki kemampuan dalam mengelola tim, troubleshooting sistem, dan memberikan solusi teknis yang efektif.",
                        skills_title: "Keahlian Utama:",
                        cta_more: "Selengkapnya Tentang Saya"
                    },
                    services: {
                        title: "Layanan Profesional",
                        subtitle: "Solusi teknologi dan dukungan teknis yang dapat diandalkan"
                    },
                    skills: {
                        title: "Tech Stack & Expertise",
                        subtitle: "Tools dan teknologi yang saya kuasai untuk deliver hasil terbaik"
                    },
                    projects: {
                        title: "Portofolio Unggulan",
                        subtitle: "Proyek-proyek yang bikin bangga dan impact nyata untuk klien",
                        cta_all: "Lihat Semua Portofolio"
                    },
                    testimonials: {
                        title: "Kata Mereka",
                        subtitle: "Feedback dari klien dan partner yang puas dengan hasil kerja saya"
                    },
                    blog: {
                        title: "Blog & Artikel",
                        subtitle: "Berbagi pengetahuan dan pengalaman dalam bidang teknologi informasi",
                        coming_soon: {
                            title: "Blog Akan Segera Tersedia",
                            description: "Saya sedang menyiapkan artikel-artikel berkualitas mengenai teknologi informasi, troubleshooting hardware, manajemen jaringan, dan pengalaman dalam industri gaming. Nantikan konten edukatif yang akan membantu Anda dalam bidang teknologi.",
                            topics_title: "Topik yang Akan Dibahas:"
                        }
                    },
                    contact: {
                        title: "Mari Berkolaborasi!",
                        subtitle: "Siap membantu project teknologi Anda dengan solusi yang profesional dan terpercaya. Hubungi saya untuk konsultasi dan diskusi kebutuhan Anda.",
                        cta_start: "Mulai Konsultasi"
                    },
                    buttons: {
                        download_cv: "Download CV"
                    }
                },
                en: {
                    nav: {
                        home: "Home",
                        about: "About", 
                        projects: "Projects",
                        blog: "Blog",
                        connect: "Connect"
                    },
                    hero: {
                        greeting: "Hello, I'm",
                        status: "Available for new projects",
                        description: "Game Promoter & Network Technician/IT Support with over 3 years of experience in hardware maintenance, system troubleshooting, and network infrastructure management. Currently pursuing a Bachelor's degree in Information Systems.",
                        cta_consult: "Get Consultation",
                        cta_contact: "Contact Me",
                        cta_portfolio: "View Portfolio", 
                        scroll_text: "Scroll to Explore"
                    },
                    typewriter: [
                        "Game Promoter 🎮",
                        "Full-Stack Developer 💻",
                        "Network Engineer 🌐", 
                        "Security Researcher 🔒",
                        "IT Support Specialist 🛠️"
                    ],
                    about: {
                        title: "About Me",
                        description1: "I am an information technology professional with over 3 years of experience in hardware troubleshooting, server maintenance, and network infrastructure management. Currently pursuing a Bachelor's degree in Information Systems.",
                        description2: "Based in Bekasi/Jakarta with experience working at various technology companies, from game promotion to technical support. Skilled in team management, system troubleshooting, and providing effective technical solutions.",
                        skills_title: "Core Skills:",
                        cta_more: "More About Me"
                    },
                    services: {
                        title: "Professional Services",
                        subtitle: "Reliable technology solutions and technical support"
                    },
                    skills: {
                        title: "Tech Stack & Expertise", 
                        subtitle: "Tools and technologies I master to deliver the best results"
                    },
                    projects: {
                        title: "Featured Portfolio",
                        subtitle: "Projects that make me proud with real impact for clients",
                        cta_all: "View All Projects"
                    },
                    testimonials: {
                        title: "What They Say",
                        subtitle: "Feedback from clients and partners satisfied with my work"
                    },
                    blog: {
                        title: "Blog & Articles",
                        subtitle: "Sharing knowledge and experience in information technology",
                        coming_soon: {
                            title: "Blog Coming Soon",
                            description: "I am preparing quality articles on information technology, hardware troubleshooting, network management, and experience in the gaming industry. Expect educational content that will help you in the technology field.",
                            topics_title: "Topics to Be Discussed:"
                        }
                    },
                    contact: {
                        title: "Let's Collaborate!",
                        subtitle: "Ready to help your technology projects with professional and reliable solutions. Contact me for consultation and discussion of your needs.",
                        cta_start: "Start Consultation"
                    },
                    buttons: {
                        download_cv: "Download CV"
                    }
                }
            };
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    setupLanguageToggle() {
        // Create language toggle button
        const navbar = document.querySelector('.rose-pine-navbar .container');
        if (navbar) {
            // Check if language toggle already exists
            let langToggle = document.getElementById('language-toggle');
            if (!langToggle) {
                langToggle = document.createElement('div');
                langToggle.id = 'language-toggle';
                langToggle.className = 'navbar-language-toggle d-flex align-items-center ms-3';
                langToggle.innerHTML = `
                    <button class="language-toggle-btn" id="language-btn" aria-label="Toggle language">
                        <span class="lang-flag">${this.currentLang === 'id' ? '🇮🇩' : '🇺🇸'}</span>
                        <span class="lang-code">${this.currentLang.toUpperCase()}</span>
                    </button>
                `;
                
                // Insert before theme toggle
                const themeToggle = navbar.querySelector('.navbar-theme-toggle');
                if (themeToggle) {
                    navbar.insertBefore(langToggle, themeToggle);
                } else {
                    navbar.appendChild(langToggle);
                }
            }

            // Add click event
            const langBtn = document.getElementById('language-btn');
            if (langBtn) {
                langBtn.addEventListener('click', () => this.toggleLanguage());
            }
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'id' ? 'en' : 'id';
        this.switchLanguage(newLang);
    }

    switchLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error('Unsupported language:', lang);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('portfolio-language', lang);
        
        // Update language toggle button
        this.updateLanguageToggle();
        
        // Apply translations
        this.applyTranslations();
        
        // Restart typewriter with new language
        this.setupTypewriter();
        
        console.log('Language switched to:', lang);
    }

    updateLanguageToggle() {
        const langFlag = document.querySelector('.lang-flag');
        const langCode = document.querySelector('.lang-code');
        
        if (langFlag && langCode) {
            langFlag.textContent = this.currentLang === 'id' ? '🇮🇩' : '🇺🇸';
            langCode.textContent = this.currentLang.toUpperCase();
        }
    }

    applyTranslations() {
        const t = this.translations[this.currentLang];
        if (!t) return;

        // Navigation
        this.updateTextContent('[data-translate="nav.home"]', t.nav.home);
        this.updateTextContent('[data-translate="nav.about"]', t.nav.about);
        this.updateTextContent('[data-translate="nav.projects"]', t.nav.projects);
        this.updateTextContent('[data-translate="nav.blog"]', t.nav.blog);
        this.updateTextContent('[data-translate="nav.connect"]', t.nav.connect);

        // Hero Section
        this.updateTextContent('.hero-greeting', t.hero.greeting);
        this.updateTextContent('.profile-status span', t.hero.status);
        this.updateTextContent('.hero-description', t.hero.description);
        this.updateTextContent('.scroll-indicator span', t.hero.scroll_text);

        // Buttons
        this.updateButtonText('[href*="mailto"]', t.hero.cta_consult);
        this.updateButtonText('[href*="wa.me"]', t.hero.cta_contact);
        this.updateButtonText('[href*="/projects"]', t.hero.cta_portfolio);

        // Section Titles
        this.updateTextContent('.about-section .section-title', t.about.title);
        this.updateTextContent('.services-section .section-title', t.services.title);
        this.updateTextContent('.services-section .section-subtitle', t.services.subtitle);
        this.updateTextContent('.skills-preview .section-title', t.skills.title);
        this.updateTextContent('.skills-preview .section-subtitle', t.skills.subtitle);
        this.updateTextContent('.featured-projects .section-title', t.projects.title);
        this.updateTextContent('.featured-projects .section-subtitle', t.projects.subtitle);
        this.updateTextContent('.testimonials-section .section-title', t.testimonials.title);
        this.updateTextContent('.testimonials-section .section-subtitle', t.testimonials.subtitle);
        this.updateTextContent('.blog-section .section-title', t.blog.title);
        this.updateTextContent('.blog-section .section-subtitle', t.blog.subtitle);
        this.updateTextContent('.contact-footer .section-title', t.contact.title);
        this.updateTextContent('.contact-footer .section-subtitle', t.contact.subtitle);

        // About Section
        this.updateTextContent('.about-section .lead', t.about.description1);
        this.updateTextContent('.about-section p:nth-of-type(2)', t.about.description2);
        this.updateTextContent('.skills-highlights h3', t.about.skills_title);
        this.updateButtonText('.about-section .btn', t.about.cta_more);

        // Blog Coming Soon
        this.updateTextContent('.blog-coming-soon h3', t.blog.coming_soon.title);
        this.updateTextContent('.blog-coming-soon .text-muted', t.blog.coming_soon.description);
        this.updateTextContent('.coming-soon-topics h5', t.blog.coming_soon.topics_title);

        // Featured Projects
        this.updateButtonText('.projects-showcase .btn-outline', t.projects.cta_all);

        // Contact
        this.updateButtonText('.btn-start-project', t.contact.cta_start);

        // Download CV Button (will be added)
        this.updateButtonText('.btn-download-cv', t.buttons.download_cv);

        console.log('Translations applied for language:', this.currentLang);
    }

    updateTextContent(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && text) {
                element.textContent = text;
            }
        });
    }

    updateButtonText(selector, text) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            if (button && text) {
                const span = button.querySelector('span');
                if (span) {
                    span.textContent = text;
                } else {
                    // If no span, update the text while preserving icons
                    const icon = button.querySelector('i');
                    if (icon) {
                        button.innerHTML = icon.outerHTML + ' <span>' + text + '</span>';
                    } else {
                        button.textContent = text;
                    }
                }
            }
        });
    }

    setupTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;

        const texts = this.translations[this.currentLang].typewriter;
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        // Clear any existing intervals
        if (window.typewriterInterval) {
            clearInterval(window.typewriterInterval);
        }

        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (!isDeleting && charIndex <= currentText.length) {
                typewriterElement.textContent = currentText.substring(0, charIndex);
                charIndex++;
                
                if (charIndex > currentText.length) {
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                    }, 2000);
                }
            } else if (isDeleting && charIndex >= 0) {
                typewriterElement.textContent = currentText.substring(0, charIndex);
                charIndex--;
                
                if (charIndex < 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(() => {
                        charIndex = 0;
                    }, 500);
                }
            }
        }

        // Start typewriter effect
        window.typewriterInterval = setInterval(() => {
            if (!isPaused) {
                typeWriter();
            }
        }, isDeleting ? 50 : 100);
    }

    // Method to get current translation
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            value = value && value[k];
        }
        
        return value || key;
    }
}

// Add CSS for language toggle
const languageToggleCSS = `
.navbar-language-toggle {
    margin-left: 0.5rem;
}

.language-toggle-btn {
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: var(--radius-md);
    padding: 0.4rem 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all var(--transition-medium);
    box-shadow: 0 2px 10px var(--card-shadow);
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.9rem;
}

.language-toggle-btn:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px var(--card-shadow);
    background: var(--primary-color);
    color: white;
}

.lang-flag {
    font-size: 1rem;
}

.lang-code {
    font-size: 0.8rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .navbar-language-toggle {
        order: -1;
        margin-left: 0;
        margin-right: 1rem;
    }
    
    .language-toggle-btn {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
    }
}
`;

// Inject CSS
function injectLanguageToggleCSS() {
    const style = document.createElement('style');
    style.textContent = languageToggleCSS;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    injectLanguageToggleCSS();
    
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.languageSwitcher = new LanguageSwitcher();
    }, 100);
});

// Export for global access
window.LanguageSwitcher = LanguageSwitcher;