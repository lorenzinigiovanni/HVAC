import { uuid, Accessory, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';

export class HomekitThermostat {

    private _accessory: Accessory;
    private _service: Service;

    constructor(name: string) {
        this._accessory = new Accessory('Thermostat ' + name, uuid.generate('Thermostat ' + name));
        this._service = this._accessory.addService(Service.Thermostat);

        this._service.getCharacteristic(Characteristic.TargetTemperature)!
            .on(CharacteristicEventTypes.SET, this.onNewTargetTemperature);

        this._service.getCharacteristic(Characteristic.TargetHeatingCoolingState)!
            .on(CharacteristicEventTypes.SET, this.onNewTargetHeatingCoolingState);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    onNewTargetTemperature(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        console.log("Characteristic TargetTemperature changed to %s", value);
        callback();
    }

    onNewTargetHeatingCoolingState(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        console.log("Characteristic TargetHeatingCoolingState changed to %s", value);
        callback();
    }

}
