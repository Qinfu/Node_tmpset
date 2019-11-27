

$(function(){
  $(window).load(function(){
    var xIP = location.host;
    console.log(xIP);
    oSocketIO.init(xIP); // チャットサーバーに接続
  });
});


var oSocketIO = {
  _receiveKey:"msgFromServer",
  _server:null,

};

oSocketIO.init = function(xIP){
  oSocketIO._server = io.connect(xIP); // チャットサーバーに接続

  // サーバーからのデータ受け取り処理
  oSocketIO._server.on( "connect", function() {
     // 接続
    oSocketIO._connect();
  });

  oSocketIO._server.on( "disconnect", function() {
     // 切断
    oSocketIO._disconnect();
  });

  // サーバーから受信
  oSocketIO._server.on(gSoketKey, function( data ) {
    oSocketIO._receive(data.value);
  });

}

//メッセージ送信
oSocketIO.send = function(xKey,xMsg){
  oSocketIO._server.emit(xKey,xMsg);
};


/*以下は適宜Ovverride*/

//メッセージ受信
oSocketIO._receive = function(xMsg){
  oSocketIO._server.emit(xKey,xMsg);
  trace("[oSocketIO]Get message=" + xMSG);
};

// Socketサーバへ接続完了
oSocketIO._connect =function() {
  trace("[oSocketIO]Socket connected")
}

 
// Socketサーバから切断
oSocketIO._disconnect =function() {
  trace("[oSocketIO]Socket disconnected")
}