
//////////////////////////////////////////

let oWebCamEvent ={
  CAM_CONNECTED:"connectedWebCam",
  CAM_UPDATE:"updateCam"
}

let oWebCam = {
  _video:null,
  _vid:"",
  _deviceID:"",
  _callback:null
}

navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
   getUserMedia: function(c) {
     return new Promise(function(y, n) {
       (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n);
     });
   }
} : null);


oWebCam.init = (xID,xCallBack) =>{
  oWebCam._vid = xID;
  oWebCam._callback = xCallBack;

  //mediaDevices対応ブラウザ判定
  if (!navigator.mediaDevices) {
    trace("[oWebCam]enumerateDevices() not supported.");
    return false;
    xCallBack(false);

  }else{
    trace("[oWebCam]enumerateDevices() supported.");
    let constraints = navigator.mediaDevices.getSupportedConstraints();
    trace(constraints);

    oWebCam.fsInitCam();
  }
}


oWebCam.fsInitCam = () =>{
  /*デバイスのリスト取得*/
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      if(device.kind == "videoinput"){
        if(device.label.indexOf("Virtual") < 0){
          oWebCam._deviceID = device.deviceId;
        }
        trace("[oWebCam]" + device.kind + ": " + device.label +" id = " + device.deviceId);
      }
    });
    oWebCam.fsCameraInit();
  })
  .catch(function(err) {
    trace("[oWebCam]" + err.name + ": " + err.message);
    oWebCam._callback(false,err.message);
  });

}


/*webRCT初期設定*/
oWebCam.fsCameraInit = () =>{

  var constraints = {
    audio: false,
    video: {
      //deviceId:"",
      //aspectRatio: 1.3333333333,//4:3
      aspectRatio: 1.41860465116279,//16:9
      width:$(oWebCam._vid).width(),
      height:$(oWebCam._vid).height(),
      //facingMode: "user",
      facingMode: 'environment',
      resizeMode: 'crop-and-scale'
    }
  };

  trace("[oWebCam]Orientation = " + window.orientation);
  if(_ua.Mobile && window.orientation == 0){
    constraints.video.width = $(oWebCam._vid).height();
    constraints.video.height = $(oWebCam._vid).width();
  }

  trace("[oWebCam]devide id =" + oWebCam._deviceID);
  constraints.video.deviceId = oWebCam._deviceID;

  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {

    oWebCam._video = document.querySelector(oWebCam._vid);
    oWebCam._video.srcObject = stream;

    trace("[oWebCam]WebCam Setuped!");


    oWebCam._video.onloadedmetadata = function(e) {
      oWebCam._video.play();
      
      $(window).trigger(oWebCamEvent.CAM_CONNECTED);
      oWebCam._callback(true);
      //oWebCam.fsTicAct();
    };

  })
  .catch(function(err) {
    trace("[oWebCam]" + err.name + ": " + err.message);
    oWebCam._callback(false);
  });

}

oWebCam.fsTicAct = () =>{
  $(window).trigger(oWebCamEvent.CAM_UPDATE);
  window.requestAnimationFrame(oWebCam.fsTicAct);
}
