/**
 * Modern Portfolio JavaScript - Erzam Bayu
 * Simplified version without theme toggle conflicts
 */

class ModernPortfolio {
  constructor() {
    this.particlesLoaded = false;
    this.aosLoaded = false;
    this.initializeComponents();
    this.setupEventListeners();
    this.startAnimations();
  }

  initializeComponents() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.mainContent = document.getElementById('main-content');
    this.typewriterElement = document.getElementById('typewriter');
    this.statsElements = document.querySelectorAll('.stat-number');
    
    // Hide main content initially
    if (this.mainContent) {
      this.mainContent.style.opacity = '0';
    }
    
    // Initialize loading screen
    this.showLoadingScreen();
    
    // Check for external libraries
    this.checkExternalLibraries();
  }

  checkExternalLibraries() {
    // Check if particles.js is available
    if (typeof particlesJS !== 'undefined') {
      this.particlesLoaded = true;
    } else {
      console.warn('Particles.js not loaded, using fallback background');
      this.createFallbackBackground();
    }

    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
      this.aosLoaded = true;
    } else {
      console.warn('AOS not loaded, using custom animations');
    }
  }

  createFallbackBackground() {
    // Create a simple animated background as fallback
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.innerHTML = `
        <div class="fallback-bg">
          <div class="bg-circle bg-circle-1"></div>
          <div class="bg-circle bg-circle-2"></div>
          <div class="bg-circle bg-circle-3"></div>
          <div class="bg-circle bg-circle-4"></div>
          <div class="bg-circle bg-circle-5"></div>
        </div>
      `;
      
      // Add fallback styles
      this.addFallbackStyles();
    }
  }

  addFallbackStyles() {
    const fallbackStyles = `
      .fallback-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
      }

      .bg-circle {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(0, 153, 255, 0.1), rgba(102, 126, 234, 0.1));
        animation: float-circle 20s infinite linear;
      }

      .bg-circle-1 {
        width: 100px;
        height: 100px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
        animation-duration: 25s;
      }

      .bg-circle-2 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 10%;
        animation-delay: -5s;
        animation-duration: 30s;
        animation-direction: reverse;
      }

      .bg-circle-3 {
        width: 80px;
        height: 80px;
        bottom: 20%;
        left: 20%;
        animation-delay: -10s;
        animation-duration: 35s;
      }

      .bg-circle-4 {
        width: 200px;
        height: 200px;
        top: 30%;
        left: 50%;
        animation-delay: -15s;
        animation-duration: 40s;
        animation-direction: reverse;
      }

      .bg-circle-5 {
        width: 120px;
        height: 120px;
        bottom: 10%;
        right: 30%;
        animation-delay: -20s;
        animation-duration: 45s;
      }

      @keyframes float-circle {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = fallbackStyles;
    document.head.appendChild(styleSheet);
  }

  setupEventListeners() {
    // Loading completion with error handling
    window.addEventListener('load', () => {
      setTimeout(() => this.hideLoadingScreen(), 1000);
    });

    // Fallback loading timer
    setTimeout(() => {
      if (this.loadingScreen && !this.loadingScreen.classList.contains('hidden')) {
        this.hideLoadingScreen();
      }
    }, 5000);

    // Smooth scrolling for navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Optimized scroll handling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleParallaxScroll();
        this.handleNavbarScroll();
      }, 10);
    });

    // Intersection Observer for animations
    this.setupIntersectionObserver();
  }

  showLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove('hidden');
    }
  }

  hideLoadingScreen() {
    if (this.loadingScreen && this.mainContent) {
      this.loadingScreen.classList.add('hidden');
      this.mainContent.style.opacity = '1';
      this.mainContent.style.transition = 'opacity 0.5s ease';
      
      // Start main animations after loading
      setTimeout(() => {
        if (this.particlesLoaded) {
          this.initializeParticles();
        }
        this.startTypewriter();
        this.animateStatsOnScroll();
      }, 500);
    }
  }

  initializeParticles() {
    if (!this.particlesLoaded) return;

    try {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ['#667eea', '#764ba2', '#0099ff']
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.4,
            random: false,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#667eea',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
    } catch (error) {
      console.warn('Error initializing particles:', error);
      this.createFallbackBackground();
    }
  }

  startTypewriter() {
    if (!this.typewriterElement) return;

    const texts = [
      'Full-Stack Developer',
      'Network Engineer', 
      'Security Researcher',
      'Technology Enthusiast',
      'Problem Solver',
      'Innovation Creator'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeText = () => {
      const currentText = texts[textIndex];
      
      try {
        if (isDeleting) {
          this.typewriterElement.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          typeSpeed = 50;
        } else {
          this.typewriterElement.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
      } catch (error) {
        console.warn('Typewriter error:', error);
      }
    };

    typeText();
  }

  animateStatsOnScroll() {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStatNumbers();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateStatNumbers() {
    this.statsElements.forEach(element => {
      try {
        const target = parseInt(element.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;

        const updateNumber = () => {
          if (current < target) {
            current += increment;
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateNumber);
          } else {
            element.textContent = target;
          }
        };

        updateNumber();
      } catch (error) {
        console.warn('Error animating stat number:', error);
      }
    });
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) {
      // Fallback for browsers without IntersectionObserver
      this.animateElementsDirectly();
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
  }

  animateElementsDirectly() {
    // Fallback animation for browsers without IntersectionObserver
    const animatedElements = document.querySelectorAll('[data-aos]');
    setTimeout(() => {
      animatedElements.forEach(el => el.classList.add('animate-in'));
    }, 1000);
  }

  handleParallaxScroll() {
    try {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    } catch (error) {
      console.warn('Parallax scroll error:', error);
    }
  }

  handleNavbarScroll() {
    try {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    } catch (error) {
      console.warn('Navbar scroll error:', error);
    }
  }

  startAnimations() {
    // Initialize AOS if available
    if (this.aosLoaded) {
      try {
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out-cubic',
          once: true,
          mirror: false,
          offset: 100,
          delay: 0,
          anchorPlacement: 'top-bottom'
        });
      } catch (error) {
        console.warn('AOS initialization error:', error);
      }
    }

    // Add entrance animations to elements
    this.addEntranceAnimations();
  }

  addEntranceAnimations() {
    try {
      // Profile image animation
      const profileImage = document.querySelector('.profile-image');
      if (profileImage) {
        profileImage.addEventListener('load', () => {
          profileImage.classList.add('loaded');
        });
        
        // Trigger if already loaded
        if (profileImage.complete) {
          profileImage.classList.add('loaded');
        }
      }

      // Card hover effects
      const cards = document.querySelectorAll('.skill-card, .project-featured');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          this.addCardParticles(card);
        });
      });

      // Button click effects
      const buttons = document.querySelectorAll('.btn-hero');
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.createRippleEffect(e);
        });
      });
    } catch (error) {
      console.warn('Error adding entrance animations:', error);
    }
  }

  addCardParticles(card) {
    try {
      // Create floating particles on card hover
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary-color);
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle 2s ease-out forwards;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 2000);
      }
    } catch (error) {
      console.warn('Error adding card particles:', error);
    }
  }

  createRippleEffect(e) {
    try {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        z-index: 10;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    } catch (error) {
      console.warn('Error creating ripple effect:', error);
    }
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Performance optimization
  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency <= 2) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          animation-duration: 0.3s !important;
          transition-duration: 0.2s !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Enhanced CSS Animations with better fallbacks
const animationStyles = `
  @keyframes float-particle {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-50px) scale(0);
      opacity: 0;
    }
  }

  @keyframes ripple-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .animate-in {
    animation: slideInUp 0.8s ease-out forwards;
  }

  @keyframes slideInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .profile-image.loaded {
    animation: profileEntrance 1s ease-out forwards;
  }

  @keyframes profileEntrance {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Scroll animations fallback */
  [data-aos] {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  [data-aos].aos-animate,
  [data-aos].animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Enhanced button effects */
  .btn-hero {
    overflow: hidden;
    position: relative;
  }

  .btn-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }

  .btn-hero:hover::before {
    left: 100%;
  }

  /* Loading screen animations */
  .loading-logo {
    animation: loadingPulse 2s ease-in-out infinite;
  }

  @keyframes loadingPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
    }
  }

  /* Responsive animations */
  @media (max-width: 768px) {
    [data-aos] {
      transform: translateY(10px);
    }
    
    .animate-in {
      animation-duration: 0.5s;
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(15px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .loading-screen {
      display: none !important;
    }
  }

  /* Dark theme support for fallback bg */
  [data-theme="dark"] .bg-circle {
    background: linear-gradient(135deg, rgba(0, 153, 255, 0.05), rgba(102, 126, 234, 0.05));
  }
`;

// Simple initialization
(function() {
  // Add styles first
  const styleSheet = document.createElement('style');
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
  
  // Initialize portfolio once DOM is ready
  function initPortfolio() {
    try {
      if (!window.portfolioInstance) {
        window.portfolioInstance = new ModernPortfolio();
        console.log('Portfolio initialized successfully');
      }
    } catch (error) {
      console.warn('Portfolio initialization failed:', error);
      
      // Basic fallback
      const loading = document.getElementById('loading-screen');
      const main = document.getElementById('main-content');
      
      if (loading) loading.style.display = 'none';
      if (main) main.style.opacity = '1';
    }
  }
  
  // Initialize based on DOM state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
})(); 