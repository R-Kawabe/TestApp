/**
 *
 */

var TreeData = function(idhead){
	this.idhead = idhead;
	this.clean();
};

TreeData.prototype.clean = function(){
	this.treeData = {};
	this.rootNode = undefined;
	this.labelList = {};
	this.resourceList = {};
	this.currentid = 0;

};

/**
 * d3.js用のデータをツリー形式に変換する
 */
TreeData.prototype.convertToTreeData = function(nodes,  baseNode){

	if (baseNode != null){
		for (var i=0; i<nodes.length; i++){
			var node = nodes[i];
			if (node.parent == baseNode.index){
				this.addSubClass(baseNode, node);
				this.convertToTreeData(nodes,node);
			}
		}
	}
};

/**
 * 自ノードデータに子ノードデータを追加する
 * @param myID
 * @param childID
 */
TreeData.prototype.addSubClass = function(myNode, childNode){
	var myTreeNode = this.getNodeJson(myNode);

	if (this.rootNode == null){
		this.rootNode = myTreeNode;
	}

	var childTreeNode = this.getNodeJson(childNode);
	this.addChildren(myTreeNode, childTreeNode);
};

/**
 * ノードIDからノードを取得・生成する。
 * @param node
 * @returns {___anonymous1517_1574}
 */
TreeData.prototype.getNodeJson = function(node){

	var ret = this.treeData[node.index];
	if (ret == undefined){
		ret = {'name' : node.label, 'id' : node.index, 'resource' : node.name, 'open' : true, 'children' : []}; // データ形式はどうにかする
		this.treeData[node.index] = ret;
	}

	return ret;
};


TreeData.prototype.addChildren = function(parent, child){

	child.parent = parent;
	if (parent.children.indexOf(child) < 0){
		// 親に子が追加済みでなければ追加
		parent.children.push(child);
	}
};