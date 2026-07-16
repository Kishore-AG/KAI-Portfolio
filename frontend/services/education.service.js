import { apiRequest } from "./api.js";

export async function getEducation() {
    return await apiRequest("/education/");
}