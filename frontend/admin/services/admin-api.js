import { getToken } from "./auth.js";

const API_BASE_URL = "https://kai-portfolio-4kbr.onrender.com";

async function request(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });

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

    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function put(endpoint, data) {
  const response = await request(endpoint, {
    method: "PUT",

    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function remove(endpoint) {
  const response = await request(endpoint, {
    method: "DELETE",
  });

  return await response.json();
}

export async function update(endpoint, data) {
  const response = await request(endpoint, {
    method: "PUT",

    body: JSON.stringify(data),
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
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.json();
}

export async function downloadFile(endpoint) {
  try {
    const response = await fetch(API_URL + endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.download_url) {
      throw new Error("Download URL not found.");
    }

    window.open(data.download_url, "_blank");
  } catch (error) {
    console.error("Resume download error:", error);

    alert("Unable to download resume.");
  }
}
