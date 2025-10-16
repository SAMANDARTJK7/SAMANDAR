document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    const businessToggle = document.getElementById('businessToggle');
    const body = document.body;
    const backToTop = document.querySelector('.back-to-top');
    const statNumbers = document.querySelectorAll('.stat-number');
    const modals = document.querySelectorAll('.modal');
    const modalButtons = document.querySelectorAll('[data-modal]');
    const contactForm = document.querySelector('.contact-form');
    const currentYearEl = document.getElementById('currentYear');

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 960) {
                    nav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    if (businessToggle) {
        businessToggle.addEventListener('click', () => {
            const isBusiness = body.classList.toggle('business-mode');
            businessToggle.setAttribute('aria-pressed', String(isBusiness));
            businessToggle.textContent = isBusiness ? 'Бизнес-режим' : 'Обычный режим';
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (statNumbers.length > 0) {
        const animateStats = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = Number(el.dataset.target);
                    const increment = Math.ceil(target / 60);
                    let current = 0;
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(counter);
                        }
                        el.textContent = current.toString();
                    }, 20);
                    observer.unobserve(el);
                }
            });
        };

        const observer = new IntersectionObserver(animateStats, {
            threshold: 0.3
        });

        statNumbers.forEach(number => observer.observe(number));
    }

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.hidden = false;
                modal.querySelector('[data-close]')?.focus();
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal || event.target.hasAttribute('data-close')) {
                modal.hidden = true;
            }
        });

        modal.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                modal.hidden = true;
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const errors = {};

            const name = formData.get('name');
            if (!name || String(name).trim().length < 2) {
                errors.name = 'Пожалуйста, укажите ваше имя (минимум 2 символа).';
            }

            const email = formData.get('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(String(email))) {
                errors.email = 'Введите корректный email.';
            }

            const message = formData.get('message');
            if (!message || String(message).trim().length < 10) {
                errors.message = 'Расскажите о задаче чуть подробнее (минимум 10 символов).';
            }

            const consent = contactForm.querySelector('#consent');
            if (!consent?.checked) {
                errors.consent = 'Необходимо согласие на обработку данных.';
            }

            contactForm.querySelectorAll('.form-error').forEach(node => {
                node.textContent = '';
            });

            Object.entries(errors).forEach(([key, value]) => {
                const errorNode = contactForm.querySelector(`.form-error[data-for="${key}"]`);
                if (errorNode) {
                    errorNode.textContent = value;
                }
            });

            const successNode = contactForm.querySelector('.form-success');
            if (Object.keys(errors).length === 0 && successNode) {
                successNode.textContent = 'Спасибо! Ваш запрос отправлен. Я свяжусь с вами в течение 24 часов.';
                contactForm.reset();
                setTimeout(() => {
                    successNode.textContent = '';
                }, 6000);
            } else if (successNode) {
                successNode.textContent = '';
            }
        });
    }
});
