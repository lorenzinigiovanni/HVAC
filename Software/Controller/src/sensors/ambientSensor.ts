export class AmbientSensor {

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
        this._topic = topic + '/ambientsensor';

        global.mqttClient.subscribe(this._topic + '/temperature');
        global.mqttClient.subscribe(this._topic + '/humidity');

        global.mqttClient.on('message', (topic: string, message: Buffer) => {
            if (topic == this._topic + '/temperature')
                this._temperature = +message.toString();
            else if (topic == this._topic + '/humidity')
                this._humidity = +message.toString();
        });
    }

}
