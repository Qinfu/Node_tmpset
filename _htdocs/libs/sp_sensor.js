
// 1.イベントとコールバックの定義
var socketio = io.connect();
var myName = "";

// 2.イベントに絡ませる関数の定義
var start = function(name) {
  socketio.emit("connected", name);
}

var sendMessage = function(xData) {
  socketio.emit("publish",xData);
}

var getMessage = function(data) {
  var domMeg = '<li>' + data.value + '</li>';
  $("#msgConsole ul").append(domMeg);
}

//////////////////////////////////////////

// 3.開始処理
$(function(){
  socketio.on("connected", function(name) {});
  socketio.on("publish",getMessage);
  socketio.on("disconnect", function () {});

  var myName = Math.floor(Math.random()*100) + "さん";
  //addMessage("貴方は" + myName + "として入室しました");
  start(myName);
});

//////////////////////////////////////////

$(window).resize(function() {
	//
});

$(window).load(function(){
	//
});
