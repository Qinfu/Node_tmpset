/*-----------------------------
 汎用Webサーバモジュール for Node.js
 ver 3.00

 by Shima-tec


使い方

const oHttpServer = require('./_asset/server_base');

const _server = oHttpServer.run("ポート番号","ドキュメントルート",[https]);

「https」で動かす場合は true;



-----------------------------*/

const os = require('os');
const fs = require('fs');
const qstr = require('querystring');
const EventEmitter = require("events");

let ip = "192.168.0.7";
let portNum = "8888";
let fileroot = ".";
let server = null;

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
  let xProtocol = "http"

  if(xHttps){

    let ssl_server_key = './_asset/server.key';
    let ssl_server_crt = './_asset/server.crt';
    
    let xOptions = {
      key: fs.readFileSync(ssl_server_key),
      cert: fs.readFileSync(ssl_server_crt),
      passphrase: "nodepass",
    };
    
    const http = require('https');
    server = http.createServer(xOptions);
    xProtocol = "https"
  }else{
    const http = require('http');
    server = http.createServer();    
  }

  server.listen(portNum);
  server.on('request',fsServerJob);

  trace('start at '+ xProtocol +"://"+ ip +":" + portNum);
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

  if (xTgFile == "/") {
    xTgFile = "index.html";
  }

  let xType = fsGetFileType(xTgFile);
  xTgFile = fileroot + xTgFile;
  xTgFile = xTgFile.replace( "//" , "/" ) ;
  //trace(xTgFile);

  fs.readFile(xTgFile, function (err, data) {

    if (err) {
      trace(err);
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404:file not found!');
      return res.end();

    }else{
      res.writeHead(200,xType);
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


/*ファイルタイプ設定*/
const fsGetFileType = xFileName => {
  let xTension = fsCheakReg(xFileName);
  let xType = {'Content-Type': 'text/html'};

  switch(xTension){
    case "html":
      xType['Content-Type'] = 'text/html';
      break;

    case "js":
      xType['Content-Type'] = 'text/javascript';
      break;

    case "css":
      xType['Content-Type'] = 'text/css';
      break;

    case "csv":
      xType['Content-Type'] = 'text/csv';
      break;

    case "json":
      xType['Content-Type'] = 'text/json';
      break;

    case "jpg":
      xType['Content-Type'] = 'image/jpeg';
      break;

    case "png":
      xType['Content-Type'] = 'image/png';
      break;

    case "gif":
      xType['Content-Type'] = 'image/gif';
      break;

    case "svg":
      xType['Content-Type'] = 'application/image/svg+xml';

    case "svg":
      xType['Content-Type'] = 'svg+xml';
      break;

    case "pdf":
      xType['Content-Type'] = 'application/pdf';
      break;

    case "mp3":
      xType['Content-Type'] = 'audio/mpeg';
      break;

    case "mp4":
      xType['Content-Type'] = 'audio/mp4';
      break;

    case "zip":
      xType['Content-Type'] = 'application/zip';
      break;

    case "ico":
      xType['Content-Type'] = 'image/x-icon';
    }

    return xType;
};

/*拡張子判定*/
const fsCheakReg = (xFileName) => {
  const reg = /(.*)(?:\.([^.]+$))/;
  return(xFileName.match(reg)[2]);
};

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