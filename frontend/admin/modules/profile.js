import {
    get,
    put,
    uploadFile
} from "../services/admin-api.js";import { renderProfileForm } from "../pages/profile-form.js";

export async function loadProfileModule() {

    try {

        const profile = await get("/profile/");

        showProfileForm(profile);

    }

    catch (error) {

        console.error(error);

        document.getElementById("content").innerHTML = `

            <div class="alert alert-error">

                Failed to load profile.

            </div>

        `;

    }

}

function showProfileForm(profile) {

    const content = document.getElementById("content");

    content.innerHTML = renderProfileForm(profile);

    attachFormEvents();

}

function attachFormEvents() {

    document
        .getElementById("profile-form")
        .addEventListener(
            "submit",
            saveProfile
        );

    document
        .getElementById("change-avatar-btn")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("avatar-file")
                    .click();

            }
        );

    document
        .getElementById("avatar-file")
        .addEventListener(
            "change",
            previewAvatar
        );

}

import { openCropper } from "../js/image-cropper.js";

async function previewAvatar(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {

        const blob = await openCropper(

            reader.result,

            1 // Square crop for avatar

        );

        if (!blob) return;

        const croppedFile = new File(

            [blob],

            file.name,

            {

                type: file.type

            }

        );

        // Replace the original file
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(croppedFile);

        document
            .getElementById("avatar-file")
            .files = dataTransfer.files;

        // Preview the cropped image
        document
            .getElementById("avatar-preview")
            .src = URL.createObjectURL(croppedFile);

    };

    reader.readAsDataURL(file);

}

function collectProfileData() {

    return {

        name:
            document.getElementById("name").value.trim(),

        title:
            document.getElementById("title").value.trim(),

        bio:
            document.getElementById("bio").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        github:
            document.getElementById("github").value.trim(),

        linkedin:
            document.getElementById("linkedin").value.trim(),

        location:
            document.getElementById("location").value.trim(),

        available:
            document.getElementById("available").checked

    };

}

async function saveProfile(event) {

    event.preventDefault();

    const data = collectProfileData();

    if (!data.name) {

        alert("Full Name is required.");

        return;

    }

    if (!data.email) {

        alert("Email is required.");

        return;

    }

    try {

        const avatarFile =
    document
        .getElementById("avatar-file")
        .files[0];

if (avatarFile) {

    const upload = await uploadFile(
        "/upload/avatar",
        avatarFile
    );

    data.avatar = upload.avatar;

}

        await put(
            "/profile/",
            data
        );

        alert(
            "Profile updated successfully."
        );

        await loadProfileModule();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to update profile."
        );

    }

}