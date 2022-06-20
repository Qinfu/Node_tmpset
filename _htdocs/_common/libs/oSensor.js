var oSensorEvent ={
    GYLO_UPDATE:"UpdateGylo",
    ACCELARETE_UPDATE:"UpdateAcceleration",
    AMBIENT_UPDATE:"UpdateAmbient",
    PROX_UPDATE:"UpdateProximity"
}

var oSensor = {
  
  _gylo:{"_x":0,"_y":0,"_z":0},
  _motion:{"_x":0,"_y":0,"_z":0},
  _ambient:0,
  _prox:0,
  _orientation:0,
  
  startCheak:function(){
    window.addEventListener("deviceorientation", oSensor.fsOrientation);
    window.addEventListener("devicemotion", oSensor.fsMotion);
    
    window.addEventListener("devicelight", oSensor.fsAmbient);
    window.addEventListener("deviceproximity", oSensor.fsProximity);
  },
  
  stopCheak:function(){
    window.removeEventListener("deviceorientation", oSensor.fsOrientation);
    window.removeEventListener("devicemotion", oSensor.fsMotion);
    
    window.removeEventListener("devicelight", oSensor.fsAmbient);
    window.removeEventListener("deviceproximity", oSensor.fsProximity);
    
  },
  
  cheakSensor:function(xKey){
    if (xKey in window) {
      return true;
    }else{
      return false;
    }
  },
  
  // ジャイロセンサーの値が変化
  fsOrientation:function(evt) {
    //oSensor._gylo._x = roundNum(evt.beta);
    //oSensor._gylo._y = roundNum(evt.gamma);
    //oSensor._gylo._z = roundNum(evt.alpha);
    oSensor._gylo._x = evt.beta;
    oSensor._gylo._y = evt.gamma;
    oSensor._gylo._z = evt.alpha;
    oSensor._orientation = oSensor.fsSetCompass();
    $("body").trigger(oSensorEvent.GYLO_UPDATE);
  },

  // 加速度が変化
  fsMotion:function(evt) {
    if(evt.acceleration){
      var xNewX = filterLow(evt.acceleration.x,oSensor._motion._x);
      var xNewY = filterLow(evt.acceleration.y,oSensor._motion._y);
      var xNewZ = filterLow(evt.acceleration.z,oSensor._motion._z);
      
      oSensor._motion._x = xNewX;
      oSensor._motion._y = xNewY;
      oSensor._motion._z = xNewZ;
      $(window).trigger(oSensorEvent.ACCELARETE_UPDATE);
    }
  },


  // 照度が変化
  fsAmbient:function(evt) {
    //oSensor._ambient = roundNum(evt.value);
    oSensor._ambient = evt.value;
    $(window).trigger(oSensorEvent.PROX_UPDATE);
  },


  // 検知範囲の状況が変化
  fsProximity:function(evt) {
    if (!evt.value) {
      // センサーの検知範囲に物体がある
      oSensor._prox = evt.value;
    } else {
      // センサーの検知範囲に物体はない
      oSensor._prox = evt.value;
    }
    $(window).trigger(oSensorEvent.AMBIENT_UPDATE);
  },
  
  //方位取得（0=北）
  fsSetCompass:function() {
    var degtorad = Math.PI / 180;
   
    var _x = oSensor._gylo._x ? oSensor._gylo._x * degtorad : 0;
    var _y = oSensor._gylo._y ? oSensor._gylo._y * degtorad : 0;
    var _z = oSensor._gylo._z ? oSensor._gylo._z * degtorad : 0;
   
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);
   
    var Vx = -cZ * sY - sZ * sX * cY;
    var Vy = -sZ * sY + cZ * sX * cY;
   
    var compassHeading = Math.atan(Vx / Vy);
   
    if (Vy < 0) {
      compassHeading += Math.PI;
    } else if (Vx < 0) {
      compassHeading += 2 * Math.PI;
    }
   
    return compassHeading * ( 180 / Math.PI );
  }

  
};

//////////////////////////////////////////

//数値丸め処理
var roundNum = function(xNum){
  xNum = Math.floor(xNum*10);
  xNum = xNum/10;
  //xNum = Math.floor(xNum);
  //xNum = xNum.toFixed(1);
  return xNum;
}


//ハイパス・ローパスフィルタ
var filterLow = function(xNum,xLastNum){
    xNum = xLastNum*0.9 + xNum*0.1;
    return xNum;
};
