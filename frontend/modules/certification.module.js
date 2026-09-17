import { getCertifications } from "../services/certification.service.js";
import { state } from "../js/state.js";

export async function loadCertifications() {
  try {
    const certifications = await getCertifications();
    state.certifications = certifications;
    renderCertifications(certifications);
    console.log("✅ Certifications Rendered");
  } catch (err) {
    console.error("Certifications Error:", err);
    const container = document.getElementById("cert-archive");
    if (container) {
      container.innerHTML = `<p class="section-empty">Unable to load certifications.</p>`;
    }
  }
}

function renderCertifications(certifications) {
  const container = document.getElementById("cert-archive");
  if (!container) return;

  const loading = document.getElementById("certs-loading");
  if (loading) loading.remove();

  container.innerHTML = "";

  if (!certifications || !certifications.length) {
    container.innerHTML = `<p class="section-empty">No certifications listed yet.</p>`;
    return;
  }

  const sorted = [...certifications].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  sorted.forEach((cert, index) => {
    container.appendChild(createCertEntry(cert, index));
  });
}

function createCertEntry(cert, index) {
  const hasUrl =
    cert.certificate_url &&
    cert.certificate_url !== "string" &&
    cert.certificate_url.trim() !== "";

  const div = document.createElement("div");
  div.className = "cert-entry";
  div.setAttribute("data-reveal", "");
  div.setAttribute("tabindex", "0");
  div.setAttribute("role", "article");
  div.setAttribute("aria-label", `${cert.title} by ${cert.issuer}`);

  div.innerHTML = `
    <div class="cert-year">${cert.issue_year}</div>
    <div class="cert-body">
      <div class="cert-issuer">${cert.issuer}</div>
      <div class="cert-title">${cert.title}</div>
    </div>
    <div class="cert-actions">
      ${cert.verified ? `<span class="cert-verified" aria-label="Verified">✓ Verified</span>` : ""}
      ${
        hasUrl
          ? `<a
               href="${cert.certificate_url}"
               target="_blank"
               rel="noopener noreferrer"
               class="cert-arrow"
               aria-label="View certificate: ${cert.title}"
               onclick="event.stopPropagation()"
             >↗</a>`
          : `<span class="cert-arrow" aria-hidden="true">→</span>`
      }
    </div>
  `;

  if (hasUrl) {
    div.addEventListener("click", () => {
      window.open(cert.certificate_url, "_blank", "noopener,noreferrer");
    });
    div.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(cert.certificate_url, "_blank", "noopener,noreferrer");
      }
    });
  }

  return div;
}