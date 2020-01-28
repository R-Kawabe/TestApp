const category = ["problem", "object", "subject"];

window.addEventListener('load', async () => {//各ドロップダウンリストごとにイベントハンドラを実行するための変数生成
    category.map(k => {
        clickEvent(`${k}_button`, `#${k}_list`);
    }, false);
})

/**
 * 検索ボタンクリック時のイベントハンドラ
 * @param {String} btnName 
 * @param {String} lstName 
 */
async function clickEvent(btnName, lstName) {
    document.getElementById(btnName).addEventListener('click', async () => {
        await search(lstName);
    }, false);
}

/**
 * ドロップダウンリスト選択検索
 * 解決する課題、取組・対策、URL、目的の4項目を最終的に提供したい
 * 上記URL以外の3項目については、配列を用意してmapで回しながら生成する？
 * それぞれの4項目についてはListValue()のような関数を作成してURIを外す、もしくは共通化
 * @param {String} id 
 */
async function search(id) {
    const resultArea = document.getElementById('result_div');
    removeAllChild(resultArea);
    const value = document.querySelector(id).value.trim();
    let searchQuery = '';
    switch (id) {
        case '#problem_list':
            searchQuery = QueryTypeProblem(value);
            createRes(searchQuery);
            break;
        case '#object_list':
            searchQuery = QueryTypeObject(value);
            createRes(searchQuery);
            break;
        case '#subject_list':
            searchQuery = QueryTypeSubject(value);
            createRes(searchQuery);
            break;
        default:
            alert('別のキーワードを選んでください');
            break;
    }
    return searchQuery;
}

/**
 * 各クエリの結果を出力
 * @param {String} query 
 */
async function createRes(query) {
    const result = await fetchQuery(query);
    const vars = result.head.vars;
    const data = result.results.bindings.map(buildKeySearchRes);
    const headers = tableHead(vars);
    const rows = data
        .map(Object.values)
        .map(resultRows)
        .reduce((acc, elem) => {
            acc.appendChild(elem);
            return acc;
        }, document.createDocumentFragment())
    createTable(headers, rows);
}
