import { EventEmitter } from "events";

export class AmbientSensor extends EventEmitter {

    private _temperature: number = 0.0;
    get temperature(): number {
        return this._temperature;
    }

    private _humidity: number = 0.0;
    get humidity(): number {
        return this._humidity;
    }

    private _topic: string;

    constructor(topic: string) {
        super();

        this._topic = topic + '/ambientsensor';

        global.mqttClient.subscribe(this._topic + '/temperature');
        global.mqttClient.subscribe(this._topic + '/humidity');

        global.mqttClient.on('message', (topic: string, message: Buffer) => {
            if (topic == this._topic + '/temperature') {
                this._temperature = +message.toString();
                this.emit('newTemperature', this._temperature);
            }
            else if (topic == this._topic + '/humidity') {
                this._humidity = +message.toString();
                this.emit('newHumidity', this._humidity);
            }
        });
    }

}

export interface AmbientSensor {
    on(event: 'newTemperature', listener: (temperature: number) => void): this;
    on(event: 'newHumidity', listener: (humidity: number) => void): this;
}
