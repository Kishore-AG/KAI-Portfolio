import { get, post, put, remove } from "../services/admin-api.js";
import { renderResearchForm } from "../pages/research-form.js";

export async function loadResearchModule() {

    const content = document.getElementById("content");

    try {

        const research = await get("/research/");

        content.innerHTML = renderResearchTable(research);

        attachTableEvents();

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `

            <div class="alert alert-error">

                Failed to load research.

            </div>

        `;

    }

}

function renderResearchTable(research) {

    const totalResearch = research.length;

    const featuredResearch =
        research.filter(item => item.featured).length;

    return `

        <div class="module-header">

            <h2>Research</h2>

            <button
                id="add-research-btn"
                class="btn-add"
            >

                + Add Research

            </button>

        </div>

        <div class="module-stats">

            <div class="stat-box">

                <div class="stat-box-label">

                    Total Research

                </div>

                <div class="stat-box-value">

                    ${totalResearch}

                </div>

            </div>

            <div class="stat-box">

                <div class="stat-box-label">

                    Featured

                </div>

                <div class="stat-box-value">

                    ${featuredResearch}

                </div>

            </div>

        </div>

        ${research.length === 0 ? `

            <div class="empty-state">

                <h3>No Research Found</h3>

                <p>

                    Click "Add Research" to create your first research record.

                </p>

            </div>

        ` : `

            <table>

                <thead>

                    <tr>

                        <th>Title</th>

                        <th>Field</th>

                        <th>Year</th>

                        <th>Featured</th>

                        <th>Ask KAI</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    ${research.map(item => `

                        <tr>

                            <td>

                                <strong>

                                    ${item.title}

                                </strong>

                            </td>

                            <td>

                                ${item.field}

                            </td>

                            <td>

                                ${item.publication_year || "-"}

                            </td>

                            <td>

                                ${item.featured ? "⭐" : "-"}

                            </td>

                            <td>

                                ${item.ask_kai_enabled ? "Enabled" : "Disabled"}

                            </td>

                            <td>

                                <button
                                    class="btn-edit edit-research"
                                    data-id="${item.id}"
                                >

                                    Edit

                                </button>

                                <button
                                    class="btn-delete delete-research"
                                    data-id="${item.id}"
                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        `}

    `;

}

function showResearchForm(research = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderResearchForm(research);

   const form = document.getElementById("research-form");

if (research?.id) {

    form.dataset.id = research.id;

}

    attachFormEvents();

}

function attachTableEvents() {

    document
        .getElementById("add-research-btn")
        ?.addEventListener("click", () => {

            showResearchForm();

        });

    document
        .querySelectorAll(".edit-research")
        .forEach(button => {

            button.addEventListener("click", async () => {

                try {

                    const research = await get(

                        `/research/${button.dataset.id}`

                    );

                    showResearchForm(research);

                }

                catch (error) {

                    console.error(error);

                    alert("Failed to load research.");

                }

            });

        });

    document
        .querySelectorAll(".delete-research")
        .forEach(button => {

            button.addEventListener("click", () => {

                deleteResearch(button.dataset.id);

            });

        });

}

function attachFormEvents() {

    document
        .getElementById("research-form")
        ?.addEventListener(
            "submit",
            saveResearch
        );

    document
        .getElementById("back-btn")
        ?.addEventListener(
            "click",
            loadResearchModule
        );

}

function collectResearchData() {

    return {

        title:
            document.getElementById("title").value.trim(),

        field:
            document.getElementById("field").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        technologies:
            document.getElementById("technologies").value.trim(),

        publication_year:
            Number(
                document.getElementById("publication_year").value
            ),

        paper_url:
            document.getElementById("paper_url").value.trim(),

        featured:
            document.getElementById("featured").checked,

        ask_kai_enabled:
            document.getElementById("ask_kai_enabled").checked,

        display_order:
            Number(
                document.getElementById("display_order").value
            )

    };

}

async function saveResearch(event) {

    event.preventDefault();

    const data = collectResearchData();

    if (!data.title) {

        alert("Research title is required.");

        return;

    }

    if (!data.field) {

        alert("Research field is required.");

        return;

    }

    if (!data.description) {

        alert("Description is required.");

        return;

    }

    const form =
        document.getElementById("research-form");

    const researchId = form.dataset.id;

const isEdit =
    Number.isInteger(Number(researchId));

    try {

        if (isEdit) {

            await put(

                `/research/${researchId}`,

                data

            );

            alert(
                "Research updated successfully."
            );

        }

        else {

            await post(

                "/research/",

                data

            );

            alert(
                "Research added successfully."
            );

        }

        await loadResearchModule();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to save research."
        );

    }

}

async function deleteResearch(researchId) {

    const confirmed = confirm(

        "Are you sure you want to delete this research?"

    );

    if (!confirmed) {

        return;

    }

    try {

        await remove(

            `/research/${researchId}`

        );

        alert(
            "Research deleted successfully."
        );

        await loadResearchModule();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to delete research."
        );

    }

}