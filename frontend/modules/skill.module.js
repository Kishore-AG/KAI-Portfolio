import { getSkills } from "../services/skill.service.js";
import { state } from "../js/state.js";

export async function loadSkills() {
  try {
    const skills = await getSkills();
    state.skills = skills;
    renderSkills(skills);
    console.log("✅ Skills Rendered");
  } catch (err) {
    console.error("Skills Error:", err);
    const container = document.getElementById("skills-editorial");
    if (container) {
      container.innerHTML = `<p class="section-empty" style="grid-column:1/-1;">Unable to load skills.</p>`;
    }
  }
}

function renderSkills(skills) {
  const container = document.getElementById("skills-editorial");
  if (!container) return;

  const loading = document.getElementById("skills-loading");
  if (loading) loading.remove();

  container.innerHTML = "";

  if (!skills || !skills.length) {
    container.innerHTML = `<p class="section-empty" style="grid-column:1/-1;">No skills listed yet.</p>`;
    return;
  }

  const sorted = [...skills].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  sorted.forEach((skill, index) => {
    container.appendChild(createSkillBlock(skill, index));
  });
}

function createSkillBlock(skill, index) {
  const block = document.createElement("div");
  block.className = "skill-category-block";
  block.setAttribute("data-reveal", "");
  block.setAttribute("data-reveal-delay", String(Math.min(index + 1, 5)));

  const techItems = skill.technologies
    ? skill.technologies
        .split(",")
        .map(t => `<div class="skill-tech-item">${t.trim()}</div>`)
        .join("")
    : "<div class='skill-tech-item' style='color:var(--fg-muted)'>—</div>";

  block.innerHTML = `
    <div class="skill-cat-label">${skill.category}</div>
    <div class="skill-tech-list">${techItems}</div>
  `;

  return block;
}