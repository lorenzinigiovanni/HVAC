import { uuid, Accessory, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';

export class HomekitTemperatureSensor {

    private _accessory: Accessory;
    private _service: Service;

    private _temperature: number = 0;
    set temperature(value: number) {
        this._temperature = value;
        this._service.getCharacteristic(Characteristic.CurrentTemperature)?.updateValue(this._temperature);
    }

    constructor(name: string) {
        this._accessory = new Accessory('Temperature ' + name, uuid.generate('Temperature ' + name));
        this._service = this._accessory.addService(Service.TemperatureSensor);

        this._service.getCharacteristic(Characteristic.CurrentTemperature)!
            .on(CharacteristicEventTypes.GET, this.onGetCurrentTemperature);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    onGetCurrentTemperature(callback: CharacteristicSetCallback) {
        callback(null, this._temperature);
    }

}
