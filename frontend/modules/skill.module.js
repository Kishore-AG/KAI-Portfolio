import { getSkills } from "../services/skill.service.js";
import { state } from "../js/state.js";

export async function loadSkills() {

    try {

        const skills = await getSkills();

        state.skills = skills;

        renderSkills(skills);

        console.log("✅ Skills Rendered");

    }

    catch (err) {

        console.error("Skills Error:", err);

    }

}

function renderSkills(skills) {

    const container = document.getElementById("skills-grid");

    container.innerHTML = "";

    if (!skills.length) {

        container.innerHTML = "<p>No Skills Available</p>";

        return;

    }

    skills.forEach(skill => {

        container.innerHTML += createSkillCard(skill);

    });

}

function createSkillCard(skill) {

    const technologies = skill.technologies
        ? skill.technologies
            .split(",")
            .map(
                tech => `<span class="chip">${tech.trim()}</span>`
            )
            .join("")
        : "";

    return `

    <article class="skill-card">

        <h3 class="skill-title">

            ${skill.category}

        </h3>

        <div class="skill-list">

            ${technologies}

        </div>

    </article>

    `;

}