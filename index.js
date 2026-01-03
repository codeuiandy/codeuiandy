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
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
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

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
  // Observe sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Observe work boxes with stagger delay
  const workBoxes = document.querySelectorAll('.work__box');
  workBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(box);
  });

  // Observe client logos with stagger delay
  const clientLogos = document.querySelectorAll('.client__logos div');
  clientLogos.forEach((logo, index) => {
    logo.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(logo);
  });

  // Observe headings
  const headings = document.querySelectorAll('h2, h3');
  headings.forEach(heading => {
    heading.classList.add('fade-in');
    observer.observe(heading);
  });

  // Observe paragraphs
  const paragraphs = document.querySelectorAll('p');
  paragraphs.forEach(para => {
    para.classList.add('fade-in');
    observer.observe(para);
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
}, false);
