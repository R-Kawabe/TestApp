/**
 * 種別色付け
 * @param {*} trainType 
 * @param {*} linename
 */
function AddDispTypeCol(trainType, linename) {//otherはlinename=""を定義しとけ
    switch (trainType) {
        case "普通": {
            const typeCol = '<span class="local">' + trainType + '</span>';
            return typeCol;
        }
        case "区間快速": {
            if (linename == "nara") {
                const typeCol = '<span class="miyakojirapid">' + trainType + '</span>';
                return typeCol;
            }
            else if (linename == "") {
                const typeCol = '<span class="regionalrapid">' + trainType + '</span>';
                return typeCol;
            }
            else {
                const typeCol = '<span class="regionalrapid">' + trainType + '</span>';
                return typeCol;
            }
        }
        case "快速": {
            if (linename == "yamatoji" || linename == "wakayama2") {
                const typeCol = '<span class="yamatojirapid">' + trainType + '</span>';
                return typeCol;
            }
            else if (linename == "nara") {
                const typeCol = '<span class="miyakojirapid">' + trainType + '</span>';
                return typeCol;
            }
            else if (linename == "") {
                const typeCol = '<span class="rapid">' + trainType + '</span>';
                return typeCol;
            }
            else {
                const typeCol = '<span class="rapid">' + trainType + '</span>';
                return typeCol;
            }
        }
        case "新快速": {
            const typeCol = '<span class="specialrapid">' + trainType + '</span>';
            return typeCol;
        }
        case "A新快○": {
            const typeCol = '<span class="specialrapid">' + trainType + '</span>';
            return typeCol;
        }
        case "A→一般": {
            const typeCol = '<span class="specialrapid">' + trainType + '</span>';
            return typeCol;
        }
        case "一般→A": {
            const typeCol = '<span class="specialrapid">' + trainType + '</span>';
            return typeCol;
        }
        case ("丹波路快" || "丹波路快速"): {
            const typeCol = '<span class="tanbajirapid">' + trainType + '</span>';
            return typeCol;
        }
        case ("紀州路快" || "紀州路快速"): {
            const typeCol = '<span class="kishujirapid">' + trainType + '</span>';
            return typeCol;
        }
        case "関空快速": {
            const typeCol = '<span class="kixrapid">' + trainType + '</span>';
            return typeCol;
        }
        case "関空紀州": {
            const typeCol = '<span class="kixrapid">関空</span>' + '<span class="kishujirapid">紀州</span>';
            return typeCol;
        }
        case ("大和路快" || "大和路快速"): {
            const typeCol = '<span class="yamatojirapid">' + trainType + '</span>';
            return typeCol;
        }
        case ("みやこ快" || "みやこ路快速"): {
            const typeCol = '<span class="miyakojirapid">' + trainType + '</span>';
            return typeCol;
        }
        case "直通快速": {
            const typeCol = '<span class="directrapid">' + trainType + '</span>';
            return typeCol;
        }
        case "特急": {
            const typeCol = '<span class="limitedexp">' + trainType + '</span>';
            return typeCol;
        }
        case "急行": {
            const typeCol = '<span class="express">' + trainType + '</span>';
            return typeCol;
        }
        case "関空特急": {
            const typeCol = '<span class="limitedexp">' + trainType + '</span>';
            return typeCol;
        }
        case "通勤特急": {
            const typeCol = '<span class="limitedexp">' + trainType + '</span>';
            return typeCol;
        }
        case ("寝台特急" || "寝台"): {
            const typeCol = '<span class="extra">' + trainType + '</span>';
            return typeCol;
        }
        case "回送": {
            const typeCol = '<span class="notinservice">' + trainType + '</span>';
            return typeCol;
        }
        case "臨時": {
            const typeCol = '<span class="extra">' + trainType + '</span>';
            return typeCol;
        }
        case "観光列車": {
            const typeCol = '<span class="extra">' + trainType + '</span>';
            return typeCol;
        }
        default: {
            return trainType;
        }

    }
}

/**
 * 行先色付け
 * @param {*} trainDest 
 */
function AddDestCol(trainDest) {
    return '<span class="destination">' + trainDest + '</span>';
}

/**
 * 路線記号付与
 * @param {*} LineMark 
 */
function LineMarkGet(LineMark) {//無印のみ
    switch (LineMark) {
        case "hokuriku": {
            const GetMark = '<span class="hokuriku">[A]</span>';
            return GetMark;
        }
        case "kosei": {
            const GetMark = '<span class="kosei">[B]</span>';
            return GetMark;
        }
        case "kusatsu": {
            const GetMark = '<span class="kusatsu">[C]</span>';
            return GetMark;
        }
        case "nara": {
            const GetMark = '<span class="nara">[D]</span>';
            return GetMark;
        }
        case "osakahigashi": {
            const GetMark = '<span class="osakahigashi">[F]</span>';
            return GetMark;
        }
        case "takarazuka": {
            const GetMark = '<span class="takarazuka">[G]</span>';
            return GetMark;
        }
        case "tozai": {
            const GetMark = '<span class="tozai">[H]</span>';
            return GetMark;
        }
        case "kakogawa": {
            const GetMark = '<span class="kakogawa">[I]</span>';
            return GetMark;
        }
        case "kishin": {
            const GetMark = '<span class="kishin">[K]</span>';
            return GetMark;
        }
        case "osakaloop": {
            const GetMark = '<span class="osakaloop">[O]</span>';
            return GetMark;
        }
        case "yumesaki": {
            const GetMark = '<span class="yumesaki">[P]</span>';
            return GetMark;
        }
        case "yamatoji": {
            const GetMark = '<span class="yamatoji">[Q]</span>';
            return GetMark;
        }
        case "hanwa": {
            const GetMark = '<span class="hanwa">[R]</span>';
            return GetMark;
        }
        case "kansaiairport": {
            const GetMark = '<span class="kix">[S]</span>';
            return GetMark;
        }
        case "wakayama2": {
            const GetMark = '<span class="wakayama">[T]</span>';
            return GetMark;
        }
        case "kansai": {
            const GetMark = '<span class="kansai">[V]</span>';
            return GetMark;
        }
        case "kinokuni": {
            const GetMark = '<span class="kinokuni">[W]</span>';
            return GetMark;
        }
        case "other": {
            return "";
        }
        case "hagoromo": {
            return "";
        }
        default: {
            return LineMark;
        }

    }
}

/**
 * 列車名セット
 * @param {*} nickname 
 */
function nicknameSet(nickname) {//otherのみ
    if (nickname == null) return "";
    else return nickname;
}

/**
 * 上下区分
 * @param {*} direction 
 */
function directionSet(direction) {
    switch (area) {
        case '東海エリア':
            if (direction == 1) return "上り";
            else return "下り";
        default:
            if (direction == 0) return "上り";
            else return "下り";
    }
}

/**
 * 遅延時分セット
 * @param {*} delayMinutes 
 */
function delayMinutesSet(delayMinutes) {
    switch (area) {
        case '東海エリア':
            if (delayMinutes == 0) return '<span class="noDelay">定刻</span>';
            else if (delayMinutes > 59) return '<span class="overDelay">60分以上遅れ</span>';
            else return '<span class="delayMinutes">' + delayMinutes + '分遅れ</span>';
        default:
            if (delayMinutes == 0) return '<span class="noDelay">定刻</span>';
            else if (delayMinutes > 60) return '<span class="overDelay">60分以上遅れ</span>';
            else return '<span class="delayMinutes">' + delayMinutes + '分遅れ</span>';
    }
}
