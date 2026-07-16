import { API_BASE_URL } from "../services/api.js";

export function initializeResumeDownload() {

    const button = document.getElementById("download-resume-btn");

    if (!button) return;

    button.addEventListener("click", () => {

        window.open(
            `${API_BASE_URL}/resume/download`,
            "_blank"
        );

    });

}