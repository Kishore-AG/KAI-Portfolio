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

    const uploadButton =
    document.getElementById("upload-resume");

if (uploadButton) {
    uploadButton.addEventListener(
        "click",
        uploadResume
    );
}

    // ==========================
    // Download Resume
    // ==========================

    const downloadButton = document.getElementById("download-resume");

    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        downloadFile("/resume/download");
      });
    }

    // ==========================
    // Delete Resume
    // ==========================

    const deleteButton = document.getElementById("delete-resume");

    if (deleteButton) {
      deleteButton.addEventListener("click", deleteResume);
    }

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
