/*
 * John Lloyd F. Villar - Portfolio Client Scripts
 * Clean, lightweight, dependency-free functionality
 */

(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.querySelector("#menu-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLinks = [...document.querySelectorAll(".nav-item")];
  const yearElement = document.querySelector("#copyright-year");

  // Dynamic Year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* Theme Switching */
  function updateTheme(theme, save = true) {
    const isLight = theme === "light";
    root.dataset.theme = isLight ? "light" : "dark";
    if (themeMeta) {
      themeMeta.setAttribute("content", isLight ? "#f6faf7" : "#0a0f0d");
    }
    if (themeToggle) {
      const nextTheme = isLight ? "dark" : "light";
      themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
    }
    if (save) {
      try {
        localStorage.setItem("jlv-theme", isLight ? "light" : "dark");
      } catch (err) {}
    }
  }

  // Load saved theme or match system
  try {
    const stored = localStorage.getItem("jlv-theme");
    if (stored) {
      updateTheme(stored, false);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      updateTheme(prefersLight ? "light" : "dark", false);
    }
  } catch (err) {
    updateTheme("dark", false);
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    updateTheme(next);
  });

  /* Mobile Navigation */
  function toggleMobileMenu(isOpen) {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navMenu.classList.toggle("open", isOpen);
  }

  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    toggleMobileMenu(!expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMobileMenu(false);
  });

  document.addEventListener("click", (e) => {
    if (!navMenu || !menuToggle || !navMenu.classList.contains("open")) return;
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  /* Active Navigation Spy */
  const observedSections = document.querySelectorAll("section[id]");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  });

  observedSections.forEach((sec) => spy.observe(sec));

  /* Clipboard Copy */
  const copyBtns = document.querySelectorAll(".btn-copy");
  const copyNotify = document.querySelector("#copy-feedback");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetText = btn.getAttribute("data-clipboard");
      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        if (copyNotify) {
          copyNotify.textContent = `Copied "${targetText}" to clipboard.`;
          setTimeout(() => {
            copyNotify.textContent = "";
          }, 3200);
        }
      }).catch(() => {
        if (copyNotify) {
          copyNotify.textContent = "Please select and copy manually.";
        }
      });
    });
  });

})();
