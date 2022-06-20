/*-----------------------------------------------

Noble Liblalys for micro:bit with BLE
ver 2.0

noble:
    https://github.com/abandonware/noble

use:
    require('./personal_module/mbit_ble/');

written by Chikao Shima
2022.04.28

-----------------------------------------------*/


const noble = require('@abandonware/noble');

//サービスUUID
const mBitUUID = require('./mbit_uuid.js');

//イベントターゲット
const mdlEmitter = require('events').EventEmitter;
const evtTarget = new mdlEmitter();


//センサーイベント
const mBitEVENTS = {
    CONNECTED:"connected_microbit",
    DISCONNECT:"disconnect_microbit",

    UPDATE_VAL:"uodate_sensor_value",
    BTN_ACT: 'buttn_action',

    GET_UART: 'get_UART_Text'
};


//センサー値保存
const pStates = {
    _connected:false,
    _acceleration:{x:0,y:0,z:0},
    _magnetism:{x:0,y:0,z:0},
    _compass:-1,
    _temperature:-1
};


//利用センサーフラグ
const pConfig ={
    BUTTON:false,
    ACCELEROMETER:false,
    MAGNETOMETER:false,
    TEMPERATURE:false,
    LED:false,
    UART:false,
    PIN:false,
};


//https://relativelayout.hatenablog.com/entry/2019/10/12/175046

const _trace = (xStr) =>{
    console.log("[mbit_ble]" + xStr);
}

const fsSetConfig = (xSvc,xState) =>{
    pConfig[xSvc] = xState;
}

const fsGetConfig = (xSvc) =>{
    return(pConfig[xSvc]);
}

/*******************************
 micro:biをスキャン
 *******************************/
const fsScanBit = () =>{
    _trace("Scan");

     noble.on('discover', peripheral => {
        const xLocalName = peripheral.advertisement.localName;

        if (xLocalName && xLocalName.startsWith('BBC micro:bit')) {
            _trace("Find");
            noble.stopScanning();

            setTimeout(() => {
                fsConnectBit(peripheral);
            }, 500) // wait 500msec to avoid disconnection.
        }
    })

    noble.startScanning();
};


/*******************************
 micro:bitへの接続処理
 *******************************/
const fsConnectBit = (peripheral) => {

    //接続完了
    peripheral.on('connect', () => {
        _trace('connected');
        pStates._connected = true;
        peripheral.discoverServices();
        fskickEvent(mBitEVENTS.CONNECTED);
    })

    //接続解除
    peripheral.on('disconnect', () => {
        _trace('disconnected')
        pStates._connected = false;
        fskickEvent(mBitEVENTS.DISCONNECT);
        process.exit(1);
    })


    //サービス受信
    peripheral.on('servicesDiscover', services => {
        _trace("find services");

        services.forEach(service => {

            if (service.uuid){
                //_trace(service.uuid);

                switch(service.uuid){

                    case mBitUUID.BUTTON.SERVICE:
                        //A,Bボタン
                        if(pConfig.BUTTON){
                            fsInitButtonSvc(service);
                        }
                        break;

                    case mBitUUID.ACCELEROMETER.SERVICE:
                        //加速度センサー
                        if(pConfig.ACCELEROMETER){
                            fsInitAcceleroSvc(service);
                        }
                        break;

                    case mBitUUID.MAGNETOMETER.SERVICE:
                        //磁気センサー
                        if(pConfig.MAGNETOMETER){
                            fsInitMagnetSvc(service);
                        }
                        break;

                    case mBitUUID.TEMPERATURE.SERVICE:
                        //温度センサー
                        if(pConfig.TEMPERATURE){
                            fsInitTempertureSvc(service);
                        }
                        break;

                    case mBitUUID.LED.SERVICE:
                        //LED関連
                        if(pConfig.LED){
                            fsInitLedSvc(service);
                        }
                        break;

                    case mBitUUID.UART.SERVICE:
                        //URAT通信
                        if(pConfig.UART){
                            fsInitUartSvc(service);
                        }
                        break;

                }
            }
        });
    })

    peripheral.connect();
}


const fskickEvent = (xType,xVal) =>{
    evtTarget.emit(xType,[xVal]);
}

/*******************************
 ボタンサービス設定
 *******************************/
const fsInitButtonSvc = (xService) =>{
    xService.on('characteristicsDiscover', characteristics => {
        _trace("Button Srrvice init");

        characteristics.forEach(xChar => {
            if (xChar.uuid){
                switch(xChar.uuid){

                    case mBitUUID.BUTTON.BTN_A:
                        //Aボタン
                        xChar.on('read',(data,isNotification) =>{
                            //_trace("BTN_A Act " + isNotification);
                            fskickEvent(mBitEVENTS.BTN_ACT,"A");
                        });

                        xChar.subscribe((err) =>{
                            _trace("BTN_A subscribe :" + err);
                        });

                        break;

                    case mBitUUID.BUTTON.BTN_B:
                        //Bボタン
                        xChar.on('read',(data,isNotification) =>{
                            //_trace("BTN_A Act " + isNotification);
                            fskickEvent(mBitEVENTS.BTN_ACT,"B");
                        });

                        xChar.subscribe((err) =>{
                            _trace("BTN_A subscribe :" + err);
                        });

                        break;

                }
            };
        });
    });

    xService.discoverCharacteristics();
}



/*******************************
 加速度センサーサービス設定
 *******************************/
let pAccPER = null;

const fsInitAcceleroSvc = (xService) =>{
    xService.on('characteristicsDiscover', characteristics => {
        _trace("Accelerometer Srrvice init");

        pAccPER = null;

        characteristics.forEach(xChar => {
            if (xChar.uuid){

                switch(xChar.uuid){

                    case mBitUUID.ACCELEROMETER.DATA:
                        //三軸データ
                        xChar.on('data', (data, isNotification) => {
                            pStates._acceleration.x = data.readInt16LE(0);
                            pStates._acceleration.y = data.readInt16LE(2);
                            pStates._acceleration.z = data.readInt16LE(4);
                            fskickEvent(mBitEVENTS.UPDATE_VAL);

                            //_trace('ACCELEROMETER_DATA = x : ' + data.readInt16LE(0) + ' / y : ' + data.readInt16LE(2) + ' / z : ' + data.readInt16LE(4));

                        });

                        xChar.subscribe((err) =>{
                            _trace("ACCELEROMETER_DATA subscribe :" + err);
                        });

                        break;

                    case mBitUUID.ACCELEROMETER.PERIOD:
                        //更新間隔
                        pAccPER = xChar;

                        /*
                        xChar.on('data', (data, isNotification) => {
                            _trace("ACCELEROMETER_PERIOD =" + data.readInt16LE(0));
                        });
                        */

                        xChar.subscribe((err) =>{
                            _trace("ACCELEROMETER_PERIOD subscribe :" + err);
                        });
                        
                        break;
                }

            };
        });
    });

    xService.discoverCharacteristics();
}


/*******************************
 磁気センサーサービス設定
 *******************************/
let pMagPER = null;

const fsInitMagnetSvc = (xService) =>{
    xService.on('characteristicsDiscover', characteristics => {
        _trace("Accelerometer Srrvice init");

        pMagPER = null;

        characteristics.forEach(xChar => {
            if (xChar.uuid){

                switch(xChar.uuid){

                    case mBitUUID.MAGNETOMETER.DATA:
                        //三軸データ
                        xChar.on('data', (data, isNotification) => {
                            pStates._magnetism.x = data.readInt16LE(0);
                            pStates._magnetism.y = data.readInt16LE(2);
                            pStates._magnetism.z = data.readInt16LE(4);
                            fskickEvent(mBitEVENTS.UPDATE_VAL);

                            //_trace('MAGNETOMETER_DATA = x : ' + data.readInt16LE(0) + ' / y : ' + data.readInt16LE(2) + ' / z : ' + data.readInt16LE(4));
                        });

                        xChar.subscribe((err) =>{
                            _trace("MAGNETOMETER_DATA subscribe :" + err);
                        });

                        break;

                    case mBitUUID.MAGNETOMETER.COMPASS:
                        //方位
                        xChar.on('data', (data, isNotification) => {
                            pStates._compass = data.readInt16LE(0);
                            fskickEvent(mBitEVENTS.UPDATE_VAL);

                            //_trace("MAGNETOMETER_COMPASS =" + data.readInt16LE(0));
                        });

                        xChar.subscribe((err) =>{
                            _trace("MAGNETOMETER_COMPASS subscribe :" + err);
                        });
                        
                        break;

                    case mBitUUID.MAGNETOMETER.PERIOD:
                        //更新間隔
                        pMagPER = xChar;
                        
                        /*
                        xChar.on('data', (data, isNotification) => {
                            _trace("MAGNETOMETER_PERIOD =" + data.readInt16LE(0));
                        });
                        */

                        xChar.subscribe((err) =>{
                            _trace("MAGNETOMETER_PERIOD subscribe :" + err);
                        });
                        
                        break;
                }

            };
        });
    });

    xService.discoverCharacteristics();
}


/*******************************
 温度センサーサービス設定
 *******************************/
//受信用インスタンス
let pTemperturePER = null;

const fsInitTempertureSvc = (xService) =>{
    pTemperturePER = null;

    xService.on('characteristicsDiscover', characteristics => {
        _trace("Temperture Srrvice init");
        characteristics.forEach(xChar => {
            if (xChar.uuid){

                switch(xChar.uuid){

                    case mBitUUID.TEMPERATURE.DATA:
                        //温度データ受信
                        xChar.on('data', (data) => {
                            pStates._temperature = data;
                            fskickEvent(mBitEVENTS.UPDATE_VAL);
                            //_trace('TEMPERATURE_DATA = ' + data);
                        });

                        xChar.subscribe((err) =>{
                            _trace("TEMPERATURE_DATA subscribe :" + err);
                        });

                        break;

                    case mBitUUID.TEMPERATURE.PERIOD:
                        pTemperturePER = xChar;

                        xChar.subscribe((err) =>{
                            _trace("TEMPERATURE_PERIOD subscribe :" + err);
                        });
                        
                        break;
                }

            };
        });
    });

    xService.discoverCharacteristics();

}


/*******************************
 LEDサービス設定 --> 開発中
 *******************************/
const fsInitLedSvc = (xService) =>{
    xService.on('characteristicsDiscover', characteristics => {
        _trace("Temperture Srrvice init");
        characteristics.forEach(xChar => {
            if (xChar.uuid){

                switch(xChar.uuid){

                    case mBitUUID.LED.MATRIX:
                        //三軸データ
                        xChar.on('data', (data, isNotification) => {
                            _trace('LED_MATRIX = ' + data.readInt16LE(0));
                        });

                        xChar.subscribe((err) =>{
                            _trace("LED_MATRIX subscribe :" + err);
                        });

                        break;

                    case mBitUUID.LED.TEXT:
                        //更新間隔
                        xChar.on('data', (data, isNotification) => {
                            _trace("LED_TEXT =" + data.readInt16LE(0));
                        });

                        xChar.subscribe((err) =>{
                            _trace("LED_TEXT subscribe :" + err);
                        });
                        
                        break;
                        

                    case mBitUUID.LED.SCDELAY:
                        //更新間隔
                        xChar.on('data', (data, isNotification) => {
                            _trace("LED_SCDELAY =" + data.readInt16LE(0));
                        });

                        xChar.subscribe((err) =>{
                            _trace("LED_SCDELAY subscribe :" + err);
                        });
                        
                        break;

                }

            };
        });
    });

    xService.discoverCharacteristics();

}


/*******************************
 UARTサービス設定
 *******************************/

//受信用インスタンス
let pUartRX = null;

const fsInitUartSvc = (xService) =>{
    pUartRX = null;

    xService.on('characteristicsDiscover', characteristics => {
        _trace("UART Service init");
        characteristics.forEach(xChar => {
            if (xChar.uuid){

                switch(xChar.uuid){

                    case mBitUUID.UART.DATA_RX:
                        pUartRX = xChar;

                         xChar.subscribe((err) =>{
                            _trace("UART_DATA_RX subscribe :" + err);
                        });

                        break;

                    case mBitUUID.UART.DATA_TX:
                        //データ受信
                        xChar.on('data', (data) => {
                            //_trace("UART_DATA_TX =" + data);
                            fskickEvent(mBitEVENTS.GET_UART,data);
                        });

                        xChar.subscribe((err) =>{
                            _trace("UART_DATA_TX subscribe :" + err);
                        });
                        
                        break;
                }

            };
        });
    });

    xService.discoverCharacteristics();

}

//UARTで文字列送信
const fsSendUart = (xStr) =>{
    if(!pUartRX) return false;

    const xBuf = new Buffer(xStr);
    pUartRX.write(xBuf,false,(err)=>{
        _trace("error:" + err);
    });

}



exports._noble = noble;
exports.EVENT = mBitEVENTS;
exports.service = evtTarget;

exports._states = pStates;
exports._conf = pConfig;


exports.getConfig = fsGetConfig;
exports.setConfig = fsSetConfig;


exports.sendUART = fsSendUart;
exports.connect = fsScanBit;


