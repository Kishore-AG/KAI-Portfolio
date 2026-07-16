import { apiRequest } from "./api.js";

export async function getSkills() {
    return await apiRequest("/skills/");
}