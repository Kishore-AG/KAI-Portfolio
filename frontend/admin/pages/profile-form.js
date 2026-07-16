export function renderProfileForm(profile = {}) {

    return `

        <div class="module-header">

            <h2>Profile Settings</h2>

        </div>

        <form id="profile-form">

            <div class="form-section">

                <h3>General Information</h3>

                <div class="form-group">

                    <label for="name">Full Name</label>

                    <input
                        type="text"
                        id="name"
                        value="${profile.name ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="title">Professional Title</label>

                    <input
                        type="text"
                        id="title"
                        value="${profile.title ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="bio">Biography</label>

                    <textarea
                        id="bio"
                        rows="5"
                    >${profile.bio ?? ""}</textarea>

                </div>

            </div>

            <div class="form-section">

                <h3>Contact Information</h3>

                <div class="form-group">

                    <label for="email">Email</label>

                    <input
                        type="email"
                        id="email"
                        value="${profile.email ?? ""}"
                        required
                    >

                </div>

                <div class="form-group">

                    <label for="github">GitHub</label>

                    <input
                        type="url"
                        id="github"
                        value="${profile.github ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="linkedin">LinkedIn</label>

                    <input
                        type="url"
                        id="linkedin"
                        value="${profile.linkedin ?? ""}"
                    >

                </div>

                <div class="form-group">

                    <label for="location">Location</label>

                    <input
                        type="text"
                        id="location"
                        value="${profile.location ?? ""}"
                    >

                </div>

            </div>

            <div class="form-section">

                <h3>Availability</h3>

                <div class="form-group">

                    <label>

                        <input
                            type="checkbox"
                            id="available"
                            ${profile.available ? "checked" : "" }
                        >

                        Available for Opportunities

                    </label>

                </div>

            </div>

            <div class="form-section">

    <h3>Profile Avatar</h3>

    <div class="avatar-upload">

        <img
            id="avatar-preview"
            src="${profile.avatar || 'https://placehold.co/150x150?text=Avatar'}"
            alt="Avatar Preview"
            class="avatar-preview"
        >

        <input
            type="file"
            id="avatar-file"
            accept="image/*"
            hidden
        >

        <button
            type="button"
            id="change-avatar-btn"
            class="btn-secondary"
        >
            Change Photo
        </button>

    </div>

</div>

            <div class="form-actions">

                <button
                    type="submit"
                    class="btn-submit"
                >

                    Save Changes

                </button>

            </div>

        </form>

    `;

}