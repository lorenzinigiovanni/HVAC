import { uuid, Accessory, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';

export class HomekitThermostat {

    private _accessory: Accessory;
    private _service: Service;

    private _currentTemperature: number = 0;
    set currentTemperature(value: number) {
        this._currentTemperature = value;
        this._service.getCharacteristic(Characteristic.CurrentTemperature)?.updateValue(this._currentTemperature);
    }

    private _targetTemperature: number = 0;
    get targetTemperature(): number {
        return this._targetTemperature;
    }

    private _targetHeatingCoolingState: number = 0;
    get targetHeatingCoolingState(): number {
        return this._targetHeatingCoolingState;
    }

    constructor(name: string) {
        this._accessory = new Accessory('Termostato ' + name, uuid.generate('Termostato ' + name));
        this._service = this._accessory.addService(Service.Thermostat);

        this._service.getCharacteristic(Characteristic.TargetTemperature)!
            .on(CharacteristicEventTypes.SET, this._onNewTargetTemperature);

        this._service.getCharacteristic(Characteristic.TargetHeatingCoolingState)!
            .on(CharacteristicEventTypes.SET, this._onNewTargetHeatingCoolingState);

        this._service.getCharacteristic(Characteristic.CurrentTemperature)!
            .on(CharacteristicEventTypes.GET, this._onGetCurrentTemperature);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    private _onNewTargetTemperature(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        this._targetTemperature = <number>value;
        console.log("Characteristic TargetTemperature changed to %s", value);
        callback();
    }

    private _onNewTargetHeatingCoolingState(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        this._targetHeatingCoolingState = <number>value;
        console.log("Characteristic TargetHeatingCoolingState changed to %s", value);
        callback();
    }

    private _onGetCurrentTemperature(callback: CharacteristicSetCallback) {
        callback(null, this._currentTemperature);
    }

}
