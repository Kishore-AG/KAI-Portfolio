import { apiRequest } from "./api.js";

export async function getResearch() {
    return await apiRequest("/research/");
}