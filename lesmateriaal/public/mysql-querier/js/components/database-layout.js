import { getLayout } from "../api.js";

export default class DatabaseLayout extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLElement} */ #databaseLayout;

    constructor() {
        super();
        this.#template = document.getElementById("template-database-layout");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
        this.#databaseLayout = this.shadowRoot.getElementById("database-layout");
    }

    /**
     * Update the database layout
     * @param {string} database
     */
    updateLayout(database) {
        getLayout(database).then((layout) => this.#displayLayout(layout)).catch(() => this.#clearLayout())
    }

    #displayLayout(layout) {
        if (layout.length == 0) {
            this.#databaseLayout.innerHTML = '<div class="alert alert-info" role="alert">Deze database heeft geen tabellen.</div>';
            return;
        }

        this.#databaseLayout.innerHTML = '';
        for (const table of layout) {
            const tableLayout = document.createElement('div');
            tableLayout.className = 'd-flex flex-wrap';

            const tableName = document.createElement('div');
            tableName.innerHTML = table.name;
            tableName.className = 'fw-bold';
            tableName.style.minWidth = '80px';
            tableName.style.padding = '2px 4px';
            tableName.style.margin = '3px'
            tableLayout.appendChild(tableName);

            for (const column of table.columns) {
                const columnInfo = document.createElement('span');
                columnInfo.className = 'border shadow-sm';
                columnInfo.style.padding = '2px 4px';
                columnInfo.style.margin = '3px'
                columnInfo.innerHTML = `${column[0]} <small class="text-muted">(${column[1].toUpperCase()})</small>`;
                tableLayout.appendChild(columnInfo);
            }
            this.#databaseLayout.appendChild(tableLayout);
        }
    }

    #clearLayout() {
        this.#databaseLayout.innerHTML = '';
    }
}

customElements.define('database-layout', DatabaseLayout);
