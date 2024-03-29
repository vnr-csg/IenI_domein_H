/** 
 * Get a list of available databases.
 * @returns {Promise<Array<string>>} List of databases
 */
export async function getDatabases() {
    const res = await fetch("php/databases.php");
    if (!res.ok) {
        throw new Error(`Failed to get database list, ${res.status} - ${await res.text()}`);
    }
    return await res.json();
}

/** 
 * Get the layout of the database
 * @returns {Promise<Array<Object>>}  Array of tables with columns and datatypes
 */
export async function getLayout(databaseName) {
    const res = await fetch(`php/layout.php?db=${databaseName}`);
    if (!res.ok) {
        throw new Error(`Failed to get database list, ${res.status} - ${await res.text()}`);
    }
    return await res.json();
}

/**
 * Runs a SQL query
 * @param {string} query The SQL query to run
 * @param {string} database The database to perform the query on
 * @param {boolean} readonly Restrict operations to read-only mode
 * @param {number | null} limit How many rows to return
 * @param {number} offset How many rows to skip from the beginning
 * @param {"csv" | "json"} contentType The content type to return
 * @returns {Promise<Object | null>} Query response object
 */
export async function runQuery(query, database, readonly, limit, offset, contentType) {
    const mimeType = contentType == "csv" ? "text/csv" : "application/json";
    const res = await fetch("php/run.php", {
        method: "POST",
        body: JSON.stringify({
            query,
            database,
            readonly,
            limit,
            offset,
        }),
        headers: {
            "Accept": mimeType,
        }
    }
    );
    if (!res.ok) {
        throw new Error(await res.text());
    }
    if (res.status == 204) {
        return null;
    }

    const data = contentType == "csv" ? await res.text() : await res.json();
    const rowCount = parseInt(res.headers.get("x-row-count"));
    return {
        data,
        count: rowCount,
    };
}

/**
 * Downloads a file
 * @param {Blob} data The data to download
 * @param {string} contentType The content type of the file
 * @param {string} filename The default filename to save to (works only on Firefox!)
 */
export function downloadFile(data, contentType, filename) {
    const file = new File([data], filename, { type: contentType });
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
}