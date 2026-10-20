/*
 * Computer Tech Client Scripts - John Lloyd F. Villar
 * Lightweight, accessible, dependency-free functionality with Interactive Canvas Physics.
 */

(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-btn") || document.querySelector("#theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.querySelector("#menu-btn") || document.querySelector("#menu-toggle");
  const navMenu = document.querySelector("#cockpit-nav") || document.querySelector("#nav-menu");
  const navLinks = [...document.querySelectorAll(".tech-link"), ...document.querySelectorAll(".nav-item")];
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
      themeMeta.setAttribute("content", isLight ? "#faf4f5" : "#080304");
    }
    if (themeToggle) {
      const nextTheme = isLight ? "dark" : "light";
      themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
    }
    if (save) {
      try {
        localStorage.setItem("jlv-tech-theme", isLight ? "light" : "dark");
      } catch (err) {}
    }
  }

  // Load saved theme or match system
  try {
    const stored = localStorage.getItem("jlv-tech-theme");
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
    rootMargin: "-20% 0px -65% 0px",
    threshold: 0
  });

  observedSections.forEach((sec) => spy.observe(sec));

  /* Clipboard Copy with Tech Terminal Feedback */
  const copyBtns = document.querySelectorAll(".copy-cmd-btn, .btn-copy");
  const copyNotify = document.querySelector("#copy-feedback");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetText = btn.getAttribute("data-clipboard");
      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        if (copyNotify) {
          copyNotify.textContent = `[SUCCESS: COPIED "${targetText}" TO CLIPBOARD]`;
          setTimeout(() => {
            copyNotify.textContent = "";
          }, 3200);
        }
      }).catch(() => {
        if (copyNotify) {
          copyNotify.textContent = "[ERROR: CLIPBOARD_ACCESS_DENIED]";
        }
      });
    });
  });

  /* ----------------------------------------------------
   * INTERACTIVE CLICK PHYSICS & CYBER NODE SYSTEM
   * ---------------------------------------------------- */
  const canvas = document.getElementById("physics-canvas");
  let globalTriggerImpulse = null;

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;

    let nodes = [];
    let shockwaves = [];
    let sparks = [];

    let mouse = { x: -9999, y: -9999, isHovering: false };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Node count scales responsively with screen area
    function initNodes() {
      nodes = [];
      const density = prefersReducedMotion ? 45000 : 22000;
      const count = Math.min(85, Math.max(26, Math.floor((width * height) / density)));

      for (let i = 0; i < count; i++) {
        const ox = Math.random() * width;
        const oy = Math.random() * height;
        nodes.push({
          x: ox,
          y: oy,
          ox: ox,
          oy: oy,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1.2,
          mass: Math.random() * 0.8 + 0.6,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initNodes();
    }

    window.addEventListener("resize", () => {
      clearTimeout(window.__canvasResizeTimeout);
      window.__canvasResizeTimeout = setTimeout(resize, 150);
    });

    resize();

    // Trigger impulse and sparks on screen click
    function triggerPhysicsImpulse(clickX, clickY, intensity = 1.0) {
      if (prefersReducedMotion) return;

      // 1. Expanding cyber shockwave ring
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: (Math.min(width, height) * 0.35 + 140) * Math.min(intensity, 1.4),
        speed: 9.5 * Math.min(intensity, 1.3),
        alpha: 0.85
      });

      // 2. Severe physical impulse applied to all nearby nodes
      const blastRadius = 360 * Math.min(intensity, 1.3);
      const blastForce = 34 * intensity;

      nodes.forEach((n) => {
        const dx = n.x - clickX;
        const dy = n.y - clickY;
        const dist = Math.hypot(dx, dy);

        if (dist < blastRadius && dist > 0.001) {
          const power = Math.pow(1 - dist / blastRadius, 1.8) * blastForce * (1 / n.mass);
          const angle = Math.atan2(dy, dx);
          n.vx += Math.cos(angle) * power;
          n.vy += Math.sin(angle) * power;
        }
      });

      // 3. Kinetic high-speed sparks radiating from click
      const sparkCount = Math.floor((Math.random() * 12 + 24) * intensity);
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 9 + 3) * Math.min(intensity, 1.3);
        sparks.push({
          x: clickX,
          y: clickY,
          px: clickX,
          py: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          size: Math.random() * 2.2 + 1,
          color: Math.random() > 0.3 ? "#ff1744" : "#ffffff"
        });
      }
    }

    globalTriggerImpulse = triggerPhysicsImpulse;

    // Global click listener for general physics background trigger
    window.addEventListener("pointerdown", (e) => {
      // Don't trigger if clicking interactive buttons, inputs, links, or modal controls
      if (e.target.closest("button, a, input, textarea, select, .physics-zoom-overlay")) {
        return;
      }
      triggerPhysicsImpulse(e.clientX, e.clientY);
    }, { passive: true });

    // Track mouse coordinates for subtle interactive repulsion
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovering = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      mouse.isHovering = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Physics Animation Loop
    let lastTime = performance.now();
    let isRunning = true;

    function render(currentTime) {
      if (!isRunning) return;
      requestAnimationFrame(render);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const isLight = root.dataset.theme === "light";
      const primaryHex = isLight ? "#e11d48" : "#ff1744";
      const traceColor = isLight ? "rgba(225, 29, 72, " : "rgba(255, 23, 68, ";

      // 1. UPDATE & DRAW SHOCKWAVES
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha *= 0.94;

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.015) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${traceColor}${sw.alpha * 0.75})`;
        ctx.lineWidth = Math.max(1, (1 - sw.radius / sw.maxRadius) * 3);
        ctx.stroke();

        // Secondary inner dash ring
        if (sw.radius > 25) {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius * 0.82, 0, Math.PI * 2);
          ctx.strokeStyle = `${traceColor}${sw.alpha * 0.45})`;
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. UPDATE & DRAW KINETIC SPARKS
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.px = s.x;
        s.py = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy = s.vy * 0.96 + 0.12; // subtle gravity
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();
      }

      // 3. UPDATE & DRAW CYBER NODES
      const maxDist = 145;
      const springK = 0.045; // spring return stiffness
      const damping = 0.91;  // velocity decay
      const mouseRadius = 110;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Spring pulling back to original anchor
        const ax = (n.ox - n.x) * springK;
        const ay = (n.oy - n.y) * springK;

        n.vx = (n.vx + ax) * damping;
        n.vy = (n.vy + ay) * damping;

        // Subtle mouse repulsion field
        if (mouse.isHovering) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < mouseRadius && mDist > 0.001) {
            const push = (1 - mDist / mouseRadius) * 2.2;
            n.vx += (mdx / mDist) * push;
            n.vy += (mdy / mDist) * push;
          }
        }

        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;

        // Draw connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `${traceColor}${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Draw node center
        const pulseAlpha = 0.45 + Math.sin(n.pulse) * 0.25;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryHex;
        ctx.globalAlpha = pulseAlpha;
        ctx.fill();

        // Node glow aura
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${traceColor}${pulseAlpha * 0.25})`;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    // Pause physics if tab is backgrounded to preserve CPU/battery
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(render);
      }
    });

    requestAnimationFrame(render);
  }

  /* ----------------------------------------------------
   * SCHEMATICS LAYOUT SWITCHER (CARDS VS. TABLE)
   * ---------------------------------------------------- */
  const btnViewCards = document.querySelector("#view-cards-btn");
  const btnViewTable = document.querySelector("#view-table-btn");
  const viewGridContainer = document.querySelector("#projects-grid-view");
  const viewTableContainer = document.querySelector("#projects-table-view");

  function switchSchematicsLayout(mode) {
    const isTable = mode === "table";
    if (viewGridContainer) viewGridContainer.style.display = isTable ? "none" : "grid";
    if (viewTableContainer) viewTableContainer.style.display = isTable ? "block" : "none";

    if (btnViewCards) {
      btnViewCards.classList.toggle("active", !isTable);
      btnViewCards.setAttribute("aria-pressed", String(!isTable));
    }
    if (btnViewTable) {
      btnViewTable.classList.toggle("active", isTable);
      btnViewTable.setAttribute("aria-pressed", String(isTable));
    }
  }

  btnViewCards?.addEventListener("click", () => switchSchematicsLayout("cards"));
  btnViewTable?.addEventListener("click", () => switchSchematicsLayout("table"));

  /* ----------------------------------------------------
   * PHYSICS ZOOM INSPECTION MODAL SYSTEM
   * When clicking table rows or project cards, view zooms in with physics!
   * ---------------------------------------------------- */
  const zoomOverlay = document.querySelector("#zoom-overlay");
  const zoomDialog = document.querySelector("#modal-dialog");
  const zoomCloseBtn = document.querySelector("#modal-close");
  const zoomScrim = document.querySelector("#modal-scrim");
  const zoomSysId = document.querySelector("#modal-sys-id");
  const zoomBody = document.querySelector("#modal-body");

  let lastFocusedTrigger = null;

  function openProjectZoomModal(projectId, triggerElement, evt) {
    const projectsList = window.PORTFOLIO_PROJECTS || [];
    const project = projectsList.find((p) => p.id === projectId) || projectsList[0];
    if (!project) return;

    lastFocusedTrigger = triggerElement;

    // Trigger physics shockwave impulse at click coordinates
    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;

    if (evt && evt.clientX && evt.clientY) {
      clickX = evt.clientX;
      clickY = evt.clientY;
    } else if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      clickX = rect.left + rect.width / 2;
      clickY = rect.top + rect.height / 2;
    }

    if (globalTriggerImpulse) {
      globalTriggerImpulse(clickX, clickY, 1.5);
    }

    // Populate modal contents
    if (zoomSysId) {
      zoomSysId.textContent = `INSPECTION :: ${project.code || "SYSTEM"}`;
    }

    if (zoomBody) {
      const techChipsHtml = (project.technologies || [])
        .map((t) => `<span class="sch-tag">${t}</span>`)
        .join("");

      const detailsHtml = (project.details || [])
        .map((d) => `<li>${d}</li>`)
        .join("");

      const actionLinks = [];
      if (project.repositoryUrl) {
        actionLinks.push(`<a class="tech-btn tech-btn-primary" href="${project.repositoryUrl}" target="_blank" rel="noopener noreferrer">[INSPECT_REPOSITORY] &rarr;</a>`);
      }
      if (project.demoUrl) {
        actionLinks.push(`<a class="tech-btn tech-btn-secondary" href="${project.demoUrl}" target="_blank" rel="noopener noreferrer">[LAUNCH_LIVE_SITE] &rarr;</a>`);
      }
      if (!project.repositoryUrl && !project.demoUrl) {
        actionLinks.push(`<span class="sch-link-locked">Academic Capstone &bull; Proprietary System Schematics</span>`);
      }

      zoomBody.innerHTML = `
        <div class="modal-proj-hero">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <span class="schematic-badge">${project.tag || "Engineering Build"}</span>
            <span class="schematic-state">${project.status || "[COMPLETE]"}</span>
          </div>
          <h2 class="modal-hero-title">${project.title}</h2>
          <div class="modal-hero-sub">${project.subtitle || ""}</div>
          <p class="modal-desc-text">${project.description || ""}</p>
        </div>

        <div class="modal-specs-grid">
          <div class="modal-spec-cell">
            <span class="modal-spec-k">Engineering Domain</span>
            <span class="modal-spec-v">${project.tag || "Systems & Hardware"}</span>
          </div>
          <div class="modal-spec-cell">
            <span class="modal-spec-k">Role Clearance</span>
            <span class="modal-spec-v">${project.role || "Lead Developer"}</span>
          </div>
          <div class="modal-spec-cell">
            <span class="modal-spec-k">Current Phase</span>
            <span class="modal-spec-v">${project.status || "Operational"}</span>
          </div>
          <div class="modal-spec-cell">
            <span class="modal-spec-k">Architectural Pattern</span>
            <span class="modal-spec-v">${project.architecture || "Modular Engineering"}</span>
          </div>
        </div>

        ${detailsHtml ? `
          <div class="modal-subhead">System Implementation Notes</div>
          <ul class="modal-details-list">
            ${detailsHtml}
          </ul>
        ` : ""}

        <div class="modal-subhead">Core Technology Stack</div>
        <div class="schematic-tags" style="margin-bottom: 24px;">
          ${techChipsHtml}
        </div>

        <div class="modal-actions-row">
          ${actionLinks.join("")}
        </div>
      `;
    }

    if (zoomOverlay) {
      zoomOverlay.classList.add("open");
      zoomOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => zoomDialog?.focus(), 50);
    }
  }

  function closeProjectZoomModal() {
    if (!zoomOverlay || !zoomOverlay.classList.contains("open")) return;
    zoomOverlay.classList.remove("open");
    zoomOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  zoomCloseBtn?.addEventListener("click", closeProjectZoomModal);
  zoomScrim?.addEventListener("click", closeProjectZoomModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && zoomOverlay?.classList.contains("open")) {
      closeProjectZoomModal();
    }
  });

  // Attach click listeners to all table rows
  const tableZoomRows = document.querySelectorAll(".table-zoom-row");
  tableZoomRows.forEach((row) => {
    const projId = row.getAttribute("data-zoom-id");
    row.addEventListener("click", (evt) => {
      openProjectZoomModal(projId, row, evt);
    });
    row.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") {
        evt.preventDefault();
        openProjectZoomModal(projId, row, evt);
      }
    });
  });

  // Attach click listeners to all schematic cards
  const cardZoomables = document.querySelectorAll(".card-zoomable");
  cardZoomables.forEach((card) => {
    const projId = card.getAttribute("data-zoom-id");
    card.addEventListener("click", (evt) => {
      // Don't intercept direct links
      if (evt.target.closest("a")) return;
      openProjectZoomModal(projId, card, evt);
    });
    card.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") {
        if (evt.target.closest("a")) return;
        evt.preventDefault();
        openProjectZoomModal(projId, card, evt);
      }
    });
  });

  // Capabilities Matrix & Telemetry cards click impulse feedback
  const techCards = document.querySelectorAll(".rack-card, .telemetry-card, .console-card");
  techCards.forEach((card) => {
    card.addEventListener("click", (evt) => {
      if (globalTriggerImpulse) {
        globalTriggerImpulse(evt.clientX, evt.clientY, 1.2);
      }
    });
  });

})();
