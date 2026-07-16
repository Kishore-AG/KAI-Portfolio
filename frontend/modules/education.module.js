import { getEducation } from "../services/education.service.js";
import { state } from "../js/state.js";

export async function loadEducation() {

    try {

        const education = await getEducation();

        state.education = education;

        renderEducation(education);

        console.log("✅ Education Rendered");

    }

    catch (err) {

        console.error("Education Error:", err);

    }

}

function renderEducation(education) {

    const container = document.getElementById("education-grid");

    container.innerHTML = "";

    if (!education.length) {

        container.innerHTML = "<p>No Education Available</p>";

        return;

    }

    education.forEach(item => {

        container.innerHTML += createEducationCard(item);

    });

}

function createEducationCard(item) {

    return `

    <div class="education-card">

        <div class="education-icon">🎓</div>

        <div class="education-content">

            <h3 class="education-degree">
                ${item.degree}
            </h3>

            <h4 class="education-field">
                ${item.description}
            </h4>

            <p class="education-college">
                ${item.institution}
            </p>

            <div class="education-meta">

                <span>

                    ${item.start_year} - ${item.end_year}

                </span>

                <span>

                    ${item.status}

                </span>

                <span>

                    Grade : ${item.grade}

                </span>

            </div>

        </div>

    </div>

    `;

}