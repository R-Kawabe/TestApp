/**
 *
 */


$.tree = $.tree || {};

$.extend($.tree,{
	version : "0.0.1",
	getMethod: function (name) {
        return this.getAccessor($.fn.tree, name);
	},
	extend : function(methods) {
		$.extend($.fn.tree,methods);
		if (!this.no_legacy_api) {
			$.fn.extend(methods);
		}
	}

});


$.fn.tree = function( pin ) {

	if (typeof pin === 'string') {
		var fn = $.tree.getMethod(pin);
		if (!fn) {
			throw ("ChainViewer - No such method: " + pin);
		}
		var args = $.makeArray(arguments).slice(1);
		return fn.apply(this,args);
	}

	return this.each( function() {
		if(this.def) {return;}

		var p = $.extend(true,{
			//
		}, $.tree.defaults, pin || {});

		var ts= this, def={
				/*
			func : function(value){
				if (ts.addon != undefined){
					ts.addon.onDiseaseSet(value);
				}
				if($.isFunction(ts.p.callback1)) {
					ts.p.callback1.call(ts, value);
				}
			}*/
		};

		var treeData = null;

		// 検索ハイライト用
		var selectedIndex = 0;
		var highlightedIds = [];

		this.p = p ;

		var cbFunc = undefined;

		// 以下、内部メソッド
		init = function(){
			/*
 <div id="tree" class="dialog">
  <div id="tree_header" class="dialog_header">CLOSE</div>
  <div id="tree_contents" class="dialog_contents">
    <div id="tree_find"><input type="text"></div>
    <div id="tree_main" class="tree"></div>
  </div>
 </div>

			 */
			$(ts).attr({
				'class' : 'dialog'
			});
			$(ts).append(
					$('<div>CLOSE</DIV>')
					.attr({
						'id': ts.id + "_header",
						'class' : 'dialog_header'
					})
					);

			$('#'+ ts.id + '_header').click(function(event){
				$(ts).hide();
			});


			$(ts).append(
							$('<DIV></DIV>')
							.attr({
								'id' : ts.id + "_contents",
								'class' : 'dialog_content'
							})
				);
			$('#'+ ts.id + '_contents').append(
					$('<div></DIV>')
					.attr({
						'id' : ts.id + "_find"
					}).append(
							$('<input>')
							.attr({
								'type' : 'text',
								'id' : ts.id + "_find_word"
							})
							)
						);
			$('#'+ ts.id + '_find_word').keypress(function(event){
				if( event.which === 13 ){
					ts.findWord($("#" + ts.id + "_find_word").val());
				}
			});

			$('#'+ ts.id + '_find').append(
					$('<input>')
					.attr({
						'type' : "button",
						'value' : "∧",
						'id' : ts.id + "_find_prev"
					})
					);
			$('#'+ ts.id + '_find_prev').click(function(event){
				setClassToNode(highlightedIds[selectedIndex], 'select', false);
				focusHighlight(--selectedIndex);
			});

			$('#'+ ts.id + '_find').append(
					$('<input>')
					.attr({
						'type' : "button",
						'value' : "∨",
						'id' : ts.id + "_find_next"
					})
					);
			$('#'+ ts.id + '_find_next').click(function(event){
				setClassToNode(highlightedIds[selectedIndex], 'select', false);

				focusHighlight(++selectedIndex);
			});

			$('#'+ ts.id + '_contents').append(
					$('<div></DIV>')
					.attr({
						'id' : ts.id + "_main",
						'class' :"tree"
					})
				);

			$('#'+ ts.id + '_find_prev').attr('disabled', 'disabled');
			$('#'+ ts.id + '_find_next').attr('disabled', 'disabled');
		},
		setTreeData = function(data){
			$('#'+ ts.id + '_find_word').val('');
			treeData = data;
			viewTree(ts.id + "_main", treeData, cbFunc);
		},
		onNodeClicked = function(func){

			cbFunc = func;
		},
		findWord = function(word){
			selectedIndex = 0;
			if (word == ''){
				clearHighlight();
				viewTree(ts.id + "_main", treeData, cbFunc);

				return;
			}
			highlightedIds = [];

			highlightedIds = recurseFind(word, highlightedIds, treeData.rootNode);

			function recurseFind(word, ids, node){
				if ((node.name).indexOf(word) >= 0){
					ids.push(node.id);
				}

				for (var i=0; i<node.children.length; i++){
					recurseFind(word, ids, node.children[i]);
				}
				return ids;

			};

			highlight(highlightedIds, true);
			if (highlightedIds.length != 0){
				focusHighlight(selectedIndex);
			}
		},
		focusHighlight = function(index){
			if (index == 0){
				$('#' + ts.id + '_find_prev').attr('disabled', 'disabled');
			} else {
				$('#' + ts.id + '_find_prev').removeAttr('disabled');
			}

			if (index == (highlightedIds.length-1)){
				$('#' + ts.id + '_find_next').attr('disabled', 'disabled');
			} else {
				$('#' + ts.id + '_find_next').removeAttr('disabled');
			}

			focusNode(highlightedIds[selectedIndex]);

			setClassToNode(highlightedIds[selectedIndex], 'select');

		},
		highlight = function(id, isHighlight){
			clearHighlight();
			var ids = [];
			if (id instanceof Array){
				ids = id;
			} else {
				ids.push(id);
			}

			if (treeData != null){
				for (var i=0; i<ids.length; i++){
					treeData.highlight(ids[i], isHighlight);
				}
			}

			viewTree(ts.id + "_main", treeData, cbFunc);

		},
		clearHighlight = function(){
			if (treeData != null){
				treeData.highlightClear();
			}
		},
		focusNode = function(id){
			$('#' + ts.id + '_main').animate({
				scrollTop:$('#' + ts.id + '_main').scrollTop() + ($('#' + id).offset().top - 200)
			});
		},
		$.extend(def,
				{setTreeData : setTreeData},
				{onNodeClicked : onNodeClicked},
				{findWord : findWord},
				{highlight : highlight},
				{clearHighlight : clearHighlight},
				{focusNode : focusNode}
				);

		this.def = def;

		// 外に公開するfunctionはここに記述

		ts.setTreeData = function(data) {setTreeData(data);};
		ts.onNodeClicked = function(func) {onNodeClicked(func);};
		ts.findWord = function(word) {findWord(word);};
		ts.highlight = function(id, isHighlight) {highlight(id, isHighlight);};
		ts.clearHighlight = function() {clearHighlight();};
		ts.focusNode = function(id) {focusNode(id);};


		// 初期化メソッド
		init();

	});
};

$.tree.extend({
	setTreeData:function(data){
		this[0].def.setTreeData(data);

	},
	onNodeClicked:function(func){
		this[0].def.onNodeClicked(func);

	},
	findWord:function(word){
		this[0].def.findWord(word);

	},
	highlight:function(id, isHighlight){
		this[0].def.highlight(id, isHighlight);

	},
	clearHighlight:function(){
		this[0].def.clearHighlight();

	},
	focusNode:function(id){
		this[0].def.focusNode(id);

	}

});