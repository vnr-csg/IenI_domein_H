import { getDatabases } from "../api.js";

export default class DatabaseSelect extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLInputElement} */ #databaseSelect;
    /** @type {string | null} */ #selected = null;

    constructor() {
        super();
        this.#template = document.getElementById("template-database-select");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
        this.#databaseSelect = this.shadowRoot.getElementById("database-select");

        this.#databaseSelect.addEventListener('change', (event) => {
            this.#selected = event.target.value;
            console.info(`Selected database ${this.#selected}`);
            this.dispatchEvent(new CustomEvent('select', { detail: this.#selected }));
        });
        this.load();
    }

    /**
     * Update the database list
     */
    load() {
        getDatabases().then((databases) => this.#displayDatabases(databases))
    }

    #displayDatabases(databases) {
        this.#databaseSelect.innerHTML = '';
        let hasSelected = false;
        for (const database of databases) {
            let option = document.createElement('option');
            option.value = database;
            option.innerHTML = database;
            if (this.#selected == database) {
                option.setAttribute('selected', 'selected');
                hasSelected = true;
            }
            this.#databaseSelect.appendChild(option);
        }

        let defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', 'disabled');
        if (!hasSelected) {
            defaultOption.setAttribute('selected', 'selected');
        }
        defaultOption.setAttribute('hidden', 'hidden');
        defaultOption.innerHTML = 'kies database';
        this.#databaseSelect.prepend(defaultOption);
    }

    get selected() {
        return this.#selected;
    }
}
customElements.define('database-select', DatabaseSelect);