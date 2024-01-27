import { getDatabases, getLayout, runQuery, downloadFile } from "./api.js";
import QueryHistory from "./components/history.js";

// Elements

const dbSelect = document.getElementById('db-select');
const queryInput = document.getElementById('query-input');
queryInput.addEventListener('input', () => updateButtons());
const readonlyCheckbox = document.getElementById('readonly-checkbox');
const runButton = document.getElementById('run-button');
runButton.addEventListener('click', () => executeQuery(true))
const exportButton = document.getElementById('export-button');

const layoutContainer = document.getElementById('layout-container');
const resultContainer = document.getElementById('result-container');
const resultInfoContainer = document.getElementById('result-info-container');
const resultStats = document.getElementById('result-stats');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingMsg = document.getElementById('loading-msg');

function displayDatabases(dbList) {
    let hasSelected = false;
    dbSelect.innerHTML = '';
    dbList.forEach(dbName => {
        let optionElement = document.createElement('option');
        optionElement.value = dbName;
        optionElement.innerHTML = dbName;
        if (selectedDatabase == dbName) {
            optionElement.setAttribute('selected', 'selected');
            hasSelected = true;
        }
        dbSelect.appendChild(optionElement);
    });
    let defaultOptionElement = document.createElement('option');
    defaultOptionElement.setAttribute('disabled', 'disabled');
    if (!hasSelected) {
        defaultOptionElement.setAttribute('selected', 'selected');
    }
    defaultOptionElement.setAttribute('hidden', 'hidden');
    dbSelect.prepend(defaultOptionElement);
    defaultOptionElement.innerHTML = 'kies database';

}

function displayLayout(layout) {
    if (layout.length == 0) {
        layoutContainer.innerHTML = '<div class="alert alert-info" role="alert">Deze database heeft geen tabellen.</div>';
        return;
    }

    layoutContainer.innerHTML = '';
    layout.forEach(tableInfo => {
        const tableInfoContainer = document.createElement('div');
        tableInfoContainer.className = 'd-flex flex-wrap';

        const headerElement = document.createElement('div');
        headerElement.innerHTML = tableInfo.name;
        headerElement.className = 'fw-bold';
        headerElement.style.minWidth = '80px';
        headerElement.style.padding = '2px 4px';
        headerElement.style.margin = '3px'
        tableInfoContainer.appendChild(headerElement);

        tableInfo.columns.forEach(colInfo => {
            const colName = colInfo[0];
            const colType = colInfo[1];
            const tableInfo = document.createElement('span');
            tableInfo.className = 'border shadow-sm';
            tableInfo.style.padding = '2px 4px';
            tableInfo.style.margin = '3px'
            tableInfo.innerHTML = `${colName} <small class="text-muted">(${colType.toUpperCase()})</small>`;
            tableInfoContainer.appendChild(tableInfo);
        });

        layoutContainer.appendChild(tableInfoContainer);
    });
}

function clearLayout() {
    layoutContainer.innerHTML = '';
}

customElements.define('query-history', QueryHistory);

const queryHistory = document.querySelector('query-history');

let selectedDatabase = null;
let lastQuerySucces = false;

// Pagination
let limit = 100;
let offset = 0;
let page = 0;
let pageCount = 0;




function updateButtons() {
    runButton.disabled = selectedDatabase == null || queryInput.value == '';
    exportButton.disabled = selectedDatabase == null || !lastQuerySucces;
}

function updateDatabases() {
    getDatabases().then((dbs) => displayDatabases(dbs))
}

function updateLayout() {
    getLayout(selectedDatabase)
        .then((layout) => displayLayout(layout))
        .catch(() => clearLayout()); // This fails when a database is dropped: clear the layout then
}

function openDatabase(dbSelect) {
    if (dbSelect.selectedIndex == 0) {
        return;
    }
    const dbName = dbSelect.options[dbSelect.selectedIndex].value;
    selectedDatabase = dbName;
    selectedPage = 0;
    pageCount = 0;
    updateButtons();
    updateLayout();
}


async function executeQuery(changedInput) {
    if (changedInput) {
        selectedPage = 0;
    }
    resultContainer.innerHTML = "";
    displayLoading(true, 'Je query wordt uitgevoerd..');

    const readonly = readonlyCheckbox.checked;

    let result;
    try {
        result = runQuery(queryInput.value, selectedDatabase, readonly, selectedLimit, 0);
    } catch (e) {
        lastQuerySucces = false;
        queryHistory.addQueryResult({
            query: query,
            success: false,
            count: null,
        });
        displayResult({
            "success": false,
            "hasData": false,
            "error": `API communicatie mislukt, code: ${response.status}, bericht: ${await response.text()}`
        });
        return;
    }

    lastQuerySucces = true;
    queryHistory.addQueryResult({
        query: query,
        success: true,
        count: queryResult.count ?? null,
    });

    pageCount = queryResult.pageCount;
    displayResult(queryResult);
    if (!result.data && !readonly) {
        // Layout may have been changed, update UI to reflect that
        updateDatabases();
        updateLayout();
    }
    updateButtons();
}


// Callbacks

async function resetQuery() {
    await navigator.clipboard.writeText(queryInput.value);
    queryInput.value = '';
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

function restoreQuery(query) {
    queryInput.value = query;
    selectedPage = 0;
}

// View

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


updateDatabases();