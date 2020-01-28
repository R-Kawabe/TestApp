/**
 * DBPedia検索・表示ライブラリ
 */


var dbp_lang;

var dbp_ep;

$(window).load(function () {

});

/**
 * DBPediaからのデータ取得初期化
 * @param lang	言語
 * @param server	servletサーバ（未指定の場合はデフォルト）
 * @param ep	エンドポイント（未指定の場合は言語に応じたデフォルトエンドポイントが指定される）
 */
function init_dbp(lang, server, ep) {

	dbp_lang = lang;

	if (ep == undefined) {
		if (dbp_lang == 'ja') {
			//			ep = {"endpoint":"http://hozoviewer.ei.sanken.osaka-u.ac.jp/endpoint/dbpedia_jp"};
			dbp_ep = "http://ja.dbpedia.org/sparql";
		} else {
			//			ep = {"endpoint":"http://hozoviewer.ei.sanken.osaka-u.ac.jp/endpoint/dbpedia"};
			dbp_ep = "http://dbpedia.org/sparql";
		}
	} else {
		dbp_ep = ep;
	}
}


/**
 * DBPediaから情報を検索する
 * @param label			検索対象文字列（部分一致）
 * @param contentdiv	コンテンツを格納するDIVのID
 * @param div			コンテンツ全体を表示するDIVのID（不要の場合は未指定とする）
 */
function find_dbp(label, contentdiv, div) {

	var select_name = label;

	var view_dbp = function (data) {
		/*
		label, p, o　形式
		labelはひとつのみ。
		pはsession
		oはsessionに関連するノード
		*/

		data = data.results.bindings;

		var comment = undefined;
		var img = undefined;
		var content = '';
		var name;
		if (dbp_lang == 'ja') {
			name = encodeURIComponent(select_name);
		} else {
			name = select_name.replace(/ /g, "_");

		}

		var dbpedia;
		var wikipedia;

		if (dbp_lang == 'ja') {
			dbpedia = '<a href="http://ja.dbpedia.org/page/' + name + '" target="_blank">View on DBPedia</a>';
			wikipedia = '<a href="https://ja.wikipedia.org/wiki/' + name + '" target="_blank">View on Wikipedia</a>';
		} else {
			dbpedia = '<a href="http://dbpedia.org/page/' + name + '" target="_blank">View on DBPedia</a>';
			wikipedia = '<a href="https://wikipedia.org/wiki/' + name + '" target="_blank">View on Wikipedia</a>';
		}


		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].comment != undefined) {
					comment = data[i].comment.value;
				}
				if (data[i].image != undefined) {
					img = data[i].image.value;
				}
			}
			content = '<h2>' + select_name + '</h2>';
			if (comment != undefined) {
				content += comment;
			} else {
				if (dbp_lang == 'ja') {
					content = 'DBPediaに <b>' + select_name + '</b> の詳細情報はありません<br><br>';
				} else {
					content = 'Not Found detail about <b>' + select_name + '</b> in DBPedia<br><br>';
				}
			}
			if (img != undefined) {
				content += '<br><br><image src="' + img + '"></image><br>';
			}
			content += '<br>' + dbpedia + '<br>' + wikipedia + '<br>';
		} else {
			if (dbp_lang == 'ja') {
				content = 'DBPediaに <b>' + select_name + '</b> の情報はありません<br><br>';
			} else {
				content = 'Not Found about <b>' + select_name + '</b> in DBPedia<br><br>';
			}
			content += '<br>' + wikipedia + '<br>';
		}

		//		content += "<br><br>"+ ep;


		$('#' + contentdiv).html(content);
		if (div != undefined) {
			$('#' + div).show();
		}

	};

	var query =
		'select ?s ?comment ?image ("' + label + '" as ?name) {\n' +
		'	 {\n' +
		'	  ?s <http://www.w3.org/2000/01/rdf-schema#label> "' + label + '"@' + dbp_lang + '.\n' +
		'	 } optional {\n' +
		'	  ?s <http://www.w3.org/2000/01/rdf-schema#comment> ?comment.\n' +
		'	    FILTER(lang(?comment) = "' + dbp_lang + '").\n' +
		'	 } optional {\n' +
		'	  ?s <http://dbpedia.org/ontology/thumbnail> ?image.\n' +
		'	 }\n' +
		'	} limit 100';

	var qr = sendQuery(dbp_ep, query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus + "' occurred.");
		}
	);
	qr.done(
		function (d) {
			view_dbp(d);

		}
	);

}
