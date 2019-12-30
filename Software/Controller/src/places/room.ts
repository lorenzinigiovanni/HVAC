import { Radiant } from "../actuators/radiant";
import { Aircon } from "../actuators/aircon";
import { PelletStove } from "../actuators/pelletStove";
import { AmbientSensor } from '../sensors/ambientSensor';
import { Fancoil } from '../actuators/fancoil';
import { AmbientTemperatureController } from '../controllers/ambientTemperatureController';
import { HomekitThermostat } from "../homekit/thermostat";
import { HomekitHumiditySensor } from "../homekit/humiditySensor";

export class Room {

    private _name: string;
    private _topic: string;

    private _radiant?: Radiant;
    private _aircon?: Aircon;
    private _pelletStove?: PelletStove;
    private _fancoil?: Fancoil;

    private _ambientSensor: AmbientSensor;

    private _ambientTemperatureController: AmbientTemperatureController;

    private _homekitThermostat: HomekitThermostat;
    private _homekitHumiditySensor: HomekitHumiditySensor;

    constructor(name: string, hasRadiant: boolean, hasAircon: boolean, hasPelletStove: boolean, hasFancoil: boolean) {
        this._name = name;

        this._topic = 'room/' + this._name.toLocaleLowerCase().replace(/\s+/g, '');

        if (hasRadiant) {
            this._radiant = new Radiant(this._topic);
        }
        if (hasAircon) {
            this._aircon = new Aircon(this._topic);
        }
        if (hasPelletStove) {
            this._pelletStove = new PelletStove(this._topic);
        }
        if (hasFancoil) {
            this._fancoil = new Fancoil(this._topic);
        }

        this._ambientSensor = new AmbientSensor(this._topic);

        this._ambientTemperatureController = new AmbientTemperatureController();
        this._ambientTemperatureController.powerChanged = this._powerChanged;

        this._homekitThermostat = new HomekitThermostat(this._name);
        this._homekitHumiditySensor = new HomekitHumiditySensor(this._name);
    }

    private _powerChanged(val: number) {

    }

}
