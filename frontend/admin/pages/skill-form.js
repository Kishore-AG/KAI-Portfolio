export function renderSkillForm(skill = null) {

    const data = skill ?? {};

    const isEdit = !!data.id;

    return `

        <div class="module-header">

            <h2>

                ${isEdit ? "Edit Skill" : "Add Skill"}

            </h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >

                ← Back

            </button>

        </div>

        <form id="skill-form">

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

                    <label for="icon">

                        Icon

                    </label>

                    <input
                        type="text"
                        id="icon"
                        placeholder="fa-brands fa-python"
                        value="${data.icon ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="technologies">

                        Technologies

                    </label>

                    <textarea
                        id="technologies"
                        rows="5"
                        placeholder="Python, FastAPI, JavaScript..."
                        required
                    >${data.technologies ?? ""}</textarea>

                </div>

            </div>

            <div class="form-section">

                <h3>Display Settings</h3>

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

                <h3>Icon Preview</h3>

                <div class="form-group">

                    <input
                        type="text"
                        disabled
                        placeholder="Icon Picker (Coming Soon)"
                    >

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Skill" : "Save Skill"}

                </button>

            </div>

        </form>

    `;

}