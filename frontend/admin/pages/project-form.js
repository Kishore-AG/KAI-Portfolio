export function renderProjectForm(project = null) {

    const projectData = project ?? {};

    const isEdit = !!projectData.id;

    return `

        <div class="module-header">

            <h2>${isEdit ? "Edit Project" : "Add Project"}</h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >
                ← Back
            </button>

        </div>

        <form id="project-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="title">Project Title</label>

                    <input
                        type="text"
                        id="title"
                        value="${projectData.title ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="category">Category</label>

                    <input
                        type="text"
                        id="category"
                        value="${project.category ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="description">Description</label>

                    <textarea
                        id="description"
                        rows="5"
                        required
                    >${project.description ?? ""}</textarea>

                </div>

            </div>

            <div class="form-section">

                <h3>Technical Information</h3>

                <div class="form-group">

                    <label for="technologies">

                        Technologies
                    </label>

                    <input
                        type="text"
                        id="technologies"
                        placeholder="Python, FastAPI, JavaScript..."
                        value="${project.technologies ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="github_url">

                        GitHub Repository

                    </label>

                    <input
                        type="url"
                        id="github_url"
                        value="${project.github_url ?? ""}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Project Settings</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="featured"
                            ${project.featured ? "checked" : ""}
                        >

                        Featured Project

                    </label>

                </div>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="completed"
                            ${project.completed !== false ? "checked" : ""}
                        >

                        Completed

                    </label>

                </div>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="ask_kai_enabled"
                            ${project.ask_kai_enabled !== false ? "checked" : ""}
                        >

                        Enable Ask KAI

                    </label>

                </div>

                <div class="form-group">

                    <label for="display_order">

                        Display Order

                    </label>

                    <input
                        type="number"
                        id="display_order"
                        value="${project.display_order ?? 0}"
                    >

                </div>

            </div>

            <div class="form-section">

    <h3>Project Image</h3>

    <div class="image-upload">

        <img
            id="project-image-preview"
            src="${projectData.image || 'https://placehold.co/500x300?text=Project+Image'}"
            class="project-image-preview"
            alt="Project Preview"
        >

        <input
            type="file"
            id="project-image-file"
            accept="image/*"
            hidden
        >

        <button
            type="button"
            id="change-project-image-btn"
            class="btn-secondary"
        >
            Choose Image
        </button>

    </div>

</div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Project" : "Save Project"}

                </button>

            </div>

        </form>

    `;

}