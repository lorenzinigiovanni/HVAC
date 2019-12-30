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
        this._accessory = new Accessory('Temperatura ' + name, uuid.generate('Temperatura ' + name));
        this._service = this._accessory.addService(Service.TemperatureSensor);

        this._service.getCharacteristic(Characteristic.CurrentTemperature)!.props.minValue = -100;
        this._service.getCharacteristic(Characteristic.CurrentTemperature)!.props.maxValue = 100;

        this._service.getCharacteristic(Characteristic.CurrentTemperature)!
            .on(CharacteristicEventTypes.GET, this._onGetCurrentTemperature);

        global.homekitBridge.addBridgedAccessory(this._accessory);
    }

    private _onGetCurrentTemperature(callback: CharacteristicSetCallback) {
        callback(null, this._temperature);
    }

}
