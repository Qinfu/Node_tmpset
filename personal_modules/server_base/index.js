/*-----------------------------
 汎用Webサーバモジュール for Node.js
 ver 5.00

 by Shima-tec

[Updaet]
複数階層構造対応
Chomeでの事故証明書エラー回避

[使い方]

const oHttpServer = require('./_asset/server_base');

const _server = oHttpServer.run("ポート番号","ドキュメントルート",[https]);

「https」で動かす場合は true;



-----------------------------*/

const os = require('os');
const fs = require('fs');
const path = require('path');

const qstr = require('querystring');
const EventEmitter = require("events");

const ssl_server_key = './personal_modules/server_base/key/server_key.pem';
const ssl_server_crt = './personal_modules/server_base/key/server_crt.pem';
const ssl_server_ca = './personal_modules/server_base/key/ca-crt.pem';

let ip = "192.168.0.7";
let portNum = "8888";
let fileroot = ".";
let server = null;

//ファイルタイプリスト
const pFileType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.csv': 'text/csv',

  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'application/image/svg+xml',

  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',

  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',

  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.ico': 'image/x-icon'
};


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const trace = (xMsg) =>{
  console.log("[server base]" + xMsg);
}

/*サーバ稼動*/
const fsRun = (xPort,xRoot,xHttps) => {
  if(xRoot){
    fileroot = xRoot;
  }
  if(xPort){
    portNum = xPort;
  }

  ip = fsGetLocalAddress().ipv4[0].address;
  let xMode = "";

  if(xHttps){
    let xOptions = {
      key: fs.readFileSync(ssl_server_key),
      cert: fs.readFileSync(ssl_server_crt),
      ca: fs.readFileSync(ssl_server_ca),
      passphrase: "nodepass",
      requestCert: true,
      rejectUnauthorized: false
    };

    const http = require('https');
    server = http.createServer(xOptions);
    //portNum = Number(portNum) + 1;
    xMode = "https://"
  }else{
    const http = require('http');
    server = http.createServer();
  }

  server.listen(portNum,ip);
  server.listen(portNum);
  server.on('request',fsServerJob);

  trace('start at '+ xMode + ip +":" + portNum);
  return server;
};


/*リクエスト受信*/
const fsServerJob = (req, res) =>{

  if(req.method === 'POST') {
    fsPostJob(req, res);
  }else{
    fsGetJob(req, res);
  }

}

/*GET処理*/
const fsGetJob = (req, res) =>{
  let xTgFile = req.url;

  if (xTgFile.slice( -1 ) == "/") {
    xTgFile += "index.html";
  }

  let xReg = String(path.extname(xTgFile)).toLowerCase();
  let xType = pFileType[xReg] || 'application/octet-stream';

  xTgFile = fileroot + xTgFile;
  xTgFile = xTgFile.replace( "//" , "/" ) ;

  fs.readFile(xTgFile, function (err, data) {

    if (err) {
      trace(err);
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404:file not found!');
      return res.end();

    }else{
      res.writeHead(200,{'Content-Type': xType});
      res.write(data);
      res.end();
    }
  });

};


/*POST処理*/
const fsPostJob = (req, res) =>{
  let postData = '';
  req.setEncoding('utf8');

  req.on('data',function (chunk){
    postData += chunk;

  }).on('end',function(){

    if(!postData){
      res.end();
      return;
    }

    var postDataObject = qstr.parse(postData);
    trace('posted data:' + postData);
    server.emit("getPost", null, postDataObject);
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('true');
    res.end();
    return('true');

  });
 
}

/*ローカルIPを調べる*/
const fsGetLocalAddress =() => {
    let ifacesObj = {}
    ifacesObj.ipv4 = [];
    ifacesObj.ipv6 = [];

    let interfaces = os.networkInterfaces();

    for (var dev in interfaces){

      interfaces[dev].map(function(details){
        if (!details.internal){
          switch(details.family){
            case "IPv4":
              ifacesObj.ipv4.push({name:dev, address:details.address});
              break;

            case "IPv6":
              ifacesObj.ipv6.push({name:dev, address:details.address})
              break;

            //for Mac OS
            case 4:
              ifacesObj.ipv4.push({name:dev, address:details.address});
              break;

            case 6:
              ifacesObj.ipv6.push({name:dev, address:details.address})
              break;
          }
        }
      });

    };

    return ifacesObj;
};



exports._ip = ip;
exports._port = portNum;
exports._htdocs = fileroot;
exports._server = server;

exports.run = fsRun;