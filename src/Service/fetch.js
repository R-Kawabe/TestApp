const elem = document.getElementById('elem');

/**
 * 
 * @param {String} line 
 */
async function getLineData(line) {
    const area = document.getElementById('area');
    let params = new URLSearchParams();
    params.set('word1', line);
    if (area.innerText === '東海エリア') {
        const result = await fetchTrain('lineC.php?', params.toString());
        const trains = result.trains.map(buildTrainC);
        viewTrainsC(trains);
    } else {
        const result = await fetchTrain('line.php?', params.toString());
        if (area.innerText === "近畿エリア") {
            const trains = result.trains.map(buildTrain);
            viewTrains(trains);
        } else {
            const trains = result.trains.map(buildTrainOther);
            viewTrainsOther(trains);
        }
    }
}

/**
 * 
 * @param {String} request 
 * @param {*} param 
 */
async function fetchTrain(request, param) {
    try {
        const result = await fetch(request + param, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        });
        if (!result.ok) {
            throw new Error("error");
        }
        const resultData = await result.json();
        return resultData;
    } catch (e) {
        elem.innerText = e.message;
        throw e;
    }
}
