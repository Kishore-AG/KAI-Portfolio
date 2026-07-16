import { get, post, put, remove } from "../services/admin-api.js";
import { renderEducationForm } from "../pages/education-form.js";

export async function loadEducationModule() {

    const content = document.getElementById("content");

    try {

        const education = await get("/education/");

        content.innerHTML = `

            <div class="module-header">
                <h2>Education</h2>
                <button id="add-education-btn" class="btn-add">+ Add New Education</button>
            </div>

            <div class="module-stats">
                <div class="stat-box">
                    <div class="stat-box-label">Total Education</div>
                    <div class="stat-box-value">${education.length}</div>
                </div>
            </div>

            ${education.length === 0 ? `
                <div class="empty-state">
                    <h3>No Education Records</h3>
                    <p>Start by adding your first education record.</p>
                </div>
            ` : `
                <table>
                    <thead>
                        <tr>
                            <th>Degree</th>
                            <th>Institution</th>
                            <th>Year</th>
                            <th>Status</th>
                            <th>Grade</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${education.map(item => `
                            <tr>
                                <td><strong>${item.degree}</strong></td>
                                <td>${item.institution}</td>
                                <td>${item.start_year}${item.end_year ? ' - ' + item.end_year : ''}</td>
                                <td>
                                    <span class="badge badge-info">${item.status}</span>
                                </td>
                                <td>${item.grade || '—'}</td>
                                <td>${item.featured ? '⭐' : '—'}</td>
                                <td>
                                    <button class="btn-edit edit-education" data-id="${item.id}">Edit</button>
                                    <button class="btn-delete delete-education" data-id="${item.id}">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `}

        `;

        // Add

        document
            .getElementById("add-education-btn")
            .addEventListener("click", () => {

                showEducationForm();

            });

        // Edit

        document
            .querySelectorAll(".edit-education")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const education = await get(
                        `/education/${button.dataset.id}`
                    );

                    showEducationForm(education);

                });

            });

        // Delete

        document
            .querySelectorAll(".delete-education")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this education record?")) {

                        return;

                    }

                    await remove(
                        `/education/${button.dataset.id}`
                    );

                    alert("Education deleted successfully.");

                    await loadEducationModule();

                });

            });

    }

    catch (error) {

        console.error(error);

        content.innerHTML = "<h2>Failed to load education.</h2>";

    }

}

function showEducationForm(education = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderEducationForm(education);

    if (education) {

        document
            .getElementById("education-form")
            .dataset.id = education.id;

    }

    document
        .getElementById("education-form")
        .addEventListener("submit", saveEducation);

    document
        .getElementById("back-btn")
        .addEventListener("click", loadEducationModule);

}

async function saveEducation(event) {

    event.preventDefault();

    const id = event.target.dataset.id;

    const data = {

        degree:
            document.getElementById("degree").value,

        institution:
            document.getElementById("institution").value,

        board_university:
            document.getElementById("board_university").value,

        start_year:
            Number(document.getElementById("start_year").value),

        end_year:
            document.getElementById("end_year").value
                ? Number(document.getElementById("end_year").value)
                : null,

        status:
            document.getElementById("status").value,

        grade:
            document.getElementById("grade").value,

        description:
            document.getElementById("description").value,

        display_order: 0,

        featured: false

    };

    try {

        if (id) {

            await put(
                `/education/${id}`,
                data
            );

            alert("Education Updated Successfully.");

        }

        else {

            await post(
                "/education/",
                data
            );

            alert("Education Added Successfully.");

        }

        await loadEducationModule();

    }

    catch (error) {

        console.error(error);

        alert("Operation Failed.");

    }

}