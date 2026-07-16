const ACTIONS = [

    {
        commands: [
            "show projects",
            "go to projects",
            "open projects",
            "move to projects",
            "navigate to projects"
        ],
        action: () => {
            document.getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "📁 Opening the Projects section..."
    },

    {
        commands: [
            "show skills",
            "go to skills",
            "open skills",
            "move to skills",
            "navigate to skills"
        ],
        action: () => {
            document.getElementById("skills")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "🛠️ Opening the Skills section..."
    },

    {
        commands: [
            "show research",
            "go to research",
            "open research",
            "move to research",
            "navigate to research"
        ],
        action: () => {
            document.getElementById("research")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "📚 Opening the Research section..."
    },

    {
        commands: [
            "show education",
            "go to education",
            "move to education",
            "open education"
        ],
        action: () => {
            document.getElementById("education")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "🎓 Opening the Education section..."
    },

    {
        commands: [
            "show certifications",
            "go to certifications",
            "move to certifications",
            "open certifications"
        ],
        action: () => {
            document.getElementById("certifications")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "🏆 Opening the Certifications section..."
    },

    {
        commands: [
            "contact",
            "move to contact",
            "open contact",
            "navigate to contact",
            "contact me",
            "show contact",
            "go to contact"
        ],
        action: () => {
            document.getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
        },
        reply: "📞 Opening the Contact section..."
    },

    {
        commands: [
            "download resume",
            "resume",
            "download cv"
        ],
        action: () => {
            document.getElementById("download-resume-btn")
                ?.click();
        },
        reply: "📄 Downloading my resume..."
    },

    {
        commands: [
            "open github",
            "github"
        ],
        action: () => {
            document.getElementById("contact-github")
                ?.click();
        },
        reply: "🔗 Opening my GitHub profile..."
    },

    {
        commands: [
            "open linkedin",
            "linkedin"
        ],
        action: () => {
            document.getElementById("contact-linkedin")
                ?.click();
        },
        reply: "💼 Opening my LinkedIn profile..."
    }

];

export function handleAction(message) {

    const text = message
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    const action = ACTIONS.find(item =>
        item.commands.includes(text)
    );

    if (!action) return null;

    action.action();

    return action.reply;

}