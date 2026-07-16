import { getToken } from "./auth.js";

const API_BASE_URL = "https://kai-portfolio-4kbr.onrender.com/";

async function request(endpoint, options = {}) {

    const token = getToken();

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            },
            ...options
        }
    );

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error);

    }

    return response;
}

export async function get(endpoint) {

    const response = await request(endpoint);

    return await response.json();

}

export async function post(endpoint, data) {

    const response = await request(endpoint, {

        method: "POST",

        body: JSON.stringify(data)

    });

    return await response.json();

}

export async function put(endpoint, data) {

    const response = await request(endpoint, {

        method: "PUT",

        body: JSON.stringify(data)

    });

    return await response.json();

}

export async function remove(endpoint) {

    const response = await request(endpoint, {

        method: "DELETE"

    });

    return await response.json();

}

export async function update(endpoint, data) {

    const response = await request(endpoint, {

        method: "PUT",

        body: JSON.stringify(data)

    });

    return await response.json();

}

export async function uploadFile(endpoint, file) {

    const token = getToken();

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(API_BASE_URL + endpoint, {

        method: "POST",

        headers: {

            Authorization: `Bearer ${token}`

        },

        body: formData

    });

    if (!response.ok) {

        throw new Error("Upload failed");

    }

    return await response.json();

}

export function downloadFile(endpoint) {

    window.open(API_URL + endpoint, "_blank");

}