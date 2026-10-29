
document.addEventListener("DOMContentLoaded", () => {
  // ANO AUTOMÁTICO NO RODAPÉ
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // MENU PARA CELULAR
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 950) closeMenu();
    });
  }

  // BOTÕES DE INÍCIO E VOLTAR AO INÍCIO
  document.querySelectorAll('a[href="#inicio"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const inicio = document.getElementById("inicio");

      if (!inicio) return;

      event.preventDefault();
      inicio.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", "#inicio");
    });
  });

  // CARROSSEL DE IMAGENS E FRASES
  const slider = document.querySelector(".netqueta-slider");

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dots = Array.from(slider.querySelectorAll(".slider-dot"));
  const prevButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");
  const counter = document.getElementById("slideCounter");

  if (slides.length === 0) return;

  let currentSlide = 0;
  let timer = null;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === currentSlide;

      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentSlide;

      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    if (counter) {
      counter.textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ` +
        `${String(slides.length).padStart(2, "0")}`;
    }
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();

    if (
      reduceMotion.matches ||
      slides.length < 2 ||
      document.hidden
    ) {
      return;
    }

    timer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5500);
  }

  function changeSlide(index) {
    showSlide(index);
    startTimer();
  }

  // INICIALIZAÇÃO
  showSlide(0);
  startTimer();

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      changeSlide(currentSlide - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      changeSlide(currentSlide + 1);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      changeSlide(index);
    });
  });

  // PAUSA QUANDO O VISITANTE INTERAGE COM O CARROSSEL
  slider.addEventListener("mouseenter", stopTimer);
  slider.addEventListener("mouseleave", startTimer);
  slider.addEventListener("focusin", stopTimer);
  slider.addEventListener("focusout", startTimer);

  // PAUSA QUANDO A ABA NÃO ESTÁ VISÍVEL
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  // RESPEITA A PREFERÊNCIA DE MOVIMENTO DO DISPOSITIVO
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", startTimer);
  }
});
