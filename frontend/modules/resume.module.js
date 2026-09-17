import { API_BASE_URL } from "../services/api.js";

export function initializeResumeDownload() {
  // Desktop nav resume button
  const navBtn = document.getElementById("download-resume-btn");
  if (navBtn) {
    navBtn.addEventListener("click", () => {
      window.open(`${API_BASE_URL}/resume/download`, "_blank");
    });
  }

  // Mobile resume button (handled in experience.js via mobile-resume-btn ID)
  // No further action needed here — experience.js picks it up
}
