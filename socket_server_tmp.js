
//基本処理ライブラリ
const $ = require('./personal_modules/utility_lib/');

/**********************************
 ベーシックサーバ作成
 **********************************/
const oHttpServer = require('./personal_modules/server_base/');
oHttpServer._ip = $.localip();

const _server = oHttpServer.run("3000","./_htdocs/",true);

_server.on("getPost", (err,xObject) =>{
	$.trace("Get POST!");

	for (var i in xObject){
		$.trace( i + ':' + xObject[i]);
	}
});

$.trace("https://" + oHttpServer._ip + ":3000");

/****************************
 Soclet処理
 ****************************/

// Socket.IOモジュール読み込み
const socketIo = require( 'socket.io' );

// サーバーをソケットに紐付け
const io = socketIo(_server);


// 最初の接続確立後の通信処理部分を定義
io.once('connection', socket => {
    $.trace("1st cliant Connected : " + socket.id);
});

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', (socket)=>{

    $.trace("cliant Connected : " + socket.id);
    
    /*
    socket.on("connected", (data) =>{
        $.trace("cliant Connected : " + socket.id);
    });
    */

    socket.on("disconnect", () =>{
      $.trace("cliant Disconnected : " + socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    })

    // クライアントからメッセージ受信
    socket.on('cliantOrder', ( data ) =>{
        fsGetMsgActions(data);
    });

});


// サーバーからクライアントへ メッセージを送り返し
const fsSendMSG = (xMSG) =>{
  io.sockets.emit('serverOrder', { _val : xMSG } );
}

//クライアントからの受信データ処理
const fsGetMsgActions = (xData) =>{
    $.trace("[fron cliant]" + data._key +":" + data._val);
    switch(xData._key){
        case "public":
            fsSendMSG(xData._val);
            break;

        case "private":

        break;

        default:
            break;
    }

}
