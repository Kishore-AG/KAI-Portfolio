export function renderEducationForm(education = null) {

    const data = education ?? {};

    const isEdit = !!data.id;

    return `

        <div class="module-header">

            <h2>

                ${isEdit ? "Edit Education" : "Add Education"}

            </h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >

                ← Back

            </button>

        </div>

        <form id="education-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="degree">

                        Degree

                    </label>

                    <input
                        type="text"
                        id="degree"
                        value="${data.degree ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="institution">

                        Institution

                    </label>

                    <input
                        type="text"
                        id="institution"
                        value="${data.institution ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="board_university">

                        Board / University

                    </label>

                    <input
                        type="text"
                        id="board_university"
                        value="${data.board_university ?? ""}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Timeline</h3>

                <div class="form-group">

                    <label for="start_year">

                        Start Year

                    </label>

                    <input
                        type="number"
                        id="start_year"
                        value="${data.start_year ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="end_year">

                        End Year

                    </label>

                    <input
                        type="number"
                        id="end_year"
                        value="${data.end_year ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="status">

                        Status

                    </label>

                    <input
                        type="text"
                        id="status"
                        value="${data.status ?? ""}"
                        placeholder="Completed / Pursuing"
                        required
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Academic Details</h3>

                <div class="form-group">

                    <label for="grade">

                        Grade / CGPA

                    </label>

                    <input
                        type="text"
                        id="grade"
                        value="${data.grade ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="description">

                        Description

                    </label>

                    <textarea
                        id="description"
                        rows="5"
                    >${data.description ?? ""}</textarea>

                </div>

            </div>

            <div class="form-section">

                <h3>Display Settings</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="featured"
                            ${data.featured ? "checked" : ""}
                        >

                        Featured Education

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

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Education" : "Save Education"}

                </button>

            </div>

        </form>

    `;

}