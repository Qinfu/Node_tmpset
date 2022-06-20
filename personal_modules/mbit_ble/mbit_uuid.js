/*-----------------------------------------------

micro:bit with BLE UUID LIST

written by Chikao Shima
2022.04.28

-----------------------------------------------*/

const mBitUUID = {

    //基本情報
    "GENERIC":{
        "SERVICE":  "0000180000001000800000805f9b34fb",
        "CHAR":     "00002a0000001000800000805f9b34fb"
    },


    //A・Bボタン
    "BUTTON":{
        "SERVICE":  "e95d9882251d470aa062fa1922dfa9a8",
        "BTN_A":    "e95dda90251d470aa062fa1922dfa9a8",
        "BTN_B":    "e95dda91251d470aa062fa1922dfa9a8"
    },

    //加速度センサ
    "ACCELEROMETER":{
        "SERVICE":  "e95d0753251d470aa062fa1922dfa9a8",
        "DATA":      "e95dca4b251d470aa062fa1922dfa9a8",
        "PERLOD":    "e95dfb24251d470aa062fa1922dfa9a8"
    },

    //磁気センサ
    "MAGNETOMETER":{
        "SERVICE":  "e95df2d8251d470aa062fa1922dfa9a8",
        "DATA":      "e95dfb11251d470aa062fa1922dfa9a8",
        "COMPASS":   "e95d9715251d470aa062fa1922dfa9a8",
        //"BEARING":"e95d9715251d470aa062fa1922dfa9a8"
        //"CALLIBRATION":"e95db358251d470aa062fa1922dfa9a8",
        "PERIOD":    "e95d386c251d470aa062fa1922dfa9a8"
    },

    //温度センサ関連
    "TEMPERATURE":{
        "SERVICE":  "e95d6100251d470aa062fa1922dfa9a8",
        "DATA":    "e95d9250251d470aa062fa1922dfa9a8",
        "PERIOD":  "e95d1b25251d470aa062fa1922dfa9a8"
    },

    //LED関連
    "LED":{
        "SERVICE":  "e95dd91d251d470aa062fa1922dfa9a8",
        "MATRIX":    "e95d7b77251d470aa062fa1922dfa9a8",
        "TEXT":      "e95d93ee251d470aa062fa1922dfa9a8",
        "SCDELAY":  "e95d0d2d251d470aa062fa1922dfa9a8"
    },

    //UART（シリアル通信）関連
    "UART":{
        "SERVICE":  "6e400001b5a3f393e0a9e50e24dcca9e",
        "DATA_TX":  "6e400002b5a3f393e0a9e50e24dcca9e",
        "DATA_RX":  "6e400003b5a3f393e0a9e50e24dcca9e"
    },

    //PINサービス
    "PIN":{
        "SERVICE":  "e95d8d00251d470aa062fa1922dfa9a8",
        "AD_CONF":  "e95d5899251d470aa062fa1922dfa9a8",
        "IO_CONF":  "e95db9fe251d470aa062fa1922dfa9a8",
        "PWN_CTR":  "e95dd822251d470aa062fa1922dfa9a8"
    },

    //イベント関連
    "EVENT":{
        "SERVICE":  "e95d93af251d470aa062fa1922dfa9a8",
        "MBIRREQ":  "e95d9775251d470aa062fa1922dfa9a8",
        "CLIENTREQUIREMENTS":  "e95d5404251d470aa062fa1922dfa9a8",
        "CLIENTEVENT":          "e95d23c4251d470aa062fa1922dfa9a8"
    }

};


module.exports = mBitUUID;