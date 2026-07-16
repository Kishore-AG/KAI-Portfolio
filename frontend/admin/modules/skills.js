import { get, post, put, remove } from "../services/admin-api.js";
import { renderSkillForm } from "../pages/skill-form.js";

export async function loadSkillsModule() {

    const content = document.getElementById("content");

    try {

        const skills = await get("/skills/");

        content.innerHTML = `

            <div class="module-header">
                <h2>Skills</h2>
                <button id="add-skill-btn" class="btn-add">+ Add New Skill</button>
            </div>

            <div class="module-stats">
                <div class="stat-box">
                    <div class="stat-box-label">Total Skills</div>
                    <div class="stat-box-value">${skills.length}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Categories</div>
                    <div class="stat-box-value">${new Set(skills.map(s => s.category)).size}</div>
                </div>
            </div>

            ${skills.length === 0 ? `
                <div class="empty-state">
                    <h3>No Skills Yet</h3>
                    <p>Start by adding your first skill category.</p>
                </div>
            ` : `
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Technologies</th>
                            <th>Count</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${skills.map(skill => `
                            <tr>
                                <td><strong>${skill.category}</strong></td>
                                <td>
                                    <small>${skill.technologies ? skill.technologies.substring(0, 50) + '...' : 'N/A'}</small>
                                </td>
                                <td>
                                    <span style="font-size: 0.9rem; color: #6b7280;">
                                        ${skill.technologies ? skill.technologies.split(',').length : 0}
                                    </span>
                                </td>
                                <td>${skill.display_order || 0}</td>
                                <td>
                                    <button class="btn-edit edit-skill" data-id="${skill.id}">Edit</button>
                                    <button class="btn-delete delete-skill" data-id="${skill.id}">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `}

        `;

        // Add

        document
            .getElementById("add-skill-btn")
            .addEventListener("click", () => {

                showSkillForm();

            });

        // Edit

        document
            .querySelectorAll(".edit-skill")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const skill = await get(
                        `/skills/${button.dataset.id}`
                    );

                    showSkillForm(skill);

                });

            });

        // Delete

        document
            .querySelectorAll(".delete-skill")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this skill?")) {

                        return;

                    }

                    await remove(
                        `/skills/${button.dataset.id}`
                    );

                    alert("Skill deleted successfully.");

                    await loadSkillsModule();

                });

            });

    }

    catch (error) {

        console.error(error);

        content.innerHTML = "<h2>Failed to load skills.</h2>";

    }

}

function showSkillForm(skill = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderSkillForm(skill);

    if (skill) {

        document
            .getElementById("skill-form")
            .dataset.id = skill.id;

    }

    document
        .getElementById("skill-form")
        .addEventListener("submit", saveSkill);

    document
        .getElementById("back-btn")
        .addEventListener("click", loadSkillsModule);

}

async function saveSkill(event) {

    event.preventDefault();

    const id = event.target.dataset.id;

    const data = {

        category:
            document.getElementById("category").value,

        icon:
            document.getElementById("icon").value,

        technologies:
            document.getElementById("technologies").value,

        display_order: 0

    };

    try {

        if (id) {

            await put(
                `/skills/${id}`,
                data
            );

            alert("Skill Updated Successfully.");

        }

        else {

            await post(
                "/skills/",
                data
            );

            alert("Skill Added Successfully.");

        }

        await loadSkillsModule();

    }

    catch (error) {

        console.error(error);

        alert("Operation Failed.");

    }

}