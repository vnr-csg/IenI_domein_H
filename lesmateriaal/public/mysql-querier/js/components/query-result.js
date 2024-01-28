export default class QueryResult extends HTMLElement {
    /** @type {HTMLTemplateElement} */ #template;
    /** @type {Object | null} */ #result = null;
    /** @type {boolean} */ #loading = false;
    /** @type {HTMLElement} */ #resultHeader;
    /** @type {HTMLElement} */ #resultBody;

    constructor() {
        super();
        this.#template = document.getElementById("template-query-result");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
        this.#resultHeader = this.shadowRoot.getElementById("result-header");
        this.#resultBody = this.shadowRoot.getElementById("result-body");
    }

    /**
     * Update the result to display.
     * @param {Object} result
     */
    updateResult(databases) {
        // TODO: Implement
    }

    set loading(newValue) {
        this.#loading = newValue;
        // TODO: Update loading display
    }

    get loading() {
        return this.#loading;
    }
}

customElements.define('query-result', QueryResult);

// TODO: Reimplement pagination
let limit = 100;
let offset = 0;
let page = 0;
let pageCount = 0;

const layoutContainer = document.getElementById('layout-container');
const resultContainer = document.getElementById('result-container');
const resultInfoContainer = document.getElementById('result-info-container');
const resultStats = document.getElementById('result-stats');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingMsg = document.getElementById('loading-msg');

function displayResult(result) {
    displayLoading(false);
    if (result.success) {
        resultInfoContainer.style.display = '';
        resultContainer.innerHTML = '';
        if (!result.hasData) {
            resultContainer.innerHTML = `<div class="alert alert-success" role="alert">Query succesvol uitgevoerd, geen resultaten.</div>`;
        }
        else {
            // Stats
            resultStats.innerHTML = `<span class="mx-2">Resultaten: <b>${result.from + 1} - ${result.to}     </b></span>
                                        <span class="mx-2">Totaal: <b>${result.count}                           </b></span>
                                        <span class="mx-2">Pagina: <b>${selectedPage + 1}/${result.pageCount}   </b></span>`;

            // Table
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            for (let header in result.headers) {
                const headerElement = document.createElement('th');
                const headerValue = result.headers[header];
                headerElement.innerHTML = headerValue;
                headerRow.appendChild(headerElement);
            }
            tableHeader.appendChild(headerRow);
            const tableBody = document.createElement('tbody');
            for (let row in result.data) {
                const tableRow = document.createElement('tr');
                const rowVal = result.data[row];
                for (let col in rowVal) {
                    const tableElement = document.createElement('td');
                    const colVal = rowVal[col];
                    tableElement.innerHTML = colVal;
                    tableRow.appendChild(tableElement);
                }
                tableBody.appendChild(tableRow);
            }
            resultContainer.innerHTML += `<table class="table table-sm table-bordered table-striped">${tableHeader.outerHTML}${tableBody.outerHTML}</table>`;
        }
    }
    else {
        resultInfoContainer.style.display = 'none';
        resultContainer.innerHTML =
            ` <div class="alert alert-danger" role="alert">
                <strong>Error: </strong>
                ${result.error}
            </div>`;
    }
    displayPagination();
}

function displayPagination() {
    const navigationParents = document.getElementsByClassName('page-nav');
    if (pageCount > 1) {
        const range = 2;
        let start = selectedPage + 1 - range;
        let end = start + 2 * range;
        if (start <= 1) {
            start = 1;
            end = start + 2 * range;
        } else if (end >= pageCount) {
            end = pageCount;
            start = (pageCount - range * 2);
        }
        start = Math.max(0, start);
        end = Math.min(pageCount, end);

        for (let i = 0; i < navigationParents.length; i++) {
            const paginationElement = createPagination(start, end);
            navigationParents[i].innerHTML = '';
            navigationParents[i].appendChild(paginationElement);
        };
    } else {
        for (let i = 0; i < navigationParents.length; i++) {
            navigationParents[i].innerHTML = '';
        }
    }
}

function createPagination(start, end) {
    const paginationElement = document.createElement('div');
    paginationElement.className = 'input-group';
    paginationElement.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == 0 ? 'disabled' : ''}" onclick="openPage(1)" title="Eerste">
            &laquo;
        </a>`;
    paginationElement.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == 0 ? 'disabled' : ''}" onclick="previousPage()" title="Vorige">
            &lt;
        </a>`;


    for (let i = start; i <= end; i++) {
        paginationElement.innerHTML += `
            <a role="button" class="btn btn-outline-secondary ${i == selectedPage + 1 ? 'active' : ''}" onclick="openPage(${i})" title="Pagina ${i}">
                ${i}
            </a>`;
    }
    paginationElement.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == pageCount - 1 ? 'disabled' : ''}" onclick="nextPage()" title="Volgende">
            &gt;
        </a>`;
    paginationElement.innerHTML += `
        <a role="button" class="btn btn-outline-secondary ${selectedPage == pageCount - 1 ? 'disabled' : ''}" onclick="openLastPage()" title="Laatste">
            &raquo;
        </a>`;
    const limitOptions = [100, 200, 500, 1000];
    const limitSelect = document.createElement('select');
    limitSelect.className = 'form-control form-select';
    limitSelect.setAttribute('onchange', 'changeLimit(this)');
    limitOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerHTML = option;
        if (selectedLimit == option) {
            optionElement.setAttribute('selected', 'selected');
        }
        limitSelect.appendChild(optionElement);
    });
    paginationElement.appendChild(limitSelect);
    return paginationElement;
}

function displayLoading(value, msg) {
    loadingIndicator.style.display = value ? 'block' : 'none';
    loadingMsg.innerHTML = msg;
}
function changeLimit(element) {
    selectedLimit = element.options[element.selectedIndex].value;
    selectedPage = 0;
    executeQuery();
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