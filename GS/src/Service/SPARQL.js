const sendButton = document.getElementById('send');
const textArea = document.getElementById('query_area');

window.addEventListener('load', () => {//ページ読み込み時クエリエリアにデフォルトクエリ出力
    const defaultQuery = "select ?s ?p ?o {?s ?p ?o} LIMIT 100";
    textArea.value = defaultQuery;
}, false);

sendButton.addEventListener('click', async () => {//SPARQL検索時に実行
    const resultArea = document.getElementById('result_div');
    removeAllChild(resultArea);
    const query = textArea.value;
    const result = await fetchQuery(query);
    const vars = result.head.vars;
    const data = result.results.bindings;
    if (vars.length === 3) data.map(obj => buildSPARQLBindings(obj, vars));
    const headers = tableHead(vars);
    const rows = data
        .map(Object.values)
        .map(tableRows)
        .reduce((acc, elem) => {
            acc.appendChild(elem);
            return acc;
        }, document.createDocumentFragment())
    const table = document.createElement('table');
    table.appendChild(headers);
    table.appendChild(rows);
    resultArea.appendChild(table);
}, false);
