document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#site-header");
    const contactForm = document.querySelector(".contact-form");
    const formNote = document.querySelector(".form-note");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    function initSlider({
        slideSelector,
        dotSelector,
        trackSelector,
        activeClass = "active",
        interval = 4000,
        containerSelector,
        translateTrack = false
    }) {
        const slides = document.querySelectorAll(slideSelector);
        const dots = document.querySelectorAll(dotSelector);
        const container = containerSelector ? document.querySelector(containerSelector) : null;
        const track = trackSelector ? document.querySelector(trackSelector) : null;
        const total = Math.min(slides.length, dots.length);

        if (!total) return;

        let activeIndex = 0;
        let timer;

        const showSlide = (index) => {
            activeIndex = (index + total) % total;

            if (translateTrack && track) {
                track.style.transform = `translateX(-${activeIndex * 100}%)`;
            } else {
                slides.forEach((slide, slideIndex) => {
                    slide.classList.toggle(activeClass, slideIndex === activeIndex);
                });
            }

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === activeIndex;
                dot.classList.toggle(activeClass, isActive);
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        };

        const stop = () => window.clearInterval(timer);
        const start = () => {
            if (reduceMotion.matches || total < 2) return;
            stop();
            timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
        };

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                stop();
                showSlide(index);
                start();
            });
        });

        if (container) {
            container.addEventListener("mouseenter", stop);
            container.addEventListener("mouseleave", start);
            container.addEventListener("focusin", stop);
            container.addEventListener("focusout", start);
        }

        showSlide(0);
        start();
    }

    initSlider({
        slideSelector: ".hero-slide",
        dotSelector: ".hero-indicators button",
        activeClass: "active",
        interval: 4000,
        containerSelector: ".hero-showcase"
    });

    initSlider({
        slideSelector: ".project-card",
        dotSelector: ".work-dots button",
        trackSelector: ".work-track",
        activeClass: "is-active",
        interval: 5000,
        containerSelector: ".work-sticky",
        translateTrack: true
    });

    const reveals = document.querySelectorAll(".reveal");

    if (reveals.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15 }
        );

        reveals.forEach((item) => observer.observe(item));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
        });
    });

    if (contactForm && formNote) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            formNote.textContent = "Thanks. Your message is ready to connect to a form service.";
            contactForm.reset();
        });
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
});
