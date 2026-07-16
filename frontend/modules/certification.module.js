import { getCertifications } from "../services/certification.service.js";
import { state } from "../js/state.js";

export async function loadCertifications() {

    try {

        const certifications = await getCertifications();

        state.certifications = certifications;

        renderCertifications(certifications);

        console.log("✅ Certifications Rendered");

    }

    catch (err) {

        console.error("Certifications Error:", err);

    }

}

function renderCertifications(certifications) {

    const container =
        document.getElementById("certifications-grid");

    container.innerHTML = "";

    if (!certifications.length) {

        container.innerHTML =
            "<p>No Certifications Available</p>";

        return;

    }

    certifications.forEach(cert => {

        container.innerHTML +=
            createCertificateCard(cert);

    });

}

function createCertificateCard(cert) {

    return `

    <article class="certificate-card">

        <div class="certificate-content">

            <span class="certificate-provider">

                ${cert.issuer}

            </span>

            <h3 class="certificate-title">

                ${cert.title}

            </h3>

            <p class="certificate-date">

                Issued • ${cert.issue_year}

            </p>

            <span class="certificate-badge">

                ${cert.verified ? "✓ Verified" : "Pending"}

            </span>

            <div class="certificate-actions">

                <button
                    class="btn btn-secondary"
                    onclick="${
                        cert.certificate_url &&
                        cert.certificate_url !== "string"
                            ? `window.open('${cert.certificate_url}','_blank')`
                            : ""
                    }"
                >

                    View Certificate

                </button>

            </div>

        </div>

    </article>

    `;

}