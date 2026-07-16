import { initializeRouter } from "./router.js";
import { loadProfile } from "../modules/profile.module.js";
import { loadProjects } from "../modules/project.module.js";
import { loadResearch } from "../modules/research.module.js";
import { loadSkills } from "../modules/skill.module.js";
import { loadEducation } from "../modules/education.module.js";
import { loadCertifications } from "../modules/certification.module.js";
import { initializeResumeDownload } from "../modules/resume.module.js";
import { initializeContactButton } from "../modules/contact.module.js";
import "./admin-entry.js";

/**
 * KAI OS Application Entry Point
 */

async function initializeApp() {

    console.log("🚀 KAI OS Starting...");

    initializeRouter();

    await loadProfile();

    await loadProjects();

    await loadResearch();

    await loadSkills();

    await loadEducation();

    await loadCertifications();

    initializeResumeDownload();

    initializeContactButton();

    console.log("✅ KAI OS Ready");

}

// Start Application
initializeApp();