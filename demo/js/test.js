(function(){
	var contextmenu=function(event,target){
		var event = event || window.event;
		var left=event.pageX,
			topY=event.pageY;
		var $test=$(".test");
		if($test){
			$test.remove();
		}
		var $div=$("<div><p>编辑</p><p>编辑</p><p>编辑</p><p>编辑</p></div>");
		$div.addClass("test");
		$div.appendTo($("body"));
		var h=$(this).height();
		var x=$(this).outerWidth();
		targetH=($div.outerHeight()+topY)<h?topY:(topY-$div.outerHeight());
		targetW=$div.outerWidth()+left>x?(x-$div.outerWidth()) : left;
		console.log(topY,$div.height(),h,targetH);
		$div.css({left:targetW,top:targetH+"px"});
		$div.css({top:targetH});
		$div.show();
		return false;
	};
	var showMenu={

	}
})();