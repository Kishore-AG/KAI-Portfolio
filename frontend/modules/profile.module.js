import { getProfile } from "../services/profile.service.js";
import { state } from "../js/state.js";

export async function loadProfile() {
  try {
    const profile = await getProfile();
    state.profile = profile;

    // ── About section ─────────────────────────────────────────────────────
    const aboutAvatar = document.getElementById("about-avatar");
    if (aboutAvatar) {
      if (
        profile.avatar &&
        profile.avatar !== "string" &&
        profile.avatar.trim() !== ""
      ) {
        aboutAvatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" loading="lazy">`;
      } else {
        aboutAvatar.innerHTML = `<span>${profile.name.charAt(0)}</span>`;
      }
    }

    const aboutBio = document.getElementById("about-bio");
    if (aboutBio && profile.bio) aboutBio.textContent = profile.bio;

    const aboutName = document.getElementById("about-name");
    if (aboutName && profile.name) observeAboutName(aboutName, profile.name);

    const aboutLocation = document.getElementById("about-location");
    if (aboutLocation && profile.location)
      aboutLocation.textContent = profile.location;

    const aboutStatus = document.getElementById("about-status");
    if (aboutStatus) {
      aboutStatus.textContent = profile.available
        ? "Open to Opportunities"
        : "Not Available";
      if (!profile.available) {
        aboutStatus.classList.remove("available");
        aboutStatus.style.color = "var(--fg-muted)";
      }
    }

    // ── Contact channels ──────────────────────────────────────────────────
    const contactEmailLink = document.getElementById("contact-email");
    const contactEmailVal = document.getElementById("contact-email-val");
    if (contactEmailLink && profile.email) {
      contactEmailLink.href = `mailto:${profile.email}`;
      if (contactEmailVal) contactEmailVal.textContent = profile.email;
    }

    const contactGithub = document.getElementById("contact-github");
    if (contactGithub && profile.github) contactGithub.href = profile.github;

    const contactLinkedin = document.getElementById("contact-linkedin");
    if (contactLinkedin && profile.linkedin)
      contactLinkedin.href = profile.linkedin;

    // ── Mobile social links ────────────────────────────────────────────────
    const mobileGithub = document.getElementById("mobile-github");
    if (mobileGithub && profile.github) mobileGithub.href = profile.github;

    const mobileLinkedin = document.getElementById("mobile-linkedin");
    if (mobileLinkedin && profile.linkedin)
      mobileLinkedin.href = profile.linkedin;

    const mobileEmail = document.getElementById("mobile-email");
    if (mobileEmail && profile.email)
      mobileEmail.href = `mailto:${profile.email}`;

    // ── Availability status in contact ────────────────────────────────────
    const contactAvailText = document.getElementById(
      "contact-availability-text",
    );
    if (contactAvailText) {
      contactAvailText.textContent = profile.available
        ? "Actively Exploring Opportunities"
        : "Not Currently Available";
    }

    const contactAvailDot = document.getElementById("contact-availability-dot");
    if (contactAvailDot && !profile.available) {
      contactAvailDot.style.backgroundColor = "var(--coral)";
    }

    console.log("✅ Profile Rendered");
  } catch (err) {
    console.error("Profile Error:", err);
  }
}

function observeAboutName(element, name) {
  if (!("IntersectionObserver" in window)) {
    typeAboutName(element, name);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      typeAboutName(element, name);
    },
    { threshold: 0.5 },
  );

  observer.observe(element);
}

function typeAboutName(element, name) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = name;
    return;
  }

  element.textContent = "";
  element.classList.add("typewriter-name");

  let characterIndex = 0;
  const typeNextCharacter = () => {
    element.textContent = name.slice(0, characterIndex + 1);
    characterIndex += 1;

    if (characterIndex < name.length) {
      window.setTimeout(typeNextCharacter, 90);
    } else {
      window.setTimeout(() => element.classList.remove("typewriter-name"), 700);
    }
  };

  typeNextCharacter();
}
