/**
 *
 */

$.chainView = $.chainView || {};
$.extend($.chainView,{
	version : "0.0.1",
	method1:function(value){
	},
	method2:function(value){

	},
	getMethod: function (name) {
        return this.getAccessor($.fn.chainView, name);
	},
	extend : function(methods) {
		$.extend($.fn.chainView,methods);
		if (!this.no_legacy_api) {
			$.fn.extend(methods);
		}
	}
});


$.fn.chainView = function( pin ) {
	if (typeof pin === 'string') {
		var fn = $.chainView.getMethod(pin);
		if (!fn) {
			throw ("ChainViewer - No such method: " + pin);
		}
		var args = $.makeArray(arguments).slice(1);
		return fn.apply(this,args);
	}
	return this.each( function() {
		if(this.def) {return;}

		var p = $.extend(true,{
			onDiseaseSet: null,
			onDiseaseStateSelected: null,
			onNodeSelected: null
		}, $.chainView.defaults, pin || {});
		var ts= this, def={
			piyo : function(value){
				if (ts.plugin != undefined){
					ts.plugin.onDiseaseSet(value);
				}
				if($.isFunction(ts.p.callback1)) {
					ts.p.callback1.call(ts, value);
				}
			}
		};
		this.p = p ;
		if (typeof Plug != 'undefined'){
			this.plugin = new Plug();
		}

		this.def = def;

	});
};

$.chainView.extend({
	setDisease:function(value){
		$('#main').html('<p>DISEASE</p>');
		$('#main')[0].def.piyo(value);
	},
	selectDiseaseState:function(value){

	},
	selectNodeState:function(value){

	}


});

