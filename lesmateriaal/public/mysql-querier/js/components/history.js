export default class QueryHistory extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {HTMLTemplateElement} */ #rowTemplate;
    /** @type {Array<any>} */ #history;
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
     * @param {number | null} result.count The count of results
     */
    addQueryResult(result) {
        if (this.#history.length == 0) {
            this.#tableBody.innerHTML = "";
        }
        this.#history.push(result);

        const historyRow = document.createElement('tr');
        historyRow.setAttribute('role', 'button');
        historyRow.title = 'Query herstellen';
        historyRow.setAttribute('data-bs-toggle', 'tooltip');
        historyRow.setAttribute('data-bs-placement', 'top');
        historyRow.innerHTML = `<td><code>${result.query}</code></td><td>${result.count ? result.count.toLocaleString() : '-'}</td>`;
        historyRow.className = result.success ? 'table-success' : 'table-danger';
        this.#tableBody.appendChild(historyRow);
    }
}