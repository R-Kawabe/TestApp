const KeySearchBtn = document.getElementById('KeySearchBtn');
const resetBtn = document.getElementById('KeywordReset');

KeySearchBtn.addEventListener('click', async () => {//入力したキーワードで検索時実行
    const resultArea = document.getElementById('result_div');
    removeAllChild(resultArea);
    const value = document.getElementById('search_text').value;
    const query = KeySearchQuery(value);
    const result = await fetchQuery(query);
    const vars = result.head.vars;
    const data = result.results.bindings;
    if (vars.length === 3) data.map(obj => buildKeySearchRes(obj, vars));
    else if (vars.length === 4) data.map(obj => buildKeySearchRes2(obj, vars));
    const headers = tableHead(vars);
    const rows = data
        .map(Object.values)
        .map(resultRows)
        .reduce((acc, elem) => {
            acc.appendChild(elem);
            return acc;
        }, document.createDocumentFragment())

    resultArea.innerText = `【${value}】に関する取組情報一覧`
    createTable(headers, rows);
}, false);

resetBtn.addEventListener('click', () => {//テキストエリアの文字列をクリア
    const resetArea = document.getElementById('search_text');
    resetArea.value = '';
}, false);
