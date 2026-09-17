/**
 * KAI Portfolio — Premium Experience Engine v2
 *
 * Handles:
 *  1. Custom cursor (desktop only)
 *  2. Navigation scroll behavior + scrollspy
 *  3. Mobile menu
 *  4. KAI Assistant panel toggle
 *  5. Scroll reveal observer
 *  6. Contact form (mailto fallback)
 *  7. Footer year
 *  8. Resume download (secondary button)
 */

import { API_BASE_URL } from "../services/api.js";

document.addEventListener("DOMContentLoaded", () => {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. CUSTOM CURSOR — desktop only
  // ─────────────────────────────────────────────────────────────────────────
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isTouchDevice =
    !window.matchMedia("(pointer: fine) and (hover: hover)").matches;

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let animFrame;

    document.addEventListener("mousemove", e => {
      dotX = e.clientX;
      dotY = e.clientY;
    });

    function animateCursor() {
      // Smooth ring follow
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;

      if (cursorDot) {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      animFrame = requestAnimationFrame(animateCursor);
    }
    animFrame = requestAnimationFrame(animateCursor);

    // Hover state on interactive elements
    const interactables = "a, button, [role='button'], input, textarea, select, .cert-entry, .research-entry";
    document.addEventListener("mouseover", e => {
      if (e.target.closest(interactables)) {
        document.body.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest(interactables)) {
        document.body.classList.remove("cursor-hover");
      }
    });
    document.addEventListener("mousedown", () =>
      document.body.classList.add("cursor-click")
    );
    document.addEventListener("mouseup", () =>
      document.body.classList.remove("cursor-click")
    );
  } else {
    // Hide cursor elements on touch devices
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. NAVIGATION SCROLL BEHAVIOR
  // ─────────────────────────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SCROLLSPY
  // ─────────────────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function updateScrollSpy() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      const matchingNav = [...navLinks].find(
        link => link.getAttribute("href") === `#${id}`
      );
      if (matchingNav) {
        matchingNav.classList.toggle(
          "active",
          scrollY >= top && scrollY < top + height
        );
      }
    });
  }

  window.addEventListener("scroll", updateScrollSpy, { passive: true });
  updateScrollSpy();

  // ─────────────────────────────────────────────────────────────────────────
  // 4. MOBILE MENU
  // ─────────────────────────────────────────────────────────────────────────
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll("[data-mobile-link]");

  function openMobileMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileToggle.classList.add("open");
    mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileToggle.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileMenu && mobileMenu.classList.contains("open");
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Mobile resume btn
  const mobileResumeBtn = document.getElementById("mobile-resume-btn");
  if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener("click", () => {
      window.open(`${API_BASE_URL}/resume/download`, "_blank");
      closeMobileMenu();
    });
  }

  // Mobile KAI btn (inside menu)
  const mobileKaiBtn = document.getElementById("mobile-kai-btn");
  if (mobileKaiBtn) {
    mobileKaiBtn.addEventListener("click", () => {
      closeMobileMenu();
      // Wait for menu transition before opening KAI
      setTimeout(() => {
        document.dispatchEvent(new Event("kai:open"));
      }, 300);
    });
  }

  // Mobile KAI FAB (floating button)
  const mobileKaiFab = document.getElementById("mobile-kai-fab");
  if (mobileKaiFab) {
    mobileKaiFab.addEventListener("click", () => {
      document.dispatchEvent(new Event("kai:open"));
    });
  }

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) {
      closeMobileMenu();
      mobileToggle?.focus();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 5. KAI ASSISTANT PANEL
  // ─────────────────────────────────────────────────────────────────────────
  const kaiPanel = document.getElementById("kai-panel");
  const kaiToggle = document.getElementById("ai-toggle");
  const kaiCloseBtn = document.querySelector(".assistant-close");
  const kaiBackdrop = document.getElementById("kai-backdrop");
  const kaiInput = document.getElementById("kai-input");

  function setKAIState(active, focusInput = false) {
    if (!kaiPanel || !kaiToggle) return;
    document.body.classList.toggle("ai-active", active);
    kaiToggle.setAttribute("aria-checked", String(active));
    kaiPanel.setAttribute("aria-hidden", String(!active));

    if (active && focusInput && kaiInput) {
      setTimeout(() => kaiInput.focus(), 350);
    }
  }

  if (kaiToggle) {
    kaiToggle.addEventListener("click", () => {
      const isActive = document.body.classList.contains("ai-active");
      setKAIState(!isActive, true);
    });
  }

  if (kaiCloseBtn) {
    kaiCloseBtn.addEventListener("click", () => {
      setKAIState(false);
      kaiToggle?.focus();
    });
  }

  if (kaiBackdrop) {
    kaiBackdrop.addEventListener("click", () => {
      setKAIState(false);
      kaiToggle?.focus();
    });
  }

  document.addEventListener("kai:open", () => setKAIState(true, true));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.body.classList.contains("ai-active")) {
      setKAIState(false);
      kaiToggle?.focus();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6. SCROLL REVEAL OBSERVER
  // ─────────────────────────────────────────────────────────────────────────
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
    );

    // Observe static elements
    document.querySelectorAll("[data-reveal]").forEach(el =>
      revealObserver.observe(el)
    );

    // Observe dynamically added elements
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.hasAttribute("data-reveal")) {
              revealObserver.observe(node);
            }
            node.querySelectorAll?.("[data-reveal]").forEach(child =>
              revealObserver.observe(child)
            );
          });
        });
      });
      mutationObserver.observe(mainContent, {
        childList: true,
        subtree: true,
      });
    }
  } else {
    // Fallback: reveal all immediately
    document.querySelectorAll("[data-reveal]").forEach(el =>
      el.classList.add("revealed")
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. CONTACT FORM
  // ─────────────────────────────────────────────────────────────────────────
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-form-status");
  const contactSubmit = document.getElementById("contact-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();

      const nameInput = document.getElementById("contact-name");
      const emailInput = document.getElementById("contact-from-email");
      const messageInput = document.getElementById("contact-message");

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const message = messageInput?.value.trim() || "";

      // Basic validation
      if (!name || !email || !message) {
        setFormStatus("error", "Please fill in all fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFormStatus("error", "Please enter a valid email address.");
        return;
      }

      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
      }

      try {
        const response = await fetch("https://kai-portfolio-4kbr.onrender.com/contact/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.detail || "The message could not be sent.");
        }

        setFormStatus("success", "Your message was sent successfully.");
        contactForm.reset();
      } catch (err) {
        setFormStatus("error", err.message || "Something went wrong. Please try again.");
      } finally {
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Send Message";
        }
      }
    });
  }

  function setFormStatus(type, message) {
    if (!contactStatus) return;
    contactStatus.className = `form-status ${type}`;
    contactStatus.textContent = message;
    setTimeout(() => {
      contactStatus.textContent = "";
      contactStatus.className = "form-status";
    }, 6000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. FOOTER YEAR
  // ─────────────────────────────────────────────────────────────────────────
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9. ADMIN ENTRY — hidden click on brand K
  // ─────────────────────────────────────────────────────────────────────────
  const adminEntry = document.getElementById("admin-entry");
  if (adminEntry) {
    adminEntry.addEventListener("click", () => {
      window.location.href = "./admin/login.html";
    });
    // Keyboard support
    adminEntry.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = "./admin/login.html";
      }
    });
  }

  console.log("✅ KAI Portfolio Experience Engine v2 Ready");
});
