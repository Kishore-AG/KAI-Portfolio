/**
 * KAI-OS Cinematic 3D Scene Engine
 * Powered by Three.js with resilient fallback
 * Generates an interactive, futuristic cybernetic environment with abstract forms,
 * orbital rings, volumetric particles, and dynamic scroll/parallax camera motion.
 */

export async function init3DScene() {
    const canvas = document.getElementById("neural-field");
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let THREE;
    try {
        THREE = await import("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js");
    } catch (err) {
        console.warn("Three.js CDN unavailable or offline; activating procedural cyber fallback canvas.", err);
        runFallbackCanvas(canvas, prefersReducedMotion);
        return;
    }

    // WebGL Renderer Setup
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
    } catch (e) {
        console.warn("WebGL not supported; activating procedural cyber fallback canvas.", e);
        runFallbackCanvas(canvas, prefersReducedMotion);
        return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Scene & Deep Atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0016);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 120);

    // Dynamic Multi-Spectrum Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1628, 2.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f5d4, 3.8, 500);
    cyanPointLight.position.set(50, 40, 60);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0x7928ca, 3.2, 500);
    violetPointLight.position.set(-60, -30, 40);
    scene.add(violetPointLight);

    const goldPointLight = new THREE.PointLight(0xf5a623, 1.6, 320);
    goldPointLight.position.set(0, 80, -20);
    scene.add(goldPointLight);

    // 3D Objects Container (transforms with parallax and scroll)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Central Morphing Polyhedral Core
    const coreGroup = new THREE.Group();
    worldGroup.add(coreGroup);

    // Outer wireframe icosahedron exoskeleton
    const outerGeo = new THREE.IcosahedronGeometry(22, 2);
    const outerMat = new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.85
    });
    const outerCore = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCore);

    // Inner geometric crystalline solid
    const innerGeo = new THREE.IcosahedronGeometry(15, 1);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x071e33,
        roughness: 0.18,
        metalness: 0.9,
        flatShading: true,
        emissive: 0x031826,
        emissiveIntensity: 0.7
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Inner pulsating quantum beacon
    const coreLightGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const coreLightMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.85
    });
    const corePoint = new THREE.Mesh(coreLightGeo, coreLightMat);
    coreGroup.add(corePoint);

    // 2. Orbital Cybernetic Rings
    const ringGroup = new THREE.Group();
    worldGroup.add(ringGroup);

    const ringConfigs = [
        { radius: 42, tube: 0.35, color: 0x00f5d4, rotX: 1.1, rotY: 0.4, opacity: 0.5 },
        { radius: 56, tube: 0.28, color: 0x7928ca, rotX: -0.8, rotY: 0.7, opacity: 0.4 },
        { radius: 72, tube: 0.2, color: 0x00bbf9, rotX: 0.3, rotY: -1.2, opacity: 0.3 }
    ];

    const rings = ringConfigs.map(cfg => {
        const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
        const mat = new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: cfg.opacity,
            wireframe: true
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = cfg.rotX;
        ring.rotation.y = cfg.rotY;
        ringGroup.add(ring);
        return { mesh: ring, speedX: 0.002 * (Math.random() > 0.5 ? 1 : -1), speedY: 0.003 };
    });

    // Orbital Satellite Shards
    const satelliteGeo = new THREE.OctahedronGeometry(1.6, 0);
    const satelliteMat = new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        emissive: 0x00f5d4,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9
    });
    const satellites = [];
    for (let i = 0; i < 7; i++) {
        const mesh = new THREE.Mesh(satelliteGeo, satelliteMat);
        const orbitRadius = 40 + i * 8;
        const angle = (i / 7) * Math.PI * 2;
        const speed = 0.008 + (i % 3) * 0.004;
        satellites.push({ mesh, orbitRadius, angle, speed, yOffset: (Math.random() - 0.5) * 20 });
        worldGroup.add(mesh);
    }

    // 3. Volumetric Floating Particle Cloud
    const particleCount = prefersReducedMotion ? 350 : (window.innerWidth < 768 ? 600 : 1300);
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color(0x00f5d4),
        new THREE.Color(0x00bbf9),
        new THREE.Color(0x7928ca),
        new THREE.Color(0xffffff),
        new THREE.Color(0x4cc9f0)
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 800;
        positions[i3 + 1] = (Math.random() - 0.5) * 800;
        positions[i3 + 2] = (Math.random() - 0.5) * 800;

        const pickedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = pickedColor.r;
        colors[i3 + 1] = pickedColor.g;
        colors[i3 + 2] = pickedColor.b;

        speeds[i] = 0.15 + Math.random() * 0.35;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 2.2 : 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // 4. Perspective Cybernetic Grid Horizon
    const gridHelper = new THREE.GridHelper(1000, 50, 0x00f5d4, 0x09223b);
    gridHelper.position.y = -85;
    gridHelper.position.z = -100;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    worldGroup.add(gridHelper);

    // Parallax & Scroll Interpolation State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let animationFrameId = null;

    function onPointerMove(e) {
        mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onScroll() {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetScrollProgress = window.scrollY / maxScroll;
    }

    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Render Loop
    let clock = new THREE.Clock();

    function animate() {
        if (prefersReducedMotion) {
            renderer.render(scene, camera);
            return;
        }

        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse parallax damping
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Smooth scroll progress
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

        // Rotate core
        outerCore.rotation.x += 0.003;
        outerCore.rotation.y += 0.005;
        innerCore.rotation.x -= 0.004;
        innerCore.rotation.y -= 0.003;

        // Core breathing pulse
        const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.04;
        outerCore.scale.set(pulse, pulse, pulse);
        corePoint.scale.set(pulse * 1.2, pulse * 1.2, pulse * 1.2);

        // Rotate rings
        rings.forEach(r => {
            r.mesh.rotation.z += r.speedX;
            r.mesh.rotation.y += r.speedY;
        });

        // Orbit satellites
        satellites.forEach(sat => {
            sat.angle += sat.speed;
            sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
            sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
            sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.orbitRadius) * 4;
            sat.mesh.rotation.x += 0.02;
            sat.mesh.rotation.y += 0.03;
        });

        // Orbit dynamic point lights
        cyanPointLight.position.x = Math.cos(elapsedTime * 0.4) * 80;
        cyanPointLight.position.z = Math.sin(elapsedTime * 0.4) * 80 + 20;
        violetPointLight.position.x = -Math.cos(elapsedTime * 0.35) * 90;
        violetPointLight.position.z = -Math.sin(elapsedTime * 0.35) * 90;

        // Drift particles slowly
        const posAttr = particleGeo.attributes.position;
        const posArray = posAttr.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArray[i3 + 1] -= speeds[i] * 0.35;
            if (posArray[i3 + 1] < -400) {
                posArray[i3 + 1] = 400;
            }
        }
        posAttr.needsUpdate = true;

        // Cinematic Camera Flight: coordinates dynamic with scroll and parallax
        const cameraTargetZ = 120 - scrollProgress * 70;
        const cameraTargetY = -scrollProgress * 65 + mouse.y * 12;
        const cameraTargetX = mouse.x * 24 + Math.sin(scrollProgress * Math.PI) * 18;

        camera.position.x += (cameraTargetX - camera.position.x) * 0.05;
        camera.position.y += (cameraTargetY - camera.position.y) * 0.05;
        camera.position.z += (cameraTargetZ - camera.position.z) * 0.05;

        camera.lookAt(0, -scrollProgress * 30, 0);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            clock.start();
            animate();
        }
    });
}

/**
 * 2D Procedural Cyber Fallback Canvas
 * Gracefully used if WebGL or external CDN script is unavailable
 */
function runFallbackCanvas(canvas, prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const count = prefersReducedMotion ? 40 : 80;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            color: i % 2 === 0 ? "rgba(0, 245, 212, " : "rgba(121, 40, 202, "
        });
    }

    let mouse = { x: w / 2, y: h / 2 };
    window.addEventListener("pointermove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    function draw() {
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}0.7)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0, 245, 212, ${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        if (!prefersReducedMotion) {
            requestAnimationFrame(draw);
        }
    }

    draw();
}
