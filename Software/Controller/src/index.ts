import { AmbientTemperatureController } from "./controllers/ambientTemperatureController";
import { Room } from "./controllers/room";
import { Attutatore, TipoAttuatore } from "./controllers/attuatore";

let currentTemperature: number = 0;
let currentHumidity: number = 0;

/*let atc1: AmbientTemperatureController = new AmbientTemperatureController();

atc1.start();
atc1.kP = 0.1;
atc1.kI = 0.2;
atc1.kD = 0.1;
atc1.currentTemperature = 20;
atc1.targetTemperature = 21;*/

const mqtt = require('mqtt')

let client = mqtt.connect('mqtt://192.168.69.220')

client.on('connect', function () {
    client.subscribe('ciro/munnezz/+', function (err: any) {
        if (!err) {
            client.publish('ciro/munnezz/a', 'Hello mqtt');
        }
    });
});

client.on('message', function (topic: string, message: Buffer) {
    console.log(topic);
    console.log(message.toString());

    if (topic == 'ciro/munnezz/temperature')
        currentTemperature = +message.toString();
    if (topic == 'ciro/munnezz/humidity')
        currentHumidity = +message.toString();

    accessory
        .getService(Service.TemperatureSensor)!
        .setCharacteristic(Characteristic.CurrentTemperature, currentTemperature);

    accessory
        .getService(Service.HumiditySensor)!
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, currentHumidity);
});

/*let salotto = new Room("salotto");
salotto.addAttuatore("topic/riscaldamento", TipoAttuatore.riscaldamento);
salotto.targetTemperature = 22;
salotto.kP = 0.1;
salotto.kI = 0.2;
salotto.kD = 0.1;
salotto.currentTemperature = 20;
salotto.targetTemperature = 21;
salotto.dt = 0.05;
salotto.start();*/

const HAP = require('hap-nodejs');

const { uuid, Bridge, Accessory, AccessoryEventTypes, Service, Characteristic, CharacteristicEventTypes } = HAP;

HAP.init();

const bridge = new Bridge('Node Bridge', uuid.generate('Node Bridge'));
bridge.on(AccessoryEventTypes.IDENTIFY, (paired: boolean, callback: any) => {
    console.log('Node Bridge identify');
    callback();
});

bridge.publish({
    username: 'CC:22:3D:E3:CE:F6',
    port: 51826,
    pincode: '799-46-544',
    category: Accessory.Categories.BRIDGE
});

const accessory = new Accessory('Ciro Sonda', uuid.generate('Ciro Sonda'));
accessory.on(AccessoryEventTypes.IDENTIFY, (paired: boolean, callback: any) => {
    accessory.identify();
    callback();
});

accessory
    .addService(Service.TemperatureSensor)
    .getCharacteristic(Characteristic.CurrentTemperature)!
    .on(CharacteristicEventTypes.GET, (callback: any) => {
        callback(null, currentTemperature);
    });

accessory
    .addService(Service.HumiditySensor)
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)!
    .on(CharacteristicEventTypes.GET, (callback: any) => {
        callback(null, currentHumidity);
    });

bridge.addBridgedAccessory(accessory);
