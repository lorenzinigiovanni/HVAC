export class PelletStove {

    private _on: boolean = false;
    get on(): boolean {
        return this._on;
    }
    set on(value: boolean) {
        this._on = value;
        if (this.on)
            global.mqttClient.publish(this._topic + '/on', '1');
        else
            global.mqttClient.publish(this._topic + '/on', '0');
    }

    private _topic: string;

    constructor(topic: string) {
        this._topic = topic + '/pelletstove';
    }

}
