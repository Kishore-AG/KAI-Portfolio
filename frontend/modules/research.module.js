import { getResearch } from "../services/research.service.js";
import { state } from "../js/state.js";
import { askKAIAbout } from "./kai/kai.js";

window.askKAIAbout = askKAIAbout;

export async function loadResearch() {

    try {

        const research = await getResearch();

        state.research = research;

        renderResearch(research);

        console.log("✅ Research Rendered");

    }

    catch (err) {

        console.error("Research Error:", err);

    }

}

function renderResearch(research) {

    const container = document.getElementById("research-grid");

    container.innerHTML = "";

    if (!research.length) {

        container.innerHTML = "<p>No Research Available</p>";

        return;

    }

    research.forEach(item => {

        container.innerHTML += createResearchCard(item);

    });

}

function createResearchCard(item) {

    return `

    <article class="research-card">

        <div class="research-content">

            <span class="research-category badge badge-primary">
                ${item.field}
            </span>

            <h3 class="research-title">
                ${item.title}
            </h3>

            <p class="research-description">
                ${item.description}
            </p>

            <div class="research-tech">

                ${
                    item.technologies
                        ? item.technologies
                            .split(",")
                            .map(
                                tech =>
                                    `<span class="chip">${tech.trim()}</span>`
                            )
                            .join("")
                        : ""
                }

            </div>

            <div class="research-footer">

                <div class="research-date">
                    ${item.publication_year}
                </div>

                <div class="research-actions">

                    <button
                        class="btn btn-secondary"
                        onclick="${
                            item.paper_url && item.paper_url !== "string"
                                ? `window.open('${item.paper_url}','_blank')`
                                : ""
                        }"
                    >
                        View Details
                    </button>

                    ${
                        item.ask_kai_enabled
                            ? `<button
    class="btn btn-primary"
    onclick="askKAIAbout(
        'research',
        ${item.id},
        'Explain the research titled ${item.title}')"
>
    Ask KAI
</button>`
                            : ""
                    }

                </div>

            </div>

        </div>

    </article>

    `;

}