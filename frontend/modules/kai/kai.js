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
  sendButton.addEventListener("click", sendMessage);

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      inputBox.value = chip.dataset.question;

      sendMessage();
    });
  });
}

function welcomeMessage() {
  addAssistantMessage(
    "Hello! I'm KAI, Kishore's AI assistant. How can I help you today?",
    false
  );
}

async function typeHtml(element, htmlContent, speed = 15) {
  const temp = document.createElement("div");
  temp.innerHTML = htmlContent;
  element.innerHTML = "";

  async function typeNode(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const textNode = document.createTextNode("");
      parent.appendChild(textNode);
      for (let i = 0; i < text.length; i++) {
        textNode.textContent += text[i];
        scrollBottom();
        await new Promise((r) => setTimeout(r, speed));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      parent.appendChild(clone);
      for (const child of node.childNodes) {
        await typeNode(child, clone);
      }
    }
  }

  for (const child of temp.childNodes) {
    await typeNode(child, element);
  }
}

async function addAssistantMessage(message, animate = true) {
  const bubble = document.createElement("div");
  bubble.className = "kai-message assistant";
  chatContainer.appendChild(bubble);
  scrollBottom();

  const formatted = formatAssistantMessage(message);

  if (animate) {
    await typeHtml(bubble, formatted, 12);
  } else {
    bubble.innerHTML = formatted;
    scrollBottom();
  }
}

function formatAssistantMessage(message) {
  const escapedMessage = escapeHtml(String(message ?? ""));
  const lines = escapedMessage.split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];
  let listType = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(`<p>${formatInlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push(
        `<${listType}>${list.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join("")}</${listType}>`,
      );
      list = [];
      listType = null;
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const heading = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
    const unorderedItem = trimmedLine.match(/^[-*+]\s+(.+)$/);
    const orderedItem = trimmedLine.match(/^\d+[.)]\s+(.+)$/);

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      return;
    }

    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length + 1;
      blocks.push(`<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextListType = unorderedItem ? "ul" : "ol";
      if (listType && listType !== nextListType) flushList();
      listType = nextListType;
      list.push((unorderedItem || orderedItem)[1]);
      return;
    }

    flushList();
    paragraph.push(trimmedLine);
  });

  flushParagraph();
  flushList();

  return blocks.join("");
}

function formatInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    await addAssistantMessage(actionReply);
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to contact KAI.");
    }

    const data = await response.json();
    removeTyping();
    
    // Type out the message while keeping loading state active (input disabled)
    await addAssistantMessage(data.response);
    
    setLoading(false);
  } catch (error) {
    removeTyping();
    await addAssistantMessage("⚠️ Sorry, I'm unable to respond right now.");
    setLoading(false);
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

export async function askKAIAbout(type, id, question = "") {
  document.dispatchEvent(new CustomEvent("kai:open"));

  document.getElementById("home").scrollIntoView({
    behavior: "smooth",
  });

  addUserMessage(question);

  showTyping();

  try {
    const response = await fetch(
      `${API_URL.replace("/chat", "/explain")}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          type,

          id,
        }),
      },
    );

    const data = await response.json();
    removeTyping();
    await addAssistantMessage(data.response);
  } catch (error) {
    removeTyping();
    await addAssistantMessage("⚠️ Unable to explain this item.");
    console.error(error);
  }
}
