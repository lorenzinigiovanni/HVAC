import mqtt from 'mqtt';

export class MixValve {

    private _temperature: number = 35;
    get temperature(): number {
        return this._temperature;
    }
    set temperature(value: number) {
        this._temperature = value;
        this._client.publish(this._topic + '/temperature', this._temperature.toString());
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

    private _client: mqtt.MqttClient;
    private _topic: string;

    constructor(client: mqtt.MqttClient, name: string) {
        this._client = client;
        this._topic = 'mixvalve/' + name;
    }

}
