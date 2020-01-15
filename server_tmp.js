const trace = function(xMsg){
  console.log(">>" + xMsg);
}


let isHttps = false;

//コマンドライン引数取得
if(process.argv[2] && process.argv[2] == "true"){
	isHttps = true;
}

//ベーシックサーバ作成
let oHttpServer = require('./_asset/server_base');


let _server = oHttpServer.run("3000","./_htdocs/",isHttps);

_server.on("getPost", (err,xObject) =>{
	trace("Get POST!");
	for (var i in xObject){
		trace( i + ':' + xObject[i]);
	}
});
