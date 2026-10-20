/*
 * Personal Portfolio Scripts - John Lloyd F. Villar
 * Clean, lightweight, framework-free implementation.
 */

const SITE_CONFIG = {
  name: "John Lloyd F. Villar",
  githubUsername: "johnllydvllr12-create",
  email: "Johnnlloyd.villar@gmail.com",
  phone: "+63 921 869 3495",
  location: "Rodriguez, Rizal, Philippines",
  profileImage: "assets/profile.png",
  resumePath: "assets/resume.pdf"
};

(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const currentYear = document.querySelector("#footer-year");

  // Update dynamic year
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     Theme Management (Dark / Light)
  ----------------------------------------------------------- */
  function applyTheme(theme, save = true) {
    const normalized = theme === "light" ? "light" : "dark";
    root.dataset.theme = normalized;
    if (themeMeta) {
      themeMeta.setAttribute("content", normalized === "light" ? "#f7faf8" : "#090e0c");
    }
    if (themeButton) {
      const nextTheme = normalized === "dark" ? "light" : "dark";
      themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeButton.setAttribute("title", `Switch to ${nextTheme} theme`);
    }
    if (save) {
      try {
        localStorage.setItem("jlv-portfolio-theme", normalized);
      } catch (e) {
        /* storage may be unavailable */
      }
    }
  }

  // Load saved theme or system preference
  try {
    const savedTheme = localStorage.getItem("jlv-portfolio-theme");
    if (savedTheme) {
      applyTheme(savedTheme, false);
    } else {
      const systemPrefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(systemPrefersLight ? "light" : "dark", false);
    }
  } catch (e) {
    applyTheme("dark", false);
  }

  themeButton?.addEventListener("click", () => {
    const current = root.dataset.theme === "light" ? "light" : "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* -----------------------------------------------------------
     Mobile Navigation Toggle
  ----------------------------------------------------------- */
  function setMenuOpen(open) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navigation.classList.toggle("is-open", open);
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!navigation || !menuButton || !navigation.classList.contains("is-open")) return;
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  /* -----------------------------------------------------------
     Active Nav Link Highlighter on Scroll
  ----------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("is-active");
          } else {
            link.classList.remove("is-active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  /* -----------------------------------------------------------
     Skills Filter Interaction
  ----------------------------------------------------------- */
  const skillFilters = document.querySelectorAll(".skill-filters .filter-button");
  const skillCards = document.querySelectorAll(".skills-grid .skill-card");
  const skillStatus = document.querySelector("#skill-filter-status");

  skillFilters.forEach((button) => {
    button.addEventListener("click", () => {
      skillFilters.forEach((b) => {
        b.classList.remove("is-selected");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");

      const filter = button.getAttribute("data-skill-filter");
      let visibleCount = 0;

      skillCards.forEach((card) => {
        const category = card.getAttribute("data-skill-category");
        if (filter === "all" || category === filter) {
          card.removeAttribute("hidden");
          visibleCount++;
        } else {
          card.setAttribute("hidden", "");
        }
      });

      if (skillStatus) {
        skillStatus.textContent = filter === "all" 
          ? `Showing all ${visibleCount} tools.`
          : `Showing ${visibleCount} ${button.textContent.trim()} tools.`;
      }
    });
  });

  /* -----------------------------------------------------------
     Projects Rendering
  ----------------------------------------------------------- */
  const projectsGrid = document.querySelector("#projects-grid");
  const projectList = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];

  if (projectsGrid && projectList.length > 0) {
    projectsGrid.innerHTML = "";
    projectList.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const techBadges = (project.technologies || [])
        .map((t) => `<span>${t}</span>`)
        .join("");

      let actionHtml = "";
      if (project.repositoryUrl) {
        actionHtml += `<a class="project-link" href="${project.repositoryUrl}" target="_blank" rel="noopener noreferrer">Source code &rarr;</a>`;
      }
      if (project.demoUrl) {
        actionHtml += `<a class="project-link" href="${project.demoUrl}" target="_blank" rel="noopener noreferrer">Live preview &rarr;</a>`;
      }
      if (!actionHtml) {
        actionHtml = `<span class="project-link-muted">Academic / Hardware prototype</span>`;
      }

      card.innerHTML = `
        <div class="project-top">
          <div class="project-topline">
            <span class="project-badge">${project.category || "Project"}</span>
            <span class="project-status">${project.status || ""}</span>
          </div>
          <div class="project-header">
            <h3>${project.title}</h3>
            ${project.subtitle ? `<div class="project-subtitle">${project.subtitle}</div>` : ""}
            <p class="project-description">${project.description}</p>
          </div>
          <div class="project-tech">
            ${techBadges}
          </div>
        </div>
        <div class="project-actions">
          ${actionHtml}
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  /* -----------------------------------------------------------
     Copy Contact Details (Email / Phone)
  ----------------------------------------------------------- */
  const copyButtons = document.querySelectorAll(".copy-button");
  const copyFeedback = document.querySelector("#copy-feedback");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (copyFeedback) {
          copyFeedback.textContent = `Copied "${textToCopy}" to clipboard.`;
          setTimeout(() => {
            copyFeedback.textContent = "";
          }, 3500);
        }
      }).catch(() => {
        if (copyFeedback) {
          copyFeedback.textContent = "Unable to auto-copy. Please select and copy manually.";
        }
      });
    });
  });

})();
