import mqtt from 'mqtt';

export class AmbientSensor {

    private _temperature: number = 0.0;
    get temperature(): number {
        return this._temperature;
    }

    private _humidity: number = 0.0;
    get humidity(): number {
        return this._humidity;
    }

    private _client: mqtt.MqttClient;
    private _topic: string;

    constructor(client: mqtt.MqttClient, topic: string) {
        this._client = client;
        this._topic = topic + '/ambientsensor';

        this._client.subscribe(this._topic + '/temperature');
        this._client.subscribe(this._topic + '/humidity');

        this._client.on('message', (topic: string, message: Buffer) => {
            if (topic == this._topic + '/temperature')
                this._temperature = +message.toString();
            else if (topic == this._topic + '/humidity')
                this._humidity = +message.toString();
        });
    }

}
