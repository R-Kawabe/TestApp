const sendBtn = document.getElementById('sendButton');
const ron = document.getElementById('ron');
const tsumo = document.getElementById('tsumo');

sendBtn.addEventListener('click', () => {
    const resultArea = document.getElementById('resultArea');
    const rad_oya = document.getElementById('oya');
    const rad_ko = document.getElementById('ko');

    var HanValue = document.querySelector('#Han').value;//翻数受け取り
    if (HanValue > 4) FuValue = '';
    else var FuValue = document.querySelector('#Fu').value;//符数受け取り

    var total = Number(HanValue + FuValue);
    if ((total >= 360 && total <= 390) || total >= 3100 || (total >= 430 && total <= 490)) total = 5;//5翻以下で満貫になる組合せ
    if (rad_oya.checked == true) {//親の場合の点数を配列から取得
        var result = scoreMatch(total, 'oya');
        if (result[0].score === "符数が間違っています") resultArea.innerText = result[0].score;
        else {
            var score = calcScore_oya(result[0].score, FuValue);
            if (score === "符数が間違っています") resultArea.innerText = score;
            else {
                if (total >= 5) resultArea.innerText = `親の${HanValue}翻は${score}です。`;
                else resultArea.innerText = `親の${HanValue}翻${FuValue}符は${score}です。`;
            }
        }
    } else if (rad_ko.checked == true) {//子の場合の点数を配列から取得
        var result = scoreMatch(total, 'ko');
        if (result[0].score === "符数が間違っています") resultArea.innerText = result[0].score;
        else {
            if (total >= 5) resultArea.innerText = `子の${HanValue}翻は${result[0].score}点です。`;
            else resultArea.innerText = `子の${HanValue}翻${FuValue}符は${result[0].score}点です。`;
        }
    } else {
        resultArea.innerText = '親または子を選択して下さい';
    }
}, false);

/**
 * 探索する配列の判定
 * @param {Number} value 
 * @param {String} oyako
 */
function scoreMatch(value, oyako) {
    switch (oyako) {
        case 'oya':
            return score_oya.filter(score => {
                if (score.HanFu === value) return score;
            });
        case 'ko':
            if (ron.checked) {
                return score_ko_ron.filter(score => {
                    if (score.HanFu === value) return score;
                });
            } else if (tsumo.checked) {
                return score_ko_tsumo.filter(score => {
                    if (score.HanFu === value) return score;
                });
            } else if (ron.checked != true && tsumo.checked != true) {
                resultArea.innerText = '和了方を選択して下さい';
            }
    }
}
