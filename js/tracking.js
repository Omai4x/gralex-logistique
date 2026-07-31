/* ==========================================================================
   GraLex Logistique — tracking.js
   Data-driven shipment tracking with an animated, sequential timeline.
   Records are looked up via fetchShipment() (currently the local mock DB in
   shipments-data.js) — swap that one function for your real API later.
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

  // Valid GraLex tracking-ID shape: GLX-<3–6 alphanumerics>-<2-letter code>
  // e.g. GLX-4821-BN, GLX-93KD-NG
  const ID_RE = /^GLX-[A-Z0-9]{3,6}-[A-Z]{2}$/;
  const isFr = () => window.gralexI18n && window.gralexI18n.lang === "fr";

  const locale = () => (isFr() ? "fr-FR" : "en-GB");
  const i18n = (el) => window.gralexI18n && window.gralexI18n.translateEl && window.gralexI18n.translateEl(el);

  // Pull the 2-letter country code out of a "City, CC" location string
  const countryOf = (loc) => {
    const m = /,\s*([A-Za-z]{2})\s*$/.exec(loc || "");
    return m ? m[1].toUpperCase() : null;
  };

  // Cross-border shipments clear customs; in-country ones don't. Honour an
  // explicit `crossBorder` flag if the record sets one, otherwise infer it
  // from the origin/destination country codes.
  const isCrossBorder = (s) => {
    if (typeof s.crossBorder === "boolean") return s.crossBorder;
    const a = countryOf(s.origin), b = countryOf(s.destination);
    return a && b ? a !== b : false;
  };

  // The step sequence for a shipment: the customs stage only exists on
  // cross-border deliveries.
  const stepsFor = (s) => STEPS.filter((st) => st.key !== "customs" || isCrossBorder(s));

  const fmtDateTime = (iso) =>
    new Date(iso).toLocaleString(locale(), { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(locale(), { weekday: "short", day: "2-digit", month: "short" });

  /* ---- Data layer -------------------------------------------------------
     Looks a shipment up by ID. Today it reads the local mock database in
     shipments-data.js; later, point this at your real backend without
     touching the rest of the file, e.g.:
       return fetch(`/api/track/${encodeURIComponent(id)}`)
         .then((r) => (r.ok ? r.json() : null));
     Resolves to the record (with `id` attached) or null when not found. */
  function fetchShipment(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = window.GRALEX_SHIPMENTS || {};
        resolve(db[id] ? Object.assign({ id: id }, db[id]) : null);
      }, 700); // simulated network latency
    });
  }

  function buildTimeline(shipment, steps) {
    // Index the real events by their step key
    const evByStep = {};
    shipment.events.forEach((ev) => (evByStep[ev.step] = ev));
    const lastStep = shipment.events[shipment.events.length - 1].step;
    const currentIndex = steps.findIndex((s) => s.key === lastStep);
    const delivered = lastStep === "delivered";
    const pendingLabel = isFr() ? "En attente" : "Pending";

    timeline.innerHTML = "";
    steps.forEach((step, i) => {
      const ev = evByStep[step.key];
      const state = i < currentIndex ? "done" : i === currentIndex ? (delivered ? "done" : "current") : "pending";
      const li = document.createElement("li");
      li.className = "tl__step";
      li.style.setProperty("--i", i);
      li.dataset.state = state;
      li.innerHTML = `
        <div class="tl__marker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[step.icon]}</svg>
        </div>
        <div class="tl__body">
          <div class="tl__head">
            <h4>${step.title}</h4>
            <span class="tl__time">${ev ? fmtDateTime(ev.time) : pendingLabel}</span>
          </div>
          <p>${step.desc}</p>
          ${ev && ev.location ? `<span class="tl__loc">${ev.location}</span>` : ""}
        </div>`;
      timeline.appendChild(li);
    });
    // reveal steps sequentially
    [...timeline.children].forEach((li, i) => {
      setTimeout(() => li.classList.add("in"), 200 + i * 300);
    });
    i18n(timeline);
  }

  function flagInvalid(msg) {
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    input.focus();
    window.gralexToast && window.gralexToast(msg, "error");
  }

  // Clear the error state once the user edits the field again
  input.addEventListener("input", () => {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  });

  // Sample chips prefill a valid ID and run the lookup
  document.querySelectorAll("[data-sample]").forEach((el) => {
    el.style.cursor = "pointer";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    const use = () => {
      input.value = el.dataset.sample;
      input.classList.remove("invalid");
      runTracking();
    };
    el.addEventListener("click", use);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); use(); }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runTracking();
  });

  function runTracking() {
    const id = input.value.trim().toUpperCase();
    // Reflect the normalised value so the user sees what we validate
    if (input.value !== id) input.value = id;

    if (!id) {
      flagInvalid(isFr() ? "Entrez un numéro de suivi pour continuer." : "Enter a tracking number to continue.");
      return;
    }
    if (!ID_RE.test(id)) {
      flagInvalid(isFr()
        ? "Numéro invalide. Format attendu : GLX-XXXX-CC (ex. GLX-4821-BN)."
        : "Invalid tracking number. Expected format: GLX-XXXX-CC (e.g. GLX-4821-BN).");
      return;
    }
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");

    btn.classList.add("loading");
    btn.disabled = true;

    fetchShipment(id).then((shipment) => {
      btn.classList.remove("loading");
      btn.disabled = false;

      if (!shipment) {
        renderNotFound(id);
        window.gralexToast && window.gralexToast(
          isFr() ? `Aucun envoi trouvé pour ${id}.` : `No shipment found for ${id}.`, "error");
      } else {
        renderShipment(shipment);
      }
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderShipment(shipment) {
    const steps = stepsFor(shipment);
    const crossBorder = isCrossBorder(shipment);
    const lastStep = shipment.events[shipment.events.length - 1].step;
    const currentIndex = steps.findIndex((s) => s.key === lastStep);
    const delivered = lastStep === "delivered";
    const progress = (shipment.events.length / steps.length) * 100;
    const statusLabel = delivered ? (isFr() ? "Livré" : "Delivered") : steps[currentIndex].title;
    const typeLabel = crossBorder
      ? (isFr() ? "Transfrontalier" : "Cross-border")
      : (isFr() ? "National" : "Domestic");
    const etaLabel = delivered ? (isFr() ? "Livré le" : "Delivered on") : (isFr() ? "Livraison estimée" : "Est. delivery");
    const etaValue = delivered
      ? fmtDate(shipment.events[shipment.events.length - 1].time)
      : shipment.estDelivery ? fmtDate(shipment.estDelivery) : "—";

    summary.innerHTML = `
      <div class="track-summary__grid">
        <div><span>Tracking ID</span><strong>${shipment.id}</strong></div>
        <div><span>Service</span><strong>${shipment.service}</strong></div>
        <div><span>Type</span><strong>${typeLabel}</strong></div>
        <div><span>Route</span><strong>${shipment.origin} &rarr; ${shipment.destination}</strong></div>
        <div><span>Recipient</span><strong>${shipment.recipient}</strong></div>
        <div><span>Weight</span><strong>${shipment.weight}</strong></div>
        <div><span>Status</span><strong class="${delivered ? "ok" : ""}">${statusLabel}</strong></div>
        <div><span>${etaLabel}</span><strong>${etaValue}</strong></div>
      </div>
      <div class="track-progress"><div class="track-progress__bar" style="width:${progress}%"></div></div>`;

    i18n(summary);
    buildTimeline(shipment, steps);
  }

  function renderNotFound(id) {
    timeline.innerHTML = "";
    summary.innerHTML = `
      <div class="track-notfound">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v3"/><path d="M11 14h.01"/>
        </svg>
        <h3>${isFr() ? "Aucun envoi trouvé" : "No shipment found"}</h3>
        <p>${isFr()
          ? `Nous n'avons trouvé aucun envoi pour <strong>${id}</strong>. Vérifiez le numéro ou contactez notre équipe.`
          : `We couldn't find a shipment for <strong>${id}</strong>. Double-check the number or contact our team.`}</p>
        <a href="contact.html" class="btn btn-outline">${isFr() ? "Contacter le support" : "Contact support"}</a>
      </div>`;
  }

  // Prefill from ?id= query param (deep links from other pages)
  const params = new URLSearchParams(location.search);
  if (params.get("id")) {
    input.value = params.get("id");
    runTracking();
  }
})();
