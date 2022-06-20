const ioSocket= io();

const oSocketLib = {};

oSocketLib.init = () =>{

  // サーバーからのデータ受け取り処理
  ioSocket.on( "connect",oSocketLib.connected ); // 接続
  ioSocket.on( "disconnect",oSocketLib.disconnected); // 切断

  // サーバーからクライアントへの送り返し
  ioSocket.on( "serverOrder",oSocketLib.getMsg);
}
  

oSocketLib.connected = () =>{
  trace("[oSocketLib] Connected Soket Server");
}

oSocketLib.disconnected = () =>{
    trace("[oSocketLib] Disconnected Soket Server");
}
 
//メッセージ受信
oSocketLib.getMsg = (xData) =>{
  trace("[oSocketLib] Get Msg = " + xData._val);
}

//メッセージ送信
oSocketLib.sendMsg = (xData) =>{
  const xMsg = {};
  xMsg._key = "msg",
  xMsg._val = xData;
  ioSocket.emit('cliantOrder', xMsg);
}