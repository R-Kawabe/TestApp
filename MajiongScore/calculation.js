/**
 * 
 * @param {Number} score 
 */
function calcScore_oya(score, FuValue) {
    if (ron.checked == true) {
        if (FuValue == 20) return "符数が間違っています";
        return `${score}点`;
    } else if (tsumo.checked == true) {
        var calc4 = score / 3;
        if (Math.floor(calc4 / 10 % 10) === 0) {
            return `${calc4}点オール`;
        } else {
            var calc4 = (score + 100) / 3;
            if (Math.floor(calc4 / 10 % 10) !== 0) {
                var calc4 = (score + 200) / 3;
            }
            return `${calc4}点オール`;
        }
    } else {
        return "和了方を選択してください";
    }
}

/**
 * 
 * @param {Number} score 
 */
function calcScore_ko(score) {
    console.log("取得した値" ? score.ron : score.tsumo);
    if (ron.checked == true) {
        return `${score.ron}点`;
    } else if (tsumo.checked == true) {
        return `${score.tsumo}点`;
    } else {
        return "和了方を選択してください";
    }
}
