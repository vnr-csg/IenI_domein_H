import DatabaseSelect from "./components/database-select.js";
import DatabaseLayout from "./components/database-layout.js";
import QueryHistory from "./components/query-history.js";
import QueryResult from "./components/query-result.js";

/** @type {QueryHistory} */ const queryHistory = document.querySelector('query-history');
/** @type {DatabaseSelect} */ const databaseSelect = document.querySelector('database-select');
/** @type {DatabaseLayout} */ const databaseLayout = document.querySelector('database-layout');
/** @type {QueryResult} */ const queryResult = document.querySelector('query-result');

/** @type {HTMLInputElement} */ const readonlyCheckbox = document.getElementById('readonly-checkbox');
/** @type {HTMLElement} */ const runButton = document.getElementById('run-button');
/** @type {HTMLElement} */ const exportButton = document.getElementById('export-button');
/** @type {HTMLElement} */ const resetButton = document.getElementById('reset-query');

function updateButtons() {
    runButton.disabled = databaseSelect.selected == null;
    exportButton.disabled = databaseSelect.selected == null;
}

databaseSelect.addEventListener('select', (e) => {
    const database = e.detail;
    databaseLayout.updateLayout(database);
    updateButtons();
});
runButton.addEventListener('click', () => {
    const input = window.editor.getValue();
    queryResult.updateQuery(input, databaseSelect.selected, readonlyCheckbox.checked);
});
queryResult.addEventListener('result', (e) => queryHistory.addQueryResult(e.detail))
resetButton.addEventListener('click', async () => {
    const input = window.editor.getValue();
    await navigator.clipboard.writeText(input); // Save input to clipboard
    window.editor.setValue('');
});
queryHistory.addEventListener('restore', (e) => {
    window.editor.setValue(e.detail);
});