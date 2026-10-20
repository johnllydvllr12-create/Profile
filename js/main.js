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
    function triggerPhysicsImpulse(clickX, clickY) {
      if (prefersReducedMotion) return;

      // 1. Expanding cyber shockwave ring
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: Math.min(width, height) * 0.35 + 140,
        speed: 9.5,
        alpha: 0.85
      });

      // 2. Severe physical impulse applied to all nearby nodes
      const blastRadius = 360;
      const blastForce = 34;

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
      const sparkCount = Math.floor(Math.random() * 12) + 24;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 3;
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

    // Global click listener for physics trigger
    window.addEventListener("pointerdown", (e) => {
      // Don't trigger if clicking interactive buttons or links directly to keep navigation clean
      const interactive = e.target.closest("button, a, input, textarea, select");
      if (interactive) {
        // Still give subtle impulse from the button center
        const rect = interactive.getBoundingClientRect();
        triggerPhysicsImpulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else {
        triggerPhysicsImpulse(e.clientX, e.clientY);
      }
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

})();
