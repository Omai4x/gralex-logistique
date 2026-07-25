/* ==========================================================================
   GraLex Logistique — slider.js
   Accessible testimonials carousel: autoplay, dots, arrows, swipe, keyboard.
   ========================================================================== */
(function () {
  "use strict";
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector(".slider__track");
  const slides = [...slider.querySelectorAll(".slide")];
  const prevBtn = slider.querySelector('[data-slide="prev"]');
  const nextBtn = slider.querySelector('[data-slide="next"]');
  const dotsWrap = slider.querySelector(".slider__dots");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  const total = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider__dot";
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    dot.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function go(i, user) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
    slides.forEach((s, si) => s.setAttribute("aria-hidden", String(si !== index)));
    if (user) restart();
  }

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  function start() {
    if (prefersReduced) return;
    timer = setInterval(next, 5500);
  }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  nextBtn && nextBtn.addEventListener("click", () => { next(); restart(); });
  prevBtn && prevBtn.addEventListener("click", () => { prev(); restart(); });

  // Pause on hover
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // Keyboard
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); restart(); }
    if (e.key === "ArrowLeft") { prev(); restart(); }
  });

  // Touch swipe
  let startX = 0, dx = 0, dragging = false;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dragging = true; stop(); }, { passive: true });
  track.addEventListener("touchmove", (e) => { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener("touchend", () => {
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    dx = 0; dragging = false; start();
  });

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  go(0);
  start();
})();
