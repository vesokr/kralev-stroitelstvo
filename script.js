// ===== NAVIGATION MENU =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

function scrollHeader() {
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===== ACTIVE LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-element');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service__card, .project__card, .why-us__card, .process__step, .contact__card, .gallery__item');

    animatedElements.forEach(element => {
        element.classList.add('reveal-element');
    });

    setTimeout(revealOnScroll, 100);
});

// ===== SINGLE THROTTLED SCROLL HANDLER =====
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            scrollHeader();
            scrollActive();
            revealOnScroll();
            checkStats();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = '<div style="background-color:#d4edda;color:#155724;padding:20px;border-radius:8px;text-align:center;margin-top:20px;"><h3 style="margin-bottom:10px;">Благодарим Ви за запитването!</h3><p>Ще се свържем с Вас възможно най-скоро.</p></div>';

        contactForm.reset();
        contactForm.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);

        console.log('Form submitted:', formData);
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target, suffix, duration) {
    duration = duration || 1500;
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }
    }, 16);
}

function checkStats() {
    const statsSection = document.querySelector('.home__stats');

    if (!statsSection || statsSection.classList.contains('animated')) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight) {
        statsSection.classList.add('animated');

        document.querySelectorAll('.stat__number').forEach(stat => {
            const text = stat.textContent.trim();
            var number = parseInt(text);

            if (isNaN(number)) return;

            if (text.indexOf('%') !== -1) {
                stat.textContent = '0%';
                animateCounter(stat, number, '%');
            } else {
                stat.textContent = '0+';
                animateCounter(stat, number, '+');
            }
        });
    }
}

window.addEventListener('load', checkStats);

// ===== PHONE NUMBER FORMATTING =====
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        var value = e.target.value.replace(/[^\d\s+]/g, '');
        e.target.value = value;
    });
}

// ===== GALLERY LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery__item img, .project__image img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== CURRENT YEAR FOR FOOTER =====
const yearElement = document.querySelector('.footer__bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
}
