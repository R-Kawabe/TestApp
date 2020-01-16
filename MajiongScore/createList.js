const HanArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const FuArray = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
const divHan = document.getElementById('HanListArea');
const divFu = document.getElementById('FuListArea');
window.addEventListener('load', () => {
    CreateHanList();
    CreateFuList();
}, false);

/**
 * 翻数リスト生成
 */
function CreateHanList() {
    const result = HanArray
        .map(createOption)
        .reduce((acc, elem) => {
            acc.appendChild(elem);
            return acc;
        }, document.createDocumentFragment());
    const select = createSelect(result, 'Han');
    divHan.appendChild(select);
}

/**
 * 符数リスト生成
 */
function CreateFuList() {
    const result = FuArray
        .map(createOption)
        .reduce((acc, elem) => {
            acc.appendChild(elem);
            return acc;
        }, document.createDocumentFragment());
    const select = createSelect(result, 'Fu');
    divFu.appendChild(select);
}

/**
 * ドロップダウンリスト生成
 * @param {HTMLElement} value 
 * @param {String} id
 * @return {HTMLElement}
 */
function createSelect(value, id) {
    const select = document.createElement('select');
    select.name = id;
    select.id = id;
    select.appendChild(value);
    return select;
}

/**
 * ドロップダウンリストのオプション生成
 * @param {String} value 
 * @return {HTMLElement}
 */
function createOption(value) {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = value;
    return option;
}

divHan.addEventListener('change', (event) => {//翻数が5以上の場合符数を表示しない
    if (event.target.value > 4) {
        divFu.style.display = "none";
    } else if (event.target.value < 4) {
        divFu.style.display = "block";
    }
}, false);
