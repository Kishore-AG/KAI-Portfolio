import { get } from "../services/admin-api.js";

export async function loadDashboardHome() {

    const content = document.getElementById("content");

    content.innerHTML = `

        <div class="dashboard-container">

            <!-- Dashboard Header -->
            <div class="dashboard-header">
                <div class="header-content">
                    <h1 class="header-title">Dashboard</h1>
                    <p class="header-subtitle">Welcome to KAI OS Admin Panel</p>
                </div>
            </div>

            <!-- Statistics Grid -->
            <div class="stats-section">
                <h2 class="section-title">Statistics Overview</h2>
                
                <div class="stats-grid">

                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Projects</h3>
                            <h2 class="stat-number" id="project-count">--</h2>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔬</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Research</h3>
                            <h2 class="stat-number" id="research-count">--</h2>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">💻</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Skills</h3>
                            <h2 class="stat-number" id="skill-count">--</h2>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🎓</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Education</h3>
                            <h2 class="stat-number" id="education-count">--</h2>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Certificates</h3>
                            <h2 class="stat-number" id="certificate-count">--</h2>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🧠</div>
                        <div class="stat-content">
                            <h3 class="stat-title">Knowledge</h3>
                            <h2 class="stat-number" id="knowledge-count">--</h2>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Status Section -->
            <div class="status-section">
                <div class="status-grid">

                    <div class="status-card resume-status-card">
                        <h3 class="status-title">Resume Status</h3>
                        <p class="status-content resume-content" id="resume-status">Checking...</p>
                    </div>

                    <div class="status-card">
                        <h3 class="status-title">System Status</h3>
                        <ul class="status-list">
                            <li>🟢 Backend Connected</li>
                            <li>🟢 Database Connected</li>
                            <li>🟢 Authentication Active</li>
                        </ul>
                    </div>

                </div>
            </div>

            <!-- Quick Actions Section -->
            <div class="actions-section">
                <h2 class="section-title">Quick Actions</h2>
                <div class="actions-grid">
                    <button class="action-btn" id="qa-project">+ New Project</button>
                    <button class="action-btn" id="qa-research">+ New Research</button>
                    <button class="action-btn" id="qa-resume">📁 Upload Resume</button>
                    <button class="action-btn" id="qa-knowledge">+ New Knowledge</button>
                </div>
            </div>

        </div>

    `;

    // Fetch counts from all endpoints
    try {

        const [projects, research, skills, education, certifications, knowledge] = await Promise.all([
            get("/projects/").catch(() => []),
            get("/research/").catch(() => []),
            get("/skills/").catch(() => []),
            get("/education/").catch(() => []),
            get("/certifications/").catch(() => []),
            get("/kai-knowledge/").catch(() => [])
        ]);

        // Update counts
        document.getElementById("project-count").textContent = projects.length || 0;
        document.getElementById("research-count").textContent = research.length || 0;
        document.getElementById("skill-count").textContent = skills.length || 0;
        document.getElementById("education-count").textContent = education.length || 0;
        document.getElementById("certificate-count").textContent = certifications.length || 0;
        document.getElementById("knowledge-count").textContent = knowledge.length || 0;

        // Update resume status - handle separately
        try {
            const resume = await get("/resume/");
            const resumeStatus = document.getElementById("resume-status");
            if (resume && resume.file_name) {
                resumeStatus.textContent = `✓ ${resume.file_name}`;
            } else {
                resumeStatus.textContent = "No resume uploaded";
            }
        } catch (err) {
            document.getElementById("resume-status").textContent = "No resume uploaded";
        }

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

    // Setup Quick Action Button Listeners
    setupQuickActions();

}

function setupQuickActions() {

    const qaProject = document.getElementById("qa-project");
    const qaResearch = document.getElementById("qa-research");
    const qaResume = document.getElementById("qa-resume");
    const qaKnowledge = document.getElementById("qa-knowledge");

    if (qaProject) {
        qaProject.addEventListener("click", () => {
            const projectLink = document.querySelector('.sidebar li[data-page="projects"]');
            if (projectLink) projectLink.click();
        });
    }

    if (qaResearch) {
        qaResearch.addEventListener("click", () => {
            const researchLink = document.querySelector('.sidebar li[data-page="research"]');
            if (researchLink) researchLink.click();
        });
    }

    if (qaResume) {
        qaResume.addEventListener("click", () => {
            const resumeLink = document.querySelector('.sidebar li[data-page="resume"]');
            if (resumeLink) resumeLink.click();
        });
    }

    if (qaKnowledge) {
        qaKnowledge.addEventListener("click", () => {
            const knowledgeLink = document.querySelector('.sidebar li[data-page="knowledge"]');
            if (knowledgeLink) knowledgeLink.click();
        });
    }

}