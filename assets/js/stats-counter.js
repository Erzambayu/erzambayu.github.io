// Stats Counter Script
document.addEventListener("DOMContentLoaded", function() {
  // Initialize stats counters
  function initCounters() {
    const countUpElements = document.querySelectorAll('.count-up');
    
    countUpElements.forEach(element => {
      // Get the target number from data attribute
      const countTo = parseFloat(element.getAttribute('data-count'));
      
      // Check if number has decimal places
      const decimal = countTo % 1 !== 0 ? 1 : 0;
      
      // Set initial value
      element.textContent = '0';
      
      // Create CountUp instance
      const options = {
        duration: 2.5,
        useEasing: true,
        useGrouping: true,
        decimalPlaces: decimal
      };
      
      // Use CountUp.js if available, otherwise fallback to simple animation
      if (typeof CountUp !== 'undefined') {
        try {
          const countUp = new CountUp(element, countTo, options);
          if (!countUp.error) {
            countUp.start();
          } else {
            console.error(countUp.error);
            simpleCounter(element, countTo, decimal);
          }
        } catch (error) {
          console.error("CountUp error:", error);
          simpleCounter(element, countTo, decimal);
        }
      } else {
        simpleCounter(element, countTo, decimal);
      }
    });
  }
  
  // Simple counter animation fallback
  function simpleCounter(element, target, decimalPlaces) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const interval = duration / 100;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current.toFixed(decimalPlaces);
    }, interval);
  }
  
  // Start counters immediately
  initCounters();
  
  // Also trigger counters when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initCounters();
        observer.disconnect(); // Only need to trigger once
      }
    });
  }, { threshold: 0.1 });
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
});
