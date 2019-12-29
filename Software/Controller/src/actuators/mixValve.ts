export class MixValve {

    private _temperature: number = 35;
    get temperature(): number {
        return this._temperature;
    }
    set temperature(value: number) {
        this._temperature = value;
        global.mqttClient.publish(this._topic + '/temperature', this._temperature.toString());
    }

    private _minTemperature: number = 20;
    get minTemperature(): number {
        return this._minTemperature;
    }
    set minTemperature(value: number) {
        this._minTemperature = value;
    }

    private _maxTemperature: number = 50;
    get maxTemperature(): number {
        return this._maxTemperature;
    }
    set maxTemperature(value: number) {
        this._maxTemperature = value;
    }

    private _topic: string;

    constructor(name: string) {
        this._topic = 'mixvalve/' + name;
    }

}
