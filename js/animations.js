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

  const finePointer = window.matchMedia("(pointer:fine)").matches;
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

  /* ---- Mouse parallax on hero layers ----------------------------------- */
  /* A single rAF loop eases the current offset toward the pointer target
     (lerp), so layers glide instead of snapping on every mousemove event. */
  const stage = $("[data-mouse-stage]");
  if (stage && !prefersReduced && finePointer) {
    const layers = $$("[data-depth]", stage);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    const loop = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth);
        layer.style.transform =
          `translate3d(${(-cx * depth * 40).toFixed(2)}px, ${(-cy * depth * 40).toFixed(2)}px, 0)`;
      });
      if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    });
    stage.addEventListener("mouseleave", () => { tx = 0; ty = 0; kick(); });
  }

  /* ---- Card 3D tilt ---------------------------------------------------- */
  /* Throttle transform writes to one per frame; ease the reset on leave. */
  if (!prefersReduced && finePointer) {
    $$("[data-tilt]").forEach((card) => {
      let px = 0, py = 0, rafId = null;
      const write = () => {
        card.style.transform =
          `perspective(900px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg) translateY(-8px)`;
        rafId = null;
      };
      card.addEventListener("mouseenter", () => { card.style.transition = "transform 120ms " + EASE; });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (!rafId) rafId = requestAnimationFrame(write);
      });
      card.addEventListener("mouseleave", () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        card.style.transition = "transform 600ms " + EASE;
        card.style.transform = "";
      });
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
