
//////////////////////////////////////////

/*------------------------------------
 プラットフォーム判定
------------------------------------*/
var _ua = (function(u){
  return {
    Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
      || u.indexOf("ipad") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
      || u.indexOf("kindle") != -1
      || u.indexOf("silk") != -1
      || u.indexOf("playbook") != -1,
    Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
      || u.indexOf("iphone") != -1
      || u.indexOf("ipod") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
      || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());


/*------------------------------------
 トレース
------------------------------------*/
var trace = function(xTxt){
	console.log(xTxt);
	//window.console && console.log(xTxt);
};

/*------------------------------------
 GETパラメータの取得
------------------------------------*/
var getParamArgs = function(){
	var xResArray = null;
	var xQuery = window.location.search.substring(1);
	var xGetDatas = xQuery.split('&');
	if (xGetDatas.length >0){
		xResArray = {};
		for (var i=0; i<xGetDatas.length; i++) {
			var xPos = xGetDatas[i].indexOf('=');
			if (xPos > 0) {
				var xKey = xGetDatas[i].substring(0,xPos);
				var xValue = xGetDatas[i].substring(xPos+1);
				xValue = decodeURI(xValue);
				xResArray[xKey] = xValue;
			}
		}
	}
	return xResArray;
};


/*------------------------------------
 スムーススクロール
------------------------------------*/
var paageScroll = function(xAncar){
  var xPos;
  var xHeight = $("#header").height();
  if (xAncar == "#top"){
  	xPos = 0;
  }else if (xAncar != "#"){
  	xPos = $(xAncar).offset().top - xHeight;
  }
  $('body,html').animate({scrollTop:xPos}, "normal", 'swing');
} 


//////////////////////////////////////////

/*------------------------------------
ページ幅チェック*/
var fsCheakPageMode = function(){
  if($(window).width() <= 738){
    $("html").addClass("modeN");
   }else{
    $("html").removeClass("modeN");
  }
}

/*------------------------------------
外部JSファイル動的読み込み
------------------------------------*/
var fsLoadJSfile = function(xUrl){
  var xElm = document.createElement("script");
  xElm.type = "text/javascript";
  xElm.src = xUrl;
  xElm.onload = function(){
    trace("Load JS >>" + xUrl)
  };
  document.head.appendChild(xElm);
};

/*------------------------------------
配列のシャッフル
------------------------------------*/
/*var shuffleArray = function(xArray){
  var  m = xArray.length;
  while (m) {
    var i = Math.floor(Math.random() * m--);
    xArray[m] = xArray[i];
    xArray[i] = xArray[m]
    //[xArray[m],xArray[i]] = [xArray[i],xArray[m]];
  }
  return xArray;
};*/

var shuffleArray = function(xArray) {
    for (var i = xArray.length - 1; i > 0; i = 0 | i - 1) {
        var j = 0 | Math.random() * (i + 1);
        var swap = xArray[i];
        xArray[i] = xArray[j];
        xArray[j] = swap;
    }
    return xArray;
}


/*------------------------------------
 イニシャライズ
------------------------------------*/
var pSelectAct = "blur";

$(function(){

  if(_ua.Mobile){
    $("html").addClass("sp");
  }else if(_ua.Tablet){
    $("html").addClass("tb");
  }else{
    $("html").addClass("pc");
    pSelectAct = "change";
  }

  $("a[href^='#']").on("click",function(evt){
    evt.preventDefault();
    evt.stopPropagation();
    var xAncar = $(this).attr("href");
    paageScroll(xAncar);
  });


  $(window).resize(function() {
    //
  });

  $(window).load(function(){
    //
  });

});


/*------------------------------------

 SNS Share Action

------------------------------------*/
var fsShareTweet = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  var xDiscription = $("meta[name='twitter:description']").attr("content");
  trace(xDiscription);
  var xTmpPath = "https://twitter.com/intent/tweet?url=#URL#&text=" + encodeURIComponent(xDiscription);
  fsDoShareSNS(xTmpPath);
}

var fsShareFacebook = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  var xDiscription = $("meta[name='og:description']").attr("content");
  trace(xDiscription);
  var xTmpPath = "https://www.facebook.com/sharer/sharer.php?u=#URL#&t=" + encodeURIComponent(xDiscription)
  fsDoShareSNS(xTmpPath);
}

var fsDoShareSNS = function(xTmpPath) {
  //var xLocation = $("link[name='canonical']").attr("href");
  var xLocation = location.href;
  xTmpPath = xTmpPath.replace( /#URL#/g ,xLocation);
  window.open(xTmpPath, '_blank', 'width=600, height=600, menubar=no, toolbar=no, scrollbars=yes');
}

/*------------------------------------

 Goole Analitics

------------------------------------*/
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-4738964-1');

var pageTracker = {};
pageTracker._trackEvent = function(){
  return false;
}
*/