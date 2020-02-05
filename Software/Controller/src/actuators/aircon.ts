export class Aircon {

    private _on: boolean = false;
    get on(): boolean {
        return this._on;
    }

    private _mode: Aircon.Mode = Aircon.Mode.Ventilation;
    get mode(): Aircon.Mode {
        return this._mode;
    }

    private _temperature: number = 0;
    get temperature(): number {
        return this._temperature;
    }

    private _fanSpeed: Aircon.FanSpeed = Aircon.FanSpeed.Low;
    get fanSpeed(): Aircon.FanSpeed {
        return this._fanSpeed;
    }

    private _vSwing: Aircon.VerticalSwing = Aircon.VerticalSwing.Auto;
    get vSwing(): Aircon.VerticalSwing {
        return this._vSwing;
    }
    set vSwing(value: Aircon.VerticalSwing) {
        this._vSwing = value;
        global.mqttClient.publish(this._topic + '/vswing', this._vSwing);
    }

    private _hSwing: Aircon.HorizontalSwing = Aircon.HorizontalSwing.Step3;
    get hSwing(): Aircon.HorizontalSwing {
        return this._hSwing;
    }
    set hSwing(value: Aircon.HorizontalSwing) {
        this._hSwing = value;
        global.mqttClient.publish(this._topic + '/hswing', this._hSwing);
    }

    private _energyControl: Aircon.EnergyControl = Aircon.EnergyControl.Off;
    get energyControl(): Aircon.EnergyControl {
        return this._energyControl;
    }
    set energyControl(value: Aircon.EnergyControl) {
        this._energyControl = value;
        global.mqttClient.publish(this._topic + '/energy', this._energyControl);
    }

    private _autoClean: boolean = false;
    get autoClean(): boolean {
        return this._autoClean;
    }
    set autoClean(value: boolean) {
        this._autoClean = value;
        if (this._autoClean)
            global.mqttClient.publish(this._topic + '/autoclean', '1');
        else
            global.mqttClient.publish(this._topic + '/autoclean', '0');
    }

    private _silent: boolean = false;
    get silent(): boolean {
        return this._silent;
    }
    set silent(value: boolean) {
        this._silent = value;
        if (this._silent)
            global.mqttClient.publish(this._topic + '/silent', '1');
        else
            global.mqttClient.publish(this._topic + '/silent', '0');
    }

    private _topic: string;

    constructor(topic: string) {
        this._topic = topic + '/ac';
    }

    set(mode: Aircon.Mode, temperature: number, fanSpeed: Aircon.FanSpeed) {
        this._on = true;
        this._mode = mode;
        this._temperature = temperature;
        this._fanSpeed = fanSpeed;

        global.mqttClient.publish(this._topic + '/set', JSON.stringify({ mode: this._mode, temperature: this._temperature, fanSpeed: this._fanSpeed }));
    }

    turnOff() {
        this._on = false;
        global.mqttClient.publish(this._topic + '/off', '');
    }

    showKW() {
        global.mqttClient.publish(this._topic + '/showkw', '');
    }

    jet() {
        global.mqttClient.publish(this._topic + '/jet', '');
    }

    light() {
        global.mqttClient.publish(this._topic + '/light', '');
    }

    send() {
        global.mqttClient.publish(this._topic + '/send', '');
    }

}

export namespace Aircon {

    export enum Mode {
        Cooling = 'cool',
        Dehumidification = 'dehum',
        Ventilation = 'vent',
        Heating = 'heat'
    }

    export enum FanSpeed {
        Low = 'low',
        MidLow = 'midlow',
        Mid = 'mid',
        MidHigh = 'midhigh',
        High = 'high',
        NaturalWind = 'naturalwind'
    }

    export enum VerticalSwing {
        Auto = 'auto',
        Step1 = 'step1',
        Step2 = 'step2',
        Step3 = 'step3',
        Step4 = 'step4',
        Step5 = 'step5',
        Step6 = 'step6',
        Swing = 'swing'
    };

    export enum HorizontalSwing {
        Auto = 'auto',
        Step1 = 'step1',
        Step2 = 'step2',
        Step3 = 'step3',
        Step4 = 'step4',
        Step5 = 'step5',
        Swing = 'swing',
        SwingLeft = 'swingleft',
        SwingRight = 'swingright'
    };

    export enum EnergyControl {
        Off = '0',
        Minus20 = '20',
        Minus40 = '40',
        Minus60 = '60'
    };

}
