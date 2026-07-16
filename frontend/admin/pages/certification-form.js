export function renderCertificationForm(certification = null) {

    const data = certification ?? {};

    const isEdit = !!data.id;

    return `

        <div class="module-header">

            <h2>

                ${isEdit ? "Edit Certification" : "Add Certification"}

            </h2>

            <button
                id="back-btn"
                class="btn-secondary"
            >

                ← Back

            </button>

        </div>

        <form id="certification-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="title">

                        Certification Title

                    </label>

                    <input
                        type="text"
                        id="title"
                        value="${data.title ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="issuer">

                        Issuer

                    </label>

                    <input
                        type="text"
                        id="issuer"
                        value="${data.issuer ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="issue_year">

                        Issue Year

                    </label>

                    <input
                        type="number"
                        id="issue_year"
                        value="${data.issue_year ?? ""}"
                        required
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Certificate Details</h3>

                <div class="form-group">

                    <label for="credential_id">

                        Credential ID

                    </label>

                    <input
                        type="text"
                        id="credential_id"
                        value="${data.credential_id ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="certificate_url">

                        Certificate URL

                    </label>

                    <input
                        type="url"
                        id="certificate_url"
                        value="${data.certificate_url ?? ""}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Display Settings</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="verified"
                            ${data.verified ? "checked" : ""}
                        >

                        Verified Certificate

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

                <h3>Certificate Image</h3>

                <div class="form-group">

                    <input
                        type="text"
                        disabled
                        placeholder="Certificate Image Upload (Coming Soon)"
                    >

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    ${isEdit ? "Update Certification" : "Save Certification"}

                </button>

            </div>

        </form>

    `;

}