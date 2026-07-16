import {
    get,
    post,
    put,
    remove,
    uploadFile
} from "../services/admin-api.js";import { renderProjectForm } from "../pages/project-form.js";
import { openCropper } from "../js/image-cropper.js";

export async function loadProjectsModule() {

    const content = document.getElementById("content");

    try {

        const projects = await get("/projects/");

        content.innerHTML = renderProjectsTable(projects);

        attachTableEvents();

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `

            <div class="alert alert-error">

                Failed to load projects.

            </div>

        `;

    }

}

function renderProjectsTable(projects) {

    const totalProjects = projects.length;

    const featuredProjects =
        projects.filter(project => project.featured).length;

    const completedProjects =
        projects.filter(project => project.completed).length;

    return `

        <div class="module-header">

            <h2>Projects</h2>

            <button
                id="add-project-btn"
                class="btn-add"
            >

                + Add Project

            </button>

        </div>

        <div class="module-stats">

            <div class="stat-box">

                <div class="stat-box-label">

                    Total Projects

                </div>

                <div class="stat-box-value">

                    ${totalProjects}

                </div>

            </div>

            <div class="stat-box">

                <div class="stat-box-label">

                    Featured

                </div>

                <div class="stat-box-value">

                    ${featuredProjects}

                </div>

            </div>

            <div class="stat-box">

                <div class="stat-box-label">

                    Completed

                </div>

                <div class="stat-box-value">

                    ${completedProjects}

                </div>

            </div>

        </div>

        ${projects.length === 0 ? `

            <div class="empty-state">

                <h3>No Projects Found</h3>

                <p>

                    Click "Add Project" to create your first project.

                </p>

            </div>

        ` : `

            <table>

                <thead>

                    <tr>

                        <th>Title</th>

                        <th>Category</th>

                        <th>Technologies</th>

                        <th>Featured</th>

                        <th>Status</th>

                        <th>Ask KAI</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    ${projects.map(project => `

                        <tr>

                            <td>

                                <strong>

                                    ${project.title}

                                </strong>

                            </td>

                            <td>

                                ${project.category}

                            </td>

                            <td>

                                ${project.technologies || "-"}

                            </td>

                            <td>

                                ${project.featured ? "⭐" : "-"}

                            </td>

                            <td>

                                ${project.completed
                                    ? "Completed"
                                    : "In Progress"}

                            </td>

                            <td>

                                ${project.ask_kai_enabled
                                    ? "Enabled"
                                    : "Disabled"}

                            </td>

                            <td>

                                <button
                                    class="btn-edit edit-project"
                                    data-id="${project.id}"
                                >

                                    Edit

                                </button>

                                <button
                                    class="btn-delete delete-project"
                                    data-id="${project.id}"
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

function showProjectForm(project = null) {

    const content = document.getElementById("content");

    content.innerHTML = renderProjectForm(project);

    if (project && project.id) {

        document
            .getElementById("project-form")
            .dataset.id = project.id;

    }

    attachFormEvents();

}

function attachTableEvents() {

    document
        .getElementById("add-project-btn")
        ?.addEventListener("click", () => {

            showProjectForm({});

        });

    document
        .querySelectorAll(".edit-project")
        .forEach(button => {

            button.addEventListener("click", async () => {

                try {

                    const project = await get(

                        `/projects/${button.dataset.id}`

                    );

                    showProjectForm(project);

                }

                catch (error) {

                    console.error(error);

                    alert("Failed to load project.");

                }

            });

        });

    document
        .querySelectorAll(".delete-project")
        .forEach(button => {

            button.addEventListener("click", () => {

                deleteProject(button.dataset.id);

            });

        });

}

function attachFormEvents() {

    document
        .getElementById("project-form")
        ?.addEventListener(
            "submit",
            saveProject
        );

    document
        .getElementById("back-btn")
        ?.addEventListener(
            "click",
            loadProjectsModule
        );

    document
        .getElementById("change-project-image-btn")
        ?.addEventListener("click", () => {

            document
                .getElementById("project-image-file")
                .click();

        });

    document
        .getElementById("project-image-file")
        ?.addEventListener(
            "change",
            previewProjectImage
        );

}

async function previewProjectImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {

        const blob = await openCropper(

            reader.result,

            16 / 9

        );

        if (!blob) return;

        const croppedFile = new File(

            [blob],

            file.name,

            {

                type: file.type

            }

        );

        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(croppedFile);

        document
            .getElementById("project-image-file")
            .files = dataTransfer.files;

        document
            .getElementById("project-image-preview")
            .src =
            URL.createObjectURL(croppedFile);

    };

    reader.readAsDataURL(file);

}

function collectProjectData() {

    return {

        title:
            document.getElementById("title").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        technologies:
            document.getElementById("technologies").value.trim(),

        github_url:
            document.getElementById("github_url").value.trim(),

        image:
            document.getElementById("project-image-preview").src,

        featured:
            document.getElementById("featured").checked,

        completed:
            document.getElementById("completed").checked,

        ask_kai_enabled:
            document.getElementById("ask_kai_enabled").checked,

        display_order:
            Number(
                document.getElementById("display_order").value
            )

    };

}

async function saveProject(event) {

    event.preventDefault();

    const data = collectProjectData();
    const imageFile =
    document
        .getElementById("project-image-file")
        ?.files[0];

if (imageFile) {

    const upload = await uploadFile(

        "/upload/project",

        imageFile

    );

    data.image = upload.image;

}

    if (!data.title) {

        alert("Project title is required.");

        return;

    }

    if (!data.category) {

        alert("Category is required.");

        return;

    }

    if (!data.description) {

        alert("Description is required.");

        return;

    }

    const form =
        document.getElementById("project-form");

    const projectId = form.dataset.id;

const isEdit =
    projectId &&
    projectId !== "undefined";

    try {

        if (isEdit) {

            await put(

                `/projects/${projectId}`,

                data

            );

            alert(
                "Project updated successfully."
            );

        }

        else {

            await post(

                "/projects/",

                data

            );

            alert(
                "Project created successfully."
            );

        }

        await loadProjectsModule();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to save project."
        );

    }

}

async function deleteProject(projectId) {

    const confirmed = confirm(

        "Are you sure you want to delete this project?"

    );

    if (!confirmed) {

        return;

    }

    try {

        await remove(

            `/projects/${projectId}`

        );

        alert(
            "Project deleted successfully."
        );

        await loadProjectsModule();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to delete project."
        );

    }

}