
$(function(){

	trace("jQuely Loaded!");

	$("form[name='myFrom']").on("submit",fsSendPost);

	$(window).on("load",function(){
		trace("page Loaded");
	})

});



var fsSendPost = function(evt){
	evt.preventDefault();
	evt.stopPropagation();

	let xSendData = $(this).serialize();
	trace(">Post data:\t" + xSendData);

	let xURL = $(this).attr("action");
	trace(">Post to:\t" + xURL);

	$.post(xURL,xSendData)
	.done(function( data ) {
	    trace(">Post result:\t" + data);
	});
}