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

  /* ---- Theme (light / dark) -------------------------------------------- */
  (function theme() {
    const root = document.documentElement;
    const STORE = "gralex-theme";
    const SUN =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const MOON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

    const current = () => root.getAttribute("data-theme") || "light";
    const render = (btn) => {
      const dark = current() === "dark";
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("aria-pressed", String(dark));
      btn.title = dark ? "Light mode" : "Dark mode";
    };

    const buttons = [];
    const apply = (mode) => {
      root.setAttribute("data-theme", mode);
      try { localStorage.setItem(STORE, mode); } catch (e) {}
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", mode === "dark" ? "#0a0a0a" : "#f6f5f0");
      buttons.forEach(render);
    };

    const makeBtn = (extra) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "theme-toggle" + (extra ? " " + extra : "");
      render(b);
      b.addEventListener("click", () => apply(current() === "dark" ? "light" : "dark"));
      buttons.push(b);
      return b;
    };

    const mount = () => {
      const navInner = document.querySelector(".nav__inner");
      if (navInner && !navInner.querySelector(".theme-toggle")) {
        const anchor = navInner.querySelector(".nav__toggle");
        navInner.insertBefore(makeBtn(), anchor);
      }
      const mm = document.querySelector(".mobile-menu__cta");
      if (mm && !mm.querySelector(".theme-toggle")) {
        mm.appendChild(makeBtn("theme-toggle--mobile"));
      }
    };
    mount();
    // Re-mount after i18n rebuilds nav actions, just in case
    setTimeout(mount, 60);

    // Follow OS changes only when the user hasn't chosen explicitly
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener && mq.addEventListener("change", (e) => {
      let stored = null;
      try { stored = localStorage.getItem(STORE); } catch (err) {}
      if (!stored) apply(e.matches ? "dark" : "light");
    });
  })();

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
              // Release the compositor layer once the reveal has finished.
              const done = () => {
                entry.target.classList.remove("will-animate");
                entry.target.removeEventListener("transitionend", done);
              };
              entry.target.addEventListener("transitionend", done);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revealEls.forEach((el) => {
        el.classList.add("will-animate");
        io.observe(el);
      });
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

  /* ---- Intelligent toast system (exposed globally) --------------------- */
  /* Backward-compatible: gralexToast("msg") still works. It now also accepts
     an explicit type — gralexToast("msg", "error") or
     gralexToast("msg", { type, duration }) — and, when none is given, infers
     the right kind (success / error / warning / info) from the message,
     picks a matching icon + colour, scales its lifespan to the reading time,
     de-duplicates repeats, pauses on hover, and stacks up to three. */
  const TOAST_ICONS = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/>',
    warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  };

  const inferToastType = (msg) => {
    const s = String(msg).toLowerCase();
    if (/\b(invalid|error|fail(ed)?|fix|wrong|required|must|couldn'?t|can'?t|cannot|unable|not found|expired|denied|oops|sorry)\b/.test(s)) return "error";
    if (/\b(success|subscribed|welcome|delivered|sent|received|confirmed|thanks?|done|complete[d]?|saved|cleared|added|updated|on (its|the) way)\b/.test(s)) return "success";
    if (/\b(please|check|make sure|ensure|missing|provide|enter a|select|choose|highlighted)\b/.test(s)) return "warning";
    return "info";
  };

  const toastReadTime = (msg) => {
    const words = String(msg).trim().split(/\s+/).length;
    return Math.min(7000, Math.max(3200, 1600 + words * 340));
  };

  let toastHost = null;
  const getToastHost = () => {
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toast-host";
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    return toastHost;
  };

  const armToastBar = (toast, duration, fromFull) => {
    const bar = toast.querySelector(".toast__bar");
    if (!bar || prefersReduced) return;
    if (fromFull) { bar.style.transition = "none"; bar.style.transform = "scaleX(1)"; void bar.offsetWidth; }
    bar.style.transition = "transform " + duration + "ms linear";
    bar.style.transform = "scaleX(0)";
  };
  const startToastTimer = (toast, duration, fromFull) => {
    clearTimeout(toast._t);
    toast._duration = duration;
    toast._end = Date.now() + duration;
    armToastBar(toast, duration, fromFull !== false);
    toast._t = setTimeout(() => dismissToast(toast), duration);
  };
  const pauseToastTimer = (toast) => {
    clearTimeout(toast._t);
    toast._remain = Math.max(600, toast._end - Date.now());
    const bar = toast.querySelector(".toast__bar");
    if (bar) { bar.style.transition = "none"; bar.style.transform = getComputedStyle(bar).transform; }
  };
  const resumeToastTimer = (toast) => startToastTimer(toast, toast._remain || toast._duration, false);
  const dismissToast = (toast) => {
    if (!toast || toast._gone) return;
    toast._gone = true;
    clearTimeout(toast._t);
    toast.classList.remove("show");
    toast.classList.add("hide");
    const done = () => toast.remove();
    toast.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 520);
  };

  window.gralexToast = function (message, opts) {
    const raw = String(message);
    let type, duration;
    if (typeof opts === "string") type = opts;
    else if (opts && typeof opts === "object") { type = opts.type; duration = opts.duration; }
    if (!TOAST_ICONS[type]) type = inferToastType(raw);
    if (!duration) duration = toastReadTime(raw);

    const display = (window.gralexI18n && window.gralexI18n.t) ? window.gralexI18n.t(raw) : raw;
    const host = getToastHost();

    // De-dupe: same message + type already up → restart it with a nudge
    const dup = [...host.children].find((t) => t._type === type && t._msg === display && !t._gone);
    if (dup) {
      dup.classList.remove("shake"); void dup.offsetWidth; dup.classList.add("shake");
      startToastTimer(dup, duration, true);
      return dup;
    }

    const toast = document.createElement("div");
    toast.className = "toast toast--" + type;
    toast._type = type;
    toast._msg = display;
    toast.setAttribute("role", type === "error" || type === "warning" ? "alert" : "status");
    toast.innerHTML =
      '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + TOAST_ICONS[type] + '</svg>' +
      '<span class="toast__msg"></span>' +
      '<button class="toast__close" type="button" aria-label="Dismiss notification"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg></button>' +
      '<span class="toast__bar"></span>';
    toast.querySelector(".toast__msg").textContent = display;
    host.appendChild(toast);

    // Cap the stack at three — drop the oldest
    while (host.children.length > 3) dismissToast(host.firstElementChild);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("show")));
    toast.querySelector(".toast__close").addEventListener("click", () => dismissToast(toast));
    toast.addEventListener("mouseenter", () => pauseToastTimer(toast));
    toast.addEventListener("mouseleave", () => resumeToastTimer(toast));
    startToastTimer(toast, duration, true);
    return toast;
  };

  /* ---- Newsletter (footer) --------------------------------------------- */
  const news = $(".newsletter");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", news);
      if (input && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        window.gralexToast("You're subscribed. Welcome aboard!", "success");
        input.value = "";
      } else {
        window.gralexToast("Please enter a valid email address.", "error");
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
