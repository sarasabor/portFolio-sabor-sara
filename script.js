// Navigation mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animation des barres de compétences
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Section compétences visible, animation des barres...');
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            console.log(`${skillBars.length} barres trouvées`);
            
            skillBars.forEach((bar, index) => {
                const level = bar.getAttribute('data-level');
                console.log(`Animation barre ${index}: ${level}%`);
                
                // Réinitialiser la barre
                bar.style.width = '0%';
                
                // Animer avec délai progressif
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, index * 150 + 200);
            });
            
            // Ne déclencher qu'une fois
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer la section des compétences
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
} else {
    console.warn('Section .skills non trouvée');
}

// Animation fade-in pour les éléments
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observer tous les éléments à animer
const elementsToAnimate = document.querySelectorAll('.project-card, .skill-item, .contact-item, .about-text, .about-image');
elementsToAnimate.forEach(el => {
    fadeObserver.observe(el);
});

// Effet de parallaxe sur la section hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Changement de style de la navbar au scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Animation de typing pour le titre
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialiser l'animation de typing si l'élément existe
document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
});

// Configuration EmailJS
(function() {
    emailjs.init('lKTr0zzWiVYriw01r'); // Votre Public Key
})();

// Gestion du formulaire de contact avec EmailJS
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('#submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Changer le bouton en état de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Envoyer l'email via EmailJS
        emailjs.sendForm(
            'service_00l3oas',    // Votre Service ID
            'template_gk2zkqm',   // Votre Template ID
            this
        ).then(function(response) {
            console.log('Email envoyé avec succès!', response.status, response.text);
            
            // Afficher un message de succès
            showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
        }, function(error) {
            console.log('Erreur lors de l\'envoi:', error);
            
            // Afficher un message d'erreur
            showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
            
        }).finally(function() {
            // Restaurer le bouton dans tous les cas
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Ajouter les styles si ils n'existent pas
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                min-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #10B981;
            }
            
            .notification-error {
                border-left: 4px solid #EF4444;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
                margin-left: 1rem;
            }
            
            .notification-close:hover {
                color: #666;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Gérer la fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Animation des compteurs dans la section "À propos"
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h4');
    const speed = 200;

    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''));
        const increment = target / speed;
        let count = 0;

        const updateCounter = () => {
            if (count < target) {
                count += increment;
                let displayCount = Math.floor(count);
                
                // Garder le suffixe original (+ ou %)
                const originalText = counter.innerText;
                const suffix = originalText.replace(/[0-9]/g, '');
                
                counter.innerText = displayCount + suffix;
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = counter.getAttribute('data-target') || counter.innerText;
            }
        };

        updateCounter();
    });
}

// Observer pour les compteurs
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// Effet de particules sur la section hero
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;

    hero.appendChild(particlesContainer);

    // Créer des particules
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Ajouter l'animation CSS pour les particules
    if (!document.querySelector('#particles-styles')) {
        const styles = document.createElement('style');
        styles.id = 'particles-styles';
        styles.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialiser les particules
document.addEventListener('DOMContentLoaded', createParticles);

// Gestion du mode sombre (optionnel)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Charger le mode sombre depuis localStorage
document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
});

// Ajouter un bouton de mode sombre (optionnel)
function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.className = 'dark-mode-toggle';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--gradient-primary);
        color: white;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    toggle.addEventListener('click', toggleDarkMode);
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
    });
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(toggle);
}

// Initialiser le toggle de mode sombre
// createDarkModeToggle(); // Décommentez si vous voulez le bouton de mode sombre

// Performance : Lazy loading pour les images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Gestion des erreurs JavaScript
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page chargée en ${Math.round(loadTime)} ms`);
});

console.log('🚀 Portfolio chargé avec succès !');
