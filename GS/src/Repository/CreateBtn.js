const categoryArray = ['kadai', 'mokuteki', 'taisho'];
window.addEventListener('load', async () => {//categoryArrayの3つの値に対してクリックイベントを生成
    categoryArray.map(k => clickEvent(`${k}Btn`, k), false);
}, false);

/**
 * 作っていくもの
 * 4.返ってきたJSONを型定義
 * 4-1.kに従って分類すればいい？
 * 4-2.ツリー構造
 * 
 * 検索ボタンクリック時のイベントハンドラ
 * @param {String} btnName
 * @param {String} category 
 */
async function clickEvent(btnName, category) {//押されたボタンによりそれぞれのカテゴリの検索ボタンを生成
    document.getElementById(btnName).addEventListener('click', async () => {
        const resultArea = document.getElementById('result_div');
        const BtnArea = document.getElementById('categoryBtnArea');
        removeAllChild(resultArea);
        removeAllChild(BtnArea);
        let query = String;
        switch (category) {
            case "kadai":
                query = categoryQuery('課題');
                BtnArea.innerHTML = "課題から検索<br>";
                break;
            case "mokuteki":
                query = categoryQuery('目的');
                BtnArea.innerHTML = "目的から検索<br>";
                break;
            case "taisho":
                query = categoryQuery('対象');
                BtnArea.innerHTML = "対象から検索<br>";
                break;
        }
        const result = await fetchQuery(query);
        const bindings = result.results.bindings.map(buildSelectList);
        const data = bindings
            .map(Object.values)
            .map(k => createBtn(k, category))
            .reduce((acc, elem) => {
                acc.appendChild(elem);
                return acc;
            }, document.createDocumentFragment());

        BtnArea.appendChild(data);
    }, false);
}

/**
 * 各カテゴリのキーワードボタンを生成
 * @param {String} values 
 * @param {String} category
 */
function createBtn(values, category) {
    const fragment = values.map(categoryValue);
    const button = document.createElement('input');
    button.type = 'button';
    button.className = 'category_button';
    button.value = fragment;
    button.onclick = function () {
        categorySearch(fragment, category);
    };
    button.innerText = fragment;
    return button;
}

/**
 * SPARQLエンドポイントからのレスポンスを読んで、
 * URIならリンク、リテラルならテキストのエレメントを返す
 * ドロップダウンリストを作成する場合には共通
 * @param {Object<String, String>} obj 
 */
function categoryValue(obj) {
    var value = null;
    switch (obj['type']) {
        case "literal":
            value = obj.value;
            break;
        case "uri":
            value = obj.value.replace("http://socialproblem/class/", "");
            break;
        default:
            throw new Error("不明なノードタイプです");
    }
    return value;
}
