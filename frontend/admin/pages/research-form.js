export function renderResearchForm(research = null) {

    const data = research ?? {};

    const isEdit = !!data.id;

    return `

        <div class="module-header">

            <h2>

                ${isEdit ? "Edit Research" : "Add Research"}

            </h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >

                ← Back

            </button>

        </div>

        <form id="research-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="title">

                        Research Title

                    </label>

                    <input
                        type="text"
                        id="title"
                        value="${data.title ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="field">

                        Research Field

                    </label>

                    <input
                        type="text"
                        id="field"
                        value="${data.field ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="description">

                        Description

                    </label>

                    <textarea
                        id="description"
                        rows="5"
                        required
                    >${data.description ?? ""}</textarea>

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
                        placeholder="Python, TensorFlow, OpenCV..."
                        value="${data.technologies ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="paper_url">

                        Paper URL

                    </label>

                    <input
                        type="url"
                        id="paper_url"
                        value="${data.paper_url ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="publication_year">

                        Publication Year

                    </label>

                    <input
                        type="number"
                        id="publication_year"
                        value="${data.publication_year ?? new Date().getFullYear()}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Research Settings</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="featured"
                            ${data.featured ? "checked" : ""}
                        >

                        Featured Research

                    </label>

                </div>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="ask_kai_enabled"
                            ${data.ask_kai_enabled !== false ? "checked" : ""}
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
                        value="${data.display_order ?? 0}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Research Paper</h3>

                <div class="form-group">

                    <input
                        type="text"
                        disabled
                        placeholder="Paper Upload (Coming Soon)"
                    >

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Research" : "Save Research"}

                </button>

            </div>

        </form>

    `;

}