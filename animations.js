// Animations du site Maij : slideshow hero, apparitions au scroll, header
// compact, parallax léger (desktop). Respecte prefers-reduced-motion.

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Slideshow hero (Accueil) ---------- */

  function initHeroSlideshow() {
    var slides = document.querySelectorAll(".hero-slide");
    if (!slides.length) return;

    var current = 0;
    slides[0].classList.add("is-active");

    if (slides.length < 2) return;

    setInterval(function () {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, 2500);
  }

  /* ---------- Apparition en cascade du hero au chargement ---------- */

  function revealHeroOnLoad() {
    var items = document.querySelectorAll(".hero-content > *, .hero-card > *");
    items.forEach(function (el, i) {
      el.style.transitionDelay = i * 100 + "ms";
      requestAnimationFrame(function () {
        el.classList.add("is-visible");
      });
    });
  }

  /* ---------- Bouton flottant : entrée discrète au chargement ---------- */

  function revealFloatCta() {
    var floatCta = document.querySelector(".float-cta");
    if (!floatCta) return;
    setTimeout(function () {
      floatCta.classList.add("is-visible");
    }, 500);
  }

  /* ---------- Apparition au scroll (une seule fois), avec cascade par groupe ---------- */

  function initScrollReveal() {
    var groups = document.querySelectorAll(".reveal-group");
    groups.forEach(function (group) {
      var children = group.querySelectorAll(".reveal");
      children.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i, 5) * 80 + "ms";
      });
    });

    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Header sticky qui se compacte au scroll ---------- */

  function initHeaderCompact() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* ---------- Parallax léger sur le hero (desktop uniquement) ---------- */

  function initHeroParallax() {
    if (reduceMotion) return;

    var slideshow = document.querySelector(".hero-slideshow");
    var hero = document.querySelector(".hero");
    if (!slideshow || !hero) return;

    var isDesktop = window.matchMedia("(min-width: 980px)").matches;
    if (!isDesktop) return;

    var ticking = false;

    function update() {
      var rect = hero.getBoundingClientRect();
      var progress = -rect.top * 0.08;
      progress = Math.max(-20, Math.min(20, progress));
      slideshow.style.transform = "translateY(" + progress + "px)";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* ---------- Carrousel mobile : points indicateurs ---------- */

  function initCarouselDots() {
    document.querySelectorAll(".carousel-mobile").forEach(function (carousel) {
      var dotsWrap = carousel.nextElementSibling;
      if (!dotsWrap || !dotsWrap.classList.contains("carousel-dots")) return;

      var items = Array.prototype.slice.call(carousel.children);
      if (items.length < 2) return;

      items.forEach(function (_, i) {
        var dot = document.createElement("span");
        if (i === 0) dot.classList.add("is-active");
        dotsWrap.appendChild(dot);
      });

      var dots = Array.prototype.slice.call(dotsWrap.children);

      if (!("IntersectionObserver" in window)) return;

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.intersectionRatio >= 0.6) {
              var index = items.indexOf(entry.target);
              dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
              });
            }
          });
        },
        { root: carousel, threshold: [0.6] }
      );

      items.forEach(function (item) {
        observer.observe(item);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeroSlideshow();
    revealHeroOnLoad();
    revealFloatCta();
    initScrollReveal();
    initHeaderCompact();
    initHeroParallax();
    initCarouselDots();
  });
})();
