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

    /** @type {number} */ #page = 0;
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
        this.#loadingIndicator = this.shadowRoot.getElementById('loading-indicator');
    }

    /**
     * Update the query to execute.
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

    async #executeQuery() {
        this.#resultMessage.innerHTML = '';
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
            this.#resultBody.innerHTML = '';
            this.#resultHeader.innerHTML = '';


            // Stats
            this.#resultStats.innerHTML = `<span class="mx-2">Resultaten: <strong>${this.#offset + 1} - ${this.#offset + this.#limit}</strong></span>
                                     <span class="mx-2">Totaal: <strong>${result.count}</strong></span>
                                     <span class="mx-2">Pagina: <strong>${this.#page + 1}/${this.#pageCount}</strong></span>`;

            // Create table to display results
            for (let header in result.headers) {
                const headerElement = document.createElement('th');
                const headerValue = result.headers[header];
                headerElement.innerHTML = headerValue;
                this.#resultHeader.appendChild(headerElement);
            }

            for (const row of result.data) {
                const tableRow = document.createElement('tr');
                for (const column of Object.values(row)) {
                    const tableElement = document.createElement('td');
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
                element.innerHTML = '';
            }
            return;
        }

        // Calculate min & max pages to show based on range
        let start = this.#page + 1 - PAGINATION_RANGE;
        let end = start + 2 * PAGINATION_RANGE;
        if (start <= 1) {
            start = 1;
            end = start + 2 * PAGINATION_RANGE;
        } else if (end >= this.#pageCount) {
            end = this.#pageCount;
            start = (this.#pageCount - PAGINATION_RANGE * 2);
        }
        start = Math.max(0, start);
        end = Math.min(this.#pageCount, end);

        for (const element of paginationElements) {
            const pagination = createPagination(start, end, this.#page, this.#pageCount);
            element.innerHTML = pagination.outerHTML;
        };
    }

    set loading(newValue) {
        this.#loading = newValue;
        this.#loadingIndicator.style.display = newValue ? 'block' : 'none';
    }

    get loading() {
        return this.#loading;
    }
}

customElements.define('query-result', QueryResult);


function createPagination(start, end, selectedPage, pageCount) {
    const element = document.createElement('div');
    element.className = 'input-group';
    element.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == 0 ? 'disabled' : ''}" title="Eerste">
            &laquo;
        </a>`;
    element.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == 0 ? 'disabled' : ''}" title="Vorige">
            &lt;
        </a>`;


    for (let i = start; i <= end; i++) {
        element.innerHTML += `
            <a role="button" class="btn btn-outline-secondary ${i == selectedPage + 1 ? 'active' : ''}" title="Pagina ${i}">
                ${i}
            </a>`;
    }
    element.innerHTML += `<a role="button" class="btn btn-outline-secondary ${selectedPage == pageCount - 1 ? 'disabled' : ''}" title="Volgende">
            &gt;
        </a>`;
    element.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == pageCount - 1 ? 'disabled' : ''}" title="Laatste">
            &raquo;
        </a>`;
    const limitSelect = document.createElement('select');
    limitSelect.className = 'form-control form-select';
    limitSelect.addEventListener('change', () => {
        // TODO: Reimplement
        // selectedLimit = element.options[element.selectedIndex].value;
        // selectedPage = 0;
    });
    LIMIT_OPTIONS.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerHTML = option;
        // TODO: Reimplement
        // if (selectedLimit == option) {
        //     optionElement.setAttribute('selected', 'selected');
        // }
        limitSelect.appendChild(optionElement);
    });
    element.appendChild(limitSelect);
    return element;
}

function previousPage() {
    selectedPage--;
    executeQuery();
}

function nextPage() {
    selectedPage++;
    executeQuery();
}

function openPage(pageNum) {
    selectedPage = pageNum - 1;
    executeQuery();
}

function openLastPage() {
    selectedPage = pageCount - 1;
    executeQuery();
}