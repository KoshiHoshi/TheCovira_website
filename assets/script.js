const header = document.querySelector("#site-header");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const clientList = document.querySelector("[data-client-list]");
const workCarousel = document.querySelector("[data-work-carousel]");
const workTrack = document.querySelector("[data-work-track]");
const workDots = document.querySelectorAll(".work-dots button");

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

updateHeader();
renderClients();
initWorkCarousel();
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
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Thanks. Your message is ready to connect to a form service.";
    contactForm.reset();
  });
}
