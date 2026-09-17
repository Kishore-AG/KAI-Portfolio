import { getResearch } from "../services/research.service.js";
import { state } from "../js/state.js";
import { askKAIAbout } from "./kai/kai.js";

window.askKAIAbout = askKAIAbout;

export async function loadResearch() {
  try {
    const research = await getResearch();
    state.research = research;
    renderResearch(research);
    console.log("✅ Research Rendered");
  } catch (err) {
    console.error("Research Error:", err);
    const container = document.getElementById("research-list");
    if (container) {
      container.innerHTML = `<p class="section-empty">Unable to load research.</p>`;
    }
  }
}

function renderResearch(research) {
  const container = document.getElementById("research-list");
  if (!container) return;

  const loading = document.getElementById("research-loading");
  if (loading) loading.remove();

  container.innerHTML = "";

  if (!research || !research.length) {
    container.innerHTML = `<p class="section-empty">No research published yet.</p>`;
    return;
  }

  const sorted = [...research].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  sorted.forEach((item, index) => {
    container.appendChild(createResearchEntry(item, index));
  });

  // Add expand/collapse interaction
  container.querySelectorAll(".research-entry").forEach(entry => {
    entry.addEventListener("click", () => {
      const isExpanded = entry.classList.contains("expanded");
      // Collapse all
      container.querySelectorAll(".research-entry.expanded").forEach(e =>
        e.classList.remove("expanded")
      );
      // Expand clicked (unless it was already open)
      if (!isExpanded) entry.classList.add("expanded");
    });

    entry.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        entry.click();
      }
    });
  });
}

function createResearchEntry(item, index) {
  const article = document.createElement("article");
  article.className = "research-entry";
  article.setAttribute("data-reveal", "");
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");
  article.setAttribute("aria-expanded", "false");
  article.setAttribute(
    "aria-label",
    `${item.title} — Click to expand details`
  );

  const techTags = item.technologies
    ? item.technologies
        .split(",")
        .map(t => `<span class="tech-tag">${t.trim()}</span>`)
        .join("")
    : "";

  const hasUrl =
    item.paper_url &&
    item.paper_url !== "string" &&
    item.paper_url.trim() !== "";

  const kaiBtn = item.ask_kai_enabled
    ? `<button
         class="btn btn-ghost"
         onclick="event.stopPropagation(); askKAIAbout('research', ${item.id}, 'Explain the research titled ${item.title}')"
         aria-label="Ask KAI about ${item.title}"
       >Ask KAI</button>`
    : "";

  const urlBtn = hasUrl
    ? `<a
         href="${item.paper_url}"
         target="_blank"
         rel="noopener noreferrer"
         class="btn btn-ghost"
         onclick="event.stopPropagation()"
         aria-label="View paper: ${item.title}"
       >View Paper</a>`
    : "";

  article.innerHTML = `
    <div class="research-year">${item.publication_year || "—"}</div>
    <div class="research-body">
      <span class="research-field-badge">${item.field}</span>
      <h3 class="research-title">${item.title}</h3>
      <p class="research-desc">${item.description}</p>
      <div class="research-detail">
        ${techTags ? `<div class="research-tech-list">${techTags}</div>` : ""}
        <div style="display: flex; gap: 12px; margin-top: 8px;">
          ${urlBtn}${kaiBtn}
        </div>
      </div>
    </div>
    <span class="research-expand-icon" aria-hidden="true">+</span>
  `;

  return article;
}