const trace = function(xMsg){
  console.log(">>" + xMsg);
}

//ベーシックサーバ作成
let oHttpServer = require('./_asset/server_base_v2');


let _server = oHttpServer.run("3000","./_htdocs/");

_server.on("getPost", (err,xObject) =>{
	trace("Get POST!");

	for (var i in xObject){
		trace( i + ':' + xObject[i]);
	}
});
