import { uuid, Accessory, Service, Characteristic, CharacteristicEventTypes, CharacteristicValue, CharacteristicSetCallback } from 'hap-nodejs';

export class HomekitHumiditySensor {

    private _accessory: Accessory;
    private _service: Service;

    private _humidity: number = 0;
    set humidity(value: number) {
        this._humidity = value;
        this._service.getCharacteristic(Characteristic.CurrentRelativeHumidity)?.updateValue(this._humidity);
    }

    constructor(name: string) {
        this._accessory = new Accessory('Humidity ' + name, uuid.generate('Humidity ' + name));
        this._service = this._accessory.addService(Service.HumiditySensor);

        this._service.getCharacteristic(Characteristic.CurrentRelativeHumidity)!
            .on(CharacteristicEventTypes.GET, this.onGetCurrentRelativeHumidity);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    onGetCurrentRelativeHumidity(callback: CharacteristicSetCallback) {
        callback(null, this._humidity);
    }

}
