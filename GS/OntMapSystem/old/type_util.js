/**
 * 種類情報を元に、データを束ねる
 */


var TypeUtil = function(treeData, maxByDepth){
	this.treeData = treeData;
	this.maxByDepth = maxByDepth;
	this.clearExtra();
};

TypeUtil.prototype.clearExtra = function(){
	this.extraData = {};
};

// 配列を渡してやると、その配列の要素数がひとつでも小さくなるレベルまでデータを束ねる。
TypeUtil.prototype.bindData = function(data){
	var ret = {'data':data, 'duplicate':{}};
	var nodes = new Array();

	for (var j=0; j<data.length; j++){
		for (var i in this.treeData.treeData){
			if (this.treeData.treeData[i].name == data[j].name.replaceAll('%20', ' ')){
				nodes.push(this.treeData.treeData[i]);
				break;
			}
		}
	}

	for (var dep=1; ; dep++){
		var dim = new Array();
		var end = true;
		for (var i=0; i<nodes.length; i++){
			var node = nodes[i];
			var parents = this.findParents(node, dep);
			if (parents.length < dep){
				// 最下位まで探索し切れなかった
			} else {
				// 探索の余地あり
				end = false;
			}
			dim.push(parents);
		}

		if (end){
			break;
		}

		// 重複した要素の一覧を取得
		var duplicates = check_duplicate(dim);
		if (duplicates.length > 0){
//			ret['data'] = new Array();
			// 要素ありなので戻り値を用意
			for (var j=0; j<dim.length; j++){
				var parents = dim[j];

//				item = data[j];
				for (var i=0; i<duplicates.length; i++){
					var duplicate = duplicates[i];

					if (parents.indexOf(duplicate) >= 0){
//						item = duplicate;
//						ret['duplicate'][data[j].index] = item;
						ret['duplicate'][data[j].index] = duplicate;
					}
				}
				/*
				if (ret['data'].indexOf(item) < 0){
					ret['data'].push(item);
				}*/
			}
			return ret;
		}
	}


	// 二次元配列に格納された値のうち、重複値のみを抽出して返す
	function check_duplicate(dim){
		var ret = new Array();
		var tmp = new Array();

		for (var x=0;x<dim.length; x++){
			var data = dim[x];
			for (var y=0;y<data.length; y++){
				if (tmp.indexOf(data[y]) >= 0){
					ret.push(data[y]);
				} else {
					tmp.push(data[y]);
				}
			}
		}
		return ret;
	}

	return ret;
};

/**
 * 指定リソースを持つノードを取得する
 * 存在しない場合はnullを返す
 * @param resource
 * @returns
 */
TypeUtil.prototype.findNode = function(resource){
	for (datum in this.treeData.treeData){
		datum = this.treeData.treeData[datum];
		if (datum.resource == resource){
			return datum;
		}
	}
	return null; // 該当なし
};

/**
 * 指定名を持つノードを取得する
 * 存在しない場合はnullを返す
 * @param name
 * @returns
 */
TypeUtil.prototype.findNodeByName = function(name){
	name = name.htmlEscape();
	for (datum in this.treeData.treeData){
		datum = this.treeData.treeData[datum];
		if (datum.name == name){
			return datum;
		}
	}
	return null; // 該当なし
};


/**
 * あるノードのdepthだけ上にある上位概念を取得する
 * 存在しない場合は自分自身を返す
 */
TypeUtil.prototype.findParent = function(node, depth){

	if (depth == null){
		depth = 1;
	}

	for (datum in this.treeData.treeData){
		datum = this.treeData.treeData[datum];
		if (datum.children.indexOf(node) >= 0){
			if (depth > 1){
				return this.findParent(datum, depth-1);
			}
			return datum;
		}
	}

	return node; // 該当なし
};

/**
 * あるノードの上位概念一覧を、指定depthだけさかのぼって取得する
 * @param node
 * @param depth
 * @returns
 */
TypeUtil.prototype.findParents = function(node, depth){

	var parents = new Array();

	if (depth == null){
		depth = 1;
	}

	for (var d = 1; d<=depth; d++){
		var parent = this.findParent(node, d);
		if (parent != node){
			if (parents.indexOf(parent) < 0){
				parents.push(parent);
			}
		}
	}

	return parents;
};

/**
 * bind元のIDと、bindされるデータを紐付ける。
 * 紐付けられるデータの中身は利用する側に依存するのでこのオブジェクトでは関知しない。
 * @param key
 * @param data
 */
TypeUtil.prototype.addExtra = function(key, data){
	if (this.extraData[key] == null){
		this.extraData[key] = [];
	}
	this.extraData[key].push(data);
};

/**
 * bind元のIDに紐づくbindデータを取得する。
 * データの中身はこのオブジェクトでは関知しないが、
 * 配列ということだけは把握している。
 * @param key
 * @returns
 */
TypeUtil.prototype.getExtra = function(key){
	if (key == null){
		return this.extraData;
	}
	return this.extraData[key];
};


