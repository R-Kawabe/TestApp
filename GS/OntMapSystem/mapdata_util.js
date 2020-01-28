/**
 * マップ用データ周りutil
 */

var json;
var colorTypes;

var DEFAULT_QUERY_TYPE = 3;

$(window).load(function() {
	if ($('#popup_process_map')[0] == undefined){
		$(':root').append(
				$('<div></div>')
				.attr({
					'id': 'popup_process_map',
					'width': '400px',
					'height': '200px'
				})
		);
		$('#popup_process_map').html('search in progress');
		$('#popup_process_map').hide();
	}
});

/**
 * マップデータをクリア
 */
function clear_json(){
	if (json != null){
		for (var j=0; j<json['nodes'].length; j++){
			delete json['nodes'][j];
		}
		for (var j=0; j<json['links'].length; j++){
			delete json['links'][j];
		}
		delete json['nodes'];
		delete json['links'];
		delete json;
	}

	json = [];
	json['nodes'] = new Array();
	json['links'] = new Array();

}

/**
 * 色見本をクリア
 */
function clear_colorType(){
	if (colorTypes != null){
		delete colorTypes;
	}
	colorTypes = [];
}

// typeは3か2のいずれか
//3の場合は s type p o type p o type ...
//2の場合は s p o p o p o ...


/**
 * sparqlの検索結果からマップ用データを生成する
 * @param data	sparql検索結果データ
 * @param type	3か2のいずれか
 *              3の場合は s type p o type p o type ...
 *              2の場合は s p o p o p o ...
 */
function make_json(data, type, typeUtil){

	var ret = null;

	if (type == undefined){
		type = DEFAULT_QUERY_TYPE;
	}

	var viewText = $('#show_label').is(':checked');

	for (var d=0; d<data.length; d++){
		var datum = data[d];
		var i=0;
		var srcNode = get_item_index(json['nodes'], ' ', ' ', 0, undefined, 'center', viewText);
		var linkVal = ' ';
		var depth = 0;

		// TODO
		if (target != undefined){
			depth = target.depth - 1;
			srcNode = target.parent;
		}

		var destNode = '';

		for (var key in datum){
			var val = datum[key].value;
			val = get_resource_label(val);
			if ((type == 3 && i % 3 == 0) || (type == 2 && i % 2 == 0)){
				// o c p のノード
				destNode = get_item_index(json['nodes'], val, datum[key].value, ++depth, srcNode, linkVal, viewText);
				add_link(json['links'], srcNode, destNode, linkVal, 1, viewText);
			} else if ((type == 3 && i % 3 == 1)){
				// 偶数インデックスはノード
				// 奇数インデックスはリンク
				var c;
				if (colorTypes[val] == undefined){
					// 存在しない
					c = Object.keys(colorTypes).length;
					c = color(c);
					colorTypes[val] = c;
				} else {
					c = colorTypes[val];
				}

				json['nodes'][destNode].color = c;
			} else {
				// 奇数インデックスはリンク

				linkVal = val;
				srcNode = destNode;
			}
			i++;
		}
	}

	var count = 0;
	for (var i=0; i<json['links'].length; i++){
		if (json['links'][i].source == 0){
			count ++;
		}
	}
	if (count < 2){
		for (var i=0; i<json['links'].length; i++){
			if (json['links'][i].source == 0){
				json['links'].splice(i,1);
				break;
			}
		}
	}

	if (typeUtil != null){
		ret = bind_nodes(json);
	} else {
		ret = json;
	}

	set_map_location(1, ret['nodes'], ret['links']);


	function bind_nodes(json){
		var ret = {};
		var work = $.extend(true, {}, json);
		var leafDepth = 0;

		for (var i=0; i<work.nodes.length; i++){
			if (work.nodes[i].depth > leafDepth){
				leafDepth = work.nodes[i].depth;
			}
		}

		var countOfTheDepth = 0;
		for (var depth=1; depth <= leafDepth; depth++){
			var maxByDepth = 1;
			if (typeUtil.maxByDepth.length > (depth-1)){
				maxByDepth = typeUtil.maxByDepth[depth-2];
			} else {
				maxByDepth = typeUtil.maxByDepth[typeUtil.maxByDepth.length-1];
			}
			var prevCount = 0;
			while(true){
			prevCount = countOfTheDepth;
			countOfTheDepth = 0;

			for (var i=0; i<work.nodes.length; i++){
				if (work.nodes[i].depth == depth && work.nodes[i].binded == null && !work.nodes[i].binder){
					// そのdepthごとの表示全ノード数
					countOfTheDepth ++;
				}
			}
			// 全ノード数が範囲より多い、もしくはそれ以上束ねられない場合は次へ
			if (countOfTheDepth < maxByDepth || prevCount == countOfTheDepth){
				ret = work;
				break;;
			}

			ret = {};
			ret.nodes = new Array();
			ret.links = new Array();
			var leafs = [];

			for (var i=0; i<work.nodes.length; i++){
				if (work.nodes[i].depth == depth && // 深さが該当
					(work.nodes[i].binded == null) && // 束ねられたノードではない
					(!hasChildren(work.nodes[i], work.links) || work.nodes[i].binder) // 子を持っていない、あるいは束ねるノードである
						){
					// そのdepthのleafノードである
					if (work.nodes[i].parent != null){
						if (leafs[work.nodes[i].parent] == null){
							leafs[work.nodes[i].parent] = {'parent':work.nodes[i].parent, 'leafs':new Array()};
						}
//						var resource = typeUtil.findNodeByName(work.nodes[i].name);
//						if (resource != null){
						leafs[work.nodes[i].parent].leafs.push(work.nodes[i]);
//						}
					}
				}
			}

			if (leafs.length == 0){
				continue;
			}

			leafs.sort(
				function(a,b){
					if (a.leafs.length > b.leafs.length) return -1;
					if (a.leafs.length < b.leafs.length) return 1;
					return 0;
				}
			);

			var delete_links = [];
			for (var i in leafs){
				if (leafs[i].leafs != null && leafs[i].leafs.length < 2){
					break;
				}
				var binds = typeUtil.bindData(leafs[i].leafs);

				// TODO bindsが元のデータから圧縮されているか
				// duplicatesに格納されているIDのデータは削除し、親ノードデータに置換する。

				for (var j in binds.duplicate){
					var count = work.nodes.length;
					var item = get_item_index(work.nodes, binds.duplicate[j].name + "*", binds.duplicate[j].name, depth, parseInt(leafs[i].parent), null, work.nodes[parseInt(j)].viewText);

					// 暫定処理。束ねたノードに固有の色を振る
//					work.nodes[item].color = work.nodes[parseInt(j)].color;
					if (colorTypes['Creature(BIND)'] == undefined){
						// 存在しない
						c = Object.keys(colorTypes).length;
						c = color(c);
						colorTypes['Creature(BIND)'] = c;
					} else {
						c = colorTypes['Creature(BIND)'];
					}
					work.nodes[item].color = c;


					work.nodes[item].binder = true; // 束ねるノードである
					if (work.nodes.length != count){
						// ノードが追加された、すなわち、リンクが追加されている

						add_link(ret.links, leafs[i].parent, item, ' ', 1, binds.duplicate[j].viewText);
					}

//					work.nodes[j].binded = true;
					work.nodes[j].parent = item;
//					work.nodes[j].depth ++;

					typeUtil.addExtra(item, work.nodes[parseInt(j)]);

					for (var k=0; k<work.links.length; k++){
						if (work.links[k].source == leafs[i].parent){
							if (work.links[k].target == parseInt(j)){
								delete_links.push(k);

								add_link(ret.links, item, parseInt(j), ' ', 1, binds.duplicate[j].viewText);

							}
						}
					}

				}

				for (var j in binds.duplicate){
					work.nodes[j].binded = true;
					work.nodes[j].depth ++;

					// ノードが持つ子の深さもすべて+1する
					updateDepth(parseInt(j), work.nodes);
				}

			}
			var linkSize = work.links.length;
			for (var j=0; j<linkSize; j++){
				if (delete_links.indexOf(j) >= 0){
//					work.links[j].binded = true;
				} else {
				ret.links.push(work.links[j]);
				}
			}

			// 仮処理（ノードの差し替えが必要?）
			// TODO 削除してしまうとノードを開くことができなくなる
			var workSize = work.nodes.length;
			for (var i=0; i<workSize; i++){
				ret.nodes.push(work.nodes[i]);
			}
			// 既存workをクリア
			clearWork(work);

			work = ret;
//			break;

			// 深さ更新（処理を抜き出したい）
			for (var i=0; i<work.nodes.length; i++){
				if (work.nodes[i].depth-1 > dep){
					dep = work.nodes[i].depth-1;
				}

				WIDTH = dep * 2 * CIRCLE_SIZE + 160;
				HEIGHT = WIDTH;
			}


			}
		}

		if (ret.nodes == null){
			ret.nodes = new Array();
			ret.links = new Array();
		}

		return ret;
	}

	function updateDepth(id, nodes){
		// ノードが持つ子の深さもすべて+1する
		for (var i=0; i<nodes.length; i++){
			if (nodes[i].parent == id){
				nodes[i].depth ++;
				if (nodes[i].label.endsWith('*')){
					updateDepth(i, nodes);
				}
			}
		}
	}

	function clearWork(work){
		work.nodes.length = 0;
		work.links.length = 0;
	}

	function hasChildren(node, links){
		for (var i=0; i<links.length; i++){
			var link = links[i];
			if (node.index == link.source){
				return true;
			}
		}
		return false;
	}

	return ret;
}



function get_item_index(item, label, name, depth, parent, type, viewText){
	for (var i=0; i<item.length; i++){
		if (item[i].name == name && item[i].depth == depth && item[i].parent == parent){
			return i;
		}
	}
	if (viewText == undefined){
		viewText = true;
	}

	item.push({'index':item.length, 'label':label, 'name':name, 'depth': depth, 'parent': parent, 'viewText': viewText, 'x':(WIDTH/2), 'y':(HEIGHT/2)});

	//
	{
		if (depth-1 > dep){
			dep = depth-1;
		}

		WIDTH = dep * 2 * CIRCLE_SIZE + 160;
		HEIGHT = WIDTH;
	}

	return item.length-1;
}

function add_link(links, source, dest, label, value, viewText){
	for (var i=0; i<links.length; i++){
		if (links[i].source == source && links[i].target == dest){
			return;
		}
	}
	if (viewText == undefined){
		viewText = true;
	}

	links.push({'source':source, 'target':dest, 'label': label, 'viewText': viewText,'value':value});

	return;
}


/**
 * リソースの文字列表現を取得
 */
function get_resource_label(resource){
	if (resource == null){
		return '';
	}
	var i = resource.lastIndexOf('/');
	var ret = resource;
	if (i > 0){
		ret = resource.substring(i + '/'.length);
	}
	ret = ret.replace(/%20/g, " ");
	return ret;
}

/**
 * 指定マップデータ中から、ラベルが指定文字列を含むデータを返す
 * @param data	マップデータ（ノードもしくはリンク）
 * @param word		指定文字列
 * @param find_type	検索タイプ（'full':完全一致 それ以外：部分一致）
 * @returns {Array}	該当データの配列
 */
function find_word_in_mapdata(data, word, find_type){
	var ret = new Array();
	for (var i=0; i<data.length; i++){
		if (find_type == 'full'){
			// 完全一致
			if (data[i].label.toLowerCase() == word.toLowerCase()){
				ret.push(data[i]);
			}
		} else {
			// 部分一致
			if (data[i].label.toLowerCase().indexOf(word.toLowerCase()) >= 0){
				ret.push(data[i]);
			}
		}
	}
	return ret;
}

/**
 * ルートから指定インデックスノードまでの経路を取得する
 * @param data		mapdata
 * @param index		ノードインデックス
 * @returns {Array} パスのノード・リンク一覧
 */
function get_path(data, index, path){
	if (path == undefined){
		path = [];
		path.nodes = new Array();
		path.links = new Array();
		path.nodes.push(data.nodes[index]);
	}

	for (var i=0; i<data.links.length; i++){
		var myIndex;
		var linkIndex;
		myIndex = data.links[i].target;
		linkIndex = data.links[i].source;
		if (myIndex == index){
			path.links.unshift(data.links[i]);
			path.nodes.unshift(data.nodes[linkIndex]);
			get_path(data, linkIndex, path);
		}
	}

	return path;
}


//make query

//typeは3か2のいずれか
//3の場合は s type p o type p o type ...
//2の場合は s p o p o p o ...

function make_route_query(start, end, depth, lang, type, limit, offset){
	var query =
		'prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n' +
		'prefix rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
		'prefix bio:<http://biomimetics.hozo.jp/class/>\n';

	if (type == undefined){
		type = DEFAULT_QUERY_TYPE;
	}

	query +=
		'select distinct ?ol0';
		if (type == 3){
			query += ' ?tl0';
		}

		for (var i=0; i<depth; i++){
			query += ' ?pl' +(i+1) + ' ?ol' +(i+1);
			if (type == 3){
				query += ' ?tl' +(i+1);
			}
		}
		query +=
			'{\n'+
			'{ ?o' + depth + ' rdfs:subClassOf+ <'+end+'>.}\n'+
			// 処理としてはよくないけど一応動く
			'UNION { ?o' + depth + ' rdfs:label "'+end.substring(end.lastIndexOf('/')+1)+'"@ja. }\n'+

			'{<' + start + '> ?p1 ?o1.} UNION {?o1 ?p1 <' + start + '>.}\n'+
			'  ?p1 rdfs:label ?pl1.\n'+
			'  FILTER(lang(?pl1) = "' +lang+ '")\n'+
			'  MINUS {<' + start + '> rdfs:subClassOf ?o1.}\n'+
//			'  MINUS {?o1 rdfs:subClassOf <' + start + '>.}\n'+
			'  <' + start + '> rdfs:label ?ol0.\n'+
			'  FILTER(lang(?ol0) = "' +lang+ '")\n';
		if (type == 3){
			query +=
			'  <' + start + '> rdf:type ?st.\n'+
			'  ?st rdfs:label ?tl0.\n'+
			'  FILTER(lang(?tl0) = "' +lang+ '")\n';
		}

		for (var i=1; i<depth; i++){
			var oldO;
			if (i == 1){
				oldO = '<' + end + '>';
			} else {
				oldO = '?o' +(i-1);
			}

			//kozaki　同一パスで同じノードを通らないようなフィルタ
			var node_filter='';
			for (var k=1; k<i; k++){
				node_filter += 'FILTER(?o' +(i+1)+ ' != ?o' + k + ')\n';
			}

			query +=
//			'{?o' +(i+1)+ ' ?p' +(i+1)+ ' ?o' +i+ '.} UNION {?o' +i+ ' ?p' +(i+1)+ ' ?o' +(i+1)+ '.}\n';
//			'{?o' +(i+1)+ ' ?p' +(i+1)+ ' ?o' +i+ '.'+'FILTER(?p' +(i+1)+ ' != rdfs:subClassOf)} UNION {?o' +i+ ' ?p' +(i+1)+ ' ?o' +(i+1)+ '.}\n';
				'{?o' +(i+1)+ ' ?p' +(i+1)+ ' ?o' +i+ '.} UNION {?o' +i+ ' ?p' +(i+1)+ ' ?o' +(i+1)+ '.'+'FILTER(?p' +(i+1)+ ' != rdfs:subClassOf)}\n';

				if (i == (depth-1)){
//				query +=
//				' UNION {?o' +i+ ' ?p' +(i+1)+ ' <' +end+ '>.} UNION {<' +end+ '> ?p' +(i+1)+ ' ?o' +i+ '.}\n';
			}
			query +=
			'?p' +(i+1)+ ' rdfs:label ?pl' +(i+1)+ '.\n'+
			'FILTER(lang(?pl' +(i+1)+ ') = "' +lang+ '")\n'+
			//'FILTER(?o' +(i+1)+ ' != ' + oldO + ')\n'+
			'FILTER(?o' +(i+1)+ ' != <' + start + '>)\n'; //koaki　ルートの重複を下げる
			if (i != (depth-1)){
				query +=

// 下の二行をコメントアウトし、その下の二行のコメントアウトを外すと
// 経路にtypeが生体クラスのリソースが含まれるデータを除外する
//					'FILTER NOT EXISTS {?o' +i+ ' rdfs:subClassOf+ <' +end+ '>}\n'+
//					'FILTER NOT EXISTS {?o' +(i+1)+ ' rdfs:subClassOf+ <' +end+ '>}\n';
				'FILTER NOT EXISTS {?o' +i+ ' rdf:type  bio:生体.}\n'+
				'FILTER NOT EXISTS {?o' +(i+1)+ ' rdf:type bio:生体.}\n';
			}


			query +=
			node_filter+
// 下の一行をコメントアウトすると、subClass関係にある経路を除外する
//			'MINUS{?o' +i+ ' rdfs:subClassOf ?o' +(i+1)+ '}\n'+
//			'MINUS{?o' +(i+1)+ ' rdfs:subClassOf ?o' +i+ '}\n'+
			'MINUS{?o' +i+ ' rdf:type ?o' +(i+1)+ '}\n'+
			'MINUS{?o' +(i+1)+ ' rdf:type ?o' +i+ '}\n'+
			'MINUS{?o' +i+ ' rdfs:label ?o' +(i+1)+ '}\n'+
			'MINUS{?o' +(i+1)+ ' rdfs:label ?o' +i+ '}\n';


			if (type == 3){
				query +=
				'?o' +i+ ' rdf:type ?t' +i+ '.\n'+
				'?t' +i+ ' rdfs:label ?tl' +i+ '.\n'+
				'FILTER(lang(?tl' +i+ ') = "' +lang+ '")\n';

			}
			query +=
			'?o' +i+ ' rdfs:label ?ol' +i+ '.\n'+
			'FILTER(lang(?ol' +i+ ') = "' +lang+ '")\n';

		}

		if (type == 3){
			query +=
			'  ?o' + depth + ' rdf:type ?t' + depth + '.\n'+
			'  ?t' + depth + ' rdfs:label ?tl' + depth + '.\n'+
			'  FILTER(lang(?tl' + depth + ') = "' + lang +'")\n';
		}
		query +=
		'  ?o' + depth + ' rdfs:label ?ol' + depth + '.\n'+
		'  FILTER(lang(?ol' + depth + ') = "' + lang +'")\n' +
		'}';

		if (limit != null){
			query += " LIMIT "+(limit+1);
			if (offset != null){
				query += " OFFSET "+(limit * offset);
			}
		}

//	alert(query);

		return query;
}

function make_extra_query(word, isRev, lang, type){

	if (type == undefined){
		type = DEFAULT_QUERY_TYPE;
	}

	var query;
	if (!isRev){
		query = 'select distinct ("' + word +'" as ?slabel)';
		if (type == 3){
			query += ' ?stypelabel';
		}
		query +=  '?plabel ?olabel';
		if (type == 3){
			query += ' ?ltypelabel';
		}
		query +=  ' {\n' +
		'?s <http://www.w3.org/2000/01/rdf-schema#label> "' + word + '"@' + lang + ';\n' +
		' <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type;\n' +
		' ?p ?o.\n';
		if (type == 3){
			query +=
			'?type <http://www.w3.org/2000/01/rdf-schema#label> ?stypelabel.\n' +
			' FILTER(lang(?stypelabel) = "' + lang + '")\n';
		}
		query +=
		'?p <http://www.w3.org/2000/01/rdf-schema#label> ?plabel.\n' +
		' FILTER(lang(?plabel) = "' + lang + '")\n' +
		'?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?ltype;\n' +
		' <http://www.w3.org/2000/01/rdf-schema#label> ?olabel.\n' +
		' MINUS {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?o}\n' +
		' FILTER(lang(?olabel) = "' + lang + '")\n';
		if (type == 3){
			query +=
			'?ltype <http://www.w3.org/2000/01/rdf-schema#label> ?ltypelabel.\n' +
			' FILTER(lang(?ltypelabel) = "' + lang + '")\n';
		}
		query +=
		'}\n';
	} else {
		query = 'select distinct ("' + word +'" as ?slabel)';
		if (type == 3){
			query += ' ?stypelabel';
		}
		query +=  '?plabel ?olabel';
		if (type == 3){
			query += ' ?ltypelabel';
		}
		query +=  ' {\n' +
		'?s <http://www.w3.org/2000/01/rdf-schema#label> "' + word + '"@' + lang + ';\n' +
		'<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type.\n';
		if (type == 3){
			query +=
			'?type <http://www.w3.org/2000/01/rdf-schema#label> ?stypelabel.\n' +
			' FILTER(lang(?stypelabel) = "' + lang + '")\n';
		}
		query +=
		'?o ?p ?s;\n' +
		' <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?ltype;\n' +
		' <http://www.w3.org/2000/01/rdf-schema#label> ?olabel.\n' +
		'?p <http://www.w3.org/2000/01/rdf-schema#label> ?plabel.\n' +
		' FILTER(lang(?plabel) = "' + lang + '")\n' +
		' FILTER(lang(?olabel) = "' + lang + '")\n';
		if (type == 3){
			query +=
			'?ltype <http://www.w3.org/2000/01/rdf-schema#label> ?ltypelabel.\n' +
			' FILTER(lang(?ltypelabel) = "' + lang + '")\n';
		}
		query +=
		'}\n';
	}

	return query;
}

function view_process_popup(show){
	if (show){
		$('#popup_process_map').dialog({
			closeOnEscape: false,
			modal:true,
			draggable:true,
			open:function(event, ui){ $(".ui-dialog-titlebar-close").hide();}
		});
	} else {
		$('#popup_process_map').dialog('close');
		 $(".ui-dialog-titlebar-close").show();
	}
}
