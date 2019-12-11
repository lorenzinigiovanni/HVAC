export class PID {
    private iError: number = 0;
    private lastError: number = 0;
    private lastTime: number = 0;
    private currentValue: number = 0;

    kP: number = 0;
    kI: number = 0;
    kD: number = 0;
    maxI: number = Number.MAX_VALUE;
    target: number = 0;

    getControl(currentValue: number): number {
        let dt;
        let currentTime = Date.now();
        if (this.lastTime === 0) {
            dt = 0;
        } else {
            dt = (currentTime - this.lastTime) / 1000;
        }
        this.lastTime = currentTime;

        this.currentValue = currentValue;
        let error = (this.target - this.currentValue);

        this.iError = this.iError + error * dt;
        if (Math.abs(this.iError) > this.maxI) {
            this.iError = (this.iError > 0) ? this.maxI : -this.maxI;
        }

        let dError = 0;
        if (dt > 0) {
            dError = (error - this.lastError) / dt;
            this.lastError = error;
        }

        return (this.kP * error) + (this.kI * this.iError) + (this.kD * dError);
    }

    reset() {
        this.iError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    }
}
