import { getProjects } from "../services/project.service.js";
import { state } from "../js/state.js";
import { askKAIAbout } from "./kai/kai.js";

window.askKAIAbout = askKAIAbout;

export async function loadProjects() {
  try {
    const projects = await getProjects();
    state.projects = projects;
    renderProjects(projects);
    console.log("✅ Projects Rendered");
  } catch (err) {
    console.error("Projects Error:", err);
    const container = document.getElementById("projects-list");
    if (container) {
      container.innerHTML = `<p class="section-empty">Unable to load projects.</p>`;
    }
  }
}

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  if (!container) return;

  // Remove loading indicator
  const loading = document.getElementById("projects-loading");
  if (loading) loading.remove();

  container.innerHTML = "";

  if (!projects || !projects.length) {
    container.innerHTML = `<p class="section-empty">No projects available yet.</p>`;
    return;
  }

  // Sort by display_order, featured first
  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });

  sorted.forEach((project, index) => {
    const entry = createProjectEntry(project, index);
    container.appendChild(entry);
  });
}

function createProjectEntry(project, index) {
  const article = document.createElement("article");
  const isReverse = index % 2 === 1;
  const isFeatured = project.featured;

  article.className = `project-entry${isFeatured ? " featured-entry" : ""}${isReverse && !isFeatured ? " reverse" : ""}`;
  article.setAttribute("data-reveal", "");

  const techTags = project.technologies
    ? project.technologies
        .split(",")
        .map(t => `<span class="tech-tag">${t.trim()}</span>`)
        .join("")
    : "";

  const statusClass = project.completed ? "" : " in-progress";
  const statusText = project.completed ? "Completed" : "In Progress";

  const projectNumber = String(index + 1).padStart(2, "0");

  const hasGithub =
    project.github_url &&
    project.github_url !== "string" &&
    project.github_url.trim() !== "";

  const githubBtn = hasGithub
    ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="View ${project.title} on GitHub">GitHub ↗</a>`
    : "";

  const kaiBtn = project.ask_kai_enabled
    ? `<button
         class="btn btn-ghost"
         onclick="askKAIAbout('project', ${project.id}, 'Explain the project titled ${project.title}')"
         aria-label="Ask KAI about ${project.title}"
       >Ask KAI</button>`
    : "";

  const imageHtml = project.image && project.image !== "string"
    ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
    : `<div class="project-image-placeholder" aria-label="Project preview"></div>`;

  if (isFeatured) {
    // Featured: full-width layout
    article.innerHTML = `
      <div class="project-visual">
        <div class="project-image-wrap">${imageHtml}</div>
      </div>
      <div class="project-info">
        <div>
          <p class="project-number">PROJECT ${projectNumber} — FEATURED</p>
          <span class="project-category">${project.category}</span>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
        </div>
        <div>
          <div class="project-status-badge">
            <span class="status-dot${statusClass}" aria-hidden="true"></span>
            ${statusText}
          </div>
          <div class="project-tech-list">${techTags}</div>
          <div class="project-links">${githubBtn}${kaiBtn}</div>
        </div>
      </div>
    `;
  } else {
    // Regular: alternating side layout
    article.innerHTML = `
      <div class="project-visual">
        <div class="project-image-wrap">${imageHtml}</div>
      </div>
      <div class="project-info">
        <p class="project-number">PROJECT ${projectNumber}</p>
        <span class="project-category">${project.category}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="project-status-badge">
          <span class="status-dot${statusClass}" aria-hidden="true"></span>
          ${statusText}
        </div>
        <div class="project-tech-list">${techTags}</div>
        <div class="project-links">${githubBtn}${kaiBtn}</div>
      </div>
    `;
  }

  return article;
}