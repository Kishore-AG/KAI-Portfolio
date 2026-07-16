export function renderResumeManager(resume = null) {

    const resumeExists = !!resume;

    const formatFileSize = (bytes) => {

        if (!bytes) return "Not Available";

        if (bytes < 1024) {

            return `${bytes} Bytes`;

        }

        if (bytes < 1024 * 1024) {

            return `${(bytes / 1024).toFixed(2)} KB`;

        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    };

    return `

        <div class="module-header">

            <h2>Resume Manager</h2>

        </div>

        <div class="form-section">

            <h3>Resume Status</h3>

            <p>

                ${resumeExists
                    ? "🟢 Resume Available"
                    : "🔴 No Resume Uploaded"}

            </p>

        </div>

        <div class="form-section">

            <h3>Current Resume</h3>

            <div class="form-group">

                <label>File Name</label>

                <input
                    type="text"
                    value="${resume?.file_name ?? "Not Available"}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>File Size</label>

                <input
                    type="text"
                    value="${formatFileSize(resume?.file_size)}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>Version</label>

                <input
                    type="text"
                    value="${resume?.version ?? "Not Available"}"
                    readonly
                >

            </div>

        </div>

        <div class="form-section">

            <h3>Upload Resume</h3>

            <div class="form-group">

                <label>Select PDF File</label>

                <input
                    type="file"
                    id="resume-file"
                    accept=".pdf"
                >

            </div>

            <p style="font-size:0.85rem;color:#888;">

                • Supported Format: PDF<br>

                • Maximum Size: 5 MB

            </p>

            <div class="form-actions">

                <button
                    id="upload-resume"
                    class="btn-submit"
                >

                    Upload Resume

                </button>

            </div>

        </div>

        <div class="form-section">

            <h3>Quick Actions</h3>

            <div class="form-actions">


                <button
                    id="delete-resume"
                    class="btn-delete"
                    ${resumeExists ? "" : "disabled"}
                >

                    Delete Resume

                </button>

            </div>

        </div>

    `;

}