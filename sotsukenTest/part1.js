const kadaiBtn = document.getElementById('part1_Kadai');
const MokutekiBtn = document.getElementById('part1_Mokuteki');
const TaishoBtn = document.getElementById('part1_Taisho');
const outputArea = document.getElementById('category_output_area');

kadaiBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ここに<span style='color:green;'>課題</span>のドロップダウンリストを生成する";
}, false);
MokutekiBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ここに<span style='color:blue;'>目的</span>のドロップダウンリストを生成する";
}, false);
TaishoBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ここに<span style='color:red;'>対象</span>のドロップダウンリストを生成する";
}, false);