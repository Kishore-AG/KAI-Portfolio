import { logout } from "../services/auth.js";
import { protectDashboard } from "./router.js";

import { loadProfileModule } from "../modules/profile.js";
import { renderCRUD } from "../components/crud.js";
import { loadProjectsModule } from "../modules/projects.js";
import { loadResearchModule } from "../modules/research.js";
import { loadSkillsModule } from "../modules/skills.js";
import { loadEducationModule } from "../modules/education.js";

import { loadCertificationsModule } from "../modules/certifications.js";
import { loadResumeModule } from "../modules/resume.js";
import { loadKnowledgeModule } from "../modules/kai-knowledge.js";
import { loadDashboardHome } from "../modules/dashboard-home.js";

protectDashboard();

/* Logout */

document
    .getElementById("logout-btn")
    .addEventListener("click", () => {

        logout();

        window.location.href = "login.html";

    });

/* Sidebar Navigation */

document
    .querySelectorAll(".sidebar li[data-page]")
    .forEach(item => {

        item.addEventListener("click", async () => {

            const content =
                document.getElementById("content");

            switch (item.dataset.page) {

                case "dashboard":

                    await loadDashboardHome();

                    break;

                case "profile":

                    await loadProfileModule();

                    break;

                case "projects":

                     await loadProjectsModule();

                break;

                case "research":

                     await loadResearchModule();

                break;

                case "skills":

                     await loadSkillsModule();

                break;

                case "education":

                     await loadEducationModule();

                break;

                case "certifications":

                     await loadCertificationsModule();

                    break;

                case "resume":

                    await loadResumeModule();

                break;

                case "knowledge":

                    await loadKnowledgeModule();    
                    break;

                default:

                    await loadDashboardHome();

            }

        });

    });

// Load dashboard on initial page load
window.addEventListener("DOMContentLoaded", async () => {

    await loadDashboardHome();

});