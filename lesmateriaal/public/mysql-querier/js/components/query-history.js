export default class QueryHistory extends HTMLElement {
    /** @type {Array<Object>} */ #history;
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLElement} */ #tableBody;

    constructor() {
        super();
        this.#history = new Array();
        this.#template = document.getElementById("template-query-history");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
        this.#tableBody = this.shadowRoot.getElementById("query-history-body");
    }

    /**
     * Add item to query history
     * @param {Object} result The result to add to the history
     * @param {string} result.query The executed SQL code 
     * @param {boolean} result.success If the query ran successfully
     * @param {number} result.count The count of items
     */
    addQueryResult(result) {
        if (this.#history.length == 0) {
            this.#tableBody.innerHTML = "";
        }
        else if (JSON.stringify(result) == JSON.stringify(this.#history[this.#history.length - 1])) {
            return; // Avoid repeating entries
        }
        this.#history.push(result);
        this.#displayResult(result);
    }

    #displayResult(result) {
        const countString = result.count ? result.count.toLocaleString() : null;
        const historyRow = document.createElement('tr');
        historyRow.setAttribute('role', 'button');
        historyRow.title = 'Query herstellen';
        historyRow.setAttribute('data-bs-toggle', 'tooltip');
        historyRow.setAttribute('data-bs-placement', 'top');
        historyRow.innerHTML = `<td style="background-color: inherit;"><code>${result.query}</code></td><td style="background-color: inherit;">${countString ?? '-'}</td>`;
        historyRow.className = result.success ? 'bg-success-subtle' : 'bg-danger-subtle';
        historyRow.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('restore', { detail: result.query }));
        });
        this.#tableBody.appendChild(historyRow);
    }
}
customElements.define('query-history', QueryHistory);