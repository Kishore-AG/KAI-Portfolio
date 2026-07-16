import { get, post, put, remove } from "../services/admin-api.js";
import { renderCertificationForm } from "../pages/certification-form.js";

export async function loadCertificationsModule() {

    const content = document.getElementById("content");

    try {

        const certifications = await get("/certifications/");

        content.innerHTML = `

            <div class="module-header">
                <h2>Certifications</h2>
                <button id="add-certification-btn" class="btn-add">+ Add New Certification</button>
            </div>

            <div class="module-stats">
                <div class="stat-box">
                    <div class="stat-box-label">Total Certifications</div>
                    <div class="stat-box-value">${certifications.length}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-box-label">Verified</div>
                    <div class="stat-box-value">${certifications.filter(c => c.verified).length}</div>
                </div>
            </div>

            ${certifications.length === 0 ? `
                <div class="empty-state">
                    <h3>No Certifications Yet</h3>
                    <p>Start by adding your first certification.</p>
                </div>
            ` : `
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Issuer</th>
                            <th>Year</th>
                            <th>Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${certifications.map(cert => `
                            <tr>
                                <td><strong>${cert.title}</strong></td>
                                <td>${cert.issuer}</td>
                                <td>${cert.issue_year}</td>
                                <td>
                                    ${cert.verified ? `<span class="badge badge-success">Verified</span>` : `<span class="badge badge-warning">Pending</span>`}
                                </td>
                                <td>
                                    <button class="btn-edit edit-certification" data-id="${cert.id}">Edit</button>
                                    <button class="btn-delete delete-certification" data-id="${cert.id}">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `}

        `;

        // Add

        document
            .getElementById("add-certification-btn")
            .addEventListener("click", () => {

                showCertificationForm();

            });

        // Edit

        document
            .querySelectorAll(".edit-certification")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const certification = await get(
                        `/certifications/${button.dataset.id}`
                    );

                    showCertificationForm(certification);

                });

            });

        // Delete

        document
            .querySelectorAll(".delete-certification")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this certification?")) {

                        return;

                    }

                    await remove(
                        `/certifications/${button.dataset.id}`
                    );

                    alert("Certification deleted successfully.");

                    await loadCertificationsModule();

                });

            });

    }

    catch (error) {

        console.error(error);

        content.innerHTML = "<h2>Failed to load certifications.</h2>";

    }

}

function showCertificationForm(certification = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderCertificationForm(certification);

    if (certification) {

        document
            .getElementById("certification-form")
            .dataset.id = certification.id;

    }

    document
        .getElementById("certification-form")
        .addEventListener("submit", saveCertification);

    document
        .getElementById("back-btn")
        .addEventListener("click", loadCertificationsModule);

}

async function saveCertification(event) {

    event.preventDefault();

    const id = event.target.dataset.id;

    const data = {

        title:
            document.getElementById("title").value,

        issuer:
            document.getElementById("issuer").value,

        issue_year:
            Number(document.getElementById("issue_year").value),

        credential_id:
            document.getElementById("credential_id").value,

        certificate_url:
            document.getElementById("certificate_url").value,

        certificate_image: "",

        verified: true,

        display_order: 0

    };

    try {

        if (id) {

            await put(
                `/certifications/${id}`,
                data
            );

            alert("Certification Updated Successfully.");

        }

        else {

            await post(
                "/certifications/",
                data
            );

            alert("Certification Added Successfully.");

        }

        await loadCertificationsModule();

    }

    catch (error) {

        console.error(error);

        alert("Operation Failed.");

    }

}