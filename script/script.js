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

// ---------- Interactive Flow Field Animation ----------
function initContactCanvas() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let particles = [];
    let mouse = { x: null, y: null, active: false, clicked: false };
    let isVisible = false;
    let animationId = null;
    let time = 0;

    const PARTICLE_COUNT = 800;
    const COLORS = ['#20c997', '#28a745', '#4facfe', '#667eea', '#f093fb'];

    // Simplex noise
    const noise = (() => {
        const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
        const perm = new Array(512);
        for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
        const dot = (g, x, y) => g[0] * x + g[1] * y;
        return (xin, yin) => {
            const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
            const s = (xin + yin) * F2;
            const i = Math.floor(xin + s), j = Math.floor(yin + s);
            const t = (i + j) * G2;
            const x0 = xin - (i - t), y0 = yin - (j - t);
            const [i1, j1] = x0 > y0 ? [1, 0] : [0, 1];
            const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
            const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
            const ii = i & 255, jj = j & 255;
            let t0 = 0.5 - x0 * x0 - y0 * y0;
            const n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * dot(grad3[perm[ii + perm[jj]] % 12], x0, y0));
            let t1 = 0.5 - x1 * x1 - y1 * y1;
            const n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * dot(grad3[perm[ii + i1 + perm[jj + j1]] % 12], x1, y1));
            let t2 = 0.5 - x2 * x2 - y2 * y2;
            const n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * dot(grad3[perm[ii + 1 + perm[jj + 1]] % 12], x2, y2));
            return 70 * (n0 + n1 + n2);
        };
    })();

    function resize() {
        const zone = canvas.parentElement;
        dpr = window.devicePixelRatio || 1;
        width = zone.offsetWidth;
        height = zone.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 0.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.6 + 0.2,
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function update() {
        time += 0.008;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Flow field from simplex noise
            const scale = 0.003;
            const n = noise(p.x * scale + time * 0.5, p.y * scale + time * 0.3);
            const angle = n * Math.PI * 4;
            p.vx += Math.cos(angle) * 0.25;
            p.vy += Math.sin(angle) * 0.25;

            // Mouse: attract on hover, big bang on click
            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (mouse.clicked && dist < 300) {
                    // Big bang repulsion on click
                    const force = (300 - dist) / 300;
                    p.vx -= (dx / dist) * force * 4;
                    p.vy -= (dy / dist) * force * 4;
                } else if (dist < 200) {
                    // Attract toward cursor
                    const force = (200 - dist) / 200;
                    p.vx += (dx / dist) * force * 1.5;
                    p.vy += (dy / dist) * force * 1.5;
                }
            }

            // Friction
            p.vx *= 0.95;
            p.vy *= 0.95;

            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
    }

    function draw() {
        // Trail fade
        ctx.fillStyle = 'rgba(8, 8, 12, 0.12)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const alpha = Math.min(1, speed * 0.25 + 0.15);
            const size = p.size * (1 + speed * 0.08);

            // Particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * p.alpha;
            ctx.fill();

            // Glow on fast particles
            if (speed > 2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
                ctx.globalAlpha = alpha * 0.08;
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;

        // Mouse cursor glow
        if (mouse.active) {
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
            grad.addColorStop(0, mouse.clicked ? 'rgba(245, 87, 108, 0.12)' : 'rgba(32, 201, 151, 0.1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        if (!isVisible) return;
        update();
        draw();
        animationId = requestAnimationFrame(animate);
    }

    // Direct mouse events on canvas (no overlay blocking)
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });
    canvas.addEventListener('mouseleave', function() {
        mouse.active = false;
    });
    canvas.addEventListener('mousedown', function() {
        mouse.clicked = true;
    });
    canvas.addEventListener('mouseup', function() {
        mouse.clicked = false;
    });
    // Touch support
    canvas.addEventListener('touchmove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
    });
    canvas.addEventListener('touchend', function() {
        mouse.active = false;
    });

    // Only animate when visible
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible = true;
                animate();
            } else {
                isVisible = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.05 });
    canvasObserver.observe(canvas.parentElement);

    window.addEventListener('resize', resize);
    init();
}

// ---------- Initialize on DOM Load ----------
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();

    // Start typing effect
    setTimeout(typeEffect, 1000);

    // Initialize contact canvas animation
    initContactCanvas();

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
