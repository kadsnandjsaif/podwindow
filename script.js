// Header scroll functionality
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
    } else {
        // At top of page
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// Smooth gentle scroll behavior
let scrollTimeout = null;
let lastScrollTime = 0;

window.addEventListener('scroll', function() {
    const currentTime = Date.now();
    
    // Only apply gentle scroll if user paused scrolling for a moment
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const timeDiff = currentTime - lastScrollTime;
        
        // If user stopped scrolling for more than 800ms, gently guide to nearest section
        if (timeDiff > 800) {
            const sections = document.querySelectorAll('.section');
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollTop;
                const distance = Math.abs(rect.top);
                
                // Find the section closest to the viewport center
                if (distance < closestDistance && Math.abs(rect.top) < windowHeight * 0.7) {
                    closestDistance = distance;
                    closestSection = sectionTop;
                }
            });
            
            // Only scroll if we're reasonably close to a section boundary
            if (closestSection !== null && closestDistance < windowHeight * 0.3) {
                window.scrollTo({
                    top: closestSection,
                    behavior: 'smooth'
                });
            }
        }
    }, 1200); // Wait 1.2 seconds after user stops scrolling
    
    lastScrollTime = currentTime;
});

// Modal functionality
const burgerMenu = document.querySelector('.burger-menu');
const burgerModal = document.getElementById('burgerModal');
const burgerClose = document.getElementById('burgerClose');
const burgerCallButton = document.getElementById('burgerCallButton');

const callButtons = document.querySelectorAll('.header-content-button, .burger-modal__button');
const callModal = document.getElementById('callModal');
const callClose = document.getElementById('callClose');
const callForm = document.getElementById('callForm');

// Burger menu controls
burgerMenu.addEventListener('click', function() {
    burgerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

burgerClose.addEventListener('click', function() {
    burgerModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close burger menu on link click
document.querySelectorAll('.burger-modal__link').forEach(link => {
    link.addEventListener('click', function() {
        burgerModal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close burger menu on overlay click
document.querySelector('.burger-modal__overlay').addEventListener('click', function() {
    burgerModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Call modal controls
callButtons.forEach(button => {
    button.addEventListener('click', function() {
        callModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Close burger menu if open
        burgerModal.classList.remove('active');
    });
});

callClose.addEventListener('click', function() {
    callModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close call modal on overlay click
document.querySelector('.call-modal__overlay').addEventListener('click', function() {
    callModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Phone number formatting
const phoneInput = document.getElementById('userPhone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (value.startsWith('7')) {
        const match = value.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (match) {
            e.target.value = `+7${match[1] ? ` (${match[1]}` : ''}${match[2] ? `) ${match[2]}` : ''}${match[3] ? `-${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
        }
    }
});

// Form submission
callForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(callForm);
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const message = document.getElementById('userMessage').value;
    
    // Simulate form submission
    const submitButton = document.querySelector('.call-modal__submit');
    submitButton.textContent = 'ОТПРАВЛЯЕМ...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
        callModal.classList.remove('active');
        document.body.style.overflow = '';
        callForm.reset();
        submitButton.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
        submitButton.disabled = false;
    }, 1500);
});

// Phone header click
document.querySelector('.header-content-phone').addEventListener('click', function() {
    window.location.href = 'tel:+78005005231';
});

// Interactive Slider Class (Fixed mobile scrolling)
class InteractiveSlider {
    constructor(containerId, backgroundId) {
        this.container = document.getElementById(containerId);
        this.background = document.getElementById(backgroundId);
        this.cards = this.container.querySelectorAll('.slider-card');
        this.currentIndex = -1;
        this.autoSliderInterval = null;
        this.isInViewport = false;
        this.defaultBackground = 'images/Rectangle 30.png';
        this.isHovering = false;
        this.clickedCard = null;
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.init();
    }
    
    init() {
        this.updateBackground(this.defaultBackground);
        
        // Add mouse wheel scrolling for desktop
        if (!this.isMobile && this.container) {
            this.container.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.container.scrollLeft += e.deltaY;
            }, { passive: false });
        }
        
        this.cards.forEach((card, index) => {
            // Only add hover events for desktop
            if (!this.isMobile) {
                card.addEventListener('mouseenter', (e) => {
                    if (this.clickedCard === null) {
                        this.previewCard(index);
                    }
                });
                
                card.addEventListener('mouseleave', (e) => {
                    if (this.clickedCard === null) {
                        this.resetPreview();
                    }
                });
            }
            
            // Click events for both desktop and mobile
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectCard(index);
            });
            
            // Touch events for mobile only
            if (this.isMobile) {
                card.addEventListener('touchstart', (e) => {
                    // Don't prevent default to allow scrolling
                    e.stopPropagation();
                }, { passive: true });
                
                card.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectCard(index);
                }, { passive: false });
            }
        });
        
        // Click outside to deselect (only for desktop)
        if (!this.isMobile) {
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.deselectAll();
                }
            });
        }
        
        this.resetAllCards();
    }
    
    previewCard(index) {
        this.setActiveCard(index);
        const bgImage = this.cards[index].getAttribute('data-bg');
        if (bgImage) {
            this.updateBackground(bgImage);
        }
        this.pauseAutoSlider();
    }
    
    resetPreview() {
        if (this.clickedCard !== null) {
            this.setActiveCard(this.clickedCard);
            const bgImage = this.cards[this.clickedCard].getAttribute('data-bg');
            if (bgImage) {
                this.updateBackground(bgImage);
            }
        } else {
            this.updateBackground(this.defaultBackground);
            this.resetAllCards();
            if (this.isInViewport) {
                this.startAutoSlider();
            }
        }
    }
    
    selectCard(index) {
        this.clickedCard = index;
        this.setActiveCard(index);
        const bgImage = this.cards[index].getAttribute('data-bg');
        if (bgImage) {
            this.updateBackground(bgImage);
        }
        this.pauseAutoSlider();
    }
    
    deselectAll() {
        this.clickedCard = null;
        this.updateBackground(this.defaultBackground);
        this.resetAllCards();
        if (this.isInViewport) {
            this.startAutoSlider();
        }
    }
    
    setActiveCard(index) {
        this.cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        this.currentIndex = index;
    }
    
    resetAllCards() {
        this.cards.forEach((card) => {
            card.classList.remove('active');
        });
        this.currentIndex = -1;
    }
    
    updateBackground(imagePath) {
        if (this.background) {
            this.background.style.backgroundImage = `url('${imagePath}')`;
        }
    }
    
    nextSlide() {
        if (this.clickedCard === null) {
            const randomIndex = Math.floor(Math.random() * this.cards.length);
            const randomCard = this.cards[randomIndex];
            const bgImage = randomCard.getAttribute('data-bg');
            
            this.setActiveCard(randomIndex);
            if (bgImage) {
                this.updateBackground(bgImage);
            }
            
            setTimeout(() => {
                if (this.clickedCard === null) {
                    this.updateBackground(this.defaultBackground);
                    this.resetAllCards();
                }
            }, 2000);
        }
    }
    
    startAutoSlider() {
        if (this.autoSliderInterval) {
            clearInterval(this.autoSliderInterval);
        }
        
        this.autoSliderInterval = setInterval(() => {
            this.nextSlide();
        }, 8000);
    }
    
    pauseAutoSlider() {
        if (this.autoSliderInterval) {
            clearInterval(this.autoSliderInterval);
            this.autoSliderInterval = null;
        }
    }
}

// Accessories Slider Class (Fixed mobile scrolling)
class AccessoriesSlider {
    constructor(containerId, backgroundId) {
        this.container = document.getElementById(containerId);
        this.background = document.getElementById(backgroundId);
        this.cards = this.container.querySelectorAll('.accessories-slider-card');
        this.currentIndex = -1;
        this.autoSliderInterval = null;
        this.isInViewport = false;
        this.defaultBackground = 'images/Rectangle 30.png';
        this.hoverBackground = 'sliders-images/Rectangle 7.png';
        this.isHovering = false;
        this.clickedCard = null;
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.init();
    }
    
    init() {
        this.updateBackground(this.defaultBackground);
        
        this.cards.forEach((card, index) => {
            // Only add hover events for desktop
            if (!this.isMobile) {
                card.addEventListener('mouseenter', (e) => {
                    if (this.clickedCard === null) {
                        this.previewCard(index);
                    }
                });
                
                card.addEventListener('mouseleave', (e) => {
                    if (this.clickedCard === null) {
                        this.resetPreview();
                    }
                });
            }
            
            // Click events for both desktop and mobile
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectCard(index);
            });
            
            // Touch events for mobile only
            if (this.isMobile) {
                card.addEventListener('touchstart', (e) => {
                    // Don't prevent default to allow scrolling
                    e.stopPropagation();
                }, { passive: true });
                
                card.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectCard(index);
                }, { passive: false });
            }
        });
        
        // Click outside to deselect (only for desktop)
        if (!this.isMobile) {
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.deselectAll();
                }
            });
        }
        
        this.resetAllCards();
    }
    
    previewCard(index) {
        this.setActiveCard(index);
        this.updateBackground(this.hoverBackground);
        this.pauseAutoSlider();
    }
    
    resetPreview() {
        if (this.clickedCard !== null) {
            this.setActiveCard(this.clickedCard);
            this.updateBackground(this.hoverBackground);
        } else {
            this.updateBackground(this.defaultBackground);
            this.resetAllCards();
            if (this.isInViewport) {
                this.startAutoSlider();
            }
        }
    }
    
    selectCard(index) {
        this.clickedCard = index;
        this.setActiveCard(index);
        this.updateBackground(this.hoverBackground);
        this.pauseAutoSlider();
    }
    
    deselectAll() {
        this.clickedCard = null;
        this.updateBackground(this.defaultBackground);
        this.resetAllCards();
        if (this.isInViewport) {
            this.startAutoSlider();
        }
    }
    
    setActiveCard(index) {
        this.cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        this.currentIndex = index;
    }
    
    resetAllCards() {
        this.cards.forEach((card) => {
            card.classList.remove('active');
        });
        this.currentIndex = -1;
    }
    
    updateBackground(imagePath) {
        if (this.background) {
            this.background.style.backgroundImage = `url('${imagePath}')`;
        }
    }
    
    nextSlide() {
        if (this.clickedCard === null) {
            const isDefault = this.background.style.backgroundImage.includes('Rectangle 30.png');
            if (isDefault) {
                this.updateBackground(this.hoverBackground);
                this.setActiveCard(Math.floor(Math.random() * this.cards.length));
            } else {
                this.updateBackground(this.defaultBackground);
                this.resetAllCards();
            }
        }
    }
    
    startAutoSlider() {
        if (this.autoSliderInterval) {
            clearInterval(this.autoSliderInterval);
        }
        
        this.autoSliderInterval = setInterval(() => {
            this.nextSlide();
        }, 8000);
    }
    
    pauseAutoSlider() {
        if (this.autoSliderInterval) {
            clearInterval(this.autoSliderInterval);
            this.autoSliderInterval = null;
        }
    }
}

// Intersection Observer for sliders
function initSliderObserver() {
    const sliderSection = document.getElementById('section4');
    const accessoriesSection = document.getElementById('section6');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'section4') {
                    window.interactiveSlider.isInViewport = true;
                    window.interactiveSlider.startAutoSlider();
                    window.interactiveSlider.updateBackground(window.interactiveSlider.defaultBackground);
                    window.interactiveSlider.resetAllCards();
                } else if (entry.target.id === 'section6') {
                    window.accessoriesSlider.isInViewport = true;
                    window.accessoriesSlider.startAutoSlider();
                    window.accessoriesSlider.updateBackground(window.accessoriesSlider.defaultBackground);
                    window.accessoriesSlider.resetAllCards();
                }
            } else {
                if (entry.target.id === 'section4') {
                    window.interactiveSlider.isInViewport = false;
                    window.interactiveSlider.pauseAutoSlider();
                } else if (entry.target.id === 'section6') {
                    window.accessoriesSlider.isInViewport = false;
                    window.accessoriesSlider.pauseAutoSlider();
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (sliderSection) observer.observe(sliderSection);
    if (accessoriesSection) observer.observe(accessoriesSection);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders
    window.interactiveSlider = new InteractiveSlider('sliderCards', 'sliderBackground');
    window.accessoriesSlider = new AccessoriesSlider('accessoriesSliderCards', 'accessoriesSliderBackground');
    
    // Initialize intersection observer
    initSliderObserver();
    
    // Initialize FAQ accordion
    initFAQAccordion();
});

// FAQ Accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherAnswer.style.padding = '0 25px';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0 25px';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.padding = '0 25px 25px 25px';
                
                // Scroll to question if needed
                setTimeout(() => {
                    const rect = question.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    
                    if (!isVisible) {
                        question.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }, 300);
            }
        });
        
        // Handle responsive padding
        const updatePadding = () => {
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 480;
            
            if (item.classList.contains('active')) {
                if (isSmallMobile) {
                    answer.style.padding = '0 15px 15px 15px';
                } else if (isMobile) {
                    answer.style.padding = '0 18px 18px 18px';
                } else {
                    answer.style.padding = '0 25px 25px 25px';
                }
            } else {
                if (isSmallMobile) {
                    answer.style.padding = '0 15px';
                } else if (isMobile) {
                    answer.style.padding = '0 18px';
                } else {
                    answer.style.padding = '0 25px';
                }
            }
        };
        
        window.addEventListener('resize', updatePadding);
        updatePadding();
    });
    
    // Keyboard navigation for FAQ
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('faq-question')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });
    
    // Make FAQ questions focusable
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', item.classList.contains('active'));
        
        const observer = new MutationObserver(() => {
            question.setAttribute('aria-expanded', item.classList.contains('active'));
        });
        
        observer.observe(item, { attributes: true, attributeFilter: ['class'] });
    });
}

// Keyboard navigation for both sliders
document.addEventListener('keydown', function(e) {
    const isSection4InView = window.interactiveSlider && window.interactiveSlider.isInViewport;
    const isSection6InView = window.accessoriesSlider && window.accessoriesSlider.isInViewport;
    
    if (e.key === 'ArrowLeft') {
        if (isSection4InView) {
            const prevIndex = window.interactiveSlider.currentIndex === 0 
                ? window.interactiveSlider.cards.length - 1 
                : window.interactiveSlider.currentIndex - 1;
            window.interactiveSlider.setActiveCard(prevIndex);
        } else if (isSection6InView) {
            const prevIndex = window.accessoriesSlider.currentIndex === 0 
                ? window.accessoriesSlider.cards.length - 1 
                : window.accessoriesSlider.currentIndex - 1;
            window.accessoriesSlider.setActiveCard(prevIndex);
        }
    } else if (e.key === 'ArrowRight') {
        if (isSection4InView) {
            window.interactiveSlider.nextSlide();
        } else if (isSection6InView) {
            window.accessoriesSlider.nextSlide();
        }
    }
});
