import { getEducation } from "../services/education.service.js";
import { state } from "../js/state.js";

export async function loadEducation() {
  try {
    const education = await getEducation();
    state.education = education;
    renderEducation(education);
    console.log("✅ Education Rendered");
  } catch (err) {
    console.error("Education Error:", err);
    const container = document.getElementById("education-timeline");
    if (container) {
      container.innerHTML = `<p class="section-empty">Unable to load education.</p>`;
    }
  }
}

function renderEducation(education) {
  const container = document.getElementById("education-timeline");
  if (!container) return;

  const loading = document.getElementById("education-loading");
  if (loading) loading.remove();

  container.innerHTML = "";

  if (!education || !education.length) {
    container.innerHTML = `<p class="section-empty">No education listed.</p>`;
    return;
  }

  const sorted = [...education].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  sorted.forEach((item, index) => {
    container.appendChild(createEduEntry(item, index));
  });
}

function createEduEntry(item, index) {
  const div = document.createElement("div");
  div.className = "edu-entry";
  div.setAttribute("data-reveal", "");
  div.setAttribute("data-reveal-delay", String(Math.min(index + 1, 5)));

  const endYear = item.end_year || "Present";
  const yearRange = `${item.start_year} — ${endYear}`;

  const hasDesc =
    item.description &&
    item.description !== "string" &&
    item.description.trim() !== "";

  const hasGrade =
    item.grade &&
    item.grade !== "string" &&
    item.grade.trim() !== "";

  div.innerHTML = `
    <p class="edu-year">${yearRange}</p>
    <h3 class="edu-degree">${item.degree}</h3>
    <p class="edu-institution">${item.institution}</p>
    <div class="edu-meta-row">
      <span class="edu-status-badge">${item.status}</span>
      ${hasGrade ? `<span class="edu-grade">Grade: ${item.grade}</span>` : ""}
    </div>
    ${hasDesc ? `<p class="edu-desc">${item.description}</p>` : ""}
  `;

  return div;
}