export class Radiant {

    private _timer?: NodeJS.Timeout;
    dt: number = 10;

    private _topic: string;

    private _on: boolean = false;
    get on(): boolean {
        return this._on;
    }

    private _power: number = 0;
    get power(): number {
        return this._power;
    }
    set power(value: number) {
        if (value != this._power) {
            this._power = value;
            if (this._power > this._minPower) {
                this._turnOn();
            }
            else {
                this._turnOff();
            }
        }
    }

    private _minPower: number = 0.1;
    get minPower(): number {
        return this._minPower;
    }
    set minPower(value: number) {
        this._minPower = value;
    }

    constructor(topic: string) {
        this._topic = topic + '/radiant';
        this._turnOff();
    }

    private _turnOn() {
        this._on = true;
        global.mqttClient.publish(this._topic + '/on', '1');

        if (this._power < 1) {
            this._timer = setInterval(() => this._turnOff(), this._power * this.dt * 60 * 1000);
        }
    }

    private _turnOff() {
        this._on = false;
        global.mqttClient.publish(this._topic + '/on', '0');

        if (this._power > this._minPower) {
            this._timer = setInterval(() => this._turnOn(), (1 - this._power) * this.dt * 60 * 1000);
        }
    }

}
