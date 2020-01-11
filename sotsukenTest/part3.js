const kadaiBtn = document.getElementById('part3_Kadai');
const MokutekiBtn = document.getElementById('part3_Mokuteki');
const TaishoBtn = document.getElementById('part3_Taisho');
const outputArea = document.getElementById('category_output_area');

kadaiBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ボタンクリックで以下のような<span style='color:green;'>課題</span>のボタンを生成する";
}, false);
MokutekiBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ボタンクリックで以下のような<span style='color:blue;'>目的</span>のボタンを生成する";
}, false);
TaishoBtn.addEventListener('click', () => {
    outputArea.innerHTML = "ボタンクリックで以下のような<span style='color:red;'>対象</span>のボタンを生成する";
}, false);