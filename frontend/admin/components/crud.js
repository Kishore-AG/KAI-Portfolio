import { get, remove } from "../services/admin-api.js";
import { renderTable } from "./table.js";

export async function renderCRUD(config) {

    const content = document.getElementById("content");

    async function loadData() {

        let data = await get(config.endpoint);

        if (!Array.isArray(data)) {
            data = [data];
        }

        content.innerHTML = renderTable(config, data);

        bindDelete();
    }

    function bindDelete() {

        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this record?")) {
                        return;
                    }

                    await remove(
                        `${config.endpoint}${button.dataset.id}`
                    );

                    await loadData();

                });

            });

    }

    try {

        await loadData();

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `
            <h2>${config.title}</h2>
            <p>${error.message}</p>
        `;

    }

}