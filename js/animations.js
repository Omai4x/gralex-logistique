/* ==========================================================================
   GraLex Logistique — animations.js
   Hero typing, mouse parallax, card tilt, marquee cloning, FAQ accordion.
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Typing effect --------------------------------------------------- */
  const typeEl = $("[data-typewords]");
  if (typeEl) {
    const words = JSON.parse(typeEl.dataset.typewords);
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.style.height = "1em";
    typeEl.after(cursor);

    if (prefersReduced) {
      typeEl.textContent = words[0];
    } else {
      let wi = 0, ci = 0, deleting = false;
      const tick = () => {
        const word = words[wi];
        ci += deleting ? -1 : 1;
        typeEl.textContent = word.slice(0, ci);
        let delay = deleting ? 45 : 90;
        if (!deleting && ci === word.length) {
          delay = 1600;
          deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 700);
    }
  }

  /* ---- Mouse parallax on hero layers ----------------------------------- */
  const stage = $("[data-mouse-stage]");
  if (stage && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    const layers = $$("[data-depth]", stage);
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth);
        layer.style.transform = `translate3d(${(-cx * depth * 40).toFixed(1)}px, ${(-cy * depth * 40).toFixed(1)}px, 0)`;
      });
    });
    stage.addEventListener("mouseleave", () => {
      layers.forEach((l) => (l.style.transform = "translate3d(0,0,0)"));
    });
  }

  /* ---- Card 3D tilt ---------------------------------------------------- */
  if (!prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg) translateY(-8px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---- Marquee: duplicate track for seamless loop ---------------------- */
  $$(".marquee__track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---- FAQ accordion --------------------------------------------------- */
  $$(".faq__item").forEach((item) => {
    const q = $(".faq__q", item);
    const a = $(".faq__a", item);
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", String(open));
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      // close siblings for clean single-open behaviour
      if (open) {
        $$(".faq__item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            $(".faq__q", other).setAttribute("aria-expanded", "false");
            $(".faq__a", other).style.maxHeight = "0px";
          }
        });
      }
    });
  });
})();
