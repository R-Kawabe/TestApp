/**
 * 検索結果と補足分を出力
 * @param {String} value 
 * @param {String} category 
 */
async function categorySearch(value, category) {
    const resultArea = document.getElementById('result_div');
    removeAllChild(resultArea);
    switch (category) {
        case 'kadai':
            createRes(QueryTypeProblem(value));
            resultArea.innerText = `課題【${value}】を解決する取組・対策とその目的一覧`;
            break;
        case 'mokuteki':
            createRes(QueryTypeObject(value));
            resultArea.innerText = `【${value}】を目的とする取組・対策とそれが解決する課題一覧`;
            break;
        case 'taisho':
            createRes(QueryTypeSubject(value));
            resultArea.innerText = `対象が【${value}】である取組・対策一覧`;
            break;
        default:
            alert('別のキーワードを選んでください');
            break;
    }
}

/**
 * 各クエリの結果を出力
 * @param {String} query 
 */
async function createRes(query) {
    const result = await fetchQuery(query);
    const vars = result.head.vars;
    const data = result.results.bindings;
    if (vars.length === 3) data.map(obj => buildKeySearchRes(obj, vars));
    else if (vars.length === 4) data.map(obj => buildKeySearchRes2(obj, vars));
    //以下、Service.jsと共通　まとめられる？
    const headers = tableHead(vars);
    const rows = data
        .map(Object.values)//各トリプルの値を
        .map(resultRows)//resultRows関数にしたがってmapで回す
        .reduce((acc, elem) => {
            acc.appendChild(elem);//elem：直前の.mapからのチェーン（引数）みたいな感じ
            return acc;
        }, document.createDocumentFragment())
    createTable(headers, rows);
}

/**
 * ポップアップを作るなら
 * 1．取組名称を利用して新たにクエリ発行
 * 1-1．クエリで取ってくる項目：[課題],[目的]
 * 2．ポップアップの枠を作る
 * 3．表示する時のデザイン
 * 「（選択した取組名称）」に関するデータ
 * 以下テーブル形式
 * --------------------
 * |  課題  |  目的  |
 * --------------------
 * |        |        |
 * |        |        |
 * |        |        |
 * -------------------
 * 4．ポップアップを消す->×ボタン
 * 5．表示非表示の方法：
 * 5-1．トリガー：取組名称クリック
 * 5-2．表示：HTMLElement.style.display="block"
 * 5-3．非表示：HTMLElement.style.display="none"
 * 
 */