export class Climatic {

    outdoorTemperatureLow = -10;
    outdoorTemperatureHigh = 15;

    waterTemperatureLow = 25;
    waterTemperatureHigh = 40;

    offset = 0;

    getWaterTemperature(outdoorTemperature: number): number {
        let m = (this.waterTemperatureLow - this.waterTemperatureHigh) / (this.outdoorTemperatureHigh - this.outdoorTemperatureLow);
        let q = (this.outdoorTemperatureHigh * this.waterTemperatureHigh - this.outdoorTemperatureLow * this.waterTemperatureLow) / (this.outdoorTemperatureHigh - this.outdoorTemperatureLow);
        return m * outdoorTemperature + q + this.offset;
    }

}
