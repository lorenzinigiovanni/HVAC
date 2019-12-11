import { PID } from "./PID"

export interface ISystemPower {
    basePower: number;
    auxPower: number
}

export abstract class AmbientTemperatureController {
    private pid: PID = new PID();
    private timer?: NodeJS.Timeout;

    dt: number = 1;
    mode: boolean = false;
    callback!: (val: ISystemPower) => void;

    private _targetTemperature: number = 20;
    get targetTemperature(): number {
        return this._targetTemperature;
    }
    set targetTemperature(value: number) {
        this._targetTemperature = value;
        this.pid.target = this._targetTemperature;
    }

    private _currentTemperature: number = 20;
    get currentTemperature(): number {
        return this._currentTemperature;
    }
    set currentTemperature(value: number) {
        this._currentTemperature = value;
    }

    private _baseSystemPower: number = 0;
    get baseSystemPower(): number {
        return this._baseSystemPower;
    }

    private _auxiliarySystemPower: number = 0;
    get auxiliarySystemPower(): number {
        return this._auxiliarySystemPower;
    }

    get kP(): number {
        return this.pid.kP;
    }
    set kP(value: number) {
        this.pid.kP = value;
    }

    get kI(): number {
        return this.pid.kI * 60;
    }
    set kI(value: number) {
        this.pid.kI = value / 60;
    }

    get kD(): number {
        return this.pid.kD / 60;
    }
    set kD(value: number) {
        this.pid.kD = value * 60;
    }

    private update() {
        let output = this.mode ? -this.pid.getControl(this._currentTemperature) : this.pid.getControl(this._currentTemperature);

        if (output <= 0) {
            this._baseSystemPower = 0;
            this._baseSystemPower = 0;
        }
        else if (output > 0 && output <= 1) {
            this._baseSystemPower = output;
            this._auxiliarySystemPower = 0;
        }
        else if (output > 1 && output <= 2) {
            this._baseSystemPower = 1;
            this._auxiliarySystemPower = output - 1;
        }
        else {
            this._baseSystemPower = 1;
            this._auxiliarySystemPower = 1;
        }

        this.callback({ basePower: this._baseSystemPower, auxPower: this._auxiliarySystemPower });
    }

    start() {
        this.timer = setInterval(() => this.update(), this.dt * 60 * 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
