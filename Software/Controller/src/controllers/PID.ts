export class PID {
    private _iError: number = 0;
    private _lastError: number = 0;
    private _lastTime: number = 0;

    kP: number = 0;
    kI: number = 0;
    kD: number = 0;
    maxI: number = Number.MAX_VALUE;
    target: number = 0;
    currentValue: number = 0;

    update(): number {
        let dt;
        let currentTime = Date.now();
        if (this._lastTime === 0) {
            dt = 0;
        } else {
            dt = (currentTime - this._lastTime) / 1000;
        }
        this._lastTime = currentTime;

        let error = (this.target - this.currentValue);

        this._iError = this._iError + error * dt;
        if (Math.abs(this._iError) > this.maxI) {
            this._iError = (this._iError > 0) ? this.maxI : -this.maxI;
        }

        let dError = 0;
        if (dt > 0) {
            dError = (error - this._lastError) / dt;
            this._lastError = error;
        }

        return (this.kP * error) + (this.kI * this._iError) + (this.kD * dError);
    }

    reset() {
        this._iError = 0;
        this._lastError = 0;
        this._lastTime = 0;
    }
}
