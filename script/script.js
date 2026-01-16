// ============================================
// AI PRODUCT MANAGER PORTFOLIO - SCRIPTS
// ============================================

// ---------- Navbar Scroll Effect ----------
const header = document.querySelector('.navbar');
window.onscroll = function() {
    const top = window.scrollY;
    if(top >= 100) {
        header.classList.add('navbarDark');
    } else {
        header.classList.remove('navbarDark');
    }
}

// ---------- Collapse navbar on click (mobile) ----------
const navLinks = document.querySelectorAll('.nav-item');
const menuToggle = document.getElementById('navbarSupportedContent');
navLinks.forEach((l) => {
    l.addEventListener('click', () => {
        new bootstrap.Collapse(menuToggle).toggle();
    });
});

// ---------- EmailJS Contact Form ----------
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            alert('Email service is loading. Please try again in a moment.');
            console.error('EmailJS not loaded');
            return;
        }

        const serviceID = 'service_yvg59sy';
        const templateID = 'template_9boqmz2';
        const fromName = document.querySelector('input[name="name"]').value;
        const fromEmail = document.querySelector('input[name="email"]').value;
        const subject = document.querySelector('input[name="subject"]').value;
        const message = document.querySelector('textarea[name="message"]').value;

        // Disable submit button while sending
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

        emailjs.send(serviceID, templateID, {
            from_name: fromName,
            from_email: fromEmail,
            subject: subject,
            message: message,
        }).then(function(response) {
            console.log('Email sent successfully:', response);
            alert('Your message has been sent!');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, function(error) {
            console.error('EmailJS error:', error);
            alert('Failed to send the message. Please try again or contact me directly at aadityasp@gmail.com');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
}

// ---------- Typing Effect for Hero ----------
const typedPhrases = [
    "Product Manager building the future of retail technology",
    "Building production apps in hours, not months with AI tools",
    "Certified Scrum Product Owner & GenAI Leader"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;

    const currentPhrase = typedPhrases[phraseIndex];

    if (isDeleting) {
        typedText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        typedText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typedPhrases.length;
        typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeEffect, typingSpeed);
}

// ---------- Scroll Animation Observer ----------
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// ---------- Counter Animation for Stats ----------
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.round(target * easeOutQuad);

        element.textContent = currentValue;

        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target;
        }
    }, frameDuration);
}

// Stats Observer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                if (!stat.classList.contains('counted')) {
                    stat.classList.add('counted');
                    animateCounter(stat, target);
                }
            });
        }
    });
}, { threshold: 0.5 });

// ---------- Smooth Scroll for Navigation ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ---------- Video Hover Play ----------
document.querySelectorAll('.video-container video').forEach(video => {
    video.parentElement.addEventListener('mouseenter', () => {
        video.play();
    });
    video.parentElement.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// ---------- Initialize on DOM Load ----------
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();

    // Start typing effect
    setTimeout(typeEffect, 1000);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // Observe timeline content for staggered list animations
    document.querySelectorAll('.timeline-content').forEach(el => {
        scrollObserver.observe(el);
    });

    // Observe stats row for counter animation
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
        statsObserver.observe(statsRow);
    }
});
