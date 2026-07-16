export function initializeContactButton() {

    const button = document.getElementById("contact-btn");

    if (!button) return;

    button.addEventListener("click", () => {

        const contactSection =
            document.getElementById("contact");

        if (contactSection) {

            contactSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

}