/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");

    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove("user-is-tabbing");

  window.removeEventListener("mousedown", handleMouseDownOnce);
  window.addEventListener("keydown", handleFirstTab);
};

window.addEventListener("keydown", handleFirstTab);

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
  
  // Add scrolled class to navigation
  const nav = document.querySelector('.nav');
  if (nav) {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  
  // Parallax effect for background particles
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('body::after');
  if (parallax) {
    const speed = scrolled * 0.5;
    document.documentElement.style.setProperty('--scroll', `${speed}px`);
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px 50px 0px' // Trigger 50px before element enters viewport
};

// Separate observer for work boxes with earlier trigger
const workObserverOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px 100px 0px' // Trigger 100px before element enters viewport
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: stop observing after animation
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const workObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, workObserverOptions);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  // Project count in work intro
  const workIntro = document.getElementById('workIntro');
  const projectCount = document.querySelectorAll('.work__boxes > .work__box').length;
  if (workIntro && projectCount > 0) {
    workIntro.textContent = `${projectCount} shipped products across AI, health, retail, and creator tools—live in production today.`;
  }

  // Copy email
  const copyBtn = document.getElementById('copyEmail');
  const contactEmail = document.getElementById('contactEmail');
  if (copyBtn && contactEmail) {
    copyBtn.addEventListener('click', async () => {
      const email = contactEmail.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy address';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Cursor glow (desktop, motion allowed)
  const cursorGlow = document.getElementById('cursorGlow');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (cursorGlow && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('has-cursor-glow');
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // Subtle tilt on project images
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.work__image-box').forEach((box) => {
      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const img = box.querySelector('.work__image');
        if (img) {
          img.style.transform = `scale(1.03) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
        }
      });
      box.addEventListener('mouseleave', () => {
        const img = box.querySelector('.work__image');
        if (img) img.style.transform = '';
      });
    });
  }

  const navToggle = document.querySelector('.nav__toggle');
  const navItems = document.querySelector('.nav__items');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navItems) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navItems.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navItems.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navItems.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navItems.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
  // Observe sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Observe work boxes with stagger delay - use workObserver for earlier trigger
  const workBoxes = document.querySelectorAll('.work__box');
  workBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.1}s`;
    workObserver.observe(box);
  });

  // Observe client logos with stagger delay
  const clientLogos = document.querySelectorAll('.client__logos div');
  clientLogos.forEach((logo, index) => {
    logo.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(logo);
  });

  // Observe section labels and key headings only
  document.querySelectorAll('.section-label, .work__text h3').forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Observe about photo
  const aboutPhoto = document.querySelector('.about__photo');
  if (aboutPhoto) {
    aboutPhoto.classList.add('scale-in');
    observer.observe(aboutPhoto);
  }

  // Observe contact info
  const contactInfo = document.querySelector('.contact__info');
  if (contactInfo) {
    contactInfo.classList.add('fade-in');
    observer.observe(contactInfo);
  }

  // Observe header text and video
  const vmimgText = document.querySelector('.vmimgText');
  const vmimg = document.querySelector('.vmimg');
  if (vmimgText) {
    setTimeout(() => {
      vmimgText.classList.add('visible');
    }, 200);
  }
  if (vmimg) {
    setTimeout(() => {
      vmimg.classList.add('visible');
    }, 400);
  }

  // Optimize video loading
  const video = document.getElementById('myVideo');
  const videoLoading = document.getElementById('videoLoading');
  
  if (video && videoLoading) {
    // Show loading spinner
    videoLoading.classList.remove('hidden');
    
    // Load video metadata first, then play
    video.addEventListener('loadedmetadata', () => {
      // Video metadata loaded, start playing
      video.play().catch(() => {
        // Autoplay blocked, show loading until user interaction
        console.log('Autoplay blocked');
      });
    });
    
    // Hide loading spinner when video can play
    video.addEventListener('canplay', () => {
      video.classList.add('loaded');
      setTimeout(() => {
        videoLoading.classList.add('hidden');
      }, 300);
    });
    
    // Handle video loading errors
    video.addEventListener('error', () => {
      videoLoading.classList.add('hidden');
      console.error('Video loading error');
    });
    
    // Intersection Observer for lazy loading video
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video is in viewport, start loading
          if (video.readyState === 0) {
            video.load();
          }
          videoObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });
    
    videoObserver.observe(video);
  }
});

// Parallax scroll effect for background
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  
  // Update scroll progress indicator
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = `${scrollPercent}%`;
  }
  
  // Update background particle position based on scroll
  const bodyAfter = document.querySelector('body');
  if (bodyAfter) {
    const yPos = scrollTop * 0.3;
    bodyAfter.style.setProperty('--scroll-y', `${yPos}px`);
  }
  
  // Parallax effect for animated background
  const animatedBg = document.querySelector('.animated-bg');
  if (animatedBg) {
    const bgY = scrollTop * 0.2;
    animatedBg.style.transform = `translateY(${bgY}px)`;
  }
  
  lastScrollTop = scrollTop;

  // Highlight active nav link
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  let currentId = 'top';

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (scrollTop >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === `#${currentId}`;
    link.classList.toggle('nav__link--active', isActive);
  });
}, false);
