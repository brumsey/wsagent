/**
 * Plumbsimple Website JavaScript
 * Mobile navigation and click-to-call tracking
 */

(function() {
  'use strict';

  // Mobile Menu Toggle
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        // Update ARIA attributes for accessibility
        const isExpanded = navMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Click-to-Call Tracking
  function trackPhoneClick(phoneNumber) {
    // Track phone clicks with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'phone_click', {
        'event_category': 'Contact',
        'event_label': phoneNumber,
        'value': 1
      });
    }

    // Track with Google Analytics 4 if available
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'Contact', 'phone_click', phoneNumber, 1);
    }

    console.log('Phone click tracked: ' + phoneNumber);
  }

  // Initialize phone click tracking on all tel: links
  function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        const phoneNumber = this.getAttribute('href').replace('tel:', '');
        trackPhoneClick(phoneNumber);
      });
    });
  }

  // CTA Button Click Tracking
  function trackCTAClick(buttonText, buttonType) {
    // Track CTA clicks with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        'event_category': 'Engagement',
        'event_label': buttonText,
        'button_type': buttonType
      });
    }

    console.log('CTA tracked: ' + buttonText + ' (' + buttonType + ')');
  }

  // Initialize CTA tracking
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    ctaButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonType = this.classList.contains('btn-primary') ? 'emergency' : 'scheduled';
        trackCTAClick(buttonText, buttonType);
      });
    });
  }

  // Form Submission Tracking
  function trackFormSubmit(formName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': formName
      });
    }

    console.log('Form submission tracked: ' + formName);
  }

  // Initialize form tracking
  function initFormTracking() {
    const forms = document.querySelectorAll('form');

    forms.forEach(function(form) {
      form.addEventListener('submit', function() {
        const formName = this.getAttribute('name') || this.getAttribute('id') || 'contact_form';
        trackFormSubmit(formName);
      });
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId !== '#') {
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }
        }
      });
    });
  }

  // Sticky header on scroll
  function initStickyHeader() {
    const header = document.querySelector('.header');

    if (header) {
      let lastScroll = 0;

      window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
        } else {
          header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
      });
    }
  }

  // Lazy load images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');

            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(function(img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }

  // Add current year to copyright
  function updateCopyright() {
    const copyrightYear = document.querySelector('.copyright-year');
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear();
    }
  }

  // Emergency banner highlighting
  function highlightEmergencyElements() {
    // Add subtle pulse animation to emergency CTAs
    const emergencyCTAs = document.querySelectorAll('.btn-primary');

    emergencyCTAs.forEach(function(cta) {
      if (cta.textContent.toLowerCase().includes('call now') ||
          cta.textContent.toLowerCase().includes('emergency')) {
        cta.classList.add('emergency-pulse');
      }
    });
  }

  // Dropdown menu accessibility
  function initDropdownAccessibility() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');

    dropdowns.forEach(function(toggle) {
      const dropdown = toggle.closest('.dropdown');
      const menu = dropdown.querySelector('.dropdown-menu');

      // Keyboard navigation
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
      });

      // Close on escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.style.display === 'block') {
          menu.style.display = 'none';
          toggle.focus();
        }
      });
    });
  }

  // Display current time for 24/7 messaging
  function updateAvailabilityTime() {
    const availabilityElements = document.querySelectorAll('.current-time');

    if (availabilityElements.length > 0) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      availabilityElements.forEach(function(el) {
        el.textContent = timeString;
      });
    }
  }

  // Initialize all functions when DOM is ready
  function init() {
    initMobileMenu();
    initPhoneTracking();
    initCTATracking();
    initFormTracking();
    initSmoothScroll();
    initStickyHeader();
    initLazyLoading();
    updateCopyright();
    highlightEmergencyElements();
    initDropdownAccessibility();
    updateAvailabilityTime();
  }

  // Run when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
