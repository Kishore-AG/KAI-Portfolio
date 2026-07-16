const API_URL = "https://kai-portfolio-4kbr.onrender.com"

export async function login(username, password) {

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: formData

    });

    if (!response.ok) {

        throw new Error("Invalid username or password");

    }

    return await response.json();

}

export function saveToken(token) {

    localStorage.setItem("kai_admin_token", token);

}

export function getToken() {

    return localStorage.getItem("kai_admin_token");

}

export function logout() {

    localStorage.removeItem("kai_admin_token");

}