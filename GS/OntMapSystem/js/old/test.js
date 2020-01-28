/**
 *
 */

$(window).load(function() {
	$('#main').chainView({
	callback1:function(value){
//		$('#main').method1();
		$('#out').html(value);
	}
	}
	);

	$('#main').setDisease('disease1');

	$('#main').addPlugin('new');

});


