import { apiRequest } from "./api.js";

export async function getCertifications() {
    return await apiRequest("/certifications/");
}