import {
    login,
    saveToken
} from "../services/auth.js";

const form = document.getElementById("login-form");

const message = document.getElementById("login-message");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    try {

        const data = await login(
            username,
            password
        );

        saveToken(data.access_token);

        message.textContent = "Login Successful";

        window.location.href = "index.html";

    }

    catch (error) {

        message.textContent = error.message;

    }

});