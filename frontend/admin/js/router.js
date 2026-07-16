import { getToken } from "../services/auth.js";

export function protectDashboard() {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";

    }

}