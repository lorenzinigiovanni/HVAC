import { AmbientTemperatureController } from "./controllers/ambientTemperatureController";
import { Room } from "./controllers/room";
import { Attutatore, TipoAttuatore } from "./controllers/attuatore";

/*let atc1: AmbientTemperatureController = new AmbientTemperatureController();

atc1.start();
atc1.kP = 0.1;
atc1.kI = 0.2;
atc1.kD = 0.1;
atc1.currentTemperature = 20;
atc1.targetTemperature = 21;*/

var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://192.168.69.220')

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

let percentuale: number = 0;

const HAP = require('hap-nodejs');

const { uuid, Bridge, Accessory, AccessoryEventTypes, Service, Characteristic, CharacteristicEventTypes } = HAP;

HAP.init();

const bridge = new Bridge('Ciro Bridge', uuid.generate('Ciro Bridge'));
bridge.on(AccessoryEventTypes.IDENTIFY, (paired: boolean, callback: any) => {
    console.log("Node Bridge identify");
    callback();
});

bridge.publish({
    username: 'CC:22:3D:E3:CE:F6',
    port: 51826,
    pincode: '799-46-544',
    category: Accessory.Categories.OTHER
});

const accessory = new Accessory("Ciro Termostato", uuid.generate('Ciro Termostato'));
accessory.on(AccessoryEventTypes.IDENTIFY, (paired: boolean, callback: any) => {
    accessory.identify();
    callback();
});

accessory
    .addService(Service.Lightbulb, 'Light')
    .getCharacteristic(Characteristic.On)!
    .on(CharacteristicEventTypes.SET, (value: any, callback: any) => {
        //console.log(value);

        // Our light is synchronous - this value has been successfully set
        // Invoke the callback when you finished processing the request
        // If it's going to take more than 1s to finish the request, try to invoke the callback
        // after getting the request instead of after finishing it. This avoids blocking other
        // requests from HomeKit.
        callback();
    })

accessory
    .getService(Service.Lightbulb)!
    .addCharacteristic(Characteristic.Brightness)
    .on(CharacteristicEventTypes.SET, (value: any, callback: any) => {
        // LightController.setBrightness(value);
        console.log(value);
        percentuale = value;
        callback();
    })
/*.on(CharacteristicEventTypes.GET, (callback: NodeCallback<CharacteristicValue>) => {
    callback(null, LightController.getBrightness());
});*/
// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
/*.on(CharacteristicEventTypes.GET, (callback: NodeCallback<CharacteristicValue>) => {
    callback(null, LightController.getPower());
});*/

bridge.addBridgedAccessory(accessory);

spento();

function acceso() {
    if (percentuale > 10) {
        client.publish('relay/1', '1');
    }
    setTimeout(() => spento(), Math.round(10 * 60 * 1000 * percentuale / 100));
    console.log('acceso');
}

function spento() {
    if (percentuale < 90) {
        client.publish('relay/0', '0');
    }
    setTimeout(() => acceso(), Math.round(10 * 60 * 1000 * (100 - percentuale) / 100));
}
