const header = document.querySelector("#site-header");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const clientList = document.querySelector("[data-client-list]");
const workCarousel = document.querySelector("[data-work-carousel]");
const workTrack = document.querySelector("[data-work-track]");
const workDots = document.querySelectorAll(".work-dots button");
const heroSection = document.querySelector(".hero");
const heroSystem = document.querySelector("[data-hero-system]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clients = [
  {
    name: "Vie Loras",
    url: "https://www.vieloras.com",
    logo: "assets/Clients /VIE LORAS.avif",
  },
  {
    name: "Him Arogya",
    url: "https://himarogya.com",
    logo: "assets/Clients /Himarogya.avif",
  },
  {
    name: "Zepfly Studio",
    url: "https://zepfly.com",
    logo: "assets/Clients /Zepylf.png",
  },
];

function renderClients() {
  if (!clientList) return;

  const createClientMarkup = (isDuplicate = false) =>
    clients
      .map(
        (client) => `
        <a class="client-logo" href="${client.url}" target="_blank" rel="noopener" aria-label="Visit ${client.name}"${isDuplicate ? ' tabindex="-1"' : ""}>
          <img src="${client.logo}" alt="${client.name}" />
        </a>
      `
      )
      .join("");

  clientList.innerHTML = `
    <div class="client-track">
      <div class="client-group">${createClientMarkup()}</div>
      <div class="client-group" aria-hidden="true">${createClientMarkup(true)}</div>
      <div class="client-group" aria-hidden="true">${createClientMarkup(true)}</div>
      <div class="client-group" aria-hidden="true">${createClientMarkup(true)}</div>
    </div>
  `;
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function initServicesDropdown() {
  const dropdown = document.querySelector(".nav-dropdown");
  const trigger = document.querySelector(".nav-dropdown-trigger");

  if (!dropdown || !trigger) return;

  const openMenu = () => trigger.setAttribute("aria-expanded", "true");
  const closeMenu = () => trigger.setAttribute("aria-expanded", "false");

  dropdown.addEventListener("pointerenter", openMenu);
  dropdown.addEventListener("pointerleave", closeMenu);
  dropdown.addEventListener("focusin", openMenu);
  dropdown.addEventListener("focusout", closeMenu);
}

function initWorkCarousel() {
  if (!workCarousel || !workTrack || !workDots.length) return;

  const slides = workTrack.querySelectorAll(".project-card");
  let activeIndex = 0;
  let carouselTimer;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    workTrack.style.transform = `translateX(-${activeIndex * 100}%)`;

    workDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const startCarousel = () => {
    carouselTimer = window.setInterval(() => showSlide(activeIndex + 1), 5200);
  };

  const stopCarousel = () => {
    window.clearInterval(carouselTimer);
  };

  workDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopCarousel();
      showSlide(index);
      startCarousel();
    });
  });

  workCarousel.addEventListener("mouseenter", stopCarousel);
  workCarousel.addEventListener("mouseleave", startCarousel);
  workCarousel.addEventListener("focusin", stopCarousel);
  workCarousel.addEventListener("focusout", startCarousel);

  showSlide(0);
  startCarousel();
}

function initHeroSystem() {
  if (!heroSection || !heroSystem || reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    heroSystem.style.setProperty("--hero-x", `${currentX.toFixed(2)}px`);
    heroSystem.style.setProperty("--hero-y", `${currentY.toFixed(2)}px`);

    if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
      animationFrame = window.requestAnimationFrame(render);
      return;
    }

    animationFrame = null;
  };

  const queueRender = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
  };

  const handlePointerMove = (event) => {
    const rect = heroSection.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    targetX = relativeX * 22;
    targetY = relativeY * 16;
    queueRender();
  };

  const resetPosition = () => {
    targetX = 0;
    targetY = 0;
    queueRender();
  };

  heroSection.addEventListener("pointermove", handlePointerMove, { passive: true });
  heroSection.addEventListener("pointerleave", resetPosition);
}

updateHeader();
renderClients();
initServicesDropdown();
initWorkCarousel();
initHeroSystem();
window.addEventListener("scroll", updateHeader, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        formNote.textContent = "Thank you! Your message has been sent successfully.";
        contactForm.reset();
      } else {
        formNote.textContent = data.message || "Failed to send your message.";
      }
    } catch (error) {
      formNote.textContent = "Something went wrong. Please try again.";
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
