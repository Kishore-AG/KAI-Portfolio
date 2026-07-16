import { get, post, put, remove } from "../services/admin-api.js";
import { renderKnowledgeForm } from "../pages/kai-knowledge-form.js";

export async function loadKnowledgeModule() {

    const content = document.getElementById("content");

    try {

        const knowledge = await get("/kai-knowledge/");

        const totalKnowledge = knowledge.length;
        const embeddedCount = knowledge.filter(k => k.embedded).length;
        const activeCount = knowledge.filter(k => k.active).length;

        content.innerHTML = `

            <div class="module-header">
                <h2>KAI Knowledge</h2>
                <button id="add-knowledge-btn" class="btn-add">+ Add New Knowledge</button>
            </div>

            <div class="module-stats">
                <div class="stat-box">
                    <div class="stat-box-label">Total Knowledge</div>
                    <div class="stat-box-value">${totalKnowledge}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Active</div>
                    <div class="stat-box-value">${activeCount}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Embedded</div>
                    <div class="stat-box-value">${embeddedCount}</div>
                </div>
            </div>

            ${knowledge.length === 0 ? `
                <div class="empty-state">
                    <h3>No Knowledge Records</h3>
                    <p>Start by adding your first knowledge entry.</p>
                </div>
            ` : `
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Embedded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${knowledge.map(item => `
                            <tr>
                                <td>${item.category}</td>
                                <td><strong>${item.title}</strong></td>
                                <td>
                                    <span class="badge ${item.active ? 'badge-success' : 'badge-danger'}">
                                        ${item.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    ${item.embedded ? '✓' : '—'}
                                </td>
                                <td>
                                    <button class="btn-edit edit-knowledge" data-id="${item.id}">Edit</button>
                                    <button class="btn-delete delete-knowledge" data-id="${item.id}">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `}

        `;

        // Add

        document
            .getElementById("add-knowledge-btn")
            .addEventListener("click", () => {

                showKnowledgeForm();

            });

        // ======================
        // Edit
        // ======================

        document
            .querySelectorAll(".edit-knowledge")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const knowledge = await get(
                        `/kai-knowledge/${button.dataset.id}`
                    );

                    showKnowledgeForm(knowledge);

                });

            });

        // ======================
        // Delete
        // ======================

        document
            .querySelectorAll(".delete-knowledge")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const confirmed = confirm(
                        "Delete this knowledge?"
                    );

                    if (!confirmed) {

                        return;

                    }

                    try {

                        await remove(
                            `/kai-knowledge/${button.dataset.id}`
                        );

                        alert("Knowledge deleted successfully.");

                        await loadKnowledgeModule();

                    }

                    catch (error) {

                        console.error(error);

                        alert("Delete failed.");

                    }

                });

            });

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `

            <h2>KAI Knowledge</h2>

            <p>Failed to load knowledge.</p>

        `;

    }

}

// ===================================
// Show Form
// ===================================

function showKnowledgeForm(knowledge = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderKnowledgeForm(knowledge);

    const form = document.getElementById("knowledge-form");

if (knowledge?.id) {

    form.dataset.id = knowledge.id;

}

    document
        .getElementById("knowledge-form")
        .addEventListener("submit", saveKnowledge);

    document
        .getElementById("back-btn")
        .addEventListener("click", loadKnowledgeModule);

}

// ===================================
// Save
// ===================================

async function saveKnowledge(event) {

    event.preventDefault();

    const id = event.target.dataset.id;

    const data = {

    category:
        document.getElementById("category").value.trim(),

    title:
        document.getElementById("title").value.trim(),

    content:
        document.getElementById("knowledge-content").value.trim(),

    source:
        document.getElementById("source").value.trim(),

    embedded:
        document.getElementById("embedded").checked,

    active:
        document.getElementById("active").checked

};

    try {

        if (id) {

            await put(
                `/kai-knowledge/${id}`,
                data
            );

            alert("Knowledge Updated Successfully.");

        }

        else {

            await post(
                "/kai-knowledge/",
                data
            );

            alert("Knowledge Added Successfully.");

        }

        await loadKnowledgeModule();

    }

    catch (error) {

        console.error(error);

        alert("Operation Failed.");

    }

}