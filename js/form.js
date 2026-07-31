/* ==========================================================================
   GraLex Logistique — form.js
   Reusable client-side validation for quote & contact forms.
   Attribute-driven: add data-validate to a <form>, and per-field rules via
   required / type=email / data-rule="phone" / minlength etc.
   ========================================================================== */
(function () {
  "use strict";
  const forms = document.querySelectorAll("[data-validate]");
  if (!forms.length) return;

  const RULES = {
    email: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    phone: (v) => /^[+]?[\d\s().-]{7,20}$/.test(v),
  };

  function fieldWrap(el) {
    return el.closest(".field") || el.parentElement;
  }

  function setError(el, msg) {
    const wrap = fieldWrap(el);
    wrap.classList.add("invalid");
    let err = wrap.querySelector(".field__error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field__error";
      wrap.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(el) {
    const wrap = fieldWrap(el);
    wrap.classList.remove("invalid");
    const err = wrap.querySelector(".field__error");
    if (err) err.textContent = "";
  }

  function validateField(el) {
    const val = (el.value || "").trim();
    const label = el.dataset.label || (el.labels && el.labels[0] && el.labels[0].textContent.replace("*", "").trim()) || "This field";

    if (el.hasAttribute("required") && !val) {
      setError(el, `${label} is required.`);
      return false;
    }
    if (val && el.type === "email" && !RULES.email(val)) {
      setError(el, "Please enter a valid email address.");
      return false;
    }
    if (val && el.dataset.rule && RULES[el.dataset.rule] && !RULES[el.dataset.rule](val)) {
      setError(el, `Please enter a valid ${el.dataset.rule}.`);
      return false;
    }
    if (el.minLength > 0 && val.length && val.length < el.minLength) {
      setError(el, `${label} must be at least ${el.minLength} characters.`);
      return false;
    }
    clearError(el);
    return true;
  }

  forms.forEach((form) => {
    const fields = [...form.querySelectorAll("input, select, textarea")].filter(
      (el) => el.type !== "submit" && el.type !== "hidden"
    );

    fields.forEach((el) => {
      el.addEventListener("blur", () => validateField(el));
      el.addEventListener("input", () => {
        if (fieldWrap(el).classList.contains("invalid")) validateField(el);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      let firstBad = null;
      fields.forEach((el) => {
        if (!validateField(el)) {
          ok = false;
          if (!firstBad) firstBad = el;
        }
      });

      if (!ok) {
        firstBad && firstBad.focus();
        window.gralexToast && window.gralexToast("Please fix the highlighted fields.", "error");
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        btn.classList.add("loading");
        btn.disabled = true;
      }

      // Simulate async submission
      setTimeout(() => {
        if (btn) {
          btn.classList.remove("loading");
          btn.disabled = false;
        }
        const msg = form.dataset.success || "Thank you! Our team will be in touch shortly.";
        window.gralexToast && window.gralexToast(msg, "success");
        form.reset();

        const success = form.querySelector(".form-success");
        if (success) {
          form.classList.add("hidden");
          success.classList.remove("hidden");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1100);
    });
  });
})();
