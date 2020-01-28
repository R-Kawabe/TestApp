/**
 *
 */


// プラグイン追加用I/F
$.chainView.extend({
	addPlugin:function(plugin){

	}
});

/**
 * プラグインソケット
 *
 */
var Plug = function(){};

Plug.prototype.onDiseaseSet = function(subject){
	$('#plugin').html('plugin enabled');
};

Plug.prototype.onDiseaseStateSelected = function(disease){

};

Plug.prototype.onNodeSelected = function(node){

};

