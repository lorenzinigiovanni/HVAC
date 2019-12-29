import mqtt from 'mqtt';

export class Pump {

    private _on: boolean = false;
    get on(): boolean {
        return this._on;
    }
    set on(value: boolean) {
        this._on = value;
        if (this.on)
            this._client.publish(this._topic + '/on', '1');
        else
            this._client.publish(this._topic + '/on', '0');
    }

    private _client: mqtt.MqttClient;
    private _topic: string;

    constructor(client: mqtt.MqttClient, name: string) {
        this._client = client;
        this._topic = 'pump/' + name;
    }

}
