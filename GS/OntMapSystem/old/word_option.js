/**
 *
 */

String.prototype.replaceAll = function (org, dest){
  return this.split(org).join(dest);
}


if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            return this.lastIndexOf(searchString) === position;
        }
    });
}

String.prototype.htmlEscape = function() {
	var obj = document.createElement('pre');
    if (typeof obj.textContent != 'undefined') {
        obj.textContent = this;
    } else {
        obj.innerText = this;
    }
    var ret = obj.innerHTML.replace(/%20/g, " ");


    return ret;

};

/**
 * ワード検索初期化
 * @param endpoint
 * @param lang
 * @param div_id
 * @returns {WordFind}
 */
function WordFind(endpoint, lang, div_id){

	this.lang = lang;
	this.div_id = div_id;

	this.endpoint = endpoint;
}

WordFind.prototype.init = function(){

	$('#' + this.div_id).html('');


};

/**
 * クエリ作成
 */
WordFind.prototype.make_query = function(word, labelPred){
	var query;


	if (labelPred == null){
		labelPred = 'http://www.w3.org/2000/01/rdf-schema#label';
	}
	query =
		'select distinct ?subject ?label {\n' +
		' ?subject <' + labelPred + '> ?label.\n' +
		' FILTER regex(str(?label), "' + word + '", "i")\n';
	if (this.lang != undefined){
	query +=
		' FILTER (lang(?label) = "' + this.lang + '")\n';
	}

	query +=
		'}\n';

	return query;
};


/**
 * ワード検索実行
 * @param word		ワード
 * @param labelPred	ワードのpredicate
 * @param cb		結果取得時のコールバック
 */
WordFind.prototype.find_word = function(word, labelPred, cb){
	var qr = sendQuery(this.endpoint, this.make_query(word, labelPred));

	var me = this;

	$('#' + me.div_id).html('');


	qr.fail(
			function (xhr, textStatus, thrownError) {
				alert("Error: A '" + textStatus+ "' occurred.");
			}
		);

	qr.done(
			function(data){


				data = data.results.bindings;

		$('#' + me.div_id).append(
			$('<select></select>')
				.attr({
				'id': me.div_id + '_select',
				'size': 5
			})
		);

		var propStr = '';
		for (var i=0; i<data.length; i++){
			var elm = data[i];
			propStr += '<option value="' +elm.subject.value+'">'+elm.label.value.htmlEscape()+' ('+elm.subject.value.htmlEscape()+')</option>\n';
		}
		$('select#' + me.div_id + '_select').html(propStr);

		// 要素選択時イベント登録
		if (cb != null){

			// TODO
			$('select#' + me.div_id + '_select').change(function () {
				var resource = $('select#' + me.div_id + '_select').val();
				var text = $('select#' + me.div_id + '_select option:selected').text();
				text = text.substring(0, text.lastIndexOf(resource)-1).trim();

				cb(resource, text);
			});
		}

	}
			);


};


