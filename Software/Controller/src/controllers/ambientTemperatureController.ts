import { EventEmitter } from "events";
import { PID } from "./PID"

export class AmbientTemperatureController extends EventEmitter {

    private _pid: PID = new PID();
    private _timer?: NodeJS.Timeout;

    dt: number = 1;
    mode: boolean = false;

    get targetTemperature(): number {
        return this._pid.target;
    }
    set targetTemperature(value: number) {
        this._pid.target = value;
    }

    get currentTemperature(): number {
        return this._pid.currentValue;
    }
    set currentTemperature(value: number) {
        this._pid.currentValue = value;
    }

    private _power: number = 0;
    get power(): number {
        return this._power;
    }

    get kP(): number {
        return this._pid.kP;
    }
    set kP(value: number) {
        this._pid.kP = value;
    }

    get kI(): number {
        return this._pid.kI * 60;
    }
    set kI(value: number) {
        this._pid.kI = value / 60;
    }

    get kD(): number {
        return this._pid.kD / 60;
    }
    set kD(value: number) {
        this._pid.kD = value * 60;
    }

    private _update() {
        let val = this.mode ? -this._pid.update() : this._pid.update();
        if (val < 0) {
            val = 0;
        }

        this._power = val;
        this.emit('powerChanged', this._power);
    }

    start() {
        this._timer = setInterval(() => this._update(), this.dt * 60 * 1000);
    }

    stop() {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }

}

export interface AmbientTemperatureController {
    on(event: 'powerChanged', listener: (power: number) => void): this;
}
