import { handleAction } from "./actions.js";

const API_URL = "https://kai-portfolio-4kbr.onrender.com/kai/chat";

let chatContainer;
let inputBox;
let sendButton;

document.addEventListener("DOMContentLoaded", initializeKAI);

function initializeKAI() {

    chatContainer = document.getElementById("kai-chat");

    inputBox = document.getElementById("kai-input");

    sendButton = document.getElementById("kai-send");

    if (!chatContainer || !inputBox || !sendButton) {

        console.error("KAI UI not found.");

        return;

    }

    welcomeMessage();
    inputBox.focus();

    sendButton.addEventListener("click", sendMessage);

    inputBox.addEventListener("keydown", event => {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            sendMessage();

        }

    });

    document.querySelectorAll(".chip").forEach(chip => {

    chip.addEventListener("click", () => {

        inputBox.value = chip.dataset.question;

        sendMessage();

    });

});

}

function welcomeMessage() {

    addAssistantMessage("Hello! I'm KAI, Kishore's AI assistant. How can I help you today?");

}

function addAssistantMessage(message) {

    const bubble = document.createElement("div");

    bubble.className = "kai-message assistant";

    bubble.innerHTML = message.replace(/\n/g, "<br>");

    chatContainer.appendChild(bubble);

    scrollBottom();

}

function addUserMessage(message) {

    const bubble = document.createElement("div");

    bubble.className = "kai-message user";

    bubble.textContent = message;

    chatContainer.appendChild(bubble);

    scrollBottom();

}

function scrollBottom() {

    chatContainer.scrollTop = chatContainer.scrollHeight;

}

async function sendMessage() {

    const message = inputBox.value.trim();

    if (!message) return;

    addUserMessage(message);

    const actionReply = handleAction(message);

    if (actionReply) {

    addAssistantMessage(actionReply);

    inputBox.value = "";

    return;

}
    setLoading(true);

    inputBox.value = "";

    showTyping();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message

            })

        });

        if (!response.ok) {

            throw new Error("Unable to contact KAI.");

        }

        const data = await response.json();

        removeTyping();
        setLoading(false);

        addAssistantMessage(data.response);

    }

    catch (error) {

        removeTyping();
        setLoading(false);

        addAssistantMessage(

            "⚠️ Sorry, I'm unable to respond right now."

        );

        console.error(error);

    }

}

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "kai-message assistant";

    typing.id = "kai-typing";

    typing.innerHTML =

        "<span class='typing-dot'></span><span class='typing-dot'></span><span class='typing-dot'></span>";

    chatContainer.appendChild(typing);

    scrollBottom();

}

function removeTyping() {

    const typing = document.getElementById("kai-typing");

    if (typing) {

        typing.remove();

    }

}

function setLoading(isLoading) {

    inputBox.disabled = isLoading;

    sendButton.disabled = isLoading;

    sendButton.innerHTML = isLoading ? "⏳" : "➜";

    if (!isLoading) {

        inputBox.focus();

    }

}

export async function askKAIAbout(type, id, question="") {

    document
        .getElementById("home")
        .scrollIntoView({
            behavior: "smooth"
        });

    addUserMessage(question);

    showTyping();

    try {

        const response = await fetch(

            `${API_URL.replace("/chat", "/explain")}`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    type,

                    id

                })

            }

        );

        const data = await response.json();

        removeTyping();

        addAssistantMessage(data.response);

    }

    catch (error) {

        removeTyping();

        addAssistantMessage(

            "⚠️ Unable to explain this item."

        );

        console.error(error);

    }

}