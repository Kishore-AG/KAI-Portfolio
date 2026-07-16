import {
    get,
    remove,
    uploadFile,
    downloadFile
} from "../services/admin-api.js";

import { renderResumeManager } from "../pages/resume-manager.js";

export async function loadResumeModule() {

    const content = document.getElementById("content");

    let resume = null;

    try {

        resume = await get("/resume/");

    }

    catch (error) {

        console.log("No resume uploaded.");

    }

    content.innerHTML = renderResumeManager(resume);

    // ==========================
    // Upload Resume
    // ==========================

    document
        .getElementById("upload-resume")
        .addEventListener("click", uploadResume);

    // ==========================
    // Download Resume
    // ==========================

    document
        .getElementById("download-resume")
        .addEventListener("click", () => {

            downloadFile("/resume/download");

        });

    // ==========================
    // Delete Resume
    // ==========================

    document
        .getElementById("delete-resume")
        .addEventListener("click", deleteResume);

}

// ==========================
// Upload
// ==========================

async function uploadResume() {

    const fileInput = document.getElementById("resume-file");

    if (!fileInput.files.length) {

        alert("Please choose a PDF file.");

        return;

    }

    try {

        await uploadFile(
            "/resume/upload",
            fileInput.files[0]
        );

        alert("Resume uploaded successfully.");

        await loadResumeModule();

    }

    catch (error) {

        console.error(error);

        alert("Upload failed.");

    }

}

// ==========================
// Delete
// ==========================

async function deleteResume() {

    const confirmed = confirm(
        "Delete current resume?"
    );

    if (!confirmed) {

        return;

    }

    try {

        await remove("/resume/");

        alert("Resume deleted successfully.");

        await loadResumeModule();

    }

    catch (error) {

        console.error(error);

        alert("Delete failed.");

    }

}