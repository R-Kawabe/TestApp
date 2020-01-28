/**
 * マップ表示を行う
 * 2015/01/14 おなじ層・おなじ名前のノードは束ねる処理を追加
 */


// 幅
var WIDTH = 1280;
// 高さ
var HEIGHT = 1280;
// マップの輪の基準サイズ
var CIRCLE_SIZE = 100;

// マップの深さ
var dep = 3;


var link;
var tlink;
var node;
var tnode;
var arrows;

var mapdata;

var layout_type = 2;

// カテゴリ色
var color = d3.scale.category20();


/**
 * マップ表示メイン
 * @param data	マップデータ（d3.jsのForce準拠（詳細はデータ仕様書に記述））
 * @param id	表示DIVのID
 */
function view_map(data, id){

	// データはD3のForce準拠
	mapdata = data;

	// 座標調整
	set_map_location(0, mapdata['nodes'], mapdata['links']);


	var width = WIDTH,
	height = HEIGHT;


	if (id == undefined){
		id = 'body';
	} else {
		id = "#" + id;
	}

	// 既にカンバスが存在する場合は削除する
	if (d3.select(id).select("svg")) {
		d3.select(id).select("svg").remove();
	}

	// ドラッグイベント
	var drag = d3.behavior.drag().on("drag", function(d,i) {
		d.x += d3.event.dx;
		d.y += d3.event.dy;

//		d. isDrag = true;
		redraw();
	});


	// カンバス追加
	var svg = d3.select(id).append("svg")
		.attr("width", width)
		.attr("height", height);

	// マップサークル描画（深さはデータの深さに応じて変更）
	var mc = new Array();
	for (var i=0; i<dep; i++){
		mc.push((dep-i) * CIRCLE_SIZE);
	}

	var mapCircle = svg.selectAll(".mapCircle")
	.data(mc)
	.enter().append("circle")
	.attr("class", "map")
	.attr("r", function(d) { return d;})
	.attr("cx", function(d) { return (WIDTH/2);} )
	.attr("cy",  function(d) { return (dep * CIRCLE_SIZE + 30); })
	.style("stroke-dasharray", ("5, 5"))
	.style("fill", function(d) { return '#eeeeee'; })
	.style("stroke", function(d) { return '#000000'; })
	.style("opacity", 0.3);

	// ノード間リンク描画
	link = svg.selectAll(".link")
	.data(mapdata.links)
	.enter().append("line")
	.attr("class", "link")
	.style("cursor", function(d) { return 'pointer'; })
	.style("stroke-width", function(d) { return Math.sqrt(d.value); });

	// 矢印は両方向分描画しておき、再描画時にリンクデータに応じて描画するしないを確定する
  	var arrowname = new Array();
//	if (true){ // target方向にarrowあり
		arrowname.push('adr');
		arrowname.push('adl');
//	}

//	if (true){ // source方向にarrowあり
		arrowname.push('asr');
		arrowname.push('asl');
//	}

	arrows = [];

	for (var i=0; i<arrowname.length; i++){
		arrows[arrowname[i]] = svg.selectAll("arrow.link")
		.data(mapdata.links)
		.enter().append("line")
		.attr("class", "link");
	}

	// ノード間リンクテキスト描画
	tlink = svg.selectAll("text.link")
	.data(mapdata.links)
	.enter().append("svg:text")
	.attr("class", "tlink")
	.attr("x", function(d) {
		return (mapdata.nodes[d.source].x + mapdata.nodes[d.target].x) / 2;
	})
	.attr("y", function(d) { return (mapdata.nodes[d.source].y + mapdata.nodes[d.target].y) / 2; })
	.text(function(d) { return d.label; }) // TODO リンク文字
	.style("cursor", function(d) { return 'pointer'; })
	.style("stroke-width", function(d) { return '0.5px'; })
	.style("stroke", function(d) { return '#000000'; })
	.style("text-anchor", function(d) { return 'middle'; });

	// ノード描画
	node = svg.selectAll(".node")
	.data(mapdata.nodes)
	.enter().append("circle")
	.attr("class", "node")
	.attr("r", 20)
	.attr("cx", function(d) { return d.x;} )
	.attr("cy",  function(d) { return d.y; })
	.style("stroke", function(d) { return '#ffffff'; })
	.style("stroke-width", function(d) { return '1.5px'; })
	.style("fill", function(d) { return d.color == undefined ? color(d.depth) : d.color; })
	.style("cursor", function(d) { return 'pointer'; })
	.call(drag);

	// ノードテキスト描画
	tnode = svg.selectAll("text.node")
	.data(mapdata.nodes)
	.enter().append("svg:text")
	.attr("class", "tnode")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.text(function(d) { return d.label; })
	.style("font-weight", "lighter")
	.style("stroke", function(d) { return '#000000'; })
	.style("stroke-width", function(d) { return '0.5px'; })
	.style("text-anchor", function(d) { return 'middle'; })
	.style("cursor", function(d) { return 'pointer'; })
	.call(drag);

	node.append("title")
	.text(function(d) { return d.name; });

	// リンククリックで選択
	link.on("click", function(d, i){
		linkClick(d, this);
	});
	link.on("mouseover", function(d, i){
		linkHovered(d, true);
	});
	link.on("mouseout", function(d, i){
		linkHovered(d, false);
	});
	tlink.on("click", function(d, i){
		// 引数に渡すのはthisではなく対応するnode
		linkClick(d, link[0][i]);
	});
	tlink.on("mouseover", function(d, i){
		linkHovered(d, true);
	});
	tlink.on("mouseout", function(d, i){
		linkHovered(d, false);
	});

	function linkClick(d, me){
		d3.selectAll(".link").style("stroke-width", function(d) { return Math.sqrt(d.value); });
		d3.select(me).style("stroke-width", function(d) { return 10; });
	};
	function linkHovered(d, isHovered){
		if (typeof link_hover_event == "function"){
			link_hover_event(d, isHovered);
		}
	};

	function nodeClick(d, me){
		if (!d. isDrag){
			d3.selectAll(".node").style("stroke-width", function(d) { return '1.5px'; });
			d3.selectAll(".node").style("stroke", function(d) { return '#ffffff'; });
			d3.select(me).style("stroke-width", function(d) { return 2; });
			d3.select(me).style("stroke", function(d) { return '#ff0000'; });

			if (typeof node_event == "function"){
				node_event(d, me);
			}
		}
		d.isDrag = false;
	};

	function nodeRightClick(d, me){
		if (typeof node_rightclick_event == "function"){
			node_rightclick_event(d, me);
		}
	};


	function addRightClickEvent(objs, func){
		for (var i=0; i<objs[0].length; i++){
			var obj = objs[0][i];
			if (obj.oncontextmenu == undefined){
				$(obj).bind('contextmenu', function(evnt){
					window.event = evnt;
					func(evnt.target.__data__, evnt.target);
					return false;
				});
			} else {
				obj.oncontextmenu = function(evnt){
					func(evnt.srcElement.__data__, evnt.srcElement);
					return false;
				};
			}
		}
	};


	// ノードクリックで選択
	node.on("click", function(d, i){
		nodeClick(d, this);
	});
	// 右クリックイベント
	addRightClickEvent(node, function(d, obj){
		nodeRightClick(d, obj);
	});
	addRightClickEvent(tnode, function(d, obj){
		nodeRightClick(d, node[0][d.index]);
	});

	node.on("mouseover", function(d, i){
		nodeHovered(d, true);
	});
	node.on("mouseout", function(d, i){
		nodeHovered(d, false);
	});
	tnode.on("click", function(d, i){
		// 引数に渡すのはthisではなく対応するnode
		nodeClick(d, node[0][i]);
	});
	tnode.on("mouseover", function(d, i){
		nodeHovered(d, true);
	});
	tnode.on("mouseout", function(d, i){
		nodeHovered(d, false);
	});



	function nodeHovered(d, isHovered){
		if (typeof node_hover_event == "function"){
			node_hover_event(d, isHovered);
		}
	};


	node.on("dblclick", function(d){
		nodeDblClick(d);
	});
	tnode.on("dblclick", function(d){
		nodeDblClick(d);
	});

	function nodeDblClick(d){
		if (typeof node_dblclick_event == "function"){
			node_dblclick_event(d);
		}
	};


	// 画面クリックでリンク選択解除
	mapCircle.on("click", function(d){
		d3.selectAll(".node").style("stroke-width", function(d) { return '1.5px'; });
		d3.selectAll(".node").style("stroke", function(d) { return '#ffffff'; });
		d3.selectAll(".link").style("stroke-width", function(d) { return Math.sqrt(d.value); });

		if (typeof map_click_event == "function"){
			map_click_event(d);
		}


	});

	redraw();
}



/*
// 内部

function addRightClickEvent(objs, func){
	for (var i=0; i<objs[0].length; i++){
		var obj = objs[0][i];
		if (obj.oncontextmenu == undefined){
			$(obj).bind('contextmenu', function(evnt){
				window.event = evnt;
				func(evnt.target.__data__, evnt.target);
				return false;
			});
		} else {
			obj.oncontextmenu = function(evnt){
				func(evnt.srcElement.__data__, evnt.srcElement);
				return false;
			};
		}
	}
}
*/

/**
 * 再描画処理
 */
function redraw(){

	// 基本ベクトル算出
	function vec(sx, sy, dx, dy){
		var vx = (dx - sx);
		var vy = (dy - sy);
		var dist = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
		var ret = [];
		ret.x = vx / dist;
		ret.y = vy / dist;

		return ret;
	};

	// ノード半径を算出
	function getR(d){
		var r = 15;

		if (d.blink != null){
			if (d.blink % 2 == 1){
				r = 25;
			} else {
				r = 30;
			}
		} else
		if (d.selected >=2){
			r = 30;
		} else if (d.selected == 1){
			r = 15;
		} else if (d.viewText == false){
			r = 10;
		} else {
			r = 15;
		}

		return r;

//		return d.selected >= 2 ? 30: (d.selected == 1 ? 15 : (d.viewText == false ? 10 : 15));
	};


	link
//	.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
	.attr("visibility", function(d) {return ((d.view == false || ((d.binded || d.binder == false) && !d.selected)) ? "hidden" : "visible");})
	//	.attr("visibility", function(d) {return ((d.view == false) ? "hidden" : "visible");})
	.style("stroke-width", function(d) { return d.selected ? 4 : (d.highlight ? 4 : Math.sqrt(d.value)); })
	.style("stroke", function(d) { return d.selected >= 2 ? '#900' : '#999'; })
	.attr("x1", function(d) {return node.data()[d.source].x;})
	.attr("y1", function(d) {return node.data()[d.source].y;})
	.attr("x2", function(d) {return node.data()[d.target].x;})
	.attr("y2", function(d) {return node.data()[d.target].y;});

	tlink
	.attr("visibility", function(d) {return (d.view == false || d.binded || d.binder == false) ? "hidden" : (d.selected ? "visible" : (d.viewText == false ? "hidden" : "visible"));})
	.style("stroke", function(d) { return d.selected >= 2 ? '#F00' : '#FFF'; })
	.attr("x", function(d) {return (node.data()[d.source].x + node.data()[d.target].x) / 2;})
	.attr("y", function(d) {
		var ret = (node.data()[d.source].y + node.data()[d.target].y) / 2;
		if (d.direction == 'forward'){
			ret -= 10;
		}
		if (d.direction == 'backward'){
			ret += 10;
		}
		return ret;});
	node
//	.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
	.attr("visibility", function(d) {return ((d.view == false || ((d.binded || d.binder == false) && !d.selected)) ? "hidden" : "visible");})
	.attr("r", function(d) {return getR(d); })
	.style("fill", function(d) {
		var c =  d.color == undefined ? color(d.depth) : d.color;
//		c = (d.selected ? c : (d.viewText == false ? d3.rgb(c).darker(2) : c));
		return c; })
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;});

	tnode
	// 暫定処理。束ねられたノードの文字は常に表示。
//	.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : (d.selected ? "visible" : ((d.viewText == false && !d.binder) ? "hidden" : "visible")));})
	.attr("visibility", function(d) {return ((d.view == false || ((d.binded || d.binder == false) && !d.selected)) ? "hidden" : (d.selected ? "visible" : ((d.viewText == false && !d.binder && d.blink == null) ? "hidden" : "visible")));})
//	.attr("visibility", function(d) {return ((d.view == false || ((d.binded || d.binder == false) && !d.selected)) ? "hidden" : "visible");})
//	.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : (d.selected ? "visible" : (d.viewText == false ? "hidden" : "visible")));})
	.text(function(d) {return d.open == false ? d.label + "[+]" : d.label;})
	.style("stroke", function(d) { return d.selected >= 2 ? '#FF0000' : '#000000'; })
	.style("font-size", function(d) {  return d.selected >= 2 ? '30px' : '18px'; })
	.attr("x", function(d) {return d.x;})
	.attr("y", function(d) {return d.y;});

	if (arrows['adr'] != undefined){
		arrows['adr']
		.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
		.style("stroke-width", function(d) { return d.selected ? 4 : (d.highlight ? 4 : Math.sqrt(d.value)); })
		.style("stroke", function(d) { return d.selected >= 2 ? '#900' : '#999'; })
		.attr("x1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * (r + 20));
			} else {
				return tn.x;
			}})
		.attr("y1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * (r + 20));
			} else {
				return tn.y;
			}})
		.attr("x2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r);
			} else {
				return tn.x;
			}})
		.attr("y2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r);
			} else {
				return tn.y;
			}})
		.attr("transform", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			return 'rotate(25, '
			+ (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
			+ (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';});
		}

	if (arrows['adl'] != undefined){
		arrows['adl']
		.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
		.style("stroke-width", function(d) { return d.selected ? 4 : (d.highlight ? 4 : Math.sqrt(d.value)); })
		.style("stroke", function(d) { return d.selected >= 2 ? '#900' : '#999'; })
		.attr("x1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * (r + 20));
			} else {
				return tn.x;
			}})
		.attr("y1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * (r + 20));
			} else {
				return tn.y;
			}})
		.attr("x2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r);
			} else {
				return tn.x;
			}})
		.attr("y2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			if (d.direction == 'forward' || d.direction == 'both'){
				return (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r);
			} else {
				return tn.y;
			}})
		.attr("transform", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(tn);
			return 'rotate(-25, '
			+ (tn.x - vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
			+ (tn.y - vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';});
	}

	if (arrows['asr'] != undefined){
		arrows['asr']
		.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
		.style("stroke-width", function(d) { return d.selected ? 4 : (d.highlight ? 4 : Math.sqrt(d.value)); })
		.style("stroke", function(d) { return d.selected >= 2 ? '#900' : '#999'; })
		.attr("x1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.x + vec(sn.x, sn.y, tn.x, tn.y).x * r);
			} else {
				return sn.x;
			}})
		.attr("y1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.y + vec(sn.x, sn.y, tn.x, tn.y).y * r);
			} else {
				return sn.y;
			}})
		.attr("x2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.x + vec(sn.x, sn.y, tn.x, tn.y).x * (r + 20));
			} else {
				return sn.x;
			}})
		.attr("y2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.y + vec(sn.x, sn.y, tn.x, tn.y).y * (r + 20));
			} else {
				return sn.y;
			}})
		.attr("transform", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			return 'rotate(25, '
					+ (sn.x + vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
					+ (sn.y + vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';});
	}

	if (arrows['asl'] != undefined){
		arrows['asl']
		.attr("visibility", function(d) {return ((d.view == false || d.binded || d.binder == false) ? "hidden" : "visible");})
		.style("stroke-width", function(d) { return d.selected ? 4 : (d.highlight ? 4 : Math.sqrt(d.value)); })
		.style("stroke", function(d) { return d.selected >= 2 ? '#900' : '#999'; })
		.attr("x1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.x + vec(sn.x,sn.y, tn.x, tn.y).x * r);
			} else {
				return sn.x;
			}})
		.attr("y1", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.y + vec(sn.x,sn.y, tn.x, tn.y).y * r);
			} else {
				return sn.y;
			}})
		.attr("x2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.x + vec(sn.x,sn.y, tn.x, tn.y).x * (r + 20));
			} else {
				return sn.x;
			}})
		.attr("y2", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			if (d.direction == 'backward' || d.direction == 'both'){
				return (sn.y + vec(sn.x,sn.y, tn.x, tn.y).y * (r + 20));
			} else {
				return sn.y;
			}
			})
		.attr("transform", function(d) {
			var sn = node.data()[d.source];
			var tn = node.data()[d.target];
			var r = getR(sn);
			return 'rotate(-25, '
			+ (sn.x + vec(sn.x, sn.y, tn.x, tn.y).x * r) + ', '
			+ (sn.y + vec(sn.x, sn.y, tn.x, tn.y).y * r) + ')';});
	}

};

/**
 * 指定されたインデックスのノードより深いリンクとノードを（表示／非表示）にする
 * @param nodeIndex ノードインデックス
 * @param value		 true:表示　false:非表示　未指定の場合はトグル
 */
function close_node(nodeIndex, value){

	var children = new Array();
	for (var i=0; i<mapdata.nodes.length; i++){
		var node = mapdata.nodes[i];
		if (node.open == undefined){
			node.open = true;
		}
		if (node.parent == nodeIndex){
			children.push(node.index);
		}
	}
	if (children.length == 0){
		// 子供がいない場合は閉じない
		return;
	}

	if (value == undefined){
		value = mapdata.nodes[nodeIndex].open;
		if (value == undefined){
			value = true;
		}
	}
	value = !value;

	mapdata.nodes[nodeIndex].open = value;

//	close_node_recurse(nodeIndex, mapdata, value);

	for (var i=0; i<mapdata.nodes.length; i++){
		var node = mapdata.nodes[i];
		if (node.parent != undefined && mapdata.nodes[node.parent].open){
			if (node.parent == nodeIndex){
				children.push(node.index);
			}
		}
	}
	for (var i=0; i<children.length; i++){
		close_node_recurse(children[i], mapdata, value);
	}

	close_links(mapdata);

	// 座標調整
	set_map_location(0, mapdata['nodes'], mapdata['links']);
//	set_map_location(1, mapdata['nodes'], mapdata['links']);


	redraw();

}

/**
 * ノード開閉処理（再帰）
 * 内部UIなので外部からはアクセスしないこと
 * @param index		ノードインデックス
 * @param mapdata	マップデータ
 * @param value		true:開く　false:閉じる
 */
function close_node_recurse(index, mapdata, value){
	var children = new Array();

	for (var i=0; i<mapdata.nodes.length; i++){
		var node = mapdata.nodes[i];
		if (node.index == index){
			node.view = value;
		}
		if (node.open == undefined){
			node.open = true;
		}
		if (node.parent != undefined && mapdata.nodes[node.parent].open){
			if (node.parent == index){
				children.push(node.index);
			}
		}
	}
	for (var i=0; i<children.length; i++){
		close_node_recurse(children[i], mapdata, value);
	}

}

/**
 * リンク開閉処理（再帰）
 * リンク開閉状態をノード開閉状態と一致させる
 * 内部UIなので外部からはアクセスしないこと
 * @param mapdata	マップデータ
 */
function close_links(mapdata){
	for (var i=0; i<mapdata.links.length; i++){
		var link = mapdata.links[i];
		if (mapdata.nodes[link.target].view == false){
			link.view = false;
		} else {
			link.view = true;
		}
		link.binded = mapdata.nodes[link.target].binded;
		link.binder = mapdata.nodes[link.target].binder;
	}

}


function unbind_node(nodeIndex, bindedNodeList, value){

	var bindedNodes = bindedNodeList;

	if (nodeIndex != null){
		bindedNodes = [];
		bindedNodes[nodeIndex] = bindedNodeList;
	}
	for (nodeIndex in bindedNodes){
		var bindedNode = bindedNodes[nodeIndex];
		for (var i=0; i<bindedNode.length; i++){
			var node = bindedNode[i];
			if (node.binded == undefined){
				node.binded = false;
			}
			if (value != null){
				node.binded = value;
			} else {
				node.binded = !node.binded;

				// トグルで開かれた場合、ノードにblink属性を追加する
				if (!node.binded){
					node.blink = 1;
				}
			}
			if (!node.binded){
				// リンク張替え(すっかり繋ぎ換えてしまう)
				node.parent = find_parent(nodeIndex); // parentを探すIF
				node.depth = mapdata.nodes[node.parent].depth + 1;
				for (var j=0; j<mapdata.links.length; j++){
					if (mapdata.links[j].source == mapdata.nodes[nodeIndex].index){
						mapdata.links[j].source = node.parent;
					}

				}
				// その子のdepthも書き換え
				// ノードが持つ子の深さもすべて-1する
				for (var k=0; k<mapdata.nodes.length; k++){
					if (mapdata.nodes[k].parent == node.index){
						mapdata.nodes[k].depth --;
					}

				}
			}

		}
		// とりあえずトグル
		if (value != null){
			mapdata.nodes[nodeIndex].binder = value;
		} else {
			mapdata.nodes[nodeIndex].binder = !mapdata.nodes[nodeIndex].binder;
			if (!mapdata.nodes[nodeIndex].binder){
				mapdata.nodes[nodeIndex].view = false;
			}
		}
	}

	close_links(mapdata);

	// 座標調整
	set_map_location(0, mapdata.nodes, mapdata.links);
//	set_map_location(1, mapdata['nodes'], mapdata['links']);


	redraw();

	function find_parent(index){
		var parent =  mapdata['nodes'][index].parent;
		if (mapdata['nodes'][parent].binder != null){
			return find_parent(parent);
		}
		return parent;
	}

	if (timer == null){
		timer = setInterval('blink()',300);
	}
}

var timer = null;

function blink(){
	var exists = false;
	for (var i=0; i<mapdata.nodes.length; i++){
		var node = mapdata.nodes[i];
		if (node.blink != null){
			node.blink ++;
			exists = true;
		}
		if (node.blink > 5){
			delete node['blink'];
		}
	}
	if (!exists){
		clearInterval(timer);
		timer = null;
	}
	redraw();

}

/**
 * ノードのハイライト表示を行う
 * @param index		ハイライト表示を行う起点ノードのインデックス
 * @param reverse	true:起点ノードからルート方向に辿る false:起点ノードから葉方向に辿る　未指定:自分のみ
 * @param path
 * @param highlight
 */
function node_highlight(index, reverse){

	if (reverse == undefined){
		mapdata.nodes[index].viewText = true;
		return;
	}

	for (var i=0; i<mapdata.links.length; i++){
		var myIndex;
		var linkIndex;
		if (reverse){
			myIndex = mapdata.links[i].target;
			linkIndex = mapdata.links[i].source;
		} else {
			myIndex = mapdata.links[i].source;
			linkIndex = mapdata.links[i].target;
		}
		if (myIndex == index){
			// ハイライト設定
			mapdata.nodes[linkIndex].viewText = true;
			mapdata.links[i].viewText = true;
			mapdata.links[i].highlight = true;
			node_highlight(linkIndex, reverse);
		}
	}
}

/**
 * ノードのハイライトをクリアする
 */
function highlight_clear(){
	// 全クリア
	for (var i=0; i<mapdata.nodes.length; i++){
		mapdata.nodes[i].viewText = false;
	}
	for (var i=0; i<mapdata.links.length; i++){
		mapdata.links[i].viewText = false;
		mapdata.links[i].highlight = false;
	}

}



/**
 * ノード選択
 * ノードは選択種別を持つ。種別は外見からは識別できない。
 * 選択クリアの時に種別を指定する
 * @param index			ノードインデックス
 * @param selectType	選択種別
 * @param reverse		true:起点ノードからルート方向に辿る false:起点ノードから葉方向に辿る　未指定:自分のみ
 */
function node_select(index, selectType, reverse, viewBind){
	if (selectType == undefined){
		selectType = true;
	}

	if (reverse == undefined){
		mapdata.nodes[index].selected = selectType;
		return;
	}

	for (var i=0; i<mapdata.links.length; i++){
		var myIndex;
		var linkIndex;
		if (reverse){
			myIndex = mapdata.links[i].target;
			linkIndex = mapdata.links[i].source;
		} else {
			myIndex = mapdata.links[i].source;
			linkIndex = mapdata.links[i].target;
		}
		if (myIndex == index){
			// ハイライト設定
			if (mapdata.nodes[linkIndex].selected == null ||mapdata.nodes[linkIndex].selected == false){
				// TODO viewBindを考慮する
				if ((viewBind == null && (mapdata.nodes[linkIndex].binded == null || !mapdata.nodes[linkIndex].binded) && (mapdata.nodes[linkIndex].binder == null || mapdata.nodes[linkIndex].binder)) ||
					(viewBind && (mapdata.nodes[linkIndex].binded))){
					mapdata.nodes[linkIndex].selected = selectType;
				}

			}
			if ((viewBind == null &&  (mapdata.nodes[linkIndex].binded == null || !mapdata.nodes[linkIndex].binded) && (mapdata.nodes[linkIndex].binder == null || mapdata.nodes[linkIndex].binder)) ||
					(viewBind && (mapdata.nodes[linkIndex].binded))){
				mapdata.links[i].selected = selectType;
			}
			node_select(linkIndex, selectType, reverse, viewBind);
		}
	}
}

/**
 * ノード選択解除
 * 指定した種別（ノード／リンク）の、指定した選択種別の選択を解除する
 * （複数選択種別を解除する場合は複数回コールする必要がある）
 * @param type			'both':ノードおよびリンク 'nodes':ノードのみ 'links':リンクのみ
 * @param selectType	解除する選択種別
 */
function select_clear(type, selectType){
	if (mapdata == null || mapdata.nodes == null || mapdata.links == null){
		return;
	}
	if (type == undefined || type == 'nodes' || type == 'both'){
		// 全クリア
		for (var i=0; i<mapdata.nodes.length; i++){
			if (selectType == undefined || mapdata.nodes[i].selected == selectType){
				mapdata.nodes[i].selected = false;
			}
		}
	}
	if (type == undefined || type == 'links' || type == 'both'){
		for (var i=0; i<mapdata.links.length; i++){
			mapdata.links[i].selected = false;
		}
	}
}

/**
 * ノードの選択種別を取得する
 * @param index	ノードインデックス
 * @returns	選択種別
 */
function get_node_select_type(index){
	return 	mapdata.nodes[index].selected;

}

/**
 * リンクの選択種別を取得する
 * @param index	リンクインデックス
 * @returns	選択種別
 */
function get_link_select_type(index){
	return 	mapdata.links[index].selected;

}

/**
 * ラベルの表示・非表示を行う
 * @param isVisible 表示状態
 */
function view_label(isVisible){
	for (var i=0; i<mapdata.nodes.length; i++){
		mapdata.nodes[i].viewText = isVisible;
	}
	for (var i=0; i<mapdata.links.length; i++){
		mapdata.links[i].viewText = isVisible;
	}
	redraw();

}

/**
 * データに基づき、マップの位置調整を行う
 * @param myNodeIndex　位置調整を開始するインデックス
 * @param nodes			ノード情報
 * @param links			リンク情報
 * @param depth			マップの深さ（明示的な指定不要）
 * @param fromAngle		開始角度（明示的な指定不要）
 * @param toAngle		終了角度（明示的な指定不要）
 */
function set_map_location(myNodeIndex, nodes, links, depth, fromAngle, toAngle){
	var func;

	if (nodes == null || nodes.length == 0){
		return;
	}

	if (layout_type == 0){
		func = set_map_location_1;
	} else if (layout_type == 1){
		func = set_map_location_2;
	} else {
		func = set_map_location_3;
	}
	func(myNodeIndex, nodes, links, depth, fromAngle, toAngle);
}

function set_map_location_3(myNodeIndex, nodes){

	// 最初にalign用にノードの並び替えを行う
	var tmpnodes = new Array();

	for (var i=0; i<nodes.length; i++){
		nodes[i].angle = 0;
	}

	set_map_location_3_sort_recurse(0, nodes, tmpnodes);

	// ここでleafノードの角度を決定している
	// leafノードはmaxdepthのノードに限らず、ノードの末端であればよい。
	// それぞれにユニークな角度が割り振られる。
	var angleunit = 0;
	var maxdepth = 0;
	var leafnodes = new Array();

	var bindMap = {}; // keyのIDを持つノードで、そのvalue配列のIDのノードが束ねられる
	for (var i=0; i<tmpnodes.length; i++){
		if (tmpnodes[i].depth > maxdepth){
			maxdepth = tmpnodes[i].depth;
		}
		var hasChild = false;
		for (var j=0; j<tmpnodes.length; j++){
			if (tmpnodes[j].parent == tmpnodes[i].index){
				hasChild = true;
				break;
			}
		}
		if (!hasChild){
			var hasSame = false;
/*
			for (var k=0; k<leafnodes.length; k++){
				if (leafnodes[k].label == tmpnodes[i].label && leafnodes[k].depth == tmpnodes[i].depth){
					// 名前と深さがおなじノードが存在する場合、対象としない
					hasSame = true;
					if (bindMap[leafnodes[k].index] == null){
						bindMap[leafnodes[k].index] = new Array();
					}
					bindMap[leafnodes[k].index].push(i);
					break;
				}
			}
*/
			if (!hasSame){
				leafnodes.push(tmpnodes[i]);
			}
		}

	}
	angleunit = 1 / leafnodes.length;
	for (var i=0; i<leafnodes.length; i++){
		leafnodes[i].angle = (angleunit * i);

		if (bindMap[leafnodes[i].index] != null){
			for (var j=0; j<bindMap[leafnodes[i].index].length; j++){
				tmpnodes[bindMap[leafnodes[i].index][j]].angle = leafnodes[i].angle;
			}
		}
	}

	// leafノード以外のノードの位置が決定される
	// 位置はleafノードの位置を元に決定される。
	if (maxdepth > 1){
		set_map_location_3_recurse(tmpnodes, maxdepth-1);
	}
	var count = 0;
	for (var i=0; i<tmpnodes.length; i++){
		if (tmpnodes[i].parent == 0){
			count++;
		}
	}
	var d = 0;
	if (count < 2){
		d = 1;
	}


	for (var i=0; i<tmpnodes.length; i++){
		var depth = tmpnodes[i].depth - d;
		if (depth < 0) depth = 0;
		var x = (WIDTH/2) + depth * CIRCLE_SIZE * Math.sin(2 * 3.14 * (tmpnodes[i].angle));
		var y = (dep * CIRCLE_SIZE + 30) + depth * CIRCLE_SIZE * Math.cos(2 * 3.14 * (tmpnodes[i].angle));
		tmpnodes[i].x = x;
		tmpnodes[i].y = y;
	}


}

function set_map_location_3_sort_recurse(index, nodes, target){
//	if (nodes[index].view != false && nodes[index].binded != true && nodes[index].binder != false){
	if (nodes[index].view != false && nodes[index].binder != false){
		target.push(nodes[index]);
		for (var i=0; i<nodes.length; i++){
			if (nodes[i].parent === index){
				set_map_location_3_sort_recurse(nodes[i].index, nodes, target);
			}
		}
	}
}

function set_map_location_3_recurse(nodes, depth){

	var dnodes = new Array();
	for (var i=0; i<nodes.length; i++){
		if (nodes[i].depth == depth){
			dnodes.push(nodes[i]);
		}
	}

	for (var i=0; i<dnodes.length; i++){
		var c = 0;
		for (var j=0; j<nodes.length; j++){
			if (nodes[j].parent == dnodes[i].index){
				c++;
				dnodes[i].angle += nodes[j].angle;
			}
		}
		if (c > 0){
			dnodes[i].angle /= c;
		}
	}

	if (depth > 0){
		set_map_location_3_recurse(nodes, depth-1);
	}

}

function set_map_location_2(myNodeIndex, nodes, links, depth, fromAngle, toAngle){

	if (nodes.length ==0 || links.length == 0){
		return;
	}

	if (depth == undefined){
		depth = 0;
	}
	if (fromAngle == undefined){
		fromAngle = 0;
	}
	if (toAngle == undefined){
		toAngle = 1;
	}

	var children = undefined;
	var parent = undefined;

	for (var i=0; i<links.length; i++){
		if (links[i].target == myNodeIndex){
			parent = links[i].source;
		}
	}

	if (parent != undefined){
		// 最上位ではない
		parentsChildren = get_children(parent, nodes);
	}

	var x = (WIDTH/2) + depth * CIRCLE_SIZE * Math.sin(2 * 3.14 * ((toAngle + fromAngle) / 2));
	var y = (dep * CIRCLE_SIZE + 30) + depth * CIRCLE_SIZE * Math.cos(2 * 3.14 * ((toAngle + fromAngle) / 2));
	nodes[myNodeIndex].x = x;
	nodes[myNodeIndex].y = y;



	children = get_children(myNodeIndex, nodes);

	for (var i=0; i<children.length; i++){
		var child = children[i];

		var d = depth + 1;
		if (depth == 0 && children.length == 1){
			d = depth;
		}

		set_map_location_2(child, nodes, links, d, fromAngle + ((toAngle - fromAngle) / children.length) * i, fromAngle + ((toAngle - fromAngle) / children.length) * (i+1));
	}

}

function get_children(index, nodes){
	var children = new Array();

	for (var i=0; i<nodes.length; i++){
		if (nodes[i].parent == index){
			children.push(nodes[i].index);
		}
	}

	return children;
}


function set_map_location_1(myNodeIndex, nodes, links){
	var ary = get_node_depthes(myNodeIndex, nodes, links, 0);

	// 中央ノードの位置はそのまま
	var dd = 0;
	for (var d=0; d<ary.length; d++){
		var data = ary[d];
		for (var i=0; i<data.length; i++){
			var ddd = dd;
			if (d == 0 && data.length == 1){
				ddd = 0;
			} else {
				ddd = dd + 1;
			}
			var x = (WIDTH/2) + (ddd)* CIRCLE_SIZE * Math.sin(2 * 3.14 * (i / data.length));
			var y = (dep * CIRCLE_SIZE + 30) + (ddd)* CIRCLE_SIZE * Math.cos(2 * 3.14 * (i / data.length));
			nodes[data[i]].x = x;
			nodes[data[i]].y = y;
		}

		if (d == 0 && data.length == 1){
			// 最上位を省略する
		} else {
			dd ++;
		}

	}

}


function get_node_depthes(myNodeIndex, nodes, links, depth, array){
	if (nodes[myNodeIndex].view == false){
		return [];
	}

	if (array == undefined){
		array = new Array();
	}

	if (array.length < depth){
		// depth0は配列不要
		array.push(new Array());
	}


	if (depth > 0){
		var nodesInDepth = array[depth-1];
		if (nodesInDepth.indexOf(myNodeIndex) < 0){
			nodesInDepth.push(myNodeIndex);
		}
	}

	for (var i=0; i<nodes.length; i++){
		if (nodes[i].parent == myNodeIndex){
			get_node_depthes(nodes[i].index, nodes, links, depth+1, array);
		}
	}


	return array;

}
