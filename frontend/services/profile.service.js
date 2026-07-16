import { apiRequest } from "./api.js";

export async function getProfile() {
    return await apiRequest("/profile");
}