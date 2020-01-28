/**
 * マップ以外の、付加情報表示を行う
 * ・pathデータ
 * ・色見本
 */

/**
 * パス表示を行う
 * @param p_nodes パス表示を行うノードの情報
 * @param p_links パス表示を行うリンクの情報
 * @param id パス表示を行うDIVのID
 * @param w DIVの幅
 */
function view_path(p_nodes, p_links, id, w){

	clear_path(id);

	id = "#" + id;
	
	var width = 220;

	var width = width;
	var height = p_nodes.length * 30 * 2; // 仮


	var svg = d3.select(id).append("svg")
	.attr("width", w)
	.attr("height", height);


	// ノードパス描画
	var path_nodes = svg.selectAll(".pathrect")
	.data(p_nodes)
	.enter().append("rect")
	.attr("x", 10)
	.attr("y", function(d) { return p_nodes.indexOf(d) * 30 * 2;} )
	.style("fill", function(d) { return d.color == undefined ? color(d.depth) : d.color; })
	.attr("width", 200)
	.attr("height", 30)
	;

	// ノードパステキスト描画
	var path_tnodes = svg.selectAll("text.pathrect")
	.data(p_nodes)
	.enter().append("svg:text")
	.attr("class", "tnode")
	.attr("x", function(d) { return width / 2; })
	.attr("y", function(d) { return p_nodes.indexOf(d) * 30 * 2 + 30 / 1.5;})
	.text(function(d) {
		return d.label;
		})
	.style("font-weight", "lighter")
	.style("stroke", function(d) { return '#000000'; })
	.style("stroke-width", function(d) { return '0.5px'; })
	.style("text-anchor", function(d) { return 'middle'; })
	.style("cursor", function(d) { return 'pointer'; });

	// ノードパス描画
	var path_links = svg.selectAll(".pathlink")
	.data(p_links)
	.enter().append("line")
	.attr("x1", width / 2)
	.attr("y1", function(d, i) { return i * 30 * 2 + 30;} )
	.attr("x2", width / 2)
	.attr("y2", function(d, i) { return i * 30 * 2 + 30 * 2;} )
	.style("stroke", 'black')
	;

	// ノードパステキスト描画
	var path_tlinks = svg.selectAll("text.pathlink")
	.data(p_links)
	.enter().append("svg:text")
	.attr("class", "tnode")
	.attr("x", function(d) { return width / 2 + 10; })
	.attr("y", function(d, i) { return i * 30 * 2 + 30 + 30 / 1.5;})
	.text(function(d) {
		return d.label;
		})
	.style("font-weight", "lighter")
	.style("stroke", function(d) { return '#000000'; })
	.style("stroke-width", function(d) { return '0.5px'; })
	.style("text-anchor", function(d) { return 'left'; })
	.style("cursor", function(d) { return 'pointer'; });


}

/**
 * パス表示をすべてクリアする
 * @param id パス表示するDIVのID
 */
function clear_path(id){
	id = "#" + id;

	// 既にカンバスが存在する場合は削除する
	if (d3.select(id).select("svg")) {
		d3.select(id).select("svg").remove();
	}

	
}

/**
 * カラーサンプルを表示する
 * @param samples カラーサンプルデータ（色：名前のmap）
 * @param id 表示するDIVのID
 */
function view_colorSample(samples, id){
	id = "#" + id;
	var test = '';
	for (var key in samples){
		test += '<font color="' + samples[key] + '">■</font> ' + key + "<br/>";
	}
	$(id).html(test);
}
