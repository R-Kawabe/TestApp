/**
 *
 */
var queryHead = 'prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>\n'+
				'prefix rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n';

var leftCount = 0;

var treeData;

var cbFunc;


function find_treeObj(treeDiv, input_elm, root){
	var x = input_elm.offset().left;
	var y = input_elm.offset().top - $('#container').height();

	treeDiv.css('top', y + 'px');
	treeDiv.css('left', x + 'px');

	treeData = new TreeData('tree');
	cbFunc = function(id){
		// ノードクリック時イベント

		input_elm.val(treeData.labelList[id]);
		$('#' + input_elm[0].id + '2').html(treeData.resourceList[id]);
		treeDiv.hide();
	};

	find_tree(treeData, root, updateTree);


	function updateTree(td){
		treeDiv.onNodeClicked(cbFunc);
		treeDiv.setTreeData(td);

	}

}

function find_tree(td, resource, cb){
	var query =
		queryHead +
		'select distinct ?r ?o ?rlabel ?olabel {\n' +
		'?o <http://www.w3.org/2000/01/rdf-schema#subClassOf>+ ' + makeResourceFormat(resource) + ';\n' +
		'   <http://www.w3.org/2000/01/rdf-schema#subClassOf> ?r.\n' +
		'  ?o rdfs:label ?olabel.\n' +
		'  FILTER (lang(?olabel) = "' + lang + '")\n' +
		'  ?r rdfs:label ?rlabel.\n' +
		'  FILTER (lang(?rlabel) = "' + lang + '")\n' +
		'}\n';


	qr = sendQuery($('#endpoint').val(),query);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			updateTree();
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			var data = d.results.bindings;

			for (var i=0; i<data.length; i++){
				var type = data[i].o.type;
				var r = data[i].r.value;
				var child = data[i].o.value;
				var clabel = data[i].olabel.value;
				clabel = clabel.replaceAll('%20', ' ');
				var rlabel;
				if (data[i].rlabel != null){
					rlabel = data[i].rlabel.value;
					rlabel = rlabel.replaceAll('%20', ' ');
				} else {
					rlabel = data[i].r.value;
				}

				td.addSubClass(td.getNodeID(rlabel, r, true), td.getNodeID(clabel, child, true), (r == resource));

			}

			if (cb != null){
				cb(td);
			}
		}
	);
}


function makeResourceFormat(res){
	if (res.indexOf('http') == 0){
		return '<' + res + '>';
	}
	return res;
}

