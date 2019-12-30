import { AmbientSensor } from "../sensors/ambientSensor";
import { HomekitHumiditySensor } from "../homekit/humiditySensor";
import { HomekitTemperatureSensor } from "../homekit/temperatureSensor";

export class Outdoors {

    private _name: string;
    private _topic: string;

    private _ambientSensor: AmbientSensor;

    private _homekitHumiditySensor: HomekitHumiditySensor;
    private _homekitTemperatureSensor: HomekitTemperatureSensor;

    constructor(name: string) {
        this._name = name;

        this._topic = 'outdoors/' + this._name.toLocaleLowerCase().replace(/\s+/g, '');

        this._ambientSensor = new AmbientSensor(this._topic);
        this._ambientSensor.on('newTemperature', this._onNewTemperature);
        this._ambientSensor.on('newHumidity', this._onNewHumidity);

        this._homekitHumiditySensor = new HomekitHumiditySensor(this._name);
        this._homekitTemperatureSensor = new HomekitTemperatureSensor(this._name);
    }

    private _onNewTemperature = (temperature: number) => {
        this._homekitTemperatureSensor.temperature = temperature;
    }

    private _onNewHumidity = (humidity: number) => {
        this._homekitHumiditySensor.humidity = humidity;
    }

}
