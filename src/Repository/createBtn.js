window.addEventListener('load', () => {
    //サイドメニューのボタン出力
    const area = document.getElementById('area').innerText;
    switch (area) {
        case '近畿エリア': AreaArray.splice(0, 1);
            AreaArray.map(k => areaButton(k.code, k.area, k.url.replace('public/', './')));
            KinkiAreaLine.map(k => lineButton(k.code, k.line));
            //配列にtype=0みたいに識別子をつけて、その番号によって実行する関数を変更すれば1ページに近畿エリア全部入るのでは？
            break;
        case '北陸・近畿2エリア': AreaArray.splice(1, 1);
            AreaArray.map(k => areaButton(k.code, k.area, k.url.replace('public/', './')));
            Kinki2AreaLine.map(k => lineButton(k.code, k.line));
            break;
        case '岡山・福山エリア': AreaArray.splice(2, 1);
            AreaArray.map(k => areaButton(k.code, k.area, k.url.replace('public/', './')));
            OkayamaAreaLine.map(k => lineButton(k.code, k.line));
            break;
        case '広島・下関エリア': AreaArray.splice(3, 1);
            AreaArray.map(k => areaButton(k.code, k.area, k.url.replace('public/', './')));
            HiroSekiAreaLine.map(k => lineButton(k.code, k.line));
            break;
        case '山陰エリア': AreaArray.splice(4, 1);
            AreaArray.map(k => areaButton(k.code, k.area, k.url.replace('public/', './')));
            SaninAreaLine.map(k => lineButton(k.code, k.line));
            break;
        default:
            AreaArray.map(k => areaButton(k.code, k.area, k.url));
            break;
    }
    sideBtnArray.map(k => infoButton(k.areaName, k.url, k.value));
}, false);

/**
 * 
 * @param {String} areaName 
 * @param {String} url 
 * @param {String} value 
 */
function infoButton(areaName, url, value) {
    const outputArea = document.getElementById(areaName);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.onclick = function () {
        switch (value) {
            case '運用検索ページ': location.href = url;
                break;
            default: window.open(url, '_blank');
                break;
        }
    }
    button.innerText = value;
    outputArea.appendChild(button);
}

/**
 * 
 * @param {String} code 
 * @param {String} area 
 * @param {String} url 
 */
function areaButton(code, area, url) {
    const outputArea = document.getElementById('areaSelect');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${code}_button`;
    button.onclick = function () {
        location.href = url;
    }
    button.innerText = area;
    outputArea.appendChild(button);
}

/**
 * 
 * @param {String} code 
 * @param {String} line 
 */
function lineButton(code, line) {
    const outputArea = document.getElementById('lineSelect');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${code}_button`;
    button.name = 'word1';
    button.onclick = function () {
        // getLineData(code);
        testfunc(code);
    }
    button.innerText = line;
    outputArea.appendChild(button);
}

function testfunc(line) {
    window.alert(line + '成功');
}
