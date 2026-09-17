import { initializeRouter } from "./router.js";
import { loadProfile } from "../modules/profile.module.js";
import { loadProjects } from "../modules/project.module.js";
import { loadResearch } from "../modules/research.module.js";
import { loadSkills } from "../modules/skill.module.js";
import { loadEducation } from "../modules/education.module.js";
import { loadCertifications } from "../modules/certification.module.js";
import { initializeResumeDownload } from "../modules/resume.module.js";

/**
 * KAI Portfolio — Application Entry Point
 */
async function initializeApp() {
  console.log("🚀 KAI Portfolio Starting...");

  initializeRouter();

  // Load all data concurrently where possible
  // Profile first (populates shared data like email/github)
  await loadProfile();

  // Remaining sections load concurrently
  await Promise.allSettled([
    loadProjects(),
    loadResearch(),
    loadSkills(),
    loadEducation(),
    loadCertifications(),
  ]);

  // Wire up resume download button
  initializeResumeDownload();

  console.log("✅ KAI Portfolio Ready");
}

initializeApp();