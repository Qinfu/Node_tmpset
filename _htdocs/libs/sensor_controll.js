

//////////////////////////////////////////
$(function(){
  $("a#turnBtn").on("tap",fsSwitchSensor);
});

$(window).resize(function() {
	//
});

$(window).load(function(){
	fastClick();
});

var fsSwitchSensor = function(evt){
  evt.preventDefault();
  if ($(this).hasClass("off")){
    //$(window).on(oSensorEvent.GYLO_UPDATE, fsOrientation);
    //$(window).on(oSensorEvent.ACCELARETE_UPDATE, fsMotion);
    $(window).on(oSensorEvent.PROX_UPDATE, fsAmbient);
    $(window).on(oSensorEvent.AMBIENT_UPDATE, fsProximity);
    oSensor.startCheak();
    $(this).removeClass("off");
  }else{
    //$(window).off(oSensorEvent.GYLO_UPDATE, fsOrientation);
    //$(window).off(oSensorEvent.ACCELARETE_UPDATE, fsMotion);
    $(window).off(oSensorEvent.PROX_UPDATE, fsAmbient);
    $(window).off(oSensorEvent.AMBIENT_UPDATE, fsProximity);
    oSensor.stopCheak();
    $(this).addClass("off");
  }

}


// ジャイロセンサーの値が変化
var fsOrientation = function(evt) {
  $("#devOrientation > dl > dd").eq(0).text(roundNum(oSensor._gylo._x));
  $("#devOrientation > dl > dd").eq(1).text(roundNum(oSensor._gylo._y));
  $("#devOrientation > dl > dd").eq(2).text(roundNum(oSensor._gylo._z));

  var xGylo = Math.floor(oSensor._orientation);
  $("#devOriantation").rotate(xGylo);
  $("#devGyros > dl > dd").eq(0).text(xGylo);

  //Serbo Motion;
  var xData = {};
  xData.type = "servo";
  xData.value = Math.floor(oSensor._gylo._x);
  //xData.value =xGylo;
  sendMessage(xData);
};

// 加速度が変化
var fsMotion = function(evt) {
  $("#devMotion > dl > dd").eq(0).text(roundNum(oSensor._motion._x));
  $("#devMotion > dl > dd").eq(1).text(roundNum(oSensor._motion._y));
  $("#devMotion > dl > dd").eq(2).text(roundNum(oSensor._motion._z));
};

// 照度が変化
var fsAmbient = function(evt) {
  $("#devAmbient > dl > dd").eq(0).text(roundNum(oSensor._ambient));

  //Led On/Off;
  var xData = {};
  xData.type = "led";
  if(oSensor._ambient<= 0){
    xData.value = "0";
  }else if(oSensor._ambient > 10){
    xData.value = "1";
  }else{
    xData.value = "2";
  }
  sendMessage(xData);

};


// 検知範囲の状況が変化
var fsProximity = function(evt) {
  $("#devProximity > dl > dd").eq(0).text(oSensor._prox);
};
