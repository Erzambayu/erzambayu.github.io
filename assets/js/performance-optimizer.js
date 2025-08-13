/**
 * Performance Optimizer for Portfolio Website
 * Implements lazy loading, image optimization, and performance monitoring
 */

class PerformanceOptimizer {
  constructor() {
    this.lazyImages = [];
    this.lazyVideos = [];
    this.observer = null;
    this.performanceMetrics = {};
    
    this.init();
  }
  
  init() {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupOptimizations());
    } else {
      this.setupOptimizations();
    }
  }
  
  setupOptimizations() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupCriticalResourcePreloading();
    this.setupPerformanceMonitoring();
    this.setupResourceHints();
    this.debounceScrollEvents();
  }
  
  // ===== LAZY LOADING =====
  setupLazyLoading() {
    // Images
    this.lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    // Videos
    this.lazyVideos = document.querySelectorAll('video[data-src]');
    
    // Background images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    if ('IntersectionObserver' in window) {
      this.createIntersectionObserver();
      
      // Observe images
      this.lazyImages.forEach(img => {
        if (!img.dataset.observed) {
          this.observer.observe(img);
          img.dataset.observed = 'true';
        }
      });
      
      // Observe videos
      this.lazyVideos.forEach(video => {
        if (!video.dataset.observed) {
          this.observer.observe(video);
          video.dataset.observed = 'true';
        }
      });
      
      // Observe background images
      lazyBackgrounds.forEach(element => {
        if (!element.dataset.observed) {
          this.observer.observe(element);
          element.dataset.observed = 'true';
        }
      });
    } else {
      // Fallback for older browsers
      this.loadAllLazyContent();
    }
  }
  
  createIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            this.loadLazyImage(element);
          } else if (element.tagName === 'VIDEO') {
            this.loadLazyVideo(element);
          } else if (element.dataset.bg) {
            this.loadLazyBackground(element);
          }
          
          this.observer.unobserve(element);
        }
      });
    }, options);
  }
  
  loadLazyImage(img) {
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Image loaded successfully
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
      
      img.classList.add('loaded');
      img.classList.remove('loading');
      
      // Fade in effect
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        img.style.opacity = '1';
      }, 10);
    };
    
    imageLoader.onerror = () => {
      img.classList.add('error');
      console.warn('Failed to load image:', img.dataset.src || img.src);
    };
    
    // Start loading
    img.classList.add('loading');
    imageLoader.src = img.dataset.src || img.src;
  }
  
  loadLazyVideo(video) {
    if (video.dataset.src) {
      video.src = video.dataset.src;
      video.removeAttribute('data-src');
    }
    
    // Load video sources
    const sources = video.querySelectorAll('source[data-src]');
    sources.forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    
    video.load();
    video.classList.add('loaded');
  }
  
  loadLazyBackground(element) {
    const bgImage = element.dataset.bg;
    if (bgImage) {
      element.style.backgroundImage = `url(${bgImage})`;
      element.classList.add('loaded');
      element.removeAttribute('data-bg');
    }
  }
  
  loadAllLazyContent() {
    // Fallback for browsers without IntersectionObserver
    this.lazyImages.forEach(img => this.loadLazyImage(img));
    this.lazyVideos.forEach(video => this.loadLazyVideo(video));
    
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(element => this.loadLazyBackground(element));
  }
  
  // ===== IMAGE OPTIMIZATION =====
  setupImageOptimization() {
    // Add responsive image support
    this.addResponsiveImageSupport();
    
    // WebP support detection
    this.detectWebPSupport();
    
    // Progressive image loading
    this.setupProgressiveImageLoading();
  }
  
  addResponsiveImageSupport() {
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
      if (img.src && !img.hasAttribute('data-no-responsive')) {
        // Generate responsive srcset
        const baseSrc = img.src;
        const sizes = [320, 640, 768, 1024, 1280, 1920];
        const srcset = sizes.map(size => 
          `${this.generateResponsiveImageUrl(baseSrc, size)} ${size}w`
        ).join(', ');
        
        img.srcset = srcset;
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
      }
    });
  }
  
  generateResponsiveImageUrl(src, width) {
    // For external images (like Unsplash), append size parameters
    if (src.includes('unsplash.com') || src.includes('images.unsplash.com')) {
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}w=${width}&q=80&fm=webp&fit=crop`;
    }
    
    // For local images, you'd implement your own resizing logic
    return src;
  }
  
  detectWebPSupport() {
    const webpSupported = new Promise((resolve) => {
      const webp = new Image();
      webp.onload = webp.onerror = () => {
        resolve(webp.height === 2);
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
    
    webpSupported.then((supported) => {
      if (supported) {
        document.documentElement.classList.add('webp-supported');
      } else {
        document.documentElement.classList.add('webp-not-supported');
      }
    });
  }
  
  setupProgressiveImageLoading() {
    const progressiveImages = document.querySelectorAll('.progressive-image');
    
    progressiveImages.forEach(container => {
      const img = container.querySelector('img');
      const placeholder = container.querySelector('.placeholder');
      
      if (img && placeholder) {
        img.addEventListener('load', () => {
          container.classList.add('loaded');
          setTimeout(() => {
            if (placeholder) {
              placeholder.style.display = 'none';
            }
          }, 300);
        });
      }
    });
  }
  
  // ===== RESOURCE PRELOADING =====
  setupCriticalResourcePreloading() {
    const criticalResources = [
      '/assets/css/custom.css',
      '/assets/js/portfolio.js'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      }
      
      document.head.appendChild(link);
    });
  }
  
  setupResourceHints() {
    const prefetchResources = [
      '/projects/',
      '/blog/',
      '/about/'
    ];
    
    // Add prefetch hints for likely next pages
    prefetchResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }
  
  // ===== PERFORMANCE MONITORING =====
  setupPerformanceMonitoring() {
    if ('performance' in window) {
      // Monitor page load time
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.measurePagePerformance();
        }, 0);
      });
      
      // Monitor Core Web Vitals
      this.measureCoreWebVitals();
      
      // Monitor resource loading
      this.monitorResourceLoading();
    }
  }
  
  measurePagePerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      this.performanceMetrics = {
        // Page load times
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        
        // Network times
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseStart - navigation.requestStart,
        pageDownload: navigation.responseEnd - navigation.responseStart,
        
        // Total times
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domProcessingTime: navigation.domComplete - navigation.domLoading
      };
      
      // Log performance metrics
      console.log('Performance Metrics:', this.performanceMetrics);
      
      // Send to analytics if needed
      this.sendPerformanceMetrics();
    }
  }
  
  measureCoreWebVitals() {
    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.performanceMetrics.fcp = entry.startTime;
              console.log('FCP:', entry.startTime);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.performanceMetrics.lcp = lastEntry.startTime;
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            console.log('FID:', this.performanceMetrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.performanceMetrics.cls = clsValue;
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
      } catch (error) {
        console.warn('Error setting up performance observers:', error);
      }
    }
  }
  
  monitorResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    
    const slowResources = resources.filter(resource => 
      resource.duration > 1000 // Resources taking more than 1 second
    );
    
    if (slowResources.length > 0) {
      console.warn('Slow loading resources:', slowResources);
    }
  }
  
  sendPerformanceMetrics() {
    // Send metrics to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(this.performanceMetrics.pageLoadTime),
        custom_map: {
          custom_parameter_1: 'load_time'
        }
      });
    }
  }
  
  // ===== SCROLL OPTIMIZATION =====
  debounceScrollEvents() {
    let scrollTimeout;
    let lastScrollTop = 0;
    
    const optimizedScrollHandler = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only process significant scroll changes
      if (Math.abs(scrollTop - lastScrollTop) > 5) {
        // Trigger scroll events
        document.dispatchEvent(new CustomEvent('optimizedScroll', {
          detail: { scrollTop, direction: scrollTop > lastScrollTop ? 'down' : 'up' }
        }));
        
        lastScrollTop = scrollTop;
      }
    };
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = requestAnimationFrame(optimizedScrollHandler);
    }, { passive: true });
  }
  
  // ===== PUBLIC METHODS =====
  
  // Preload a specific image
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
  
  // Load additional content (for infinite scroll, etc.)
  loadAdditionalContent(selector) {
    const newElements = document.querySelectorAll(selector);
    
    newElements.forEach(element => {
      const images = element.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (this.observer) {
          this.observer.observe(img);
        } else {
          this.loadLazyImage(img);
        }
      });
    });
  }
  
  // Get current performance metrics
  getPerformanceMetrics() {
    return this.performanceMetrics;
  }
  
  // Manual cleanup for SPA navigation
  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Make it globally available
window.PerformanceOptimizer = performanceOptimizer;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}