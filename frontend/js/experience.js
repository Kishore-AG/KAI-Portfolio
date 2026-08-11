const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const panel = document.getElementById("kai-panel");
const toggle = document.getElementById("ai-toggle");
const closeButton = document.querySelector(".assistant-close");
const field = document.getElementById("neural-field");

function setAIState(active, focus = false) {
    if (!panel || !toggle) return;
    document.body.classList.toggle("ai-active", active);
    toggle.setAttribute("aria-checked", String(active));
    panel.setAttribute("aria-hidden", String(!active));
    const state = toggle.querySelector(".header-kai-state");
    if (state) state.textContent = active ? "ON" : "OFF";
    if (active && focus) window.setTimeout(() => document.getElementById("kai-input")?.focus(), 280);
}

toggle?.addEventListener("click", () => setAIState(!document.body.classList.contains("ai-active"), true));
closeButton?.addEventListener("click", () => {
    setAIState(false);
    toggle?.focus();
});
document.addEventListener("kai:open", () => setAIState(true));
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.body.classList.contains("ai-active")) {
        setAIState(false);
        toggle?.focus();
    }
});

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${index * 120}ms`);
});

if (field) {
    const context = field.getContext("2d");
    const pointer = { x: 0.5, y: 0.35 };
    const particles = [];
    let width = 0, height = 0, raf;
    const count = Math.min(window.innerWidth < 700 ? 34 : 72, reduceMotion ? 26 : 72);

    function resize() {
        const scale = Math.min(window.devicePixelRatio || 1, 1.5);
        width = field.width = Math.floor(innerWidth * scale);
        height = field.height = Math.floor(innerHeight * scale);
        field.style.width = `${innerWidth}px`; field.style.height = `${innerHeight}px`;
        context.setTransform(scale, 0, 0, scale, 0, 0);
    }
    function makeParticle() {
        return { x: Math.random() * innerWidth, y: Math.random() * innerHeight, z: .25 + Math.random() * .9, v: .08 + Math.random() * .32, seed: Math.random() * 7 };
    }
    function draw(time = 0) {
        context.clearRect(0, 0, innerWidth, innerHeight);
        const driftX = (pointer.x - .5) * 18, driftY = (pointer.y - .5) * 14;
        particles.forEach((p, i) => {
            p.y -= p.v * p.z;
            if (p.y < -12) { p.y = innerHeight + 12; p.x = Math.random() * innerWidth; }
            const x = p.x + driftX * p.z + Math.sin(time / 2400 + p.seed) * 5;
            const y = p.y + driftY * p.z;
            const size = 1 + p.z * 2.8;
            const alpha = .08 + p.z * .22;
            context.beginPath(); context.fillStyle = `rgba(122, 229, 218, ${alpha})`; context.arc(x, y, size, 0, Math.PI * 2); context.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j], dx = x - (q.x + driftX * q.z), dy = y - (q.y + driftY * q.z);
                if (dx * dx + dy * dy < 10500 && p.z > .6 && q.z > .6) {
                    context.beginPath(); context.strokeStyle = "rgba(120, 212, 209, .055)"; context.lineWidth = .6; context.moveTo(x, y); context.lineTo(q.x + driftX * q.z, q.y + driftY * q.z); context.stroke();
                }
            }
        });
        if (!reduceMotion) raf = requestAnimationFrame(draw);
    }
    for (let i = 0; i < count; i++) particles.push(makeParticle());
    resize(); draw();
    addEventListener("resize", resize, { passive: true });
    addEventListener("pointermove", event => { pointer.x = event.clientX / innerWidth; pointer.y = event.clientY / innerHeight; }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !reduceMotion) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } });
}

document.querySelectorAll(".btn-primary").forEach(button => {
    button.addEventListener("pointermove", event => {
        if (reduceMotion || !button.matches(":hover")) return;
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .08}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
});
