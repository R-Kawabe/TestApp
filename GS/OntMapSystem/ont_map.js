/* 
 * 法造からRDF形式で出力したオントロジーを探索するプログラム
 * 「ontology_map.html」のフォームから情報を取得する形になっているので注意
 * 
 */

var lang = 'ja';
var type = 3;
var dep = 4;

var limit = 100;
var offset = 0;

var popup;

$(window).load(function() {


	$('#find_query').click(function(){
		var query = $('#query_text').val();

		target = null;
		$('#dbp').hide();

		offset = 0;
		dep = 2;
		make_link($('#query_index').val());

	});

	$('#dbp').hide();
	$('#dbp').draggable();
	$('#dbp_header').click(function(event){
		$('#dbp').hide();
	});

	$('#path').hide();
	$('#path').draggable();
	$('#path_header').click(function(event){
		$('#path').hide();
	});

	$('#extra').hide();
	$('#extra').draggable();
	$('#extra_header').click(function(event){
		$('#extra').hide();
	});

	$('#show_label').change(function(event){
		view_label($('#show_label').is(':checked')); // TODO
		redraw();
	});

	$('#clear_highlight').click(function(event){
		clearSelect();
	});

	$('#findbtn').click(function(event){
		find_word($('#findword').val(), 'part');
	});

	$('#findclear').click(function(event){
		select_clear('nodes', 2);
		redraw();
	});

	init();


	$('#query_depth').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});
	$('#query_index').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});

	$('#find_limit').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});

	$('#find_prev').click(function(){
		var query = $('#query_text').val();
		target = null;
		$('#dbp').hide();

		dep = 2;
		offset --;
		make_link($('#query_index').val());

	});

	$('#find_next').click(function(){
		var query = $('#query_text').val();
		target = null;
		$('#dbp').hide();

		dep = 2;
		offset ++;
		make_link($('#query_index').val());

	});


	$('#find_prev').attr('disabled', true);
	$('#find_next').attr('disabled', true);

	var parm = getParameter();
	if(parm != null){
		if(!(parm['start'] === undefined)){
			alert(parm['start']);
			var query = $('#query_text').val();

		target = null;
		$('#dbp').hide();

		offset = 0;
		dep = 2;
		make_link(parm['start']);
		}
		
	}

});

function init(){

	// Servletサーバアドレス

	init_dbp(lang);

	// 検索対象エンドポイント（途中での改行は不可）

	popup = new PopupMenu();
	// popup.add('Show Info', function(obj, d){
	// 	find_dbp(d.label, 'dbp_contents', 'dbp');
	// });

	popup.add('Show Path', function(obj, d){

		// 指定ノードへのpathを取得する
		var path = get_path(mapdata, d.index);

		$('#path').show();

		view_path(path.nodes, path.links, 'path_contents', 400);

	});
	popup.addSeparator();
	popup.add('Jamp to details page', function(obj, d){
		var name = encodeURIComponent(d.label);
		// var url = 'http://www.google.com/search?q='+name;
		var url = 'https://www.city.osaka.lg.jp/shimin/cmsfiles/contents/0000460/460869/' + name;
		 window.open(url);

	});
	// popup.add('Search on Google Scholar', function(obj, d){
	// 	var name = encodeURIComponent(d.label);
	// 	var url = 'http://scholar.google.com/scholar?q='+name;
	// 	 window.open(url);
	// });
	// popup.add('Search on CiNii', function(obj, d){
	// 	var name = encodeURIComponent(d.label);
	// 	var url = 'http://ci.nii.ac.jp/search?q='+name;
	// 	 window.open(url);
	// });
	// popup.add('Search on Nature Tech DB', function(obj, d){
	// 	var name = encodeURIComponent(d.label);
	// 	var url = 'http://nature-sr.com/index.php?Page=10&SearchString='+name;
	// 	 window.open(url);
	// });
	// popup.addSeparator();
	// popup.add('Explore Next..(forward)', function(obj, d){
	// 	find_extra(d);
	// });
	// popup.add('Explore Next..(backward)', function(obj, d){
	// 	find_extra(d, true);
	// });

	// popup.addSeparator();
	// popup.add('Save Search Keywords', function(obj, d){
	// 	var path = get_path(mapdata, d.index);
	// 	//view_path(path.nodes, path.links, 'path_contents', 400);
	// 	var text ='';
	// 	for(i=0;i<path.nodes.length;i++){
	// 		text+=path.nodes[i].label+' ';
	// 	}
	// 	//alert(text);
	// 	handleDownload(text);
	// //alert('TEST');
	// });
}

function make_link(i){

	clear_json();
	clear_colorType();

	query_type = i;
	query_index = 2;

	target = undefined;

	limit = $('#find_limit').val();
	limit = parseInt(limit);
	if (limit == 0){
		limit = null;
	}

	// 複数queryを投げる
	view_process_popup(true);

	var qr = sendQuery($('#endpoint').val(), make_route_query(query_type, $('#endclass').val(), query_index, lang, type, limit, offset));

//	var qr = sendQuery($('#endpoint').val(), make_route_query(query_type, 'http://biomimetics.hozo.jp/class/生物', query_index, lang, type, limit, offset));


	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			d = d.results.bindings;
			view_result(d);
		}
		);
}

function view_result(data){

	if (limit != null){
		if (data.length > limit){
			$('#find_next').attr('disabled', false);
		} else {
			$('#find_next').attr('disabled', true);
		}
		if (offset != 0){
			$('#find_prev').attr('disabled', false);
		} else {
			$('#find_prev').attr('disabled', true);
		}
	}

	view_map(make_json(data, type), 'map');

	var depth = $('#query_depth').val();

	if (query_index < depth){
		var qr = sendQuery($('#endpoint').val(), make_route_query(query_type, $('#endclass').val(), ++query_index, lang, type, limit, offset));
		
		qr.fail(
				function (xhr, textStatus, thrownError) {
					alert("Error: A '" + textStatus+ "' occurred.");
				}
			);

		qr.done(
				function (d) {
					d = d.results.bindings;
					view_result(d);
				}
			);

	} else {
		view_process_popup(false);
	}

	view_colorSample(colorTypes, 'color_sample');
}


function node_rightclick_event(d, obj){
	popup.bind(obj);
	popup.show();
}



function node_event(d, obj){
//	clearSelect();
	select_clear('nodes', 2);

	// 関連ノードのviewTextをtrueにする
	node_highlight(d.index);

	if ($('#path_root:checked').val()){
		node_highlight(d.index, true);
	}
	if ($('#path_leafs:checked').val()){
		node_highlight(d.index, false);
	}

	redraw();

}

function node_hover_event(d, isHovered){
	select_clear('both', true);
	select_clear('both', 3);

	if (isHovered){
		// 関連ノードのselectedをtrueにする
		if (get_node_select_type(d.index) != 2){
			node_select(d.index, 3);
		}

		if ($('#path_root:checked').val()){
			node_select(d.index, true, true);
		}
		if ($('#path_leafs:checked').val()){
			node_select(d.index, true, false);
		}
	}

	redraw();
}

function node_dblclick_event(d){

	// TODO map.jsは整理しないといけない
	close_node(d.index);

}

function map_click_event(d){
	select_clear();
	highlight_clear();
	clear_path('path');
	redraw();
}

// extra
var target;

function find_extra(t, isRev){
	target = t;

	var query = make_extra_query(t.name, isRev, lang);

	var qr = sendQuery($('#endpoint').val(), query);
	qr.fail(
			function (xhr, textStatus, thrownError) {
				alert("Error: A '" + textStatus+ "' occurred.");
			}
		);

	qr.done(
			function (d) {
				d = d.results.bindings;
				view_extra(d);
			}
		);


}

function view_extra(data){
	var table = $('#extra_info_table')[0];

	if (table == undefined){
		$('#extra_contents').append(
					$('<table></table>')
					.attr({
						'id': 'extra_info_table',
						'class': 'table'
					})
			);
		table = $('#extra_info_table')[0];
	}

	if ($('#extra_info_button')[0] == undefined){
		$('#extra_contents').append(
				$('<input>')
				.attr({
					'id': 'extra_info_button',
					'type': 'button',
					'value': '追加'
				})
		);
	}

	while(table.rows.length > 0){
		table.deleteRow(0);	// 行を追加
	}

	if (data instanceof Array){
		$('#extra').show();
		// ヘッダ
		var header = table.createTHead();	// 行を追加
		var headerRow = header.insertRow(0);

		id = 1;
		for (var d=0; d<data.length; d++){
			var row1 = table.insertRow(d+1);	// 行を追加

			if (d == 0){
				var i=0;

				var th = document.createElement('th');
				th.innerHTML = '<input type="checkbox" id="ckall">';
				headerRow.appendChild(th);


				for (var key in data[0]){
					if (key.value == 's'){
						continue;
					}

					var th = document.createElement('th');
					th.innerHTML = key;
					headerRow.appendChild(th);
				}
			}

			var i=0;

			var cell = row1.insertCell(i++);	// 最初はチェックボックスを追加
			cell.innerHTML = '<input type="checkbox" id="ck' + d +'">';

			// ID
			for (var key in data[d]) {
				if (key.value == 's'){
					continue;
				}
				var cell = row1.insertCell(i);	// ２つ目以降のセルを追加
				var value = data[d][key].value;

				if (value == null){
					value = '';
				}

				cell.innerHTML = value;

				i++;
			}
		}
	}

	$('#ckall').change(function(){
		var chk = false;
		if($(this).is(':checked')) {
			chk = true;
		}
		for (var d=0; d<data.length; d++){
			$('#ck'+d).prop('checked', chk);
		}

	});



	$('#extra_info_button').unbind('click');

	$('#extra_info_button').click(function(){
		// TODO チェックされているデータ列を抜き出して表示
		var new_data = new Array();

		for (var d=0; d<data.length; d++){
			if ($('#ck'+d).prop('checked')){
				new_data.push(data[d].value);
			}
		}

		view_map(make_json(new_data), 'map');
	});
}

function clearSelect(){
	map_click_event();
}

//find word
function find_word(word, type){
	select_clear('nodes', 2);
	var find = find_word_in_mapdata(json['nodes'], word, type);
	for (var i=0; i<find.length; i++){
//		find[i].selected = 2;
		node_select(find[i].index, 2);
	}
	redraw();

}


function handleDownload(text) {

	prompt('検索キーワードの保存',text);
	
	writeToLocal('search_key.txt', text);

}


//GETのパラメータを取得する処理
function getParameter()
{
    var result = {};
    if( 1 < window.location.search.length )
    {
        var query = window.location.search.substring( 1 );

        var parameters = query.split( '&' );

        for( var i = 0; i < parameters.length; i++ )
        {
            var element = parameters[ i ].split( '=' );
            var paramName = decodeURIComponent( element[ 0 ] );
            var paramValue = decodeURIComponent( element[ 1 ] );
            result[ paramName ] = paramValue;
        }
    }
    return result;
}