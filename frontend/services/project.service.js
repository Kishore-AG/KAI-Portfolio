import { apiRequest } from "./api.js";

export async function getProjects() {
    return await apiRequest("/projects/");
}