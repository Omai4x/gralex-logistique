/* ==========================================================================
   GraLex Logistique — tracking.js
   Simulated shipment tracking with an animated, sequential timeline.
   ========================================================================== */
(function () {
  "use strict";
  const form = document.querySelector("#track-form");
  if (!form) return;

  const input = form.querySelector("#track-input");
  const result = document.querySelector("#track-result");
  const timeline = document.querySelector("#track-timeline");
  const summary = document.querySelector("#track-summary");
  const btn = form.querySelector("button[type=submit]");

  const STEPS = [
    { key: "received", title: "Package Received", desc: "Parcel checked in at the GraLex origin hub.", icon: "box" },
    { key: "processing", title: "Processing", desc: "Sorted, weighed and prepared for dispatch.", icon: "cog" },
    { key: "transit", title: "In Transit", desc: "On the move across our regional network.", icon: "truck" },
    { key: "customs", title: "Customs Clearance", desc: "Cross-border documentation verified & cleared.", icon: "shield" },
    { key: "out", title: "Out for Delivery", desc: "Loaded onto the final-mile vehicle.", icon: "route" },
    { key: "delivered", title: "Delivered", desc: "Handed to the recipient. Signature captured.", icon: "check" },
  ];

  const ICONS = {
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h1"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
  };

  const cities = ["Cotonou, BJ", "Porto-Novo, BJ", "Lagos, NG", "Parakou, BJ", "Abidjan, CI", "Accra, GH"];
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const locale = window.gralexI18n && window.gralexI18n.lang === "fr" ? "fr-FR" : "en-GB";
  const i18n = (el) => window.gralexI18n && window.gralexI18n.translateEl && window.gralexI18n.translateEl(el);

  function buildTimeline(activeCount) {
    timeline.innerHTML = "";
    STEPS.forEach((step, i) => {
      const li = document.createElement("li");
      li.className = "tl__step";
      li.style.setProperty("--i", i);
      const state = i < activeCount ? "done" : i === activeCount ? "current" : "pending";
      li.dataset.state = state;
      li.innerHTML = `
        <div class="tl__marker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[step.icon]}</svg>
        </div>
        <div class="tl__body">
          <div class="tl__head">
            <h4>${step.title}</h4>
            <span class="tl__time"></span>
          </div>
          <p>${step.desc}</p>
        </div>`;
      timeline.appendChild(li);
    });
    // reveal steps sequentially
    const steps = [...timeline.children];
    steps.forEach((li, i) => {
      setTimeout(() => {
        li.classList.add("in");
        const t = li.querySelector(".tl__time");
        if (li.dataset.state !== "pending") {
          const d = new Date(Date.now() - (activeCount - i) * 8 * 3600 * 1000);
          t.textContent = d.toLocaleString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
        } else {
          t.textContent = window.gralexI18n && window.gralexI18n.lang === "fr" ? "En attente" : "Pending";
        }
      }, 250 + i * 320);
    });
    i18n(timeline);
  }

  function hashInt(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = input.value.trim();
    if (!id) {
      input.focus();
      window.gralexToast && window.gralexToast("Enter a tracking number to continue.");
      return;
    }
    btn.classList.add("loading");
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove("loading");
      btn.disabled = false;

      // Deterministic pseudo-status from the tracking id
      const seed = hashInt(id.toUpperCase());
      const activeCount = (seed % 6) + 1; // 1..6
      const from = cities[seed % cities.length];
      const to = cities[(seed + 3) % cities.length];
      const eta = new Date(Date.now() + (6 - activeCount) * 26 * 3600 * 1000);
      const current = STEPS[Math.min(activeCount, STEPS.length - 1)];
      const delivered = activeCount >= 6;

      summary.innerHTML = `
        <div class="track-summary__grid">
          <div><span>Tracking ID</span><strong>${id.toUpperCase()}</strong></div>
          <div><span>Route</span><strong>${from} → ${to}</strong></div>
          <div><span>Status</span><strong class="${delivered ? "ok" : ""}">${delivered ? "Delivered" : current.title}</strong></div>
          <div><span>${delivered ? "Delivered on" : "Est. delivery"}</span><strong>${eta.toLocaleDateString(locale, { weekday: "short", day: "2-digit", month: "short" })}</strong></div>
        </div>
        <div class="track-progress"><div class="track-progress__bar" style="width:${(activeCount / 6) * 100}%"></div></div>`;

      result.hidden = false;
      i18n(summary);
      buildTimeline(activeCount);
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  });

  // Prefill from ?id= query param (deep links from other pages)
  const params = new URLSearchParams(location.search);
  if (params.get("id")) {
    input.value = params.get("id");
    form.dispatchEvent(new Event("submit"));
  }
})();
