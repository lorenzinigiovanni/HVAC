export class Pump {

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

    private _name: string;
    private _topic: string;

    constructor(name: string) {
        this._name = name;

        this._topic = 'pump/' + this._name.toLocaleLowerCase().replace(/\s+/g, '');
    }

}
