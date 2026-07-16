export function renderKnowledgeForm(knowledge = null) {

    const data = knowledge ?? {};

    const isEdit = !!data.id;

    return `

        <div class="module-header">

            <h2>

                ${isEdit ? "Edit Knowledge" : "Add Knowledge"}

            </h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >

                ← Back

            </button>

        </div>

        <form id="knowledge-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="category">

                        Category

                    </label>

                    <input
                        type="text"
                        id="category"
                        value="${data.category ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="title">

                        Title

                    </label>

                    <input
                        type="text"
                        id="title"
                        value="${data.title ?? ""}"
                        required
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Knowledge Content</h3>

                <div class="form-group">

                    <label for="content">

                        Content

                    </label>

                    <textarea
                        id="knowledge-content"
                        rows="10"
                        required
                    >${data.content ?? ""}</textarea>

                </div>

                <div class="form-group">

                    <label for="source">

                        Source

                    </label>

                    <input
                        type="text"
                        id="source"
                        value="${data.source ?? ""}"
                        placeholder="Website, Book, Personal Experience..."
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Knowledge Settings</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="active"
                            ${data.active !== false ? "checked" : ""}
                        >

                        Active

                    </label>

                </div>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="embedded"
                            ${data.embedded ? "checked" : ""}
                        >

                        Embedded Into AI

                    </label>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Knowledge" : "Save Knowledge"}

                </button>

            </div>

        </form>

    `;

}