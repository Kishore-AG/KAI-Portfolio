import { apiRequest } from "./api.js";

export async function getResume() {
    return await apiRequest("/resume");
}
