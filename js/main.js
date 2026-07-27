/* ==========================================================================
   GraLex Logistique — main.js
   Global UI: loader, sticky nav, mobile menu, reveals, counters,
   back-to-top, ripple, newsletter, current year.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Loading screen -------------------------------------------------- */
  const loader = $(".loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hidden"), 500);
    });
    // Safety fallback if load fires slowly
    setTimeout(() => loader.classList.add("hidden"), 3500);
  }

  /* ---- Sticky navbar --------------------------------------------------- */
  const nav = $(".nav");
  if (nav && !nav.classList.contains("solid")) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile menu ----------------------------------------------------- */
  const toggle = $(".nav__toggle");
  const menu = $(".mobile-menu");
  if (toggle && menu) {
    let lockedY = 0;
    const setMenu = (open) => {
      toggle.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      // Scroll lock: pin the body at its current offset so nothing behind
      // the drawer can be scrolled or dragged on touch devices.
      if (open) {
        lockedY = window.scrollY || window.pageYOffset || 0;
        document.body.style.top = `-${lockedY}px`;
        document.body.classList.add("body-lock");
      } else if (document.body.classList.contains("body-lock")) {
        document.body.classList.remove("body-lock");
        document.body.style.top = "";
        window.scrollTo(0, lockedY);
      }
    };
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    // Scrim, close button and nav links all dismiss the drawer
    $$("[data-menu-close]").forEach((el) => el.addEventListener("click", () => setMenu(false)));
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---- Scroll reveal (IntersectionObserver) ---------------------------- */
  const revealEls = $$("[data-reveal], [data-stagger], .reveal-img");
  if (revealEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---- Animated counters ----------------------------------------------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.decimals && parseInt(el.dataset.decimals)) || 0;
      const dur = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = target * eased;
        el.textContent = val.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      };
      requestAnimationFrame(step);
    };

    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach((el) => (el.textContent = el.dataset.count));
    } else {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---- Ripple on buttons ----------------------------------------------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - r.left - size / 2 + "px";
      ripple.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 640);
    });
  });

  /* ---- Back to top ----------------------------------------------------- */
  const toTop = $(".to-top");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => toTop.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

  /* ---- Smooth anchor scroll -------------------------------------------- */
  $$('a[href^="#"]:not([href="#"])').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });

  /* ---- Toast helper (exposed globally) --------------------------------- */
  window.gralexToast = function (message) {
    // Translate dynamic toast copy when French is active
    if (window.gralexI18n && window.gralexI18n.t) message = window.gralexI18n.t(message);
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toast);
    }
    $("span", toast).textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 3800);
  };

  /* ---- Newsletter (footer) --------------------------------------------- */
  const news = $(".newsletter");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", news);
      if (input && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        window.gralexToast("You're subscribed. Welcome aboard!");
        input.value = "";
      } else {
        window.gralexToast("Please enter a valid email address.");
      }
    });
  }

  /* ---- Current year ---------------------------------------------------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---- Graceful image fallback ----------------------------------------- */
  // If any remote image fails to load, swap in a branded gradient so the
  // layout never shows a broken-image icon.
  const fallbackSVG = (label) =>
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#0f172a'/><stop offset='0.6' stop-color='#1e3a8a'/>
        <stop offset='1' stop-color='#2563eb'/></linearGradient></defs>
        <rect width='800' height='600' fill='url(#g)'/>
        <g fill='none' stroke='rgba(255,255,255,0.16)' stroke-width='2'>
        <circle cx='650' cy='120' r='90'/><circle cx='120' cy='500' r='70'/></g>
        <text x='50%' y='50%' fill='rgba(255,255,255,0.85)' font-family='Poppins,sans-serif'
        font-size='34' font-weight='700' text-anchor='middle' dominant-baseline='middle'>
        ${label || "GraLex Logistique"}</text></svg>`
    );

  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (img.tagName === "IMG" && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = "1";
        img.src = fallbackSVG(img.dataset.label || img.alt);
      }
    },
    true
  );

  /* ---- Parallax on [data-parallax] ------------------------------------- */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !prefersReduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }
})();
