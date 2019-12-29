import mqtt from "mqtt";
const HAP = require('hap-nodejs');
import { uuid, Bridge } from 'hap-nodejs';
import { System } from "./system";

global.mqttClient = mqtt.connect('mqtt://192.168.69.220');

HAP.init();
global.homekitBridge = new Bridge('Node Bridge', uuid.generate('Node Bridge'));
global.homekitBridge.publish({
    username: 'CC:22:3D:E3:CE:F6',
    port: 51826,
    pincode: '799-46-544',
    category: Bridge.Categories.BRIDGE
});

var system = new System();
