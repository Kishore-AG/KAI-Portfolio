import { getProfile } from "../services/profile.service.js";
import { state } from "../js/state.js";

export async function loadProfile() {

    try {

        const profile = await getProfile();

        state.profile = profile;

        // Name
        document.getElementById("profile-name").textContent =
            profile.name;

        // Availability
        const availability =
            document.getElementById("profile-availability");

        availability.innerHTML = `
            <span class="status-dot"></span>
            ${profile.available ? "Available for Opportunities" : "Currently Unavailable"}
        `;

        // Avatar
const avatar = document.getElementById("profile-avatar");

if (
    profile.avatar &&
    profile.avatar !== "string" &&
    profile.avatar.trim() !== ""
) {

    avatar.innerHTML = `
        <img src="${profile.avatar}" alt="${profile.name}">
    `;

} else {

    avatar.innerHTML = `
        <span>${profile.name.charAt(0)}</span>
    `;

}

        // Roles
        const roles =
            document.getElementById("profile-roles");

        roles.innerHTML = "";

        if (profile.title) {

            const li = document.createElement("li");

            li.textContent = profile.title;

            roles.appendChild(li);

        }

        // Contact Links
        const emailLink = document.getElementById("contact-email");
        if (emailLink && profile.email) {
            emailLink.href = `mailto:${profile.email}`;
        }

        const githubLink = document.getElementById("contact-github");
        if (githubLink && profile.github) {
            githubLink.href = profile.github;
        }

        const linkedinLink = document.getElementById("contact-linkedin");
        if (linkedinLink && profile.linkedin) {
            linkedinLink.href = profile.linkedin;
        }

        // Availability Status
        const availabilityText = document.getElementById("availability-text");
        if (availabilityText) {
            availabilityText.textContent = profile.available ? "Available" : "Unavailable";
        }

        // Bio
        const bioElement = document.getElementById("profile-bio");
        if (bioElement && profile.bio) {
            bioElement.textContent = profile.bio;
        }

        // Location
        const locationElement = document.getElementById("profile-location");
        if (locationElement && profile.location) {
            locationElement.textContent = profile.location;
        }

        console.log("✅ Profile Rendered");

    }

    catch (err) {

        console.error("Profile Error:", err);

    }

}