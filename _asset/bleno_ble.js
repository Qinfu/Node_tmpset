/*-----------------------------
 bleno_ble
 汎用Bleクライアントモジュール with  bleno
 ver 1.02

 by Shima-tec
-----------------------------*/

const util = require('util');
const bleno = require('bleno');

const APPROACH_SERVICE_UUID = '3bbd406c-30bb-4fcb-8b10-74f7332aefdb';
const APPROACH_CHARACTERISTIC_UUID = '0bdc6789-30bb-4fcb-8b10-74f7332aefdb';

const Characteristic = bleno.Characteristic;

/*カスタムイベント作成*/
const event = require('events').EventEmitter;
const reciveEvent = "GET_MSG";
const evEm = new event;

//--------------------------------------------------------//

var ApproachCharacteristic = function() {
    ApproachCharacteristic.super_.call(this, {
        uuid : APPROACH_CHARACTERISTIC_UUID,
        properties: ['read','notify','write'],
        value : null
    });

    this._value = 0;
    this._updateValueCallback = null;
};

util.inherits(ApproachCharacteristic, Characteristic);


ApproachCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('[ApproachCharacteristic]onReadRequest ->' + this._value);
    callback(this.RESULT_SUCCESS, this._value);
}


ApproachCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('[ApproachCharacteristic]onSubscribe');

    this._updateValueCallback = updateValueCallback;
};

ApproachCharacteristic.prototype.onUnsubscribe = function(maxValueSize, updateValueCallback) {
    console.log('[ApproachCharacteristic]onUnsubscribe');

    this._updateValueCallback = null;
};

ApproachCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    let xVal = Buffer.from(Uint8Array.from(Buffer.from(data))).toString();
    console.log("[ApproachCharacteristic]WriteRequest ->" + xVal);
    //reciveValue(xVal);
    evEm.emit(reciveEvent,xVal);

    callback(this.RESULT_SUCCESS);
}


//--------------------------------------------------------//


const PrimaryService = bleno.PrimaryService;
const approachCharacteristic = new ApproachCharacteristic();

bleno.on('stateChange', function(state) {
    console.log('[bleno]on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('Approach', [APPROACH_SERVICE_UUID]);
    } else {
        bleno.stopAdvertising();
    }
});


bleno.on('advertisingStart', function(error) {
    console.log('[bleno]on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if(!error) {
        bleno.setServices([
            new PrimaryService({
                uuid: APPROACH_SERVICE_UUID,
                characteristics: [
                    approachCharacteristic
                ]
            })
        ]);
    }
});


/* データ更新 & notify 実行*/
const updateValue = function(xVal){
    approachCharacteristic._value = xVal;
    if (approachCharacteristic._updateValueCallback) {
        console.log(`[bleno_ble]Send value : ${approachCharacteristic._value}`);

        const notificationBytes = Buffer.from(String(approachCharacteristic._value));
        approachCharacteristic._updateValueCallback(notificationBytes);
    }
}

/* write 発生時のリスナーを設定*/
const reciveValue = function(listener){
    evEm.on(reciveEvent, listener);
}


const setServiceUUID = function(xVal){
  APPROACH_SERVICE_UUID = xVal;
}

const setCharacterristicUUID = function(xVal){
  APPROACH_CHARACTERISTIC_UUID = xVal;
}



exports.SERVICE_UUID = APPROACH_SERVICE_UUID;
exports.CHARACTERISTIC_UUID = APPROACH_CHARACTERISTIC_UUID;

exports.sendMsg = updateValue;
exports.onGetMsg = reciveValue;
