import { uuid, Accessory, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';

export class HomekitTemperatureSensor {

    private _accessory: Accessory;
    private _service: Service;

    constructor(name: string) {
        this._accessory = new Accessory('Temperature ' + name, uuid.generate('Temperature ' + name));
        this._service = this._accessory.addService(Service.TemperatureSensor);

        this._service.getCharacteristic(Characteristic.CurrentTemperature)!
            .on(CharacteristicEventTypes.GET, this.onGetCurrentTemperature);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    onGetCurrentTemperature(callback: CharacteristicSetCallback) {
        callback(null, 20);
    }

}
