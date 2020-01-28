const list_array = ["課題", "目的", "対象"];
const textArea = document.getElementById('query_area');

window.addEventListener('load', () => {//ページ読み込み時実行
    const listQuery = ListQuery(list_array);//ドロップダウンリスト用のクエリ生成
    listQuery.map(async function (query) {
        const result = await fetchQuery(query);
        const data = result.results.bindings.map(buildSelectList);
        const rows = data
            .map(Object.values)
            .map(createList)
            .reduce((acc, elem) => {
                acc.appendChild(elem);
                return acc;
            }, document.createDocumentFragment());
        const select = createSelect(query, rows);//selectDOM生成関数

        if (query.includes('課題')) {
            document.getElementById('select_problem').appendChild(select);
        } else if (query.includes('目的')) {
            document.getElementById('select_object').appendChild(select);
        } else if (query.includes('対象')) {
            document.getElementById('select_subject').appendChild(select);
        }
    }, false);

}, false);

/**
 * ドロップダウンリストを作成する関数
 * @param {Array<String>} query 
 * @param {Array} rows 
 */
function createSelect(query, rows) {
    // const op = null;
    if (query.includes('課題')) {
        var op = "problem";
    } else if (query.includes('目的')) {
        var op = "object";
    } else if (query.includes('対象')) {
        var op = "subject";
    }
    const select = document.createElement('select');//セレクトタグ生成（ドロップダウンリストに関しては共通部分）
    select.name = op;//nameオプション
    select.id = `${op}_list`;//IDオプション
    select.appendChild(rows);//リストの中身
    return select;
}

/**
 * ドロップダウンリストのOptionを作成する関数
 * 共通
 * @param {Array<string>} values 
 * @return {HTMLTableRowElement}
 */
function createList(values) {
    const option = document.createElement('option');
    const fragment = values.map(ListValue);
    option.value = fragment;
    option.innerText = fragment;
    return option;
}

/**
 * SPARQLエンドポイントからのレスポンスを読んで、
 * URIならリンク、リテラルならテキストのエレメントを返す
 * ドロップダウンリストを作成する場合には共通
 * @param {Object<String, String>} obj 
 * @returns {HTMLTableDataCellElement}
 */
function ListValue(obj) {
    var value = null;
    switch (obj['type']) {
        case "literal":
            value = obj.value;
            break;
        case "uri":
            value = obj.value.replace("http://socialproblem/class/", " ");
            break;
        default:
            throw new Error("不明なノードタイプです");
    }
    return value;
}
