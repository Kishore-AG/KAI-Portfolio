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

    }

    catch (err) {

        console.error("Projects Error:", err);

    }

}

function renderProjects(projects) {

    const featuredContainer =
        document.getElementById("featured-project");

    const gridContainer =
        document.getElementById("projects-grid");

    featuredContainer.innerHTML = "";

    gridContainer.innerHTML = "";

    if (!projects.length) {

        featuredContainer.innerHTML =
            "<p>No Projects Available</p>";

        return;

    }

   const featured = projects.find(p => p.featured);

if (featured) {
    featuredContainer.innerHTML = createProjectCard(featured, true);
}

projects
    .filter(p => !p.featured)
    .forEach(project => {
        gridContainer.innerHTML += createProjectCard(project);
    });

}

function createProjectCard(project, featured = false) {

    return `
    <article class="project-card ${featured ? "featured-project-card" : ""}">

        <div class="project-image">

            ${
                project.image
                ? `<img src="${project.image}" alt="${project.title}">`
                : `<div class="image-placeholder">Project Preview</div>`
            }

        </div>

        <div class="project-content">

            <span class="project-category badge badge-primary">
                ${project.category}
            </span>

            <h3 class="project-title">
                ${project.title}
            </h3>

            <p class="project-description">
                ${project.description}
            </p>

            <div class="project-tech">

                ${
                    project.technologies
                        ? project.technologies
                            .split(",")
                            .map(
                                tech =>
                                    `<span class="chip">${tech.trim()}</span>`
                            )
                            .join("")
                        : ""
                }

            </div>

            <div class="project-footer">

                <div class="project-status">

                    <span class="status-dot"></span>

                    <span>${project.completed ? "Completed" : "In Progress"}</span>

                </div>

                <div class="project-actions">

                    <button
                        class="btn btn-secondary"
                        onclick="${
    project.github_url && project.github_url !== 'string'
        ? `window.open('${project.github_url}', '_blank')`
        : ''
}"
                    >
                        GitHub
                    </button>

                    <button
    class="btn btn-primary"
    onclick="askKAIAbout('project', ${project.id}, 'Explain the project titled ${project.title}')"
>
     Ask KAI
</button>

                </div>

            </div>

        </div>

    </article>
    `;

}