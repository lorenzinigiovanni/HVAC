import { AmbientTemperatureController } from "./controllers/ambientTemperatureController";
import { Room } from "./controllers/room";
import { Attutatore, TipoAttuatore } from "./controllers/attuatore";
import { Aircon } from "./actuators/aircon";
import mqtt from 'mqtt';

let currentTemperature: number = 0;
let currentHumidity: number = 0;

/*let atc1: AmbientTemperatureController = new AmbientTemperatureController();

atc1.start();
atc1.kP = 0.1;
atc1.kI = 0.2;
atc1.kD = 0.1;
atc1.currentTemperature = 20;
atc1.targetTemperature = 21;*/

let client = mqtt.connect('mqtt://192.168.69.220')

client.on('connect', function () {
    client.subscribe('cameraGiovanni/temperature');
    client.subscribe('cameraGiovanni/humidity');
    client.subscribe('test');
});

client.on('message', function (topic: string, message: Buffer) {
    console.log(topic);
    console.log(message.toString());

    if (topic == 'cameraGiovanni/temperature')
        currentTemperature = +message.toString();
    if (topic == 'cameraGiovanni/humidity')
        currentHumidity = +message.toString();

    accessory
        .getService(Service.TemperatureSensor)!
        .setCharacteristic(Characteristic.CurrentTemperature, currentTemperature);

    accessory
        .getService(Service.HumiditySensor)!
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, currentHumidity);

    if (topic == 'test')
        aircon.set(true, Aircon.Mode.Heating, 24, Aircon.FanSpeed.Low);
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
import { uuid, Bridge, Accessory, AccessoryEventTypes, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';


HAP.init();

const bridge = new Bridge('Node Bridge', uuid.generate('Node Bridge'));

bridge.publish({
    username: 'CC:22:3D:E3:CE:F6',
    port: 51826,
    pincode: '799-46-544',
    category: Accessory.Categories.BRIDGE
});

const accessory = new Accessory('Ciro Sonda', uuid.generate('Ciro Sonda'));

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

let aircon = new Aircon(client, 'cameraGiovanni');

/*const ac = new Accessory('AC LG', uuid.generate('AC LG'));

let fanService = ac.addService(Service.Fan, 'Blower')

fanService.getCharacteristic(Characteristic.On)!
    .on(CharacteristicEventTypes.SET, (value: any, callback: any) => {
        console.log("Fan power changed to " + value);

        aircon.on = value;
        aircon.send();

        callback(null, currentTemperature);
    });

fanService.addCharacteristic(Characteristic.RotationSpeed)
    .on(CharacteristicEventTypes.SET, (value: any, callback: any) => {
        console.log("Setting fan rSpeed to %s", value);

        if (value <= 20)
            aircon.fanSpeed = Aircon.FanSpeed.Low;
        else if (value <= 40)
            aircon.fanSpeed = Aircon.FanSpeed.MidLow;
        else if (value <= 60)
            aircon.fanSpeed = Aircon.FanSpeed.Mid;
        else if (value <= 80)
            aircon.fanSpeed = Aircon.FanSpeed.MidHigh;
        else
            aircon.fanSpeed = Aircon.FanSpeed.High;

        aircon.send();

        callback();
    });

fanService.addCharacteristic(Characteristic.SwingMode)
    .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        console.log("Setting horizontal swing to %s", value);

        if (value)
            aircon.hSwing = Aircon.HorizontalSwing.Swing;
        else
            aircon.hSwing = Aircon.HorizontalSwing.Step3;

        callback();
    });

var thermostatService = ac.addService(Service.Thermostat, "Thermostat");
thermostatService.addLinkedService(fanService);

thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState)!
    .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        console.log("Characteristic TargetHeatingCoolingState changed to %s", value);

        if (value == 0)
            aircon.mode = Aircon.Mode.Ventilation;
        else if (value == 1)
            aircon.mode = Aircon.Mode.Heating;
        else if (value == 2)
            aircon.mode = Aircon.Mode.Cooling;
        else if (value == 3)
            aircon.mode = Aircon.Mode.Dehumidification;

        aircon.send();

        callback();
    });

thermostatService.getCharacteristic(Characteristic.TargetTemperature)!
    .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        console.log("Characteristic TargetTemperature changed to %s", value);

        aircon.temperature = <number>value;
        aircon.send();

        callback();
    });

bridge.addBridgedAccessory(ac);*/
