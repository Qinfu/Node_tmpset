
//基本処理ライブラリ
const $ = require('./personal_modules/utility_lib/');

//ベーシックサーバ作成
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

