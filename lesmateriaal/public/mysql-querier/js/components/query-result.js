import { runQuery } from "../api.js";

const PAGINATION_RANGE = 2;
const LIMIT_OPTIONS = [100, 200, 500, 1000];

export default class QueryResult extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLElement} */ #resultMessage;
    /** @type {HTMLElement} */ #resultContainer;
    /** @type {HTMLElement} */ #resultHeader;
    /** @type {HTMLElement} */ #resultBody;
    /** @type {HTMLElement} */ #resultStats;
    /** @type {HTMLElement} */ #loadingIndicator;

    /** @type {boolean} */ #loading = false;

    /** @type {string} */ #query;
    /** @type {string} */ #database;
    /** @type {boolean} */ #readonly;
    /** @type {number} */ #offset = 0;
    /** @type {number} */ #limit = 100;

    /** @type {number} */ #activePage = 0;
    /** @type {number} */ #pageCount = 0;


    constructor() {
        super();
        this.#template = document.getElementById("template-query-result");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
        this.#resultMessage = this.shadowRoot.getElementById("result-message");
        this.#resultContainer = this.shadowRoot.getElementById("result-container");
        this.#resultHeader = this.shadowRoot.getElementById("result-header");
        this.#resultBody = this.shadowRoot.getElementById("result-body");
        this.#resultStats = this.shadowRoot.getElementById("result-stats");
        this.#loadingIndicator = this.shadowRoot.getElementById("loading-indicator");
    }

    /**
     * Updates the query to execute.
     * @param {string} query
     * @param {string} database
     * @param {boolean} readonly
     */
    updateQuery(query, database, readonly) {
        this.#query = query;
        this.#database = database;
        this.#readonly = readonly;
        this.#executeQuery();
    }

    /**
     * Nagivates to a specific page.
     * @param {number} pageNumber The page to navigate to
     */
    navigateToPage(pageNumber) {
        console.info("Navgiate to page", pageNumber);
        this.#activePage = pageNumber;
        this.#executeQuery();
    }

    async #executeQuery() {
        this.#resultMessage.innerHTML = "";
        this.loading = true;
        try {
            const result = await runQuery(this.#query, this.#database, this.#readonly, this.#limit, this.#offset, "json");
            if (result != null) this.#pageCount = Math.ceil(result.count / this.#limit); // Update page count
            this.#displayResult(result)
        } catch (e) {
            this.#displayError(e.message);
        }
        this.loading = false;
    }

    #displayResult(result) {
        if (result == null) {
            this.#resultMessage.innerHTML = `<div class="alert alert-success" role="alert">Query succesvol uitgevoerd, geen resultaten.</div>`;
        } else {
            this.#resultBody.innerHTML = "";
            this.#resultHeader.innerHTML = "";

            // Stats
            this.#resultStats.innerHTML = `<span class="mx-2">Resultaten: <strong>${this.#offset + 1} - ${this.#offset + this.#limit}</strong></span>
                                     <span class="mx-2">Totaal: <strong>${result.count}</strong></span>
                                     <span class="mx-2">Pagina: <strong>${this.#activePage + 1}/${this.#pageCount}</strong></span>`;

            // Create table to display results
            for (let header in result.headers) {
                const headerElement = document.createElement("th");
                const headerValue = result.headers[header];
                headerElement.innerHTML = headerValue;
                this.#resultHeader.appendChild(headerElement);
            }

            for (const row of result.data) {
                const tableRow = document.createElement("tr");
                for (const column of Object.values(row)) {
                    const tableElement = document.createElement("td");
                    tableElement.innerHTML = column.toLocaleString();
                    tableRow.appendChild(tableElement);
                }
                this.#resultBody.appendChild(tableRow);
            }

            this.#displayPagination();
        }
    }

    #displayError(message) {
        this.#resultMessage.innerHTML =
            `<div class="alert alert-danger" role="alert">
                <strong>Error:</strong> ${message}
            </div>`;
    }

    #displayPagination() {
        const paginationElements = this.shadowRoot.querySelectorAll(".result-pagination");
        if (this.#pageCount == 0) {
            for (const element of paginationElements) {
                element.innerHTML = "";
            }
            return;
        }

        // Calculate min & max pages to show based on range
        let start = this.#activePage  - PAGINATION_RANGE;
        let end = start + 2 * PAGINATION_RANGE;
        if (start <= 0) {
            start = 0;
            end = start + 2 * PAGINATION_RANGE;
        } else if (end >= this.#pageCount) {
            end = this.#pageCount;
            start = (this.#pageCount - PAGINATION_RANGE * 2);
        }
        start = Math.max(0, start);
        end = Math.min(this.#pageCount, end);

        for (const element of paginationElements) {
            const pagination = this.#createPagination(start, end, this.#activePage, this.#pageCount);
            element.innerHTML = '';
            element.appendChild(pagination);
        };
    }

    #createPagination(start, end) {
        const group = document.createElement("div");
        group.className = "input-group";

        const onFirst = this.#activePage == 0;
        const onLast = this.#activePage == this.#pageCount - 1;

        group.appendChild(createPaganationButton("Eerste", "&laquo;", () => this.navigateToPage(0), onFirst));
        group.appendChild(createPaganationButton("Vorige", "&lt;", () => this.navigateToPage(this.#activePage - 1), onFirst));
        for (let i = start; i <= end; i++) {
            group.appendChild(createPaganationButton(`Pagina ${i + 1}`, `${i + 1}`, () => this.navigateToPage(i), false, i == this.#activePage + 1));
        }
        group.appendChild(createPaganationButton("Volgende", "&gt;", () => this.navigateToPage(this.#activePage + 1), onLast));
        group.appendChild(createPaganationButton("Laatste", "&raquo;", () => this.navigateToPage(this.pageCount - 1), onLast));


        const limitSelect = document.createElement("select");
        limitSelect.className = "form-control form-select";
        limitSelect.addEventListener("change", (e) => {
            const newLimit = e.target.value;
            console.info("Set limit to", newLimit);
            this.#limit = newLimit;
            this.#activePage = 0;
            this.#executeQuery();
        });
        for (const limit of LIMIT_OPTIONS) {
            const option = document.createElement("option");
            option.value = limit;
            option.innerHTML = limit;
            if (this.#limit == option) {
                option.setAttribute("selected", "selected");
            }
            limitSelect.appendChild(option);
        }
        group.appendChild(limitSelect);

        return group;
    }

    set loading(newValue) {
        this.#loading = newValue;
        this.#loadingIndicator.style.display = newValue ? "block" : "none";
    }

    get loading() {
        return this.#loading;
    }
}

customElements.define("query-result", QueryResult);


/**
 * Helper function to create pagination buttons.
 * @param {string} title Text displayed when hovering over button
 * @param {string} content HTML content displayed on button
 * @param {() => void} onclick Button click callback
 * @param {boolean} disabled If the button is disabled
 * @param {boolean} active If the button is active, defaults to false
 * @returns {HTMLElement} A button element
 */
function createPaganationButton(title, content, onclick, disabled, active = false) {
    const button = document.createElement("a");
    button.role = "button";
    button.classList.add("btn", "btn-outline-secondary");
    if (active) {
        button.classList.add("active");
    }
    button.title = title;
    if (disabled) {
        button.setAttribute("disabled", disabled);
    }
    button.innerHTML = content;
    button.addEventListener('click', onclick);
    return button;
}
