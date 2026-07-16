export const API_BASE_URL = "https://kai-portfolio-4kbr.onrender.com/";

export async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },

        ...options

    });

    if (!response.ok) {

        throw new Error(`API Error: ${response.status}`);

    }

    return response.json();

}