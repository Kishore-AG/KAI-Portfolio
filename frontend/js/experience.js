/**
 * KAI-OS Interactive Experience Engine
 * Handles 3D background initialization, scroll reveals, 3D card tilt micro-interactions,
 * active navigation tracking, and KAI intelligence state.
 */

import { init3DScene } from "./scene3d.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Three.js Cinematic 3D Scene
    init3DScene();

    // 2. KAI Assistant Panel Management
    const panel = document.getElementById("kai-panel");
    const toggle = document.getElementById("ai-toggle");
    const closeButton = document.querySelector(".assistant-close");
    const backdrop = document.getElementById("kai-backdrop");
    const kaiInput = document.getElementById("kai-input");

    function setAIState(active, focus = false) {
        if (!panel || !toggle) return;
        document.body.classList.toggle("ai-active", active);
        toggle.setAttribute("aria-checked", String(active));
        panel.setAttribute("aria-hidden", String(!active));

        const stateLabel = toggle.querySelector(".header-kai-state");
        if (stateLabel) {
            stateLabel.textContent = active ? "ONLINE" : "STANDBY";
        }

        if (active && focus && kaiInput) {
            window.setTimeout(() => kaiInput.focus(), 250);
        }
    }

    if (toggle) {
        toggle.addEventListener("click", () => {
            const isActive = document.body.classList.contains("ai-active");
            setAIState(!isActive, true);
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            setAIState(false);
            toggle?.focus();
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", () => {
            setAIState(false);
            toggle?.focus();
        });
    }

    document.addEventListener("kai:open", () => {
        setAIState(true, true);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && document.body.classList.contains("ai-active")) {
            setAIState(false);
            toggle?.focus();
        }
    });

    // Handle Quick Query Chips in Hero Stage
    document.querySelectorAll(".matrix-chips .chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const question = chip.dataset.question;
            if (!question) return;

            setAIState(true, true);
            if (kaiInput) {
                kaiInput.value = question;
                const sendBtn = document.getElementById("kai-send");
                if (sendBtn) {
                    sendBtn.click();
                }
            }
        });
    });

    // 3. Scroll Reveal Observer
    const revealElements = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add("revealed"));
    }

    // Dynamic reveal observer for elements loaded asynchronously (projects, research, etc.)
    const contentObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.hasAttribute("data-reveal") || node.classList.contains("project-card") || node.classList.contains("research-card") || node.classList.contains("skill-card") || node.classList.contains("education-card") || node.classList.contains("certificate-card")) {
                        node.classList.add("revealed");
                        attachTiltEffect(node);
                    }
                    node.querySelectorAll?.("[data-reveal], .project-card, .research-card, .skill-card, .education-card, .certificate-card").forEach(child => {
                        child.classList.add("revealed");
                        attachTiltEffect(child);
                    });
                }
            });
        });
    });

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        contentObserver.observe(mainContent, { childList: true, subtree: true });
    }

    // 4. Sophisticated 3D Card Tilt Micro-Interaction
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function attachTiltEffect(card) {
        if (prefersReducedMotion || card.dataset.tiltAttached) return;
        card.dataset.tiltAttached = "true";

        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    }

    document.querySelectorAll(".glass-card, .project-card, .research-card, .skill-card, .education-card, .certificate-card, .contact-card").forEach(card => {
        attachTiltEffect(card);
    });

    // 5. Active Navigation ScrollSpy
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    function updateNav() {
        const scrollY = window.scrollY + 180;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }

    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();
});
