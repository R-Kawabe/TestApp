window.addEventListener('load', () => {
    switch (document.getElementById('plan2').innerText) {
        case ("案2-課題から検索ページ"):
            document.getElementById('category_output_area').innerHTML = "ここに<span style='color:green;'>課題</span>のドロップダウンリストを生成する";
            break;
        case ("案2-目的から検索ページ"):
            document.getElementById('category_output_area').innerHTML = "ここに<span style='color:blue;'>目的</span>のドロップダウンリストを生成する";
            break;
        case ("案2-対象から検索ページ"):
            document.getElementById('category_output_area').innerHTML = "ここに<span style='color:red;'>対象</span>のドロップダウンリストを生成する";
            break;
    }
}, false);