/**
 * <table>のヘッダー部分を生成する
 * @param {Array<string>} vars 
 * @return {HTMLTableRowElement}
 */
function tableHead(vars) {
    const tr = document.createElement('tr');
    tr.className = "kakomi-box-head";
    const fragment = vars.map(v => {
        const th = document.createElement('th');
        th.innerText = headerLabel(v);
        return th;
    }).reduce((acc, th) => {
        acc.appendChild(th);
        return acc;
    }, document.createDocumentFragment());

    tr.appendChild(fragment);
    return tr;
}

/**
 * テーブルヘッダーのラベルを日本語化
 * @param {String} text 
 */
function headerLabel(text) {
    var label = String;
    switch (text) {
        case 'torikumi': label = '取組名称'; break;
        case 'kadai': label = '解決する課題'; break;
        case 'Kadai': label = '解決する課題'; break;
        case 'mokuteki': label = '解決する目的'; break;
        case 'Mokuteki': label = '解決する目的'; break;
        case 'URL': label = '詳細のページ'; break;
        default: label = text; break;
    }
    return label;
}

/**
 * <table>の行を生成する
 * 主にSPARQL検索で利用
 * @param {Array<string>} values 
 * @return {HTMLTableRowElement}
 */
function tableRows(values) {
    const tr = document.createElement('tr');
    tr.className = 'kakomi-box-rows';
    const fragment = values.map(tableDataCell)
        .reduce((acc, td) => {
            acc.appendChild(td);
            return acc;
        }, document.createDocumentFragment());

    tr.appendChild(fragment);
    return tr;
}

/**
 * <table>の行を生成する
 * 主にカテゴリ検索で利用
 * @param {Array<string>} values 
 * @return {HTMLTableRowElement}
 */
function resultRows(values) {
    const tr = document.createElement('tr');
    tr.className = 'kakomi-box-rows';
    const fragment = values.map(resultCell)
        .reduce((acc, td) => {
            acc.appendChild(td);
            return acc;
        }, document.createDocumentFragment());

    tr.appendChild(fragment);
    return tr;
}

/**
 * SPARQLエンドポイントからのレスポンスを読んで、
 * URIならリンク、リテラルならテキストのエレメントを返す
 * @param {Object<String, String>} obj 
 * @returns {HTMLTableDataCellElement}
 */
function tableDataCell(obj) {
    const td = document.createElement('td');
    switch (obj['type']) {
        case "literal":
            td.innerText = obj.value;
            break;
        case "uri":
            const aTag = document.createElement('a');
            aTag.href = obj.value;
            aTag.innerText = obj.value
                .replace("_", ":")
                .replace("http://socialproblem/class/", "")
                .replace("http://socialproblem/property/", "");
            td.appendChild(aTag);
            break;
        default:
            throw new Error("不明なノードタイプです");
    }
    td.classList.add('result-item');
    return td;
}

/**
 * 子ノードをすべて削除する
 * @param {HTMLElement} elem 
 */
function removeAllChild(elem) {
    let child = null;
    while (child = elem.firstChild) {
        elem.removeChild(child);
    }
}

/**
 * SPARQLエンドポイントからのレスポンスを読んで、
 * URIならリンク、リテラルならテキストのエレメントを返す
 * @param {Object<String, String>} obj 
 * @returns {HTMLTableDataCellElement}
 */
function resultCell(obj) {
    const remText = "http://socialproblem/class/";
    const value = obj.value.replace(remText, "");
    const td = document.createElement('td');
    switch (obj['type']) {
        case "literal":
            td.innerText = value;
            break;
        case "uri":
            if (value.includes('http')) {
                const aTag = document.createElement('a');
                aTag.href = value.replace("_", ":");//.replace("_",":")は不要
                aTag.innerText = "取組の詳細";
                // aTag.innerText = value.replace("_", ":");
                td.appendChild(aTag);
            } else {
                td.innerText = value;
                // td.innerHTML = value + '<br>';
            }
            break;
        default:
            throw new Error("不明なノードタイプです");
    }
    td.classList.add('result-item');
    return td;
}

/**
 * 最終的に出力するテーブル組み立て
 * @param {*} headers 
 * @param {*} rows 
 */
function createTable(headers, rows) {
    const resultArea = document.getElementById('result_div');
    const table = document.createElement('table');
    table.id = 'table';
    table.appendChild(headers);
    table.appendChild(rows);
    for (var i = 1; i < table.rows.length; i++) {//不要な行を削除
        console.log(table.rows[i].innerText);
        if (table.rows[i].innerText.includes('URL')) {
            table.deleteRow(i);
        }
    }
    resultArea.appendChild(table);
}
