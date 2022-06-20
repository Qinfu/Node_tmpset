/*-----------------------------
 汎用コマンドモジュール for Node.js
 ver 1.00

 by Shima-tec

[使い方]

-----------------------------*/

const os = require('os');
const fs = require('fs');



const fsTrace = (xMsg) =>{
  console.log(xMsg);
}

/*ローカルIPを調べる*/
const fsSerchIP =() => {

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

           //for MacOS
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

const fsGetLocalAddress = (xType) =>{
  let xIP = fsSerchIP().ipv4[0].address;
  if(xType == "IPv6"){
    xIP = fsSerchIP().ipv6[0].address;
  }
  return xIP;
}


exports.trace = fsTrace;
exports.localip = fsGetLocalAddress;