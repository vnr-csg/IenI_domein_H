import { getDatabases, getLayout, runQuery, downloadFile } from "./api.js";
import DatabaseSelect from "./components/database-select.js";
import DatabaseLayout from "./components/database-layout.js";
import QueryHistory from "./components/query-history.js";
import QueryResult from "./components/query-result.js";

// Components

/** @type {QueryHistory} */ const queryHistory = document.querySelector('query-history');
/** @type {DatabaseSelect} */ const databaseSelect = document.querySelector('database-select');
/** @type {DatabaseLayout} */ const databaseLayout = document.querySelector('database-layout');
/** @type {QueryResult} */ const queryResult = document.querySelector('query-result');

// Inputs

/** @type {HTMLInputElement} */ const queryInput = document.getElementById('query-input');
/** @type {HTMLInputElement} */ const readonlyCheckbox = document.getElementById('readonly-checkbox');
/** @type {HTMLElement} */ const runButton = document.getElementById('run-button');
/** @type {HTMLElement} */ const exportButton = document.getElementById('export-button');
/** @type {HTMLElement} */ const resetButton = document.getElementById('reset-query');

function updateButtons() {
    runButton.disabled = databaseSelect.selected == null || queryInput.value == '';
    exportButton.disabled = databaseSelect.selected == null;
}


async function executeQuery(changedInput) {
    if (changedInput) {
        selectedPage = 0;
    }
    queryResult.loading = true;

    let result;
    try {
        result = runQuery(queryInput.value, selectedDatabase, readonlyCheckbox.checked, selectedLimit, 0);
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
        // Database or tables may have been changed
        databaseSelect.updateDatabases();
        databaseLayout.updateLayout(databaseSelect.selected);
    }
    updateButtons();
}


// Events

databaseSelect.addEventListener('select', (e) => {
    const database = e.detail;
    databaseLayout.updateLayout(database);
});
queryInput.addEventListener('input', () => updateButtons());
runButton.addEventListener('click', () => executeQuery());
resetButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(queryInput.value); // Save input to clipboard
    queryInput.value = '';
});

// TODO: Restore query from history
function restoreQuery(query) {
    queryInput.value = query;
    selectedPage = 0;
}