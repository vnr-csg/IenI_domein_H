import DatabaseSelect from "./components/database-select.js";
import DatabaseLayout from "./components/database-layout.js";
import QueryHistory from "./components/query-history.js";
import QueryResult from "./components/query-result.js";
import { downloadFile, runQuery } from "./api.js";

/** @type {QueryHistory} */ const queryHistory = document.querySelector('query-history');
/** @type {DatabaseSelect} */ const databaseSelect = document.querySelector('database-select');
/** @type {DatabaseLayout} */ const databaseLayout = document.querySelector('database-layout');
/** @type {QueryResult} */ const queryResult = document.querySelector('query-result');

/** @type {HTMLInputElement} */ const readonlyCheckbox = document.getElementById('readonly-checkbox');
/** @type {HTMLElement} */ const runButton = document.getElementById('run-button');
/** @type {HTMLElement} */ const exportButton = document.getElementById('export-button');
/** @type {HTMLElement} */ const exportCsvButton = document.getElementById('export-csv');
/** @type {HTMLElement} */ const exportJsonButton = document.getElementById('export-json');
/** @type {HTMLElement} */ const resetButton = document.getElementById('reset-query');

function updateButtons() {
    runButton.disabled = databaseSelect.selected == null;
    exportButton.disabled = databaseSelect.selected == null;
}

databaseSelect.addEventListener('select', (e) => {
    const database = e.detail;
    databaseLayout.loadLayout(database);
    updateButtons();
});
runButton.addEventListener('click', () => {
    const input = window.editor.getValue();
    queryResult.updateQuery(input, databaseSelect.selected, readonlyCheckbox.checked);
});
queryResult.addEventListener('result', (e) => {
    const result = e.detail;
    queryHistory.addQueryResult(result);
    if (result.success && !result.count) { // Databases or tables might have been changed
        console.info("Update datbases & layout");
        databaseSelect.load();
        databaseLayout.reload();
        updateButtons();
    }
})
resetButton.addEventListener('click', async () => {
    const input = window.editor.getValue();
    await navigator.clipboard.writeText(input); // Save input to clipboard
    window.editor.setValue('');
});
queryHistory.addEventListener('restore', (e) => {
    window.editor.setValue(e.detail);
});


async function exportToFile(format) {
    const result = await runQuery(queryResult.query, queryResult.database, true, null, 0, format);
    const data = format != "csv" ? JSON.stringify(result.data) : result.data;
    downloadFile(data, format == "csv" ? "text/csv" : "application/json", `export.${format}`);
}

exportCsvButton.addEventListener('click', () => exportToFile("csv"));
exportJsonButton.addEventListener('click', () => exportToFile("json"));