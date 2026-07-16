export function renderTable(config, data) {

    if (!Array.isArray(data) || data.length === 0) {

        return `
            <h2>${config.title}</h2>
            <p>No records found.</p>
        `;

    }

    const headers = config.columns
        .map(column => `<th>${column.label}</th>`)
        .join("");

    const rows = data
        .map(item => {

            const cells = config.columns
                .map(column => {

                    let value = item[column.key];

                    switch (column.type) {

                        case "boolean":

                            value = value
                                ? "🟢 Yes"
                                : "🔴 No";
                            break;

                        case "email":

                            value = `
                                <a href="mailto:${value}">
                                    ${value}
                                </a>
                            `;
                            break;

                        case "url":

                            value = value
                                ? `<a href="${value}" target="_blank">Open</a>`
                                : "";
                            break;

                        case "image":

                            value = value
                                ? `<img src="${value}" width="50">`
                                : "";
                            break;

                        default:

                            value = value ?? "";

                    }

                    return `<td>${value}</td>`;

                })
                .join("");

            return `

                <tr>

                    ${cells}

                    <td>

                        <button
                            class="edit-btn"
                            data-id="${item.id}"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${item.id}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        })
        .join("");

    return `

        <h2>${config.title}</h2>

        <button id="create-btn">

            Add New

        </button>

        <br><br>

        <table border="1" cellpadding="10">

            <thead>

                <tr>

                    ${headers}

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}