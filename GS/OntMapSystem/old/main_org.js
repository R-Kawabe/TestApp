
// マップの輪の基準サイズ
CIRCLE_SIZE = 100;

var type = 3; //

var popup;

var findWord;

var lang;

var limit = 100;
var offset = 0;

var typeTree;
var typeUtil;


$(window).load(function() {

	$('#find_query').click(function(){
		target = null;
		$('#dbp').hide();

		offset = 0;
		dep = 2;
		make_link();

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
		view_label($('#show_label').is(':checked'));
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

	// 検索処理
	$('#find').hide();
	$('#find_header').click(function(event){
		$('#find').hide();
	});
	$('#start_element').click(function(event){
		find_treeObj($('#tree'), $('#start_element'), 'http://biomimetics.hozo.jp/class/ゴール');
		$('#tree').show();
	});
	$('#end_element').click(function(event){
		find_treeObj($('#tree'), $('#end_element'), 'http://biomimetics.hozo.jp/class/生物');
		$('#tree').show();


	});


	$('#query_depth').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});

	$('#query_depth').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});

	$('#find_limit').change(function(event){
		$('#find_prev').attr('disabled', true);
		$('#find_next').attr('disabled', true);

	});

	init();

	$('#find_prev').click(function(){
		target = null;
		$('#dbp').hide();

		dep = 2;
		offset --;
		make_link();

	});

	$('#find_next').click(function(){
		target = null;
		$('#dbp').hide();

		dep = 2;
		offset ++;
		make_link();

	});


	$('#find_prev').attr('disabled', true);
	$('#find_next').attr('disabled', true);


	$('#tree').tree({});
	$('#tree').hide();

	$('#bind_enable').change(function(event){

		// 大本のデータを再展開する
		typeUtil.clearExtra();
		view_result(json, true);

	});

});

function init(){

	// Servletサーバアドレス

	init_dbp(lang);

	popup = new PopupMenu();
	popup.add('Show Info', function(obj, d){
		find_dbp(d.label, 'dbp_contents', 'dbp');
	});

	popup.add('Show Path', function(obj, d){

		// 指定ノードへのpathを取得する
		var path = get_path(mapdata, d.index);

		$('#path').show();

		view_path(path.nodes, path.links, 'path_contents', 400);

	});
	popup.addSeparator();
	popup.add('Search on Google', function(obj, d){
		var name = encodeURIComponent(d.label);
		var url = 'http://www.google.com/search?q='+name;
		 window.open(url);

	});
	popup.add('Search on Google Scholar', function(obj, d){
		var name = encodeURIComponent(d.label);
		var url = 'http://scholar.google.com/scholar?q='+name;
		 window.open(url);
	});
	popup.add('Search on CiNii', function(obj, d){
		var name = encodeURIComponent(d.label);
		var url = 'http://ci.nii.ac.jp/search?q='+name;
		 window.open(url);
	});
	popup.add('Search on Nature Tech DB', function(obj, d){
		var name = encodeURIComponent(d.label);
		var url = 'http://nature-sr.com/index.php?Page=10&SearchString='+name;
		 window.open(url);
	});
	popup.addSeparator();
	popup.add('Explore Next..(forward)', function(obj, d){
		find_extra(d);
	});
	popup.add('Explore Next..(backward)', function(obj, d){
		find_extra(d, true);
	});

	find_tree(new TreeData('type'), 'http://biomimetics.hozo.jp/class/生物', function(treeData){
		typeTree = treeData;
		typeUtil = new TypeUtil(typeTree, [10, 10, 30, 40]); // 二番目の引数は深さあたりの期待ノード数(深さごとの配列)
	});


}

function make_link(){

	clear_json();
	clear_colorType();
	typeUtil.clearExtra();

	query_index = 2;

	target = undefined;

	limit = $('#find_limit').val();
	limit = parseInt(limit);
	if (limit == 0){
		limit = null;
	}

	// 複数queryを投げる
	view_process_popup(true);

	var qr = sendQuery($('#endpoint').val(), make_route_query($('#start_element2').text(), $('#end_element2').text(), query_index, lang, type, limit, offset));
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

function view_result(data, refresh){

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

	var depth = $('#query_depth').val();

	var tu = typeUtil;

	if (query_index < depth && refresh == null){
		tu = null;
	}

	view_map(make_json(data, type, tu), 'map');

	if (query_index < depth){
		var qr = sendQuery($('#endpoint').val(), make_route_query($('#start_element2').text(), $('#end_element2').text(), ++query_index, lang, type, limit, offset));
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
		unbind_node(null, typeUtil.getExtra(), $('#bind_enable').val() == 'on');
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
		// bindノードをたどる
		if (d.binder){
			node_select(d.index, true, false, true);
		}
	}

	redraw();
}

function node_dblclick_event(d){

	// TODO map.jsは整理しないといけない
	if (d.binder){
		// TODO bindedノードを開く
		unbind_node(d.index, typeUtil.getExtra(d.index));
	} else {
		close_node(d.index);
	}

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
	/*
	sparql.result_func = view_extra;

	sparql.findByQuery(query);
	*/

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
				new_data.push(data[d]);
			}
		}

		view_map(make_json(new_data, null), 'map');
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